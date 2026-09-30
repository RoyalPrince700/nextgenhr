import { Router } from 'express';
import { createEnquiry, listEnquiries } from '../controllers/enquiryController.js';

const router = Router();

router.post('/', createEnquiry);
router.get('/', listEnquiries);

export default router;
