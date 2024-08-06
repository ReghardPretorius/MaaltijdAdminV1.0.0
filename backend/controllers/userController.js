import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import WalletLog from '../models/walletLog.js';


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const { id } = req.body;

    const _id = id;

  const user = await User.findById(_id);

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// @desc    Get all user profiles
// @route   GET /api/users/profile
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {


  const users = await User.find();

  if (users) {
    res.status(200).json(users);
  } else {
    res.status(404).json({ message: 'No users found for this user' });
  }
});

// @desc    Get all user profiles
// @route   GET /api/users/profile
// @access  Private
// const increaseUserWallet = asyncHandler(async (req, res) => {

//   const user = await User.findById(req.body.order._id);
 
//   if (user) {
//     user.wallet = Number(user.wallet) + Number(req.body.order.wallet);   

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       wallet: updatedUser.wallet
//     });
//   } else {
//     res.status(404);
//     throw new Error('User not found');
//   }
// });

// @desc    Create a new wallet log
// @route   POST /api/users
// @access  Public
const createWalletLog = asyncHandler(async (req, res) => {
  const { userID, walletAmount, admin, campaign, expire, expiryDate, allocatedBy,  userName} = req.body;

  console.log(req.body);
  const walletAmountNumber = Number(walletAmount);

  if (expire === 'Yes') {
    const walletLog = await WalletLog.create({
      userID,
      walletAmount: walletAmountNumber, 
      admin, 
      campaign,
      expire,
      expiryDate,
      allocatedBy,  
      userName
    });
    console.log(walletLog);
    if (walletLog) {
      res.status(201).json(walletLog);
    } else {
      res.status(400);
      throw new Error('Invalid data');
    }
  } else {
    const walletLog = await WalletLog.create({
      userID,
      walletAmount: walletAmountNumber, 
      admin, 
      campaign,
      expire,
      allocatedBy,  
      userName

    });
    console.log(walletLog);
    if (walletLog) {
      res.status(201).json(walletLog);
    } else {
      res.status(400);
      throw new Error('Invalid data');
    };

  }


 

});



export {

  getUserProfile, getAllUsers, createWalletLog

};