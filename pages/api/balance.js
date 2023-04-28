import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Account from "../../models/account";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session.user.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      const balances = await Account.aggregate([
        {
          $lookup: {
            from: "transactions",
            localField: "account_number",
            foreignField: "account_number",
            as: "transactions",
          },
        },
        {
          $unwind: "$transactions",
        },
        {
          $group: {
            _id: "$transactions.account_number",
            balance: {
              $sum: "$transactions.amount",
            },
          },
        },
      ]);

      return res.status(200).json({
        error: false,
        ok: true,
        data: balances,
        message: "Accounts fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Erorr while fetching accounts",
      });
    }
  }
};

export default connectDB(handler);
