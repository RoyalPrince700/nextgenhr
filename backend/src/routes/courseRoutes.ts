import { Router } from 'express';
import { enrollInCourse, listCourses } from '../controllers/courseController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.get('/', listCourses);
router.post('/:slug/enroll', enrollInCourse);

export default router;
