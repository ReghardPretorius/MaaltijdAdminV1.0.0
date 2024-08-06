import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const orderStatusSchema = mongoose.Schema(
  {
    OGOrderID: {
        type: String,
        required: true
      },
      merchantTransactionId: {
        type: String,
        required: false
      },
    userID: {
      type: String,
      required: true,
    },
    currentStatus: {
      type: String,
      required: false,
    },
    orderPlacedTimestamp: {
      type: Date,
      required: false
    },
    getherIngredientsTimestamp: {
      type: Date,
      required: false
    },
    preparingTimestamp: {
        type: Date,
        required: false
      },
      refrigeratingTimestamp: {
        type: Date,
        required: false
      },
      outForDeliveryTimestamp: {
        type: Date,
        required: false
      },
      couldNotBeDelivered1Timestamp: {
        type: Date,
        required: false
      },
      couldNotBeDelivered2Timestamp: {
        type: Date,
        required: false
      },
      deliveredTimestamp: {
        type: Date,
        required: false
      },
  },
  {
    timestamps: true,
  }
);


const orderStatus = mongoose.model('orderStatus', orderStatusSchema);

export default orderStatus;