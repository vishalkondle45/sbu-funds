import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Customer from "../../models/customer";
import Account from "../../models/account";
import Transaction from "../../models/transaction";
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
      var customers = await Customer.find().select("id");
      var accounts = await Account.find().select("id");
      var transactions = await Transaction.find().select("id");
      return res.status(200).json({
        error: false,
        ok: true,
        data: { customers, accounts, transactions },
        message: "Customers fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error,
        message: "Erorr while fetching loans",
      });
    }
  }
};

export default connectDB(handler);
