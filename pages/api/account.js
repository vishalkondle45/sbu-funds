import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Account from "../../models/account";
import { authOptions } from "./auth/[...nextauth]";
import Transaction from "@/models/transaction";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "POST") {
    try {
      var accounts = await Account.find().sort({ _id: -1 }).limit(1);
      var account = await Account({
        ...req.body,
        account_number: (accounts[0]?.account_number || 1110) + 1,
      });
      await account.save();
      var accounts = await Account.find();
      return res.status(200).json({
        error: false,
        ok: true,
        data: accounts,
        message: `Account Number - ${
          accounts[accounts.length - 1].account_number
        }`,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while creating account",
      });
    }
  }
  if (req.method === "GET") {
    try {
      var account = await Account.findOne({ account_number: req.query.id });
      return res.status(200).json({
        error: false,
        ok: true,
        data: account,
        message: "Account fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while fetching account",
      });
    }
  }
  if (req.method === "PUT") {
    try {
      await Account.findOneAndUpdate({ id: req.body.id }, { ...req.body });
      return res.status(200).json({
        error: false,
        ok: true,
        data: null,
        message: "Account updated successfully",
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
      await Account.findOneAndDelete({ account_number: req.query.id });
      await Transaction.deleteMany({ account_number: req.query.id });
      var accounts = await Account.find();
      return res.status(200).json({
        error: false,
        ok: true,
        data: accounts,
        message: "Account deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while deleting account",
      });
    }
  }
};

export default connectDB(handler);
