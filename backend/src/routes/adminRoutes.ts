import { Router } from 'express';
import { getOverview, updateUserRole } from '../controllers/adminController.js';
import {
  createJob,
  deleteJob,
  listAdminJobs,
  setJobPublished,
  updateJob,
} from '../controllers/jobController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireAdmin);
router.get('/overview', getOverview);
router.patch('/users/:id/role', updateUserRole);
router.get('/jobs', listAdminJobs);
router.post('/jobs', createJob);
router.patch('/jobs/:id/publish', setJobPublished);
router.patch('/jobs/:id', updateJob);
router.delete('/jobs/:id', deleteJob);

export default router;
