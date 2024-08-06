// routes/emailRoutes.js

import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/emailController.js';

const router = express.Router();

router.post('/sendOTP', sendOTP);
router.post('/verifyOTP', verifyOTP);

export default router;


