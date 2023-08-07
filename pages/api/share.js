import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Share from "../../models/share";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "POST") {
    try {
      await Share.findOneAndDelete({});
      let share = await Share({ ...req.body });
      await share.save();
      share = await Share.findOne();
      return res.status(200).json({
        error: false,
        ok: true,
        data: share.value,
        message: "Share created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while creating share",
      });
    }
  }
  if (req.method === "GET") {
    try {
      var share = await Share.findOne();
      return res.status(200).json({
        error: false,
        ok: true,
        data: share.value,
        message: "Share fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while fetching share",
      });
    }
  }
  if (req.method === "PUT") {
    try {
      await Share.findOneAndUpdate(null, { ...req.body });
      var share = await Share.findOne();
      return res.status(200).json({
        error: false,
        ok: true,
        data: share.value,
        message: "Share updated successfully",
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
      await Share.findOneAndDelete();
      return res.status(200).json({
        error: false,
        ok: true,
        data: null,
        message: "Share deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while deleting share",
      });
    }
  }
};

export default connectDB(handler);
