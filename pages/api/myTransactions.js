import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Transaction from "../../models/transaction";
import Account from "../../models/account";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      var transactions = await Transaction.find({
        $or: [
          {
            from: req.query.account_number,
          },
          {
            to: req.query.account_number,
          },
        ],
      }).sort({ _id: -1 });
      return res.status(200).json({
        error: false,
        ok: true,
        data: transactions,
        message: "Transactions fetched successfully",
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
