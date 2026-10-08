import React, { useEffect, useState } from "react";
import axios from "axios";

import "../styles/Dashboard.css";

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [purchases, setPurchases] = useState([]);

    function getData() {
        axios.get("http://localhost:8000/items")
            .then((response) => {
                setItems(response.data);
            })
            .catch((err) => {
                console.log(err);
            });

        axios.get("http://localhost:8000/purchases")
            .then((response) => {
                setPurchases(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        getData();
    }, []);

    const totalItems = items.length;
    const activeItems = items.filter((item) => item.active).length;
    const totalPurchases = purchases.length;
    const outOfStock = items.filter(
        (item) => item.stock_available === 0
    ).length;

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <h3>Total Items</h3>
                    <p>{totalItems}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Active Items</h3>
                    <p>{activeItems}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Total Purchases</h3>
                    <p>{totalPurchases}</p>
                </div>

                <div className="dashboard-card">
                    <h3>Out of Stock</h3>
                    <p>{outOfStock}</p>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;