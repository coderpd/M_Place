const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.MYSQLUSER,
  password: process.env.PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  
});



module.exports = pool;
