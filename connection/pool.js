const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  server: "127.0.0.1",
  user: "root",
  password: "",
  database: "db_portfolio",
});

module.exports = pool;
