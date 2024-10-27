import express from "express";
import pkg from "pg";

const { Pool } = pkg;

const registerTemporaryDetails = express.Router();
const adminApprovalUsersGet = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digitrade",
  password: "varma",
  port: 5432,
});

registerTemporaryDetails.use("/", async (req, res) => {
  try {
    const {
      fullName,
      nickName,
      fatherName,
      age,
      address,
      mobileNo,
      aadharNo,
      panNo,
      userType,
      userStatus,
      userAcknowledge,
      userName,
      userPassword,
    } = req.body;
    // console.log(
    //   fullName,
    //   nickName,
    //   fatherName,
    //   age,
    //   address,
    //   mobileNo,
    //   aadharNo,
    //   panNo,
    //   userType,
    //   userStatus,
    //   userAcknowledge,
    //   userName,
    //   userPassword
    // );
    await pool.query(
      `INSERT INTO temporary_user_details (full_name, nick_name, father_name, age,address, mobile_no, aadhar_no, pan_no,
    user_type, user_status, user_acknowledge ,user_name, user_password)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        fullName,
        nickName,
        fatherName,
        age,
        address,
        mobileNo,
        aadharNo,
        panNo,
        userType,
        userStatus,
        userAcknowledge,
        userName,
        userPassword,
      ]
    );

    res.status(200).json({ message: "Data Saved Successfully to temporary!" });
  } catch (err) {
    console.error(err);
  }
});

adminApprovalUsersGet.get("/", async (req, res) => {
  try {
    const getApproveUsersQuery = `SELECT * FROM temporary_user_details WHERE user_status='pending'`;

    const response = await pool.query(getApproveUsersQuery);
    if (response.rows.length === 0) {
      // console.log("no users");
      return res.status(404).json({ message: "No Users Found!" });
    } else {
      return res
        .status(201)
        .json({ message: "Data Found", rows: response?.rows });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export { registerTemporaryDetails, adminApprovalUsersGet };
