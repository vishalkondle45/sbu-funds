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
      var accounts = await Account.find({
        customer_id: session.user.id,
      }).select("account_number");
      if (accounts.length == 0) {
        return res.status(200).json({
          error: false,
          ok: true,
          data: [],
          message: "Balance fetched successfully",
        });
      }
      accounts = accounts.map(({ account_number }) => account_number);
      var transactions = await Transaction.find({
        $or: [
          {
            from: {
              $in: accounts,
            },
          },
          {
            to: {
              $in: accounts,
            },
          },
        ],
      })
        .sort({ _id: -1 })
        .limit(5);
      return res.status(200).json({
        error: false,
        ok: true,
        data: transactions,
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
