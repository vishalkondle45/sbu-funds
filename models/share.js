import mongoose from "mongoose";
var Schema = mongoose.Schema;

var shareSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.models = {};

global.Share = global.Share || mongoose.model("Share", shareSchema);

export default global.Share;
