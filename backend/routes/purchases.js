const express = require("express");

const {
    createPurchase,
    getPurchases,
    getPurchaseById,
    updatePurchase
} = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", createPurchase);
router.get("/",getPurchases);
router.get("/:id",getPurchaseById)
router.put("/:id", updatePurchase);
module.exports = router;