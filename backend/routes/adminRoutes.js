import express from 'express';
import {
  authAdmin,
  logoutAdmin,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/auth', authAdmin);
router.post('/logout', logoutAdmin);


export default router;
