import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import connectDB from "../../middleware/mongodb";
import Interest from "../../models/interest";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      let interest;
      if (req.query?.days) {
        interest = await Interest.findOne({
          from_days: { $lte: req.query.days },
          to_days: { $gte: req.query.days },
        });
      } else if (req.query.id) {
        interest = await Interest.findOne({ id: req.query.id });
      } else {
        interest = await Interest.find();
      }
      return res.status(200).json({
        error: false,
        ok: true,
        data: interest,
        message: "Interest fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while fetching interest",
      });
    }
  }
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "POST") {
    try {
      let interests = await Interest.find().sort({ _id: -1 }).limit(1);
      let interest = await Interest({
        ...req.body,
        id: (interests[0]?.id || 0) + 1,
      });
      await interest.save();
      interests = await Interest.find();
      return res.status(200).json({
        error: false,
        ok: true,
        data: interests,
        message: "Interest created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while creating interest",
      });
    }
  }
  if (req.method === "PUT") {
    try {
      await Interest.findOneAndUpdate({ id: req.query.id }, { ...req.body });
      var interests = await Interest.find();
      return res.status(200).json({
        error: false,
        ok: true,
        data: interests,
        message: "Interest updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while updating loans",
      });
    }
  }
  if (req.method === "DELETE") {
    try {
      await Interest.findOneAndDelete({ id: req.query.id });
      var interests = await Interest.find();
      return res.status(200).json({
        error: false,
        ok: true,
        data: interests,
        message: "Interest deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while deleting interest",
      });
    }
  }
};

export default connectDB(handler);
