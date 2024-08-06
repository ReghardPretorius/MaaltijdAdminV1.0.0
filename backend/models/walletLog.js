import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const walletLogSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    },
    walletAmount: {
      type: Number,
      required: true,
    },
    admin: {
      type: String,
      required: true,
    } ,
    campaign: {
        type: String,
        required: true,
      },
      expire: {
        type: String,
        required: true,
      },
      
      expiryDate: {
        type: Date,
        required: false,
      },
      allocatedBy: {
        type: String,
        required: false,
      },
      userName: {
        type: String,
        required: false,
      }

  },
  {
    timestamps: true,
  }
);


const WalletLog = mongoose.model('WalletLog', walletLogSchema);

export default WalletLog;