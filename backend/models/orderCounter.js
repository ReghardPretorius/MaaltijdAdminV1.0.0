import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const OrderCounterSchema = mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: {
      type: Number,
      default: 0
    },

  },
  {
    timestamps: true,
  }
);


const OrderCounter = mongoose.model('OrderCounter', OrderCounterSchema);

export default OrderCounter;