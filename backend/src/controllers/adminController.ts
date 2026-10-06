import type { Response } from 'express';
import mongoose from 'mongoose';
import { isConfiguredAdmin, normaliseRole } from '../config/roles.js';
import { COURSE_CATALOG } from '../data/courses.js';
import type { AuthRequest } from '../middleware/auth.js';
import { Enrollment } from '../models/Enrollment.js';
import { Enquiry, PROGRAMME_OPTIONS } from '../models/Enquiry.js';
import { User, type UserRole } from '../models/User.js';

const ROLES: UserRole[] = ['learner', 'job-lister', 'admin'];

function isCompleted(row: { status: string; progress: number }): boolean {
  return row.status === 'completed' || row.progress >= 100;
}

function isInProgress(row: { status: string; progress: number }): boolean {
  return row.progress > 0 && row.progress < 100 && row.status !== 'completed';
}

function learnerFrom(value: unknown): { fullName: string; email: string } {
  if (value && typeof value === 'object' && 'fullName' in value && 'email' in value) {
    const learner = value as { fullName: unknown; email: unknown };
    return {
      fullName: typeof learner.fullName === 'string' ? learner.fullName : 'Unknown learner',
      email: typeof learner.email === 'string' ? learner.email : '',
    };
  }

  return { fullName: 'Unknown learner', email: '' };
}

export async function getOverview(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const [users, enrollments, enquiries, programmeGroups] = await Promise.all([
      User.find().select('fullName email role createdAt').sort({ createdAt: -1 }),
      Enrollment.find().sort({ createdAt: -1 }).populate('user', 'fullName email'),
      Enquiry.find().sort({ createdAt: -1 }).limit(25),
      Enquiry.aggregate<{ _id: string; count: number }>([
        { $group: { _id: '$programmeInterest', count: { $sum: 1 } } },
      ]),
    ]);

    const programmeCount = new Map(programmeGroups.map((row) => [row._id, row.count]));
    const enrollmentCounts = new Map<string, { enrolled: number; completed: number }>();

    for (const enrollment of enrollments) {
      const ownerId = String(enrollment.user && typeof enrollment.user === 'object' && '_id' in enrollment.user
        ? enrollment.user._id
        : enrollment.user);
      const current = enrollmentCounts.get(ownerId) ?? { enrolled: 0, completed: 0 };
      current.enrolled += 1;
      if (isCompleted(enrollment)) current.completed += 1;
      enrollmentCounts.set(ownerId, current);
    }

    const knownSlugs = new Set(COURSE_CATALOG.map((course) => course.slug));
    const courses = [
      ...COURSE_CATALOG.map((course) => {
        const rows = enrollments.filter((enrollment) => enrollment.courseSlug === course.slug);
        return {
          slug: course.slug,
          title: course.title,
          track: course.track,
          duration: course.duration,
          enrolled: rows.length,
          inProgress: rows.filter(isInProgress).length,
          completed: rows.filter(isCompleted).length,
        };
      }),
      ...[...new Set(enrollments.map((enrollment) => enrollment.courseSlug))]
        .filter((slug) => !knownSlugs.has(slug))
        .map((slug) => {
          const rows = enrollments.filter((enrollment) => enrollment.courseSlug === slug);
          return {
            slug,
            title: slug,
            track: 'Not in the current catalogue',
            duration: '—',
            enrolled: rows.length,
            inProgress: rows.filter(isInProgress).length,
            completed: rows.filter(isCompleted).length,
          };
        }),
    ];

    const admins = users.filter((user) => normaliseRole(user.role) === 'admin').length;
    const jobListers = users.filter((user) => normaliseRole(user.role) === 'job-lister').length;
    const learners = users.filter((user) => normaliseRole(user.role) === 'learner').length;

    res.json({
      stats: {
        users: users.length,
        learners,
        jobListers,
        admins,
        enrollments: enrollments.length,
        inProgress: enrollments.filter(isInProgress).length,
        completed: enrollments.filter(isCompleted).length,
        enquiries: programmeGroups.reduce((total, row) => total + row.count, 0),
      },
      users: users.map((user) => {
        const counts = enrollmentCounts.get(String(user._id)) ?? { enrolled: 0, completed: 0 };
        return {
          id: String(user._id),
          fullName: user.fullName,
          email: user.email,
          role: normaliseRole(user.role),
          roleLocked: isConfiguredAdmin(user.email),
          createdAt: user.createdAt,
          enrollmentCount: counts.enrolled,
          completedCount: counts.completed,
        };
      }),
      courses,
      enrollments: enrollments.slice(0, 30).map((enrollment) => {
        const learner = learnerFrom(enrollment.user);
        const course = COURSE_CATALOG.find((item) => item.slug === enrollment.courseSlug);
        return {
          id: String(enrollment._id),
          learnerName: learner.fullName,
          learnerEmail: learner.email,
          courseTitle: course?.title ?? enrollment.courseSlug,
          courseSlug: enrollment.courseSlug,
          progress: enrollment.progress,
          status: enrollment.status,
          enrolledAt: enrollment.createdAt,
        };
      }),
      programmes: PROGRAMME_OPTIONS.map((programme) => ({
        programme,
        count: programmeCount.get(programme) ?? 0,
      })),
      enquiries: enquiries.map((enquiry) => ({
        id: String(enquiry._id),
        fullName: enquiry.fullName,
        email: enquiry.email,
        currentRole: enquiry.currentRole,
        programmeInterest: enquiry.programmeInterest,
        growthGoal: enquiry.growthGoal,
        createdAt: enquiry.createdAt,
      })),
    });
  } catch (error) {
    console.error('getOverview error:', error);
    res.status(500).json({ message: 'Unable to load the admin overview right now.' });
  }
}

export async function updateUserRole(req: AuthRequest, res: Response): Promise<void> {
  try {
    const id = typeof req.params.id === 'string' ? req.params.id : '';
    const role = req.body?.role as unknown;

    if (!mongoose.isValidObjectId(id)) {
      res.status(404).json({ message: 'That account was not found.' });
      return;
    }

    if (typeof role !== 'string' || !ROLES.includes(role as UserRole)) {
      res.status(400).json({ message: 'Role must be learner, job lister, or admin.' });
      return;
    }

    const nextRole = role as UserRole;
    const user = await User.findById(id);

    if (!user) {
      res.status(404).json({ message: 'That account was not found.' });
      return;
    }

    if (nextRole !== 'admin' && isConfiguredAdmin(user.email)) {
      res.status(403).json({
        message: 'This account is an administrator in server configuration and stays an admin.',
      });
      return;
    }

    if (nextRole !== 'admin' && normaliseRole(user.role) === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        res.status(409).json({ message: 'At least one administrator must remain.' });
        return;
      }
    }

    user.role = nextRole;
    await user.save();

    const message =
      nextRole === 'admin'
        ? `${user.fullName} is now an administrator.`
        : nextRole === 'job-lister'
          ? `${user.fullName} can now list jobs. New listings wait for your approval.`
          : `${user.fullName} is now a learner.`;

    res.json({
      message,
      user: {
        id: String(user._id),
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('updateUserRole error:', error);
    res.status(500).json({ message: 'Unable to update that role right now.' });
  }
}
