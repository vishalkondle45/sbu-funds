import mongoose from "mongoose";
var Schema = mongoose.Schema;

var transactionSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    customer_id: {
      type: Number,
      required: true,
    },
    account_type: {
      type: String,
      required: true,
    },
    // balance: {
    //   type: Number,
    //   required: true,
    // },
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
