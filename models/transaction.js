import mongoose from "mongoose";
var Schema = mongoose.Schema;

var transactionSchema = new Schema(
  {
    transaction_id: {
      type: Number,
      required: true,
    },
    from: {
      default: null,
      type: Number,
    },
    to: {
      default: null,
      type: Number,
    },
    amount: {
      type: Number,
      required: true,
    },
    transaction_type: {
      type: String,
      required: true,
      default: "Cash",
      enum: ["Cash", "Transfer", "Cheque", "NEFT", "RTGS"],
    },
    from_balance: {
      type: Number,
      default: 0,
    },
    to_balance: {
      type: Number,
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
