import { getServerSession } from "next-auth";
import connectDB from "@/middleware/mongodb";
import Customer from "@/models/customer";
import Account from "@/models/account";
import { authOptions } from "../../auth/[...nextauth]";
import Share from "@/models/share";

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
      //   var shares = await Share.findOne();
      return res.status(200).json({
        name: customer.name,
        address: customer.address,
        customerId: customer.id,
        sharesCount: customer.shares,
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
