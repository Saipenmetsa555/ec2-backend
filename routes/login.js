import express from "express";
import pkg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { Pool } = pkg;

const getData = express.Router();
const loginDetails = express.Router();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digitrade",
  password: "varma",
  port: 5432,
});

loginDetails.post("/", async (req, res) => {
  const { userName, userPassword } = req.body;
  try {
    const getUserDetailsQuery = `SELECT * from users_details WHERE user_name=$1`;

    const userExistedOrNot = await pool.query(getUserDetailsQuery, [userName]);
    console.log(userExistedOrNot.rows);
    if (userExistedOrNot.rows.length === 0) {
      return res.status(404).json({ message: "User Not Found!" });
    } else {
      const hashedPassword = await bcrypt.compare(
        userPassword,
        userExistedOrNot.rows[0].user_password
      );
      if (hashedPassword) {
        const token = jwt.sign(
          {
            id: userExistedOrNot.rows[0].user_id,
            user_name: userExistedOrNot.rows[0].user_name,
            user_role: userExistedOrNot.rows[0].user_role,
          },
          "your_secret_key",
          { expiresIn: "1h" }
        );
        return res
          .status(201)
          .json({ message: "Verified user", jwt_token: token });
      } else {
        return res.status(404).json({ message: "Password Didn't match" });
      }
    }
    // const passwordCompare=bcrypt.compare(userPassword,)
  } catch (err) {
    console.error(err);
  }
});

// getData.get("/get", async (req, res) => {
//   try {
//     const getQuery = `SELECT * FROM users_details`;
//     const responseData = await pool.query(getQuery);

//     res
//       .status(201)
//       .send({ message: "Data Successfully", rows: responseData.rows });
//   } catch (err) {
//     res.status(500).send({ message: "error creating database" });
//   }
// });

export { loginDetails };
