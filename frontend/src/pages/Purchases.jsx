import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../styles/Purchases.css";

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);

    const navigate = useNavigate();

    function getPurchases() {
        axios.get("http://localhost:8000/purchases")
            .then((response) => {
                setPurchases(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getPurchases();
    }, []);

    return (
        <div className="container">

            <h1>Purchases</h1>

            <button
                onClick={() => navigate("/purchases/add")}
            >
                Create Purchase
            </button>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Order ID</th>
                        <th>Purchase Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {purchases.map((purchase) => {
                        return (
                            <tr key={purchase.id}>

                                <td>{purchase.id}</td>

                                <td>{purchase.order_id}</td>
<td>
    {purchase.purchase_date.split("T")[0]}
</td>

                                <td>
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/purchases/${purchase.id}`
                                            )
                                        }
                                    >
                                        View
                                    </button>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/purchases/${purchase.id}/edit`
                                            )
                                        }
                                    >
                                        Update
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

export default Purchases;