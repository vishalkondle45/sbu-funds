import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Customer from "../../models/customer";
import { authOptions } from "./auth/[...nextauth]";
import Account from "@/models/account";
import Transaction from "@/models/transaction";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      var customer = await Customer.countDocuments();
      var account = await Account.countDocuments();
      var transaction = await Transaction.countDocuments();
      var deposit = await Transaction.countDocuments({
        transaction_type: "Cash",
        from: "",
      });
      var withdrawl = await Transaction.countDocuments({
        transaction_type: "Cash",
        to: "",
      });
      var cheque = await Transaction.countDocuments({
        transaction_type: "Cheque",
      });
      var transfer = await Transaction.countDocuments({
        transaction_type: "Transfer",
      });
      var neft = await Transaction.countDocuments({
        transaction_type: "NEFT",
      });
      var rtgs = await Transaction.countDocuments({
        transaction_type: "RTGS",
      });
      return res.status(200).json({
        error: false,
        ok: true,
        data: {
          customer,
          account,
          transaction,
          deposit,
          withdrawl,
          cheque,
          transfer,
          neft,
          rtgs,
        },
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
};

export default connectDB(handler);