"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require("dotenv").config();
const pool = new pg_1.Pool({
    user: process.env.PGHOST,
    host: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: 5432,
});
const db = {
    query: (text, params) => pool.query(text, params),
};
exports.default = db;
//# sourceMappingURL=index.js.map