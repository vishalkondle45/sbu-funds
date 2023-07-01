import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Transaction from "../../models/transaction";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      const [{ amount: plus }] = await Transaction.aggregate([
        { $match: { from: "" } },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ]);
      const [{ amount: minus }] = await Transaction.aggregate([
        { $match: { to: "" } },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ]);
      return res.status(200).json({
        error: false,
        ok: true,
        data: plus - minus,
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
