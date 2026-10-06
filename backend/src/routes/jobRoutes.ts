import { Router } from 'express';
import { getPublishedJob, listPublishedJobs } from '../controllers/jobController.js';

const router = Router();

router.get('/', listPublishedJobs);
router.get('/:id', getPublishedJob);

export default router;
