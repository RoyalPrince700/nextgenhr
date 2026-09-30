import type { Request, Response } from 'express';
import { Enquiry, PROGRAMME_OPTIONS } from '../models/Enquiry.js';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function createEnquiry(req: Request, res: Response): Promise<void> {
  try {
    const { fullName, email, currentRole, programmeInterest, growthGoal } = req.body ?? {};

    if (
      typeof fullName !== 'string' ||
      typeof email !== 'string' ||
      typeof currentRole !== 'string' ||
      typeof programmeInterest !== 'string' ||
      typeof growthGoal !== 'string'
    ) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      currentRole: currentRole.trim(),
      programmeInterest: programmeInterest.trim(),
      growthGoal: growthGoal.trim(),
    };

    if (
      !payload.fullName ||
      !payload.email ||
      !payload.currentRole ||
      !payload.programmeInterest ||
      !payload.growthGoal
    ) {
      res.status(400).json({ message: 'Please complete every field before submitting.' });
      return;
    }

    if (!isValidEmail(payload.email)) {
      res.status(400).json({ message: 'Please provide a valid email address.' });
      return;
    }

    if (!PROGRAMME_OPTIONS.includes(payload.programmeInterest as (typeof PROGRAMME_OPTIONS)[number])) {
      res.status(400).json({ message: 'Please select a valid programme interest.' });
      return;
    }

    const enquiry = await Enquiry.create(payload);

    res.status(201).json({
      message: 'Thank you. Your enquiry has been received.',
      id: enquiry._id,
    });
  } catch (error) {
    console.error('createEnquiry error:', error);
    res.status(500).json({ message: 'Unable to submit enquiry right now. Please try again.' });
  }
}

export async function listEnquiries(_req: Request, res: Response): Promise<void> {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(100);
    res.json(enquiries);
  } catch (error) {
    console.error('listEnquiries error:', error);
    res.status(500).json({ message: 'Unable to load enquiries.' });
  }
}
