const connection = require("../db/connection");

const getItemTypes = async (req, res) => {
    try {
        const sql = `
            SELECT id, type_name
            FROM item_types
        `;

        const [result] = await connection.promise().query(sql);

        res.json(result);
    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Failed to fetch item types"
        });
    }
};
const createItemType = async (req, res) => {
    try {
        const { type_name } = req.body;

        if (!type_name) {
            return res.status(400).json({
                message: "Item type name is required"
            });
        }

        const sql = `
            INSERT INTO item_types (type_name)
            VALUES (?)
        `;

        const [result] = await connection.promise().query(sql, [type_name]);

        res.status(201).json({
            message: "Item type created successfully",
            item_type_id: result.insertId
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Failed to create item type"
        });
    }
};
const updateItemType = async (req, res) => {
    try {
        const { id } = req.params;
        const { type_name } = req.body;

        if (!type_name) {
            return res.status(400).json({
                message: "Item type name is required"
            });
        }

        const sql = `
            UPDATE item_types
            SET type_name = ?
            WHERE id = ?
        `;

        const [result] = await connection.promise().query(sql, [
            type_name,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Item type not found"
            });
        }

        res.json({
            message: "Item type updated successfully"
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            message: "Failed to update item type"
        });
    }
};
const deleteItemType = async (req, res) => {
    try {
        const { id } = req.params;

        const [items] = await connection.promise().query(
            `SELECT id
             FROM items
             WHERE item_type_id = ?`,
            [id]
        );

        if (items.length > 0) {
            return res.status(409).json({
                message: "Cannot delete item type because it is being used by an item"
            });
        }

        const [result] = await connection.promise().query(
            `DELETE FROM item_types
             WHERE id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Item type not found"
            });
        }

        res.json({
            message: "Item type deleted successfully"
        });

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: "Failed to delete item type"
        });
    }
};

module.exports = {
    getItemTypes,
    createItemType,
    updateItemType,
    deleteItemType
};