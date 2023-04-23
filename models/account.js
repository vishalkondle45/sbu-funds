import mongoose from "mongoose";
var Schema = mongoose.Schema;

var accountSchema = new Schema(
  {
    number: {
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

global.Account = global.Account || mongoose.model("Account", accountSchema);

export default global.Account;
