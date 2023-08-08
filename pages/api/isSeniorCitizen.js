import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import { authOptions } from "./auth/[...nextauth]";
import Customer from "@/models/customer";
import Account from "@/models/account";
import dayjs from "dayjs";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    let { customer_id } = await Account.findOne({
      account_number: req.query.account_number,
    });
    let { dob } = await Customer.findOne({ id: customer_id });
    return res.status(200).json(dayjs().diff(dayjs(dob), "year", true) >= 60);
  } else {
    return res.status(500).json({
      error: true,
      ok: false,
      message: "Bad Request",
    });
  }
};

export default connectDB(handler);
