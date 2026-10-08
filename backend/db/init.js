const connection = require("./connection");

const query = `
    CREATE TABLE IF NOT EXISTS item_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type_name VARCHAR(100) NOT NULL
    )
`;

connection.query(query, (err) => {
    if (err) {
        console.log("Error creating item_types table:", err);
        return;
    }

    console.log("item_types table created successfully");
});

const itemsQuery = `
    CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        purchase_date DATE NOT NULL,
        stock_available INT NOT NULL DEFAULT 0,
        item_type_id INT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (item_type_id) REFERENCES item_types(id)
    )
`;

connection.query(itemsQuery, (err) => {
    if (err) {
        console.log("Error creating items table:", err);
        return;
    }

    console.log("items table created successfully");
});
const purchasesQuery = `
    CREATE TABLE IF NOT EXISTS purchases (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL UNIQUE,
        purchase_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

connection.query(purchasesQuery, (err) => {
    if (err) {
        console.log("Error creating purchases table:", err);
        return;
    }

    console.log("purchases table created successfully");
});

const purchaseItemsQuery = `
    CREATE TABLE IF NOT EXISTS purchase_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        purchase_id INT NOT NULL,
        item_id INT NOT NULL,
        quantity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (purchase_id) REFERENCES purchases(id),
        FOREIGN KEY (item_id) REFERENCES items(id)
    )
`;

connection.query(purchaseItemsQuery, (err) => {
    if (err) {
        console.log("Error creating purchase_items table:", err);
        return;
    }

    console.log("purchase_items table created successfully");
});