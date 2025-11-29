require('dotenv').config();
const mysql = require('mysql2');

// const pool = mysql.createPool(process.env.DATABASE_URL)

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
});

pool.getConnection(function (err, connection) {
    if (err) {
        console.log('DB Connection Error:  ' + err.message);
        return;
    }
    console.log('Connection DB Successfully');
    connection.release();
})

module.exports = pool.promise()