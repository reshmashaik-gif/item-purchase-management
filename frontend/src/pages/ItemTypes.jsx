import React, { useEffect, useState } from "react";
import axios from "axios";

import "../styles/ItemTypes.css";

const ItemTypes = () => {
    const [itemTypes, setItemTypes] = useState([]);
    const [typeName, setTypeName] = useState("");
    const [editId, setEditId] = useState(null);

    function getItemTypes() {
        axios.get("http://localhost:8000/item-types")
            .then((response) => {
                setItemTypes(response.data);
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
        getItemTypes();
    }, []);

    function handleSubmit(e) {
        e.preventDefault();

        if (!typeName) {
            alert("Item type is required");
            return;
        }

        const itemType = {
            type_name: typeName
        };

        if (editId) {
            axios.put(
                `http://localhost:8000/item-types/${editId}`,
                itemType
            )
                .then((response) => {
                    console.log(response.data);

                    setTypeName("");
                    setEditId(null);
                    getItemTypes();
                })
                .catch((err) => {
                    console.log(err);

                    if (err.response) {
                        alert(err.response.data.message);
                    } else {
                        alert("Something went wrong");
                    }
                });
        } else {
            axios.post(
                "http://localhost:8000/item-types",
                itemType
            )
                .then((response) => {
                    console.log(response.data);

                    setTypeName("");
                    getItemTypes();
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
    }

    function editItemType(type) {
        setTypeName(type.type_name);
        setEditId(type.id);
    }

    function deleteItemType(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this item type?"
        );

        if (!confirmDelete) {
            return;
        }

        axios.delete(`http://localhost:8000/item-types/${id}`)
            .then((response) => {
                console.log(response.data);
                getItemTypes();
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
            <h1>Item Types</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter Item Type"
                    value={typeName}
                    onChange={(e) => setTypeName(e.target.value)}
                />

                <button type="submit">
                    {editId ? "Update Item Type" : "Add Item Type"}
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Item Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {itemTypes.map((type) => {
                        return (
                            <tr key={type.id}>
                                <td>{type.id}</td>
                                <td>{type.type_name}</td>

                                <td>
                                    <button
                                        onClick={() =>
                                            editItemType(type)
                                        }
                                    >
                                        Update
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteItemType(type.id)
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

export default ItemTypes;