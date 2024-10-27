import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const temporaryDetailsGet = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digitrade",
  password: "varma",
  port: 5432,
});

temporaryDetailsGet.get("/", async (req, res) => {
  try {
    const getTemporaryDetails = `SELECT * FROM temporary_user_details`;
    const response = await pool.query(getTemporaryDetails);
    res.status(201).json({ message: "Data", row: response.rows });
  } catch (err) {
    console.error("Error to fetch data");
  }
});

export { temporaryDetailsGet };
