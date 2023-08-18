import { getServerSession } from "next-auth";
import connectDB from "@/middleware/mongodb";
import Customer from "@/models/customer";
import Account from "@/models/account";
import Transaction from "@/models/transaction";
import { authOptions } from "../auth/[...nextauth]";
import Interest from "@/models/interest";
import dayjs from "dayjs";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      var account = await Account.findOne({ account_number: req.query.id });
      var customer = await Customer.findOne({ id: account.customer_id });
      var transaction = await Transaction.findOne({ to: req.query.id });
      var interest = await Interest.findOne({
        $and: [
          {
            from_days: {
              $lte: account.duration,
            },
          },
          {
            to_days: {
              $gte: account.duration,
            },
          },
        ],
      });

      let interestRate =
        dayjs(new Date()).diff(customer.dob, "years") <= 60
          ? interest.interest
          : interest.interest60;

      let maturityAmount =
        transaction.to_balance +
        ((transaction.to_balance * (interestRate / 100)) / 365) *
          account.duration;

      let maturityDate = dayjs(transaction.createdAt).add(
        account.duration + 1,
        "days"
      );

      return res.status(200).json({
        name: customer.name,
        customerId: customer.id,
        amount: transaction.to_balance,
        period: account.duration,
        interest: interestRate,
        account_number: account.account_number,
        maturityDate,
        maturityAmount: Number(maturityAmount.toFixed(2)),
        createdAt: transaction.createdAt,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Error while fetching customer",
      });
    }
  }
};

export default connectDB(handler);
