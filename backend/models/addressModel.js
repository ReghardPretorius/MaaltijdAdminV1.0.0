import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = mongoose.Schema(
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
    }  
  },
  {
    timestamps: true,
  }
);


const Address = mongoose.model('Address', addressSchema);

export default Address;