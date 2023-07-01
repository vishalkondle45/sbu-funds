import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import { authOptions } from "./auth/[...nextauth]";
import Transaction from "@/models/transaction";
import Account from "@/models/account";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      var account = await Account.find({
        account_number: req.query.account_number,
        customer_id: session.user.id,
      });
      if (!account) {
        return res.status(401).json({
          error: false,
          ok: true,
          data: 0,
          message: "Balance fetched successfully",
        });
      }
      var [transaction] = await Transaction.find({
        $or: [
          { from: req.query.account_number },
          { to: req.query.account_number },
        ],
      })
        .sort({ _id: -1 })
        .limit(1);
      return res.status(200).json({
        error: false,
        ok: true,
        transaction,
        data: transaction
          ? transaction?.from == req.query.account_number
            ? transaction?.from_balance
            : transaction?.to_balance
          : 0,
        message: "Balance fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Erorr while fetching transactions",
      });
    }
  }
};

export default connectDB(handler);
