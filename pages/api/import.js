import { getServerSession } from "next-auth";
import connectDB from "../../middleware/mongodb";
import Customer from "../../models/customer";
import { authOptions } from "./auth/[...nextauth]";
import account from "@/models/account";
import transaction from "@/models/transaction";

const handler = async (req, res) => {
  // const session = await getServerSession(req, res, authOptions);
  // if (!session) {
  //   return res
  //     .status(401)
  //     .json({ error: true, message: "You are unauthorized!" });
  // }
  if (req.method === "PUT") {
    try {
      var param = [];
      if (req.query.table == "customers") {
        const myPromise = new Promise((resolve, reject) => {
          req.body.forEach((customer) => {
            param.push({
              updateOne: {
                filter: { id: customer.id },
                update: { ...customer },
              },
            });
          });
          resolve(param);
        });
        myPromise.then((response) => {
          // return res.json({ response });
          Customer.bulkWrite(response)
            .then((r) => {
              return res.status(200).json({
                message: `${r?.nModified || 0} updated and ${
                  r?.writeErrors || 0
                } failed.`,
              });
            })
            .catch((error) => {
              return res.status(500).json({
                error: error.message,
                error1: error.stack,
              });
            });
        });
      } else if (req.query.table == "accounts") {
        const myPromise = new Promise((resolve, reject) => {
          req.body.forEach((account) => {
            param.push({
              updateOne: {
                filter: { account_number: account.account_number },
                update: { ...account },
              },
            });
          });
          resolve(param);
        });
        myPromise.then((response) => {
          // return res.json({ response });
          account
            .bulkWrite(response)
            .then((r) => {
              return res.status(200).json({
                message: `${r?.nModified || 0} updated and ${
                  r?.writeErrors || 0
                } failed.`,
              });
            })
            .catch((error) => {
              return res.status(500).json({
                error: error.message,
                error1: error.stack,
              });
            });
        });
      } else if (req.query.table == "transactions") {
        const myPromise = new Promise((resolve, reject) => {
          req.body.forEach((transaction) => {
            param.push({
              updateOne: {
                filter: { transaction_id: transaction.transaction_id },
                update: { ...transaction },
              },
            });
          });
          resolve(param);
        });
        myPromise.then((response) => {
          // return res.json({ response });
          transaction
            .bulkWrite(response)
            .then((r) => {
              return res.status(200).json({
                message: `${r?.nModified || 0} updated and ${
                  r?.writeErrors || 0
                } failed.`,
              });
            })
            .catch((error) => {
              return res.status(500).json({
                error: error.message,
                error1: error.stack,
              });
            });
        });
      } else {
        return res.status(500).json({
          error: true,
          ok: false,
          message: "Bad Request",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        ok: false,
        data: error.message,
        message: "Erorr while fetching customers",
      });
    }
  } else {
    return res.status(500).json({
      error: true,
      ok: false,
      message: "Bad Request",
    });
  }
};

export default connectDB(handler);

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb", // Set desired value here
    },
  },
};
