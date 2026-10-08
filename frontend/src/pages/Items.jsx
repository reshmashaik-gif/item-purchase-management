import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Items.css";

const Items = () => {
    const [items, setItems] = useState([]);

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

    function toggleStatus(item) {
        const updatedItem = {
            name: item.name,
            purchase_date: item.purchase_date.split("T")[0],
            stock_available: Number(item.stock_available),
            item_type_id: Number(item.item_type_id),
            active: item.active ? false : true
        };

        axios.put(
            `http://localhost:8000/items/${item.id}`,
            updatedItem
        )
            .then((response) => {
                console.log(response.data);
                getItems();
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

    function deleteItem(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this item?"
        );

        if (!confirmDelete) {
            return;
        }

        axios.delete(`http://localhost:8000/items/${id}`)
            .then((response) => {
                console.log(response.data);
                getItems();
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

            <h1>Items</h1>

            <button onClick={() => navigate("/items/add")}>
                Add Item
            </button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Purchase Date</th>
                        <th>Current Stock</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) => {
                        return (
                            <tr key={item.id}>

                                <td>{item.id}</td>

                                <td>{item.name}</td>

                                <td>{item.type_name}</td>

                                <td>
                                    {item.purchase_date.split("T")[0]}
                                </td>

                                <td>{item.stock_available}</td>

                                <td>
                                    {item.stock_available === 0
                                        ? "Out of Stock"
                                        : item.stock_available <= 5
                                        ? "Low Stock"
                                        : "In Stock"}
                                </td>

                                <td>
                                    {item.active
                                        ? "Active"
                                        : "Inactive"}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            navigate(`/items/${item.id}`)
                                        }
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() =>
                                            navigate(`/items/${item.id}/edit`)
                                        }
                                    >
                                        Update
                                    </button>

                                    <button
                                        onClick={() =>
                                            toggleStatus(item)
                                        }
                                    >
                                        {item.active
                                            ? "Deactivate"
                                            : "Activate"}
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteItem(item.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>

        </div>
    );
};

export default Items;