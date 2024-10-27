import express from "express";
import bcrypt from "bcrypt";
import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digitrade",
  password: "varma",
  port: 5432,
});

const periment = express.Router();
const notApproveUser = express.Router();

periment.post("/", async (req, res) => {
  const {
    id,
    fullName,
    nickName,
    fatherName,
    age,
    address,
    mobileNo,
    aadharNo,
    panNo,
    userType,
    userName,
    userPassword,
  } = req.body;
  console.log(
    id,
    fullName,
    nickName,
    fatherName,
    age,
    address,
    mobileNo,
    aadharNo,
    panNo,
    userType,
    userName,
    userPassword
  );
  try {
    // Check if user already exists
    const userExistedOrNot = `SELECT * FROM users_details WHERE user_name=$1`;
    const existedUserResult = await pool.query(userExistedOrNot, [userName]);
    // ================
    // const userIdQuery = `SELECT user_id from users_details WHERE user_name=$1`;
    // const userIdInsert = await pool.query(userIdQuery, [userName]);
    // console.log(userIdInsert.rows[0]?.user_id);
    // ====================
    if (existedUserResult.rows.length !== 0) {
      return res.status(409).json({ message: "User Already Exists!" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltRounds);

    // Insert into users details
    const insertQueryToUserDetails = `
          INSERT INTO users_details (user_name, user_password, user_role)
          VALUES ($1, $2, $3)`;

    await pool.query(insertQueryToUserDetails, [
      userName,
      hashedPassword,
      userType,
    ]);

    //getting user_id from user_details table
    const userIdQuery = `SELECT user_id from users_details WHERE user_name=$1`;
    const userIdInsert = await pool.query(userIdQuery, [userName]);
    // console.log(userIdInsert.rows[0]?.user_id);
    // Insert into permanent user details
    const insertQueryToPeriment = `
        INSERT INTO perminent_user_details (
          full_name, nick_name, father_name, age, address, mobile_no,
          aadhar_no, pan_no, user_type, user_name, user_password, status, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`;
    const status = "approved";
    await pool.query(insertQueryToPeriment, [
      fullName,
      nickName,
      fatherName,
      age,
      address,
      mobileNo,
      aadharNo,
      panNo,
      userType,
      userName,
      hashedPassword,
      status,
      userIdInsert?.rows[0]?.user_id,
    ]);

    const updateStatusInTemporaryTable = `UPDATE temporary_user_details SET user_status=$1 WHERE id=$2`;

    await pool.query(updateStatusInTemporaryTable, [status, id]);

    return res
      .status(201)
      .json({ message: "Data Added Successfully to permanent table!" });
  } catch (err) {
    console.error("Error inserting data", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

notApproveUser.put("/", async (req, res) => {
  const { id } = req.body;
  try {
    const updateNotApprovalQuery = `UPDATE temporary_user_details SET user_status ='not approved' WHERE id=$1`;

    await pool.query(updateNotApprovalQuery, [id]);

    return res.status(201).json({ message: "status Updated" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server Error" });
  }
});

export { periment, notApproveUser };
