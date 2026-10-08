const connection = require("../db/connection");

const createPurchase = async (req, res) => {
    try {
        const { order_id, purchase_date, items } = req.body;

        if (!order_id) {
            return res.status(400).json({
                message: "Order ID is required"
            });
        }

     if (!purchase_date || isNaN(new Date(purchase_date).getTime())) {
    return res.status(400).json({
        message: "Valid purchase date is required"
    });
}

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Items are required"
            });
        }
        const itemIds = items.map(item => item.item_id);

const uniqueItemIds = new Set(itemIds);

if (itemIds.length !== uniqueItemIds.size) {
    return res.status(400).json({
        message: "Duplicate items are not allowed"
    });
}

        // Check all items before saving
        for (const item of items) {
            const { item_id, quantity } = item;

            const [result] = await connection.promise().query(
                `SELECT stock_available, active
                 FROM items
                 WHERE id = ?`,
                [item_id]
            );

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Item not found"
                });
            }

            if (!result[0].active) {
                return res.status(400).json({
                    message: "Item is inactive"
                });
            }

          if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
        message: "Quantity must be a positive integer"
    });
}

            if (quantity > result[0].stock_available) {
                return res.status(400).json({
                    message: "Not enough stock"
                });
            }
        }

        // Start transaction
        await connection.promise().beginTransaction();

        const [purchase] = await connection.promise().query(
            `INSERT INTO purchases
            (order_id, purchase_date)
            VALUES (?, ?)`,
            [order_id, purchase_date]
        );

        for (const item of items) {

            await connection.promise().query(
                `INSERT INTO purchase_items
                (purchase_id, item_id, quantity)
                VALUES (?, ?, ?)`,
                [purchase.insertId, item.item_id, item.quantity]
            );

            await connection.promise().query(
                `UPDATE items
                SET stock_available = stock_available - ?
                WHERE id = ?`,
                [item.quantity, item.item_id]
            );
        }

        // Save everything
        await connection.promise().commit();

        res.status(201).json({
            message: "Purchase created successfully",
            purchase_id: purchase.insertId
        });

    } catch (err) {

        // Undo if something fails
        await connection.promise().rollback();

        console.log(err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "Order ID already exists"
            });
        }

        res.status(500).json({
            message: "Failed to create purchase"
        });
    }
};


const getPurchases = async (req, res) => {
    try {
        const sql = `
            SELECT *
            FROM purchases
        `;

        const [result] = await connection.promise().query(sql);

        res.json(result);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Failed to fetch purchases"
        });
    }
};


const getPurchaseById = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            SELECT
                purchases.order_id,
                purchases.purchase_date,
                items.name,
                item_types.type_name,
                purchase_items.quantity,
                items.stock_available
            FROM purchases
            JOIN purchase_items
            ON purchases.id = purchase_items.purchase_id
            JOIN items
            ON purchase_items.item_id = items.id
            JOIN item_types
            ON items.item_type_id = item_types.id
            WHERE purchases.id = ?
        `;

        const [result] = await connection.promise().query(sql, [id]);

        if (result.length === 0) {
            return res.status(404).json({
                message: "Purchase not found"
            });
        }

        res.json(result);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Failed to fetch purchase"
        });
    }
};


const updatePurchase = async (req, res) => {
    let transactionStarted = false;

    try {
        const { id } = req.params;
        const { items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "Items are required"
            });
        }

        // Check duplicate items
        const itemIds = items.map(item => item.item_id);
        const uniqueItemIds = new Set(itemIds);

        if (itemIds.length !== uniqueItemIds.size) {
            return res.status(400).json({
                message: "Duplicate items are not allowed"
            });
        }

        // Get existing purchase items
        const [existingItems] = await connection.promise().query(
            `SELECT item_id, quantity
             FROM purchase_items
             WHERE purchase_id = ?`,
            [id]
        );

        if (existingItems.length === 0) {
            return res.status(404).json({
                message: "Purchase not found"
            });
        }

        // For simplicity, item list cannot be changed.
        // Only quantities can be updated.
        if (existingItems.length !== items.length) {
            return res.status(400).json({
                message: "Purchase items cannot be added or removed"
            });
        }

        // Check every item
        for (const item of items) {
            const { item_id, quantity } = item;

         if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
        message: "Quantity must be greater than 0"
    });
}

            const oldItem = existingItems.find(
                existing => existing.item_id === item_id
            );

            if (!oldItem) {
                return res.status(400).json({
                    message: "Item does not belong to this purchase"
                });
            }

            const [itemResult] = await connection.promise().query(
                `SELECT stock_available, active
                 FROM items
                 WHERE id = ?`,
                [item_id]
            );

            if (itemResult.length === 0) {
                return res.status(404).json({
                    message: "Item not found"
                });
            }

            if (!itemResult[0].active) {
                return res.status(400).json({
                    message: "Item is inactive"
                });
            }

            const difference = quantity - oldItem.quantity;

            if (difference > itemResult[0].stock_available) {
                return res.status(400).json({
                    message: "Not enough stock"
                });
            }
        }

        // Start transaction
        await connection.promise().beginTransaction();
        transactionStarted = true;

        // Update every item
        for (const item of items) {
            const oldItem = existingItems.find(
                existing => existing.item_id === item.item_id
            );

            const difference = item.quantity - oldItem.quantity;

            await connection.promise().query(
                `UPDATE purchase_items
                 SET quantity = ?
                 WHERE purchase_id = ?
                 AND item_id = ?`,
                [item.quantity, id, item.item_id]
            );

            await connection.promise().query(
                `UPDATE items
                 SET stock_available = stock_available - ?
                 WHERE id = ?`,
                [difference, item.item_id]
            );
        }

        await connection.promise().commit();
        transactionStarted = false;

        res.json({
            message: "Purchase updated successfully"
        });

    } catch (err) {

        if (transactionStarted) {
            await connection.promise().rollback();
        }

        console.log(err);

        res.status(500).json({
            message: "Failed to update purchase"
        });
    }
};


module.exports = {
    createPurchase,
    getPurchases,
    getPurchaseById,
    updatePurchase
};