import { Pool } from "pg";
require("dotenv").config();
const pool = new Pool({
  user: process.env.PGHOST,
  host: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: 5432,
});
const db = {
  query: (text: string, params: any[]) => pool.query(text, params),
};
export default db;
