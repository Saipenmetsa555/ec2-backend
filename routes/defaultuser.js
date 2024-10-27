import pkg from "pg";
import bcrypt from "bcrypt";

const { Pool } = pkg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digitrade",
  password: "varma",
  port: 5432,
});

const insertInitialUser = async () => {
  try {
    // Check if any users exist in the table
    const result = await pool.query("SELECT * FROM users_details");

    if (result.rows.length === 0) {
      // If no users exist, hash the password and insert the initial user
      const username = "admin";
      const password = "password123"; // Replace with your desired initial password
      const role = "ADMIN";

      // Hash the password using bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the user with the hashed password
      await pool.query(
        "INSERT INTO users_details (user_name, user_password, user_role) VALUES ($1, $2, $3)",
        [username, hashedPassword, role]
      );
      console.log("Initial user inserted with hashed password.");
    } else {
      console.log("Users already exist. No user inserted.");
    }
  } catch (err) {
    console.error("Error inserting initial user:", err);
  }
};

export default insertInitialUser;
