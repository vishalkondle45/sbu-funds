import mongoose from "mongoose";
var Schema = mongoose.Schema;

var customerSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    pan: {
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
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    aadhar: {
      type: Number,
      required: true,
      minlength: 12,
      maxlength: 12,
      unique: true,
    },
    nominee: {
      type: String,
      required: true,
    },
    relation: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

mongoose.models = {};

global.Customer = global.Customer || mongoose.model("Customer", customerSchema);

export default global.Customer;
