import mongoose from "mongoose";
var Schema = mongoose.Schema;

var interestSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    // account_type: {
    //   type: String,
    //   required: true,
    // },
    from_days: {
      type: Number,
      required: true,
    },
    to_days: {
      type: Number,
      required: true,
    },
    interest: {
      type: Number,
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

global.Interest = global.Interest || mongoose.model("Interest", interestSchema);

export default global.Interest;
