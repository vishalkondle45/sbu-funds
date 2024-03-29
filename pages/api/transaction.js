import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Trasaction from "../../models/transaction";
import { authOptions } from "./auth/[...nextauth]";
import Account from "@/models/account";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "POST") {
    req.body.from = Number(req.body.from) || null;
    req.body.to = Number(req.body.to) || null;

    try {
      var [fromLastTransaction] = req.body.from
        ? await Trasaction.find({
            $or: [{ from: req.body.from }, { to: req.body.from }],
          })
            .sort({ _id: -1 })
            .limit(1)
        : [null];

      var [toLastTransaction] = req.body.to
        ? await Trasaction.find({
            $or: [{ from: req.body.to }, { to: req.body.to }],
          })
            .sort({ _id: -1 })
            .limit(1)
        : [null];

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

      // Get From Account
      let fromAccount = req.body.from
        ? await Account.findOne({
            account_number: req.body.from,
          })
        : null;
      // Get To Account
      let toAccount = req.body.to
        ? await Account.findOne({
            account_number: req.body.to,
          })
        : null;
      if ((!toAccount && req.body.to) || (!fromAccount && req.body.from)) {
        return res.status(401).json({
          error: true,
          ok: false,
          data: `Invalid Accounts Selected`,
          message: `Invalid Accounts Selected`,
        });
      }
      if (
        (!fromLastTransaction &&
          req.body.from &&
          fromAccount?.account_type !== "Loan Account") ||
        (fromLastTransaction?.from_balance &&
          fromLastTransaction?.from_balance < req.body.amount) ||
        (fromLastTransaction?.to_balance &&
          fromLastTransaction?.to_balance < req.body.amount)
      ) {
        return res.status(401).json({
          error: true,
          ok: false,
          data: {
            fromLastTransaction,
            from: req.body.from,
            fromAccount,
            type: fromAccount?.account_type,
            from_balance: fromLastTransaction?.from_balance,
            to_balance: fromLastTransaction?.to_balance,
            amount: req.body.amount,
          },
          message: `From balance is less than amount.`,
        });
      }
      var transactions1 = await Trasaction.find().sort({ _id: -1 }).limit(1);

      if (req.body.transaction_type !== "Transfer") {
        var transaction = await Trasaction({
          ...req.body,
          transaction_id: (transactions1[0]?.transaction_id || 111110) + 1,
          from_balance: req.body.from
            ? from_balance
              ? Number(from_balance) - Number(req.body.amount)
              : 0 - Number(req.body.amount)
            : null,
          to_balance: req.body.to
            ? to_balance
              ? Number(to_balance) + Number(req.body.amount)
              : 0 + Number(req.body.amount)
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
        message: `Trasaction Number - ${
          transactions[transactions.length - 1].transaction_id
        }`,
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
