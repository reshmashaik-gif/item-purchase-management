const express = require("express");

const {
    getItemTypes,
    createItemType,
    updateItemType,
    deleteItemType
} = require("../controllers/itemTypeController");

const router = express.Router();

router.get("/", getItemTypes);
router.post("/", createItemType);
router.put("/:id", updateItemType);
router.delete("/:id", deleteItemType);

module.exports = router;