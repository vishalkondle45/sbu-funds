import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Account from "../../models/account";
import { authOptions } from "./auth/[...nextauth]";

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
      return res.status(200).json({
        error: false,
        ok: true,
        data: accounts,
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
