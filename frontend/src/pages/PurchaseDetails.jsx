import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

import "../styles/PurchaseDetails.css";

const PurchaseDetails = () => {
    const { id } = useParams();

    const [purchase, setPurchase] = useState([]);

    function getPurchase() {
        axios.get(`http://localhost:8000/purchases/${id}`)
            .then((response) => {
                setPurchase(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getPurchase();
    }, [id]);

    if (purchase.length === 0) {
        return <h2>Loading...</h2>;
    }

    return (
        <div className="container">

            <h1>Purchase Details</h1>

            <p>
                <strong>Order ID:</strong>{" "}
                {purchase[0].order_id}
            </p>

            <p>
                <strong>Purchase Date:</strong>{" "}
{purchase[0].purchase_date.split("T")[0]}
            </p>

            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Item Type</th>
                        <th>Quantity</th>
                        <th>Current Stock</th>
                    </tr>
                </thead>

                <tbody>
                    {purchase.map((item, index) => {
                        return (
                            <tr key={index}>

                                <td>{item.name}</td>

                                <td>{item.type_name}</td>

                                <td>{item.quantity}</td>

                                <td>{item.stock_available}</td>

                            </tr>
                        );
                    })}
                </tbody>
            </table>

        </div>
    );
};

export default PurchaseDetails;