import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Customer from "../../models/customer";
import Account from "../../models/account";
import Transaction from "../../models/transaction";
import { authOptions } from "./auth/[...nextauth]";
import dayjs from "dayjs";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session.user.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      var customers = await Customer.countDocuments();
      var accounts = await Account.countDocuments();
      var transactions = await Transaction.countDocuments();
      var currentBalance = await Transaction.aggregate([
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ]);
      var thisMonthNumberOfCustomers = await Customer.countDocuments({
        createdAt: {
          $gte: dayjs(new Date()).startOf("month").toDate(),
          $lt: dayjs(new Date()).endOf("month").toDate(),
        },
      });
      var thisMonthNumberOfAccounts = await Account.countDocuments({
        createdAt: {
          $gte: dayjs(new Date()).startOf("month").toDate(),
          $lt: dayjs(new Date()).endOf("month").toDate(),
        },
      });
      var thisMonthNumberOfTransactions = await Transaction.countDocuments({
        createdAt: {
          $gte: dayjs(new Date()).startOf("month").toDate(),
          $lt: dayjs(new Date()).endOf("month").toDate(),
        },
      });
      const thisMonthAmountOfTransactions = await Transaction.aggregate([
        {
          $match: {
            createdAt: {
              $gte: dayjs(new Date()).startOf("month").toDate(),
              $lt: dayjs(new Date()).endOf("month").toDate(),
            },
          },
        },
        { $group: { _id: null, amount: { $sum: "$amount" } } },
      ]);

      // Account Types
      var savings = await Account.countDocuments({
        account_type: "Savings Account",
      });
      var loan = await Account.countDocuments({
        account_type: "Loan Account",
      });
      var fd = await Account.countDocuments({
        account_type: "Fixed Deposit",
      });
      var rd = await Account.countDocuments({
        account_type: "Recurring Deposit",
      });

      return res.status(200).json({
        error: false,
        ok: true,
        data: [
          {
            label: "Total Customers",
            stats: customers,
            color: "red",
            icon: "customers",
          },
          {
            label: "Total Accounts",
            stats: accounts,
            color: "blue",
            icon: "accounts",
          },
          {
            label: "Total Transactions",
            stats: transactions,
            color: "green",
            icon: "transactions",
          },
          {
            label: "Current Balance",
            stats: `₹ ${currentBalance[0].amount}`,
            color: "yellow",
            icon: "accounts",
          },
          {
            label: `Customers - ${dayjs()
              .month(dayjs().month())
              .format("MMMM")}`,
            stats: thisMonthNumberOfCustomers,
            color: "pink",
            icon: "calendar",
          },
          {
            label: `Accounts - ${dayjs()
              .month(dayjs().month())
              .format("MMMM")}`,
            stats: thisMonthNumberOfAccounts,
            color: "teal",
            icon: "calendar",
          },
          {
            label: `Transactions - ${dayjs()
              .month(dayjs().month())
              .format("MMMM")}`,
            stats: thisMonthNumberOfTransactions,
            color: "violet",
            icon: "calendar",
          },
          {
            label: `Amount - ${dayjs().month(dayjs().month()).format("MMMM")}`,
            stats: `₹ ${thisMonthAmountOfTransactions[0].amount}`,
            color: "indigo",
            icon: "calendar",
          },
          {
            label: "Savings Accounts",
            stats: savings,
            color: "orange",
            icon: "accounts",
          },
          {
            label: "Loan Accounts",
            stats: savings,
            color: "lime",
            icon: "accounts",
          },
          {
            label: "Fixed Deposit Accounts",
            stats: savings,
            color: "cyan",
            icon: "accounts",
          },
          {
            label: "Recurring Deposit Accounts",
            stats: savings,
            color: "grape",
            icon: "accounts",
          },
        ],
        message: "Customers fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Erorr while fetching loans",
      });
    }
  }
};

export default connectDB(handler);
