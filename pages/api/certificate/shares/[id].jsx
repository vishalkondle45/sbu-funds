import { getServerSession } from "next-auth";
import connectDB from "@/middleware/mongodb";
import Customer from "@/models/customer";
import { authOptions } from "../../auth/[...nextauth]";

const handler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.isAdmin) {
    return res
      .status(401)
      .json({ error: true, message: "You are unauthorized!" });
  }
  if (req.method === "GET") {
    try {
      var customer = await Customer.findOne({ id: req.query.id });
      return res.status(200).json({
        name: customer.name,
        customerId: customer.id,
        sharesFaceValue: 100,
        sharesCount: customer.shares,
        sharesValue: customer.shares * 100,
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
