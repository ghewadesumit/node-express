const mysql = require("mysql2");

/**   connection pool */

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "Supersumoz@28",
});

module.exports = pool.promise();
