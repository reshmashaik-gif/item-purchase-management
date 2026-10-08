import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ItemDetails.css";

const ItemDetails = () => {
    const { id } = useParams();

    const [item, setItem] = useState(null);

    function getItem() {
        axios.get(`http://localhost:8000/items/${id}`)
            .then((response) => {
                setItem(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getItem();
    }, [id]);

    if (!item) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="container">

            <div className="details">

                <h1>Item Details</h1>

                <p>
                    <strong>ID:</strong> {item.id}
                </p>

                <p>
                    <strong>Name:</strong> {item.name}
                </p>

                <p>
                    <strong>Type:</strong> {item.type_name}
                </p>

                <p>
                    <strong>Purchase Date:</strong> {item.purchase_date}
                </p>

                <p>
                    <strong>Current Stock:</strong> {item.stock_available}
                </p>

                <p>
                    <strong>Availability:</strong>{" "}
                    {item.stock_available === 0
                        ? "Out of Stock"
                        : item.stock_available <= 5
                        ? "Low Stock"
                        : "In Stock"}
                </p>

                <p>
                    <strong>Purchase Date:</strong>{" "}
{item.purchase_date.split("T")[0]}
                </p>

            </div>

        </div>
    );
};

export default ItemDetails;