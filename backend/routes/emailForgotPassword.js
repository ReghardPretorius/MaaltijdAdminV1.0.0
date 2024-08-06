import express from 'express';
import { sendFPOTP, verifyFPOTP } from '../controllers/emailForgotPasswordController.js';

const router = express.Router();

router.post('/sendFPOTP', sendFPOTP);
router.post('/verifyFPOTP', verifyFPOTP);

export default router;