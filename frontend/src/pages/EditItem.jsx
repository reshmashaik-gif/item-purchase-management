import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import "../styles/EditItem.css";

const EditItem = () => {
    const { id } = useParams();

    const [name, setName] = useState("");
    const [itemType, setItemType] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [stock, setStock] = useState("");
    const [active, setActive] = useState(true);

    const [itemTypes, setItemTypes] = useState([]);

    const navigate = useNavigate();

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

    function getItem() {
        axios.get(`http://localhost:8000/items/${id}`)
            .then((response) => {
                const item = response.data;

                setName(item.name);
                setItemType(item.item_type_id);
                setPurchaseDate(item.purchase_date.split("T")[0]);
                setStock(item.stock_available);
                setActive(item.active);
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
        getItem();
    }, [id]);

function handleForm(e) {
    e.preventDefault();

    if (!name) {
        alert("Item name is required");
        return;
    }

    if (!itemType) {
        alert("Please select an item type");
        return;
    }

    if (!purchaseDate) {
        alert("Purchase date is required");
        return;
    }

    if (stock === "" || Number(stock) < 0) {
        alert("Stock cannot be negative");
        return;
    }

    const item = {
        name: name,
        purchase_date: purchaseDate,
        stock_available: Number(stock),
        item_type_id: Number(itemType),
        active: active
    };

    axios.put(`http://localhost:8000/items/${id}`, item)
        .then((response) => {
            console.log(response.data);

            navigate("/items");
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

            <form onSubmit={handleForm}>

                <h1>Update Item</h1>

                <input
                    type="text"
                    placeholder="Enter Item Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />

                <select
                    value={itemType}
                    onChange={(e) => {
                        setItemType(e.target.value);
                    }}
                >
                    <option value="">
                        Select Item Type
                    </option>

                    {itemTypes.map((type) => {
                        return (
                            <option
                                key={type.id}
                                value={type.id}
                            >
                                {type.type_name}
                            </option>
                        );
                    })}
                </select>

                <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => {
                        setPurchaseDate(e.target.value);
                    }}
                />

                <input
                    type="number"
                    min="0"
                    placeholder="Enter Stock"
                    value={stock}
                    onChange={(e) => {
                        setStock(e.target.value);
                    }}
                />

                <select
                    value={active}
                    onChange={(e) => {
                        setActive(e.target.value === "true");
                    }}
                >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>

                <button type="submit">
                    Update Item
                </button>

            </form>

        </div>
    );
};

export default EditItem;