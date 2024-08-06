import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const orderItemSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    orderID: {
      type: String,
      required: true,
    },
    orderItemCode: {
      type: String,
      required: false,
    },
    orderItemName: {
      type: String,
      required: false,
    },
    quantity: {
        type: String,
        required: false
      },
      orderItemPrice: {
        type: String,
        required: false,
      },
      orderTotalPrice: {
        type: String,
        required: false,
      },
      deliveryDate: {
        type: Date,
        required: false
      },
      status: {
        type: String,
        required: false,
      },
      merchantTransactionId: {
        type: String,
        required: false
      },
  },
  {
    timestamps: true,
  }
);


const OrderItem = mongoose.model('OrderItem', orderItemSchema);

export default OrderItem;