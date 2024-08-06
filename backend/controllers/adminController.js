import asyncHandler from 'express-async-handler';
//import User from '../models/userModel.js';
import Address from '../models/addressModel.js';
import Admin from '../models/adminModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/admin/auth
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  const user = await Admin.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      cellNumber: user.cellNumber,
      email: user.email,
      role: user.role
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


// @desc    Logout user / clear cookie
// @route   POST /api/admin/logout
// @access  Public
const logoutAdmin = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};



export {
  authAdmin,
  logoutAdmin,

};