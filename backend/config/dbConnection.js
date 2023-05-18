const mysql = require("mysql");

const dbConnection = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    port: process.env.SQL_PORT,
});

dbConnection.connect((error) => {
    if (error) console.error(error);
    else console.log("Connected to db!");
});

module.exports = dbConnection;
