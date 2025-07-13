const mysql = require("mysql");
require("dotenv").config();

async function connectMySQL() {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
        if (err) {
          console.error('DB connection failed:', err);
        reject(err);
        return;
        } else {
            console.log('DB connected successfully');
        resolve(connection);
      }
    });
  });
}

module.exports = {
  connectMySQL,
};
