import { getServerSession } from "next-auth";
import connectDB from "@/middleware/mongodb";
import Customer from "@/models/customer";
import Account from "@/models/account";
import Transaction from "@/models/transaction";
// import { authOptions } from "../auth/[...nextauth]";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      var account = await Account.findOne({ account_number: req.query.id });
      var customer = await Customer.findOne({ id: account.customer_id });
      var transactions = await Transaction.find({
        createdAt: { $gte: req.query.from, $lte: req.query.to },
        $or: [{ to: req.query.id }, { from: req.query.id }],
      });
      var transaction = await Transaction.findOne({
        $or: [{ to: req.query.id }, { from: req.query.id }],
      }).sort("-created_at");
      var balance = transaction
        ? transaction.to == req.query.id
          ? transaction.to_balance
          : transaction.from_balance
        : 0;
      return res.status(200).json({
        transaction,
        customer,
        transactions,
        account,
        balance,
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
