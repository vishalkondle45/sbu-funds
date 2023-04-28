import mongoose from "mongoose";
var Schema = mongoose.Schema;

var transactionSchema = new Schema(
  {
    transaction_id: {
      type: Number,
      required: true,
    },
    customer_id: {
      type: Number,
      required: true,
    },
    account_number: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transaction_type: {
      type: String,
      required: true,
      default: "Cash",
      enum: ["Cash", "Cheque"],
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

mongoose.models = {};

global.Transaction =
  global.Transaction || mongoose.model("Transaction", transactionSchema);

export default global.Transaction;
