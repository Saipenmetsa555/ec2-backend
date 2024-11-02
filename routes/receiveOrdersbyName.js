import express from "express";
import pkg from "pg";

const { Pool } = pkg;
const receivedOrdersFromUser = express.Router();
const updateInvoiceStatus = express.Router();
const getOrderDetailsToAdmin = express.Router();
const updateInvoiceStatusByAdmin = express.Router();
const getInvoiceByUser = express.Router();

const pools = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digitrade",
  password: "varma",
  port: 5432,
});

receivedOrdersFromUser.get(
  "/receivedOrdersbyUser/:userid",
  async (req, res) => {
    const userid = req.params.userid;
    // console.log(userid);
    try {
      const dataGetQueryByUserName = `SELECT * FROM order_details WHERE user_id=$1 AND order_status='approved'`;
      const response = await pools.query(dataGetQueryByUserName, [userid]);
      if (response.rows.length === 0) {
        return res.status(404).json({ message: "No Orders Found!" });
      } else {
        return res
          .status(201)
          .json({ message: "Data Found", rows: response?.rows });
      }
    } catch (err) {
      console.error(err);
    }
  }
);

updateInvoiceStatus.put("/updateInvoiceStatus", async (req, res) => {
  const { id, invoiceStatus } = req.body;
  console.log(invoiceStatus, id);
  try {
    const updateQueryForInvoiceStatus = `UPDATE order_details SET invoice_status=$1, order_status='received' WHERE id=$2`;
    await pools.query(updateQueryForInvoiceStatus, [invoiceStatus, id]);
    return res.status(201).json({ message: "Sent to admin" });
  } catch (err) {
    console.error(err);
  }
});

updateInvoiceStatusByAdmin.put(
  "/updateInvoiceStatusByAdmin",
  async (req, res) => {
    const { id, invoiceStatus } = req.body;
    try {
      const updateQueryForInvoiceStatus = `UPDATE order_details SET invoice_status=$1 WHERE id=$2`;
      await pools.query(updateQueryForInvoiceStatus, [invoiceStatus, id]);
      return res.status(201).json({ message: "Sent to admin" });
    } catch (err) {
      console.error(err);
    }
  }
);

getOrderDetailsToAdmin.get("/getOrderDetailsToAdmin", async (req, res) => {
  try {
    const orderQuery = `SELECT * FROM order_details WHERE invoice_status='at admin'`;

    const response = await pools.query(orderQuery);
    // console.log(response.rows);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "No Orders Found!" });
    }
    return res
      .status(201)
      .json({ message: "Data Found", rows: response?.rows });
  } catch (err) {
    console.error(err);
  }
});

getInvoiceByUser.get("/getInvoiceByUser/:userId", async (req, res) => {
  const userId = req.params.userId;
  // console.log(userId);
  try {
    const getUserQuery = `SELECT * FROM order_details WHERE 
     user_id=$1 AND invoice_status='invoice approved'`;
    const response = await pools.query(getUserQuery, [userId]);
    // console.log(response.rows);
    if (response?.rows.length === 0) {
      return res.status(404).json({ message: "No Invoices Found!" });
    } else {
      return res
        .status(201)
        .json({ message: "Data Found", rows: response?.rows });
    }
  } catch (err) {
    console.error(err);
  }
});

export {
  receivedOrdersFromUser,
  updateInvoiceStatus,
  getOrderDetailsToAdmin,
  updateInvoiceStatusByAdmin,
  getInvoiceByUser,
};
