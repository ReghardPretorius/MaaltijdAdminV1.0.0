import express from 'express';
import {
  getUserProfile, getAllUsers, increaseUserWallet, createWalletLog
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();


//router.put('/updateprofile', updateProfile);
router.post('/userinfo', getUserProfile);
router.post('/allusers', getAllUsers);
router.route('/updatewallet').post(protect, increaseUserWallet);
router.route('/createwalletlog').post(protect, createWalletLog);

// router.post('/updatewallet', increaseUserWallet);
// router.post('/createwalletlog', createWalletLog);


export default router;
