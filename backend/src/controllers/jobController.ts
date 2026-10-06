import type { Response } from 'express';
import mongoose from 'mongoose';
import type { AuthRequest } from '../middleware/auth.js';
import {
  EMPLOYMENT_TYPES,
  Job,
  WORKPLACE_TYPES,
  type EmploymentType,
  type IJob,
  type JobStatus,
  type WorkplaceType,
} from '../models/Job.js';

interface JobInput {
  title: string;
  organisation: string;
  location: string;
  workplace: WorkplaceType;
  employmentType: EmploymentType;
  summary: string;
  description: string;
  applyEmail: string;
  applyUrl: string;
  published: boolean;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function readText(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > max) return null;
  return trimmed;
}

function parseJob(body: unknown): { data?: JobInput; message?: string } {
  const source = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const title = readText(source.title, 140);
  const organisation = readText(source.organisation, 140);
  const location = readText(source.location, 120);
  const summary = readText(source.summary, 400);
  const description = readText(source.description, 8000);
  const workplace = typeof source.workplace === 'string' ? source.workplace.trim() : '';
  const employmentType = typeof source.employmentType === 'string' ? source.employmentType.trim() : '';
  const applyEmail = typeof source.applyEmail === 'string' ? source.applyEmail.trim().toLowerCase() : '';
  const applyUrl = typeof source.applyUrl === 'string' ? source.applyUrl.trim() : '';

  if (!title || !organisation || !location || !summary || !description) {
    return { message: 'Title, organisation, location, summary, and description are required.' };
  }

  if (!WORKPLACE_TYPES.includes(workplace as WorkplaceType)) {
    return { message: 'Choose a workplace: on-site, hybrid, or remote.' };
  }

  if (!EMPLOYMENT_TYPES.includes(employmentType as EmploymentType)) {
    return { message: 'Choose a valid employment type.' };
  }

  if (applyEmail && !isValidEmail(applyEmail)) {
    return { message: 'Enter a valid application email, or leave it blank.' };
  }

  if (applyEmail.length > 160) {
    return { message: 'The application email is too long.' };
  }

  if (applyUrl && !isHttpUrl(applyUrl)) {
    return { message: 'The application link must start with http:// or https://.' };
  }

  if (applyUrl.length > 500) {
    return { message: 'The application link is too long.' };
  }

  if (!applyEmail && !applyUrl) {
    return { message: 'Add an application email or an application link so people can apply.' };
  }

  return {
    data: {
      title,
      organisation,
      location,
      workplace: workplace as WorkplaceType,
      employmentType: employmentType as EmploymentType,
      summary,
      description,
      applyEmail,
      applyUrl,
      published: source.published === true,
    },
  };
}

export function jobStatus(job: Pick<IJob, 'status' | 'published'>): JobStatus {
  if (
    job.status === 'draft' ||
    job.status === 'pending' ||
    job.status === 'published' ||
    job.status === 'taken-down'
  ) {
    return job.status;
  }

  return job.published ? 'published' : 'draft';
}

function applyStatus(job: IJob, status: JobStatus): void {
  const wasPublished = jobStatus(job) === 'published';
  job.status = status;
  job.published = status === 'published';
  if (status === 'published' && !wasPublished) {
    job.publishedAt = new Date();
  }
  if (status !== 'published') {
    job.publishedAt = null;
  }
}

function copyListing(job: IJob, data: JobInput): void {
  job.title = data.title;
  job.organisation = data.organisation;
  job.location = data.location;
  job.workplace = data.workplace;
  job.employmentType = data.employmentType;
  job.summary = data.summary;
  job.description = data.description;
  job.applyEmail = data.applyEmail;
  job.applyUrl = data.applyUrl;
}

function presentJob(job: IJob, includeStatus: boolean) {
  const status = jobStatus(job);
  return {
    id: String(job._id),
    title: job.title,
    organisation: job.organisation,
    location: job.location,
    workplace: job.workplace,
    employmentType: job.employmentType,
    summary: job.summary,
    description: job.description,
    applyEmail: job.applyEmail,
    applyUrl: job.applyUrl,
    publishedAt: job.publishedAt,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    ...(includeStatus
      ? {
          published: status === 'published',
          status,
          submittedByName: job.submittedByName || '',
          submittedByEmail: job.submittedByEmail || '',
        }
      : {}),
  };
}

function routeId(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value : '';
}

async function findJob(id: string): Promise<IJob | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  return Job.findById(id);
}

export async function listPublishedJobs(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const jobs = await Job.find({ published: true }).sort({ publishedAt: -1, createdAt: -1 });
    res.json({ jobs: jobs.map((job) => presentJob(job, false)) });
  } catch (error) {
    console.error('listPublishedJobs error:', error);
    res.status(500).json({ message: 'Unable to load job listings.' });
  }
}

export async function getPublishedJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const job = await findJob(routeId(req.params.id));
    if (!job || !job.published) {
      res.status(404).json({ message: 'That role is not available.' });
      return;
    }

    res.json({ job: presentJob(job, false) });
  } catch (error) {
    console.error('getPublishedJob error:', error);
    res.status(500).json({ message: 'Unable to load that role.' });
  }
}

export async function listAdminJobs(_req: AuthRequest, res: Response): Promise<void> {
  try {
    const jobs = await Job.find().sort({ updatedAt: -1 });
    const rank: Record<JobStatus, number> = {
      pending: 0,
      published: 1,
      'taken-down': 2,
      draft: 3,
    };
    jobs.sort((left, right) => rank[jobStatus(left)] - rank[jobStatus(right)]);
    res.json({ jobs: jobs.map((job) => presentJob(job, true)) });
  } catch (error) {
    console.error('listAdminJobs error:', error);
    res.status(500).json({ message: 'Unable to load job listings.' });
  }
}

export async function createJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const parsed = parseJob(req.body);
    if (!parsed.data) {
      res.status(400).json({ message: parsed.message });
      return;
    }

    const status: JobStatus = parsed.data.published ? 'published' : 'draft';
    const job = await Job.create({
      ...parsed.data,
      published: status === 'published',
      status,
      publishedAt: status === 'published' ? new Date() : null,
      submittedBy: req.user?._id ?? null,
      submittedByName: req.user?.fullName ?? '',
      submittedByEmail: req.user?.email ?? '',
    });

    res.status(201).json({
      message: status === 'published' ? 'Role published.' : 'Role saved as a draft.',
      job: presentJob(job, true),
    });
  } catch (error) {
    console.error('createJob error:', error);
    res.status(500).json({ message: 'Unable to save that role.' });
  }
}

export async function updateJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const job = await findJob(routeId(req.params.id));
    if (!job) {
      res.status(404).json({ message: 'That role could not be found.' });
      return;
    }

    const parsed = parseJob(req.body);
    if (!parsed.data) {
      res.status(400).json({ message: parsed.message });
      return;
    }

    const current = jobStatus(job);
    copyListing(job, parsed.data);
    let next: JobStatus = 'draft';
    if (parsed.data.published) next = 'published';
    else if (current === 'published') next = 'taken-down';
    else if (current === 'pending') next = 'pending';
    else if (current === 'taken-down') next = 'taken-down';
    applyStatus(job, next);
    await job.save();

    res.json({
      message:
        next === 'published'
          ? 'Role updated and posted.'
          : next === 'taken-down'
            ? 'Role updated and taken down.'
            : next === 'pending'
              ? 'Role updated. It is still waiting for approval.'
              : 'Role updated.',
      job: presentJob(job, true),
    });
  } catch (error) {
    console.error('updateJob error:', error);
    res.status(500).json({ message: 'Unable to update that role.' });
  }
}

export async function setJobPublished(req: AuthRequest, res: Response): Promise<void> {
  try {
    const job = await findJob(routeId(req.params.id));
    if (!job) {
      res.status(404).json({ message: 'That role could not be found.' });
      return;
    }

    const published = req.body?.published === true;
    const current = jobStatus(job);
    if (published && !job.applyEmail && !job.applyUrl) {
      res.status(400).json({ message: 'Add an application email or link before posting.' });
      return;
    }

    if (!published && current !== 'published') {
      res.status(400).json({ message: 'Only a posted role can be taken down.' });
      return;
    }

    applyStatus(job, published ? 'published' : 'taken-down');
    await job.save();

    const message = published
      ? current === 'pending'
        ? 'Role approved and posted.'
        : current === 'taken-down'
          ? 'Role posted again.'
          : 'Role published.'
      : 'Role taken down. It is hidden from the public site.';

    res.json({
      message,
      job: presentJob(job, true),
    });
  } catch (error) {
    console.error('setJobPublished error:', error);
    res.status(500).json({ message: 'Unable to change the publication status.' });
  }
}

export async function deleteJob(req: AuthRequest, res: Response): Promise<void> {
  try {
    const job = await findJob(routeId(req.params.id));
    if (!job) {
      res.status(404).json({ message: 'That role could not be found.' });
      return;
    }

    await job.deleteOne();
    res.json({ message: 'Role removed.' });
  } catch (error) {
    console.error('deleteJob error:', error);
    res.status(500).json({ message: 'Unable to remove that role.' });
  }
}

function ownsListing(job: IJob, userId: string): boolean {
  return String(job.submittedBy ?? '') === userId;
}

export async function listOwnListings(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const jobs = await Job.find({ submittedBy: req.user._id }).sort({ updatedAt: -1 });
    res.json({ jobs: jobs.map((job) => presentJob(job, true)) });
  } catch (error) {
    console.error('listOwnListings error:', error);
    res.status(500).json({ message: 'Unable to load your listings.' });
  }
}

export async function submitListing(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const parsed = parseJob(req.body);
    if (!parsed.data) {
      res.status(400).json({ message: parsed.message });
      return;
    }

    const job = await Job.create({
      ...parsed.data,
      published: false,
      status: 'pending',
      publishedAt: null,
      submittedBy: req.user._id,
      submittedByName: req.user.fullName,
      submittedByEmail: req.user.email,
    });

    res.status(201).json({
      message: 'Listing submitted. An administrator will review it before it is posted.',
      job: presentJob(job, true),
    });
  } catch (error) {
    console.error('submitListing error:', error);
    res.status(500).json({ message: 'Unable to submit that listing.' });
  }
}

export async function updateOwnListing(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required.' });
      return;
    }

    const job = await findJob(routeId(req.params.id));
    if (!job || !ownsListing(job, String(req.user._id))) {
      res.status(404).json({ message: 'That listing could not be found.' });
      return;
    }

    if (jobStatus(job) === 'published') {
      res.status(409).json({
        message: 'This listing is posted. An administrator must take it down before you can change it.',
      });
      return;
    }

    const parsed = parseJob(req.body);
    if (!parsed.data) {
      res.status(400).json({ message: parsed.message });
      return;
    }

    copyListing(job, parsed.data);
    applyStatus(job, 'pending');
    await job.save();

    res.json({
      message: 'Listing updated and sent back for approval.',
      job: presentJob(job, true),
    });
  } catch (error) {
    console.error('updateOwnListing error:', error);
    res.status(500).json({ message: 'Unable to update that listing.' });
  }
}
