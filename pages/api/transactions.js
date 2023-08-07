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
  if (req.method === "POST") {
    try {
      // var transactions = await Transaction.find();
      var transactions = await Transaction.aggregate([
        {
          $lookup: {
            from: "accounts",
            localField: "from",
            foreignField: "account_number",
            as: "from_account",
          },
        },
        {
          $lookup: {
            from: "accounts",
            localField: "to",
            foreignField: "account_number",
            as: "to_account",
          },
        },
        {
          $unwind: {
            path: "$from_account",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "from_account.customer_id",
            foreignField: "id",
            as: "from_customer",
          },
        },
        {
          $unwind: {
            path: "$to_account",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "to_account.customer_id",
            foreignField: "id",
            as: "to_customer",
          },
        },
        {
          $unwind: {
            path: "$to_customer",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$from_customer",
            preserveNullAndEmptyArrays: true,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
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
  if (req.method === "GET") {
    try {
      var transactions = await Transaction.find({
        customer_id: req.query.id,
      }).select("transaction_number transaction_type");
      transactions = transactions.map(
        ({ _id, transaction_number, transaction_type }) => ({
          label: transaction_number + " - " + transaction_type,
          value: transaction_number,
        })
      );
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
