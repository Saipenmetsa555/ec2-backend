import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digitrade",
  password: "varma",
  port: 5432,
});

const orderPlaced = express.Router();
const orderGet = express.Router();
const orderReceived = express.Router();
const orderData = express.Router();

orderPlaced.post("/", async (req, res) => {
  const {
    referralId,
    category,
    item,
    quantity,
    rate,
    totalAmount,
    address,
    orderStatus,
    userId,
  } = req.body;
  // console.log(typeof userId);
  try {
    const checkUserOrderExistedQuery = `SELECT * FROM order_details WHERE user_id=$1`;
    const response = await pool.query(checkUserOrderExistedQuery, [userId]);
    // console.log(response.rows);

    // if (response.rows.length !== 0) {
    // console.log(checkUserOrderExistedQuery.rows);
    // return res.status(409).json({ message: "Already Order placed!" });
    // } else {
    const invoiceStatus = "pending";
    const insertOrderDetails = `INSERT INTO order_details (referral_id,
    category, item, quantity, rate, total_amount, address, invoice_status,
     order_status, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

    await pool.query(insertOrderDetails, [
      referralId,
      category,
      item,
      quantity,
      rate,
      totalAmount,
      address,
      invoiceStatus,
      orderStatus,
      userId,
    ]);
    return res.status(201).json({ message: "Order placed Successfully!" });
    // }
  } catch (err) {
    console.error(err);
  }
});

orderGet.get("/", async (req, res) => {
  try {
    // old query  `SELECT * FROM order_details WHERE order_status='placed'`
    const getAllOrderDetailsQuery = `SELECT user_name,user_id,id,address,category,item,quantity,total_amount,rate
     FROM users_details NATURAL JOIN order_details WHERE order_status='placed'`;
    const response = await pool.query(getAllOrderDetailsQuery);
    if (response.rows.length === 0) {
      return res.status(201).json({ message: "No order found!" });
    } else {
      return res
        .status(201)
        .json({ message: "placed status!", rows: response.rows });
    }
  } catch (err) {
    console.error(err);
  }
});

orderData.get("/orderData/:ids", async (req, res) => {
  const ids = req.params.ids;
  try {
    const getOrderQuery = `SELECT * FROM order_details WHERE id=$1`;
    const response = await pool.query(getOrderQuery, [ids]);
    res.status(201).json({ message: "Data Found", rows: response.rows });
  } catch (err) {
    console.error(err);
  }
});

orderReceived.put("/", async (req, res) => {
  const { id } = req.body;
  // console.log(id);
  try {
    console.log(id);
    const checkingQuery = `SELECT * FROM order_details WHERE id=$1`;
    const response = await pool.query(checkingQuery, [id]);
    // console.log(response.rows, "rrr");
    if (response.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Don't have orders for this user" });
    } else if (response.rows[0].order_status === "received") {
      return res.status(409).json({ message: "Order already received" });
    } else {
      const updateStatusQuery = `UPDATE order_details SET order_status='approved' WHERE id=$1`;
      await pool.query(updateStatusQuery, [id]);
      return res.status(201).json({ message: "Order Received" });
    }
  } catch (err) {
    console.error(err);
  }
});

export { orderPlaced, orderGet, orderReceived, orderData };
