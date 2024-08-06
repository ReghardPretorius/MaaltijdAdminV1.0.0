import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    cellNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailIsVerified: {
      type: String,
      required: true,
    },
    numberIsVerified: {
      type: String,
      required: true,
    },
    terms: {
      type: String,
      required: true,
    },
    addressName: {
      type: String,
      required: true,
    },
    lat: {
      type: String,
      required: true,
    },
    long: {
      type: String,
      required: true,
    },
    town: {
      type: String,
      required: false,
    },
    suburb: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
    streetNumber: {
      type: String,
      required: false,
    },
    postalCode: {
        type: String,
        required: false,
      },
    unit: {
      type: String,
      required: true,
    },
    building: {
      type: String,
      required: false,
    },
    optionalAddressInfo: {
        type: String,
        required: false,
      },
      formattedAddress: {
        type: String,
        required: true,
      },
      marketing: {
        type: String,
        required: true,
      },
      wallet: {
        type: Number,
        required: false,
      },
      
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
