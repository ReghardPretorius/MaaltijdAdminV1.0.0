import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const paidOrderSchema = mongoose.Schema(
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
shortAddress: {
  type: String,
  required: false
},
status: {
  type: String,
  required: false
},
OGOrderID: {
    type: String,
    required: false
  },
  merchantTransactionId: {
    type: String,
    required: false
  },
  numberOfFailedDeliveryAttempts: {
    type: Number,
    required: false
  },
  deliveryFee: {
    type: String,
    required: false
  },
  newDeliveryDate: {
    type: Date,
    required: false
  },
  reasonForReschedule: {
    type: String,
    required: false
  },
  rescheduled: {
    type: String,
    required: false
  },
  actualDateDelivered: {
    type: Date,
    required: false
  },
  },
  {
    timestamps: true,
  }
);


const PaidOrder = mongoose.model('PaidOrder', paidOrderSchema);

export default PaidOrder;