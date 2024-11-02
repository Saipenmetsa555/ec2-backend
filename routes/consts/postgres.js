import pkg from "pg";

const { Pool } = pkg;

export const pools = new Pool({
  user: "postgres",
  host: "localhost",
  database: "digitrade",
  password: "varma",
  port: 5432,
});
