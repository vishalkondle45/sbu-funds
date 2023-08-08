import mongoose from "mongoose";
var Schema = mongoose.Schema;

var customerSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      default: 0,
    },
    name: {
      type: String,
      required: true,
    },
    pan: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 10,
      unique: true,
    },
    dob: {
      type: Date,
      required: true,
      trim: true,
    },
    aadhar: {
      type: Number,
      required: true,
      minlength: 12,
      maxlength: 12,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    nominee: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
      // enum: ["Mother", "Father", "Sister", "Brother", "Husband"],
    },
    shares: {
      type: Number,
      required: true,
    },
    comments: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

mongoose.models = {};

global.Customer = global.Customer || mongoose.model("Customer", customerSchema);

export default global.Customer;
