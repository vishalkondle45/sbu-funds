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
    address: {
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
    aadhar: {
      type: Number,
      required: true,
      minlength: 12,
      maxlength: 12,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: Number,
      required: true,
      minlength: 10,
      maxlength: 10,
    },
    dob: {
      type: Date,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      default: "Male",
      enum: ["Male", "Female"],
    },
    occupation: {
      type: String,
      required: false,
    },
    income: {
      type: String,
      required: false,
    },
    nominee: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
    nominee_dob: {
      type: Date,
      required: true,
      trim: false,
    },
    mother: {
      type: String,
      required: false,
    },
    catogory: {
      type: String,
      required: true,
      default: "Others",
      enum: [
        "Savings Account",
        "Loan Account",
        "Fixed Deposit",
        "Recurring Deposit",
        "Others",
      ],
    },
    shares: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
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
