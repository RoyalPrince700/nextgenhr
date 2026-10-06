import { Router } from 'express';
import { listOwnListings, submitListing, updateOwnListing } from '../controllers/jobController.js';
import { requireAuth, requireJobLister } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireJobLister);
router.get('/', listOwnListings);
router.post('/', submitListing);
router.patch('/:id', updateOwnListing);

export default router;
