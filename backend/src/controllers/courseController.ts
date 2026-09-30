import type { Response } from 'express';
import { COURSE_CATALOG, findCourse } from '../data/courses.js';
import type { AuthRequest } from '../middleware/auth.js';
import { Enrollment, type IEnrollment } from '../models/Enrollment.js';

function toCourse(course: (typeof COURSE_CATALOG)[number], enrollment?: IEnrollment) {
  return {
    slug: course.slug,
    title: course.title,
    track: course.track,
    summary: course.summary,
    duration: course.duration,
    lessons: course.lessons,
    enrolled: Boolean(enrollment),
    progress: enrollment?.progress ?? 0,
    status: enrollment?.status ?? null,
    enrolledAt: enrollment?.createdAt ?? null,
  };
}

async function courseLists(userId: unknown) {
  const enrollments = await Enrollment.find({ user: userId }).sort({ updatedAt: -1 });
  const bySlug = new Map(enrollments.map((enrollment) => [enrollment.courseSlug, enrollment]));

  const enrolled = COURSE_CATALOG.flatMap((course) => {
    const enrollment = bySlug.get(course.slug);
    return enrollment ? [toCourse(course, enrollment)] : [];
  }).sort((a, b) => {
    const aTime = a.enrolledAt ? new Date(a.enrolledAt).getTime() : 0;
    const bTime = b.enrolledAt ? new Date(b.enrolledAt).getTime() : 0;
    return bTime - aTime;
  });

  const available = COURSE_CATALOG.filter((course) => !bySlug.has(course.slug)).map((course) =>
    toCourse(course),
  );

  return { enrolled, available };
}

export async function listCourses(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const lists = await courseLists(req.user._id);
    res.json(lists);
  } catch (error) {
    console.error('listCourses error:', error);
    res.status(500).json({ message: 'Unable to load courses right now.' });
  }
}

export async function enrollInCourse(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const slug = typeof req.params.slug === 'string' ? req.params.slug : '';
    const course = findCourse(slug);

    if (!course) {
      res.status(404).json({ message: 'That course was not found.' });
      return;
    }

    const existing = await Enrollment.findOne({ user: req.user._id, courseSlug: course.slug });
    if (existing) {
      res.status(409).json({ message: 'You are already enrolled in this course.' });
      return;
    }

    await Enrollment.create({
      user: req.user._id,
      courseSlug: course.slug,
      progress: 0,
      status: 'enrolled',
    });

    const lists = await courseLists(req.user._id);
    res.status(201).json({
      message: `You are enrolled in ${course.title}.`,
      ...lists,
    });
  } catch (error) {
    console.error('enrollInCourse error:', error);
    res.status(500).json({ message: 'Unable to enrol right now.' });
  }
}
