import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Transaction from "../../models/transaction";
import { authOptions } from "./auth/[...nextauth]";

const handler = async (req, res) => {
  // const session = await getServerSession(req, res, authOptions);
  // if (!session) {
  //   return res
  //     .status(401)
  //     .json({ error: true, message: "You are unauthorized!" });
  // }
  if (req.method === "POST") {
    try {
      // var transactions = await Transaction.find(req.body.filters);
      let obj = {};
      for (const property in req.body.filters) {
        obj[property] = Number(req.body.filters[property]);
      }
      var transactions = await Transaction.aggregate([
        {
          $match: {
            $or: [obj],
          },
        },
        {
          $lookup: {
            from: "customers",
            localField: "customer_id",
            foreignField: "id",
            as: "customers",
          },
        },
        { $unwind: "$customers" },
        {
          $project: {
            name: "$customers.name",
            transaction_id: 1,
            customer_id: 1,
            account_number: 1,
            amount: 1,
            transaction_type: 1,
            balance: 1,
            comments: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
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
