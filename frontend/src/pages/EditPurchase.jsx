import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/EditPurchase.css";

const EditPurchase = () => {
    const { id } = useParams();

    const [items, setItems] = useState([]);
    const [purchaseItems, setPurchaseItems] = useState([]);

    const navigate = useNavigate();

    function getItems() {
        axios.get("http://localhost:8000/items")
            .then((response) => {
                setItems(response.data);
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

    function getPurchase() {
        axios.get(`http://localhost:8000/purchases/${id}`)
            .then((response) => {
                const purchase = response.data;

                const updatedItems = purchase.map((item) => {
                    return {
                        item_id: item.item_id,
                        quantity: item.quantity
                    };
                });

                setPurchaseItems(updatedItems);
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

    useEffect(() => {
        getItems();
        getPurchase();
    }, [id]);
function changeQuantity(itemId, quantity) {
    const value = Number(quantity);

    const selectedItem = items.find(
        (item) => item.id === itemId
    );

    const oldItem = purchaseItems.find(
        (item) => item.item_id === itemId
    );

    if (!selectedItem || !oldItem) {
        return;
    }

    if (value <= 0) {
        alert("Quantity must be greater than 0");
        return;
    }

    const availableStock = selectedItem.stock_available + oldItem.quantity;

    if (value > availableStock) {
        alert(
            `Quantity cannot be greater than available stock: ${availableStock}`
        );
        return;
    }

    const updatedItems = purchaseItems.map((item) => {
        if (item.item_id === itemId) {
            return {
                ...item,
                quantity: value
            };
        }

        return item;
    });

    setPurchaseItems(updatedItems);
}

    function handleSubmit(e) {
        e.preventDefault();

        const purchase = {
            items: purchaseItems
        };

        axios.put(`http://localhost:8000/purchases/${id}`, purchase)
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

                <h1>Update Purchase</h1>

                {purchaseItems.map((item) => {

                    const selectedItem = items.find(
                        (data) => data.id === item.item_id
                    );

                    return (
                        <div key={item.item_id}>

                            <p>
                                {selectedItem
                                    ? selectedItem.name
                                    : "Item"}
                            </p>

                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                    changeQuantity(
                                        item.item_id,
                                        e.target.value
                                    );
                                }}
                            />

                        </div>
                    );
                })}

                <button type="submit">
                    Update Purchase
                </button>

            </form>

        </div>
    );
};

export default EditPurchase;