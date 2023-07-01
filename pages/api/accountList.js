import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
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
      var accounts = await Account.find({
        customer_id: session.user.id,
      }).select("account_number account_type");
      accounts = accounts.map(({ _id, account_number, account_type }) => ({
        label: account_number + " - " + account_type,
        value: account_number,
      }));
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
