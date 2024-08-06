import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const orderSchema = mongoose.Schema(
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
    paymentSuccessful: {
      type: String,
      required: false,
    },
   paymentTime: {
    type: String,
    required: false
    },
    totalPrice: {
        type: String,
        required: false
    },
    deliveryLat: {
      type: String,
      required: false
  },
  deliveryLong: {
    type: String,
    required: false
},
deliveryAddress: {
  type: String,
  required: false
},
shortAddress: {
  type: String,
  required: false
},
freeDelivery: {
  type: String,
  required: false
},
totalQuantity: {
  type: String,
  required: false
},
typesOfItems: {
  type: String,
  required: false
},
deliveryDate: {
  type: Date,
  required: false
},
status: {
  type: String,
  required: false
},
merchantTransactionId: {
  type: String,
  required: false
},
deliveryFee: {
  type: String,
  required: false
},
  },
  {
    timestamps: true,
  }
);


const Order = mongoose.model('Order', orderSchema);

export default Order;