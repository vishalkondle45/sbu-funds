import mongoose from "mongoose";
var Schema = mongoose.Schema;

var accountSchema = new Schema(
  {
    account_number: {
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
      enum: [
        "Savings Account",
        "Loan Account",
        "Fixed Deposit",
        "Recurring Deposit",
      ],
      default: "Savings Account",
    },
    duration: {
      type: Number,
      required: false,
      default: null,
    },
    comments: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

mongoose.models = {};

global.Account = global.Account || mongoose.model("Account", accountSchema);

export default global.Account;
