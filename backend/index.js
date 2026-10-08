const express = require("express");
const cors = require("cors");
const itemsRouter = require("./routes/items");
const itemTypesRouter = require("./routes/itemTypes");
const purchasesRouter = require("./routes/purchases");
const app = express();
const PORT = 8000
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Item Purchase Management System");
});


app.use("/items", itemsRouter);


app.use("/item-types", itemTypesRouter);


app.use("/purchases", purchasesRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});