import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Customer from "../../models/customer";
import { authOptions } from "./auth/[...nextauth]";
import Account from "@/models/account";
import Transaction from "@/models/transaction";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session.user.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "POST") {
    try {
      var customers = await Customer.find().sort({ _id: -1 }).limit(1);
      var customer = await Customer({
        ...req.body,
        id: (customers[0]?.id || 100) + 1,
      });
      await customer.save();
      var customers = await Customer.find();
      return res.status(200).json({
        error: false,
        ok: true,
        data: customers,
        message: "Customer created successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while creating customer",
      });
    }
  }
  if (req.method === "GET") {
    try {
      var customer = await Customer.findOne({ id: req.query.id });
      return res.status(200).json({
        error: false,
        ok: true,
        data: customer,
        message: "Customer fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while fetching customer",
      });
    }
  }
  if (req.method === "PUT") {
    try {
      await Customer.findOneAndUpdate({ id: req.body.id }, { ...req.body });
      var customers = await Customer.find();
      return res.status(200).json({
        error: false,
        ok: true,
        data: customers,
        message: "Customer updated successfully",
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
      await Customer.findOneAndDelete({ id: req.query.id });
      await Account.deleteMany({ customer_id: req.query.id });
      await Transaction.deleteMany({ customer_id: req.query.id });
      var customers = await Customer.find();
      return res.status(200).json({
        error: false,
        ok: true,
        data: customers,
        message: "Customer deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while deleting customer",
      });
    }
  }
};

export default connectDB(handler);
