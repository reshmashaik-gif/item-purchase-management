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
    setPurchaseItems((prevItems) =>
        prevItems.map((item) =>
            item.item_id === itemId
                ? {
                    ...item,
                    quantity: quantity
                }
                : item
        )
    );
}



function handleSubmit(e) {
    e.preventDefault();

    const purchase = {
        items: purchaseItems.map((item) => ({
            item_id: Number(item.item_id),
            quantity: Number(item.quantity)
        }))
    };

    console.log("Purchase ID:", id);
    console.log("Request payload:", purchase);

    axios.put(`http://localhost:8000/purchases/${id}`, purchase)
        .then((response) => {
            console.log(response.data);
            navigate("/purchases");
        })
        .catch((err) => {
            console.log("Backend error:", err.response?.data);
            alert(
                err.response?.data?.message ||
                "Failed to update purchase"
            );
        });
}

    return (
        <div className="container">

            <form onSubmit={handleSubmit}>

                <h1>Update Purchase</h1>

                {purchaseItems.map((item) => {
    const selectedItem = items.find(
        (data) => data.id === Number(item.item_id)
    );

    return (
        <div key={item.item_id}>
            <p>
                {selectedItem ? selectedItem.name : "Item"}
            </p>

            <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                    changeQuantity(item.item_id, e.target.value)
                }
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