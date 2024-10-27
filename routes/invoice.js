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

const sendInvoice = express.Router();
const invoiceGet = express.Router();
const invoiceAccept = express.Router();

sendInvoice.post("/", async (req, res) => {
  const { invoiceStatus, userId } = req.body;

  try {
    const submitInvoiceQuery = `INSERT INTO invoice_details(invoice_status, user_id)
        VALUES($1, $2)`;
    await pool.query(submitInvoiceQuery, [invoiceStatus, userId]);
    return res.status(201).json({ message: "Invoice Send Successfully!" });
  } catch (err) {
    console.log(err);
  }
});

invoiceGet.get("/", async (req, res) => {
  try {
    const getInvoiceQuery = `SELECT * FROM invoice_details WHERE invoice_status='pending'`;
    const response = await pool.query(getInvoiceQuery);
    if (response.rows.length === 0) {
      return res.status(404).json({ message: "No invocies found!" });
    } else {
      return res.status(200).json({ message: "Send Successfully!" });
    }
  } catch (err) {
    console.error(err);
  }
});

// invoiceAccept.post("/", async (req, res) => {
//   const {} = req.body;
//   try {
//   } catch (err) {
//     console.error(err);
//   }
// });

export { sendInvoice, invoiceGet };
