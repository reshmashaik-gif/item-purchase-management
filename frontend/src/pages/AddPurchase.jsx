import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/AddPurchase.css";

const AddPurchase = () => {
    const [orderId, setOrderId] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");

    const [items, setItems] = useState([]);

    const [selectedItem, setSelectedItem] = useState("");
    const [quantity, setQuantity] = useState("");

    const [purchaseItems, setPurchaseItems] = useState([]);

    const navigate = useNavigate();

    function getItems() {
        axios.get("http://localhost:8000/items")
            .then((response) => {
                setItems(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getItems();
    }, []);

    function addItem() {

    if (!selectedItem) {
        alert("Please select an item");
        return;
    }

    if (!quantity || Number(quantity) <= 0) {
        alert("Quantity must be greater than 0");
        return;
    }

    const selected = items.find(
        (item) => item.id === Number(selectedItem)
    );

    if (!selected) {
        alert("Item not found");
        return;
    }

    if (!selected.active) {
        alert("Item is inactive");
        return;
    }

    if (Number(quantity) > selected.stock_available) {
        alert(
            `Not enough stock. Available stock: ${selected.stock_available}`
        );
        return;
    }

    const alreadyAdded = purchaseItems.find(
        (item) => item.item_id === Number(selectedItem)
    );

    if (alreadyAdded) {
        alert("This item is already added");
        return;
    }

    const item = {
        item_id: Number(selectedItem),
        quantity: Number(quantity)
    };

    setPurchaseItems([
        ...purchaseItems,
        item
    ]);

    setSelectedItem("");
    setQuantity("");
}

    function removeItem(itemId) {

        const updatedItems = purchaseItems.filter(
            (item) => item.item_id !== itemId
        );

        setPurchaseItems(updatedItems);
    }

    function getItemName(itemId) {

        const item = items.find(
            (item) => item.id === itemId
        );

        return item ? item.name : "";
    }

    function handleSubmit(e) {
    e.preventDefault();

    if (!orderId) {
        alert("Order ID is required");
        return;
    }

    if (!purchaseDate) {
        alert("Purchase date is required");
        return;
    }

    if (purchaseItems.length === 0) {
        alert("Please add at least one item");
        return;
    }

    const purchase = {
        order_id: orderId,
        purchase_date: purchaseDate,
        items: purchaseItems
    };

    axios.post("http://localhost:8000/purchases", purchase)
        .then((response) => {
            console.log(response.data);

            navigate("/purchases");
        })
       .catch((err) => {
    console.log(err);

    if (err.response) {
        alert(err.response.data.message);
    } else {
        alert("Something went wrong");
    }
});
}

    return (
        <div className="container">

            <form onSubmit={handleSubmit}>

                <h1>Create Purchase</h1>

                <input
                    type="text"
                    placeholder="Enter Order ID"
                    value={orderId}
                    onChange={(e) => {
                        setOrderId(e.target.value);
                    }}
                />

                <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => {
                        setPurchaseDate(e.target.value);
                    }}
                />

                <select
                    value={selectedItem}
                    onChange={(e) => {
                        setSelectedItem(e.target.value);
                    }}
                >
                    <option value="">
                        Select Item
                    </option>

                    {items.map((item) => {

                        if (!item.active) {
                            return null;
                        }

                        return (
                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.name} - Stock: {item.stock_available}
                            </option>
                        );
                    })}
                </select>

                <input
                    type="number"
                    min="1"
                    placeholder="Enter Quantity"
                    value={quantity}
                    onChange={(e) => {
                        setQuantity(e.target.value);
                    }}
                />

                <button
                    type="button"
                    onClick={addItem}
                >
                    Add Item
                </button>

                {purchaseItems.map((item) => {

                    return (
                        <div key={item.item_id}>

                            <p>
                                {getItemName(item.item_id)}
                                {" - "}
                                Quantity: {item.quantity}
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    removeItem(item.item_id);
                                }}
                            >
                                Remove
                            </button>

                        </div>
                    );
                })}

                <button type="submit">
                    Create Purchase
                </button>

            </form>

        </div>
    );
};

export default AddPurchase;