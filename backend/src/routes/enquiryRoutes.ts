import { Router } from 'express';
import { createEnquiry, listEnquiries } from '../controllers/enquiryController.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', createEnquiry);
router.get('/', requireAuth, requireAdmin, listEnquiries);

export default router;
