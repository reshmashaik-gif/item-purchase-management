const connection = require("../db/connection");
const getItems = async (req, res) => {
    try {
        const sql = `
            SELECT
                items.id,
                items.name,
                items.purchase_date,
                items.stock_available,
                items.active,
                items.item_type_id,
                item_types.type_name
            FROM items
            JOIN item_types
            ON items.item_type_id = item_types.id
        `;

        const [result] = await connection.promise().query(sql);

        res.json(result);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Failed to fetch items"
        });
    }
};
const createItem = async (req, res) => {
    try {
        const {
            name,
            purchase_date,
            stock_available,
            item_type_id,
            active
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Item name is required"
            });
        }

        if (!purchase_date || isNaN(new Date(purchase_date).getTime())) {
            return res.status(400).json({
                message: "Valid purchase date is required"
            });
        }

        if (
            stock_available === undefined ||
            !Number.isInteger(stock_available) ||
            stock_available < 0
        ) {
            return res.status(400).json({
                message: "Stock must be a non-negative integer"
            });
        }

        if (!item_type_id) {
            return res.status(400).json({
                message: "Item type is required"
            });
        }

        const [type] = await connection.promise().query(
            `SELECT id
             FROM item_types
             WHERE id = ?`,
            [item_type_id]
        );

        if (type.length === 0) {
            return res.status(400).json({
                message: "Item type not found"
            });
        }

        const [result] = await connection.promise().query(
            `INSERT INTO items
            (name, purchase_date, stock_available, item_type_id, active)
            VALUES (?, ?, ?, ?, ?)`,
            [
                name,
                purchase_date,
                stock_available,
                item_type_id,
                active === undefined ? true : active
            ]
        );

        res.status(201).json({
            message: "Item created successfully",
            item_id: result.insertId
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Failed to create item"
        });
    }
};
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            SELECT 
                items.id,
                items.name,
                items.purchase_date,
                items.stock_available,
                items.active,
                item_types.type_name
            FROM items
            JOIN item_types
            ON items.item_type_id = item_types.id
            WHERE items.id = ?
        `;

        const [result] = await connection.promise().query(sql, [id]);

        if (result.length === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.json(result[0]);

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Failed to fetch item"
        });
    }
};
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            purchase_date,
            stock_available,
            item_type_id,
            active
        } = req.body;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                message: "Invalid item ID"
            });
        }

        if (!name) {
            return res.status(400).json({
                message: "Item name is required"
            });
        }

        if (!purchase_date || isNaN(new Date(purchase_date).getTime())) {
            return res.status(400).json({
                message: "Valid purchase date is required"
            });
        }

        if (
            stock_available === undefined ||
            !Number.isInteger(stock_available) ||
            stock_available < 0
        ) {
            return res.status(400).json({
                message: "Stock must be a non-negative integer"
            });
        }

        if (!item_type_id) {
            return res.status(400).json({
                message: "Item type is required"
            });
        }

        const [item] = await connection.promise().query(
            `SELECT id
             FROM items
             WHERE id = ?`,
            [id]
        );

        if (item.length === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        const [type] = await connection.promise().query(
            `SELECT id
             FROM item_types
             WHERE id = ?`,
            [item_type_id]
        );

        if (type.length === 0) {
            return res.status(400).json({
                message: "Item type not found"
            });
        }

        await connection.promise().query(
            `UPDATE items
             SET name = ?,
                 purchase_date = ?,
                 stock_available = ?,
                 item_type_id = ?,
                 active = ?
             WHERE id = ?`,
            [
                name,
                purchase_date,
                stock_available,
                item_type_id,
                active === undefined ? true : active,
                id
            ]
        );

        res.json({
            message: "Item updated successfully"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Failed to update item"
        });
    }
};
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            SELECT id
            FROM purchase_items
            WHERE item_id = ?
        `;

        const [result] = await connection.promise().query(sql, [id]);

        if (result.length > 0) {
            const updateSql = `
                UPDATE items
                SET active = false
                WHERE id = ?
            `;

            await connection.promise().query(updateSql, [id]);

            return res.json({
                message: "Item has purchase history, so it was marked inactive"
            });
        }

        const deleteSql = `
            DELETE FROM items
            WHERE id = ?
        `;

        const [deleteResult] = await connection.promise().query(
            deleteSql,
            [id]
        );

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        res.json({
            message: "Item deleted successfully"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Failed to delete item"
        });
    }
};
module.exports = {
    getItems,
    createItem,
    getItemById,
    updateItem,
    deleteItem
};