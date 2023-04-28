import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Customer from "../../models/customer";
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
      var customers = await Customer.find(req.body.filters);
      return res.status(200).json({
        error: false,
        ok: true,
        data: customers,
        message: "Customers fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Erorr while fetching customers",
      });
    }
  }

  if (req.method === "GET") {
    try {
      var customers = await Customer.find().select("id name");
      customers = customers.map(({ id, name }) => ({
        label: name,
        value: id,
      }));
      return res.status(200).json({
        error: false,
        ok: true,
        data: customers,
        message: "Customers fetched successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Erorr while fetching customers",
      });
    }
  }
};

export default connectDB(handler);
