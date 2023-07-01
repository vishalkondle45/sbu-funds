import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Trasaction from "../../models/transaction";
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
      var [fromLastTransaction] = await Trasaction.find({
        $or: [{ from: req.body.from }, { to: req.body.from }],
      })
        .sort({ _id: -1 })
        .limit(1);

      var [toLastTransaction] = await Trasaction.find({
        $or: [{ from: req.body.to }, { to: req.body.to }],
      })
        .sort({ _id: -1 })
        .limit(1);

      let from_balance = null;
      if (req.body.from) {
        from_balance =
          fromLastTransaction?.from == req.body.from
            ? fromLastTransaction?.from_balance || null
            : fromLastTransaction?.to_balance || null;
      }
      let to_balance = null;
      if (req.body.to) {
        to_balance =
          toLastTransaction?.from == req.body.to
            ? toLastTransaction?.from_balance || null
            : toLastTransaction?.to_balance || null;
      }

      var transactions1 = await Trasaction.find().sort({ _id: -1 }).limit(1);

      if (req.body.transaction_type !== "Transfer") {
        var transaction = await Trasaction({
          ...req.body,
          transaction_id: (transactions1[0]?.transaction_id || 111110) + 1,
          from_balance: req.body.from
            ? from_balance
              ? Number(from_balance) - Number(req.body.amount)
              : Number(req.body.amount)
            : null,
          to_balance: req.body.to
            ? to_balance
              ? Number(to_balance) + Number(req.body.amount)
              : Number(req.body.amount)
            : null,
        });
      } else {
        var transaction = await Trasaction({
          ...req.body,
          transaction_id: (transactions1[0]?.transaction_id || 111110) + 1,
          from_balance: from_balance
            ? Number(from_balance) - Number(req.body.amount)
            : Number(req.body.amount),
          to_balance: Number(to_balance)
            ? Number(to_balance) + Number(req.body.amount)
            : Number(req.body.amount),
        });
      }
      await transaction.save();
      var transactions = await Trasaction.find();
      return res.status(200).json({
        error: false,
        ok: true,
        data: transactions,
        // message: `Trasaction Number - ${
        //   transactions[transactions.length - 1].transaction_id
        // }`,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while creating transaction",
      });
    }
  }
  if (req.method === "GET") {
    try {
      var transaction = await Trasaction.findOne({
        transaction_id: req.query.id,
      });
      return res.status(200).json({
        error: false,
        ok: true,
        data: transaction,
        message: "Trasaction fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while fetching transaction",
      });
    }
  }
  if (req.method === "PUT") {
    try {
      req.body._id = undefined;
      let transaction = await Trasaction.findOne({
        transaction_id: req.body.transaction_id,
      });
      // await
      await Trasaction.findOneAndUpdate(
        { transaction_id: req.body.transaction_id },
        {
          ...req.body,
          balance:
            transaction?.balance - transaction.amount + Number(req.body.amount),
        }
      );
      return res.status(200).json({
        error: false,
        ok: true,
        data: {
          balance: transaction?.balance,
          amount1: transaction.amount,
          amount2: Number(req.body.amount),
        },
        message: "Trasaction updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while updating loans",
      });
    }
  }
  if (req.method === "DELETE") {
    try {
      await Trasaction.findOneAndDelete({ transaction_id: req.query.id });
      // var transactions = await Trasaction.find();
      return res.status(200).json({
        error: false,
        ok: true,
        // data: transactions,
        message: "Trasaction deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while deleting transaction",
      });
    }
  }
};

export default connectDB(handler);
