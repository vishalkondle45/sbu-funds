import { getServerSession } from "next-auth";
import connectDB from "@/middleware/mongodb";
import Customer from "@/models/customer";
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
      var customer = await Customer.findOne({ id: req.query.id });
      var shares = await Share.findOne();
      return res.status(200).json({
        name: customer.name,
        address: customer.address,
        customerId: customer.id,
        sharesFaceValue: shares.value,
        sharesCount: customer.shares,
        sharesValue: customer.shares * shares.value,
        createdAt: customer.createdAt,
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
