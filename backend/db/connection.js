const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "tiger",
    database: "item_purchase_management"
});

connection.connect((err) => {
    if (err) {
        console.log("Database connection failed");
        return;
    }

    console.log("MySQL connected successfully");
});

module.exports = connection;