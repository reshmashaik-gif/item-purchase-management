import { Link } from "react-router-dom";

import "../styles/Navbar.css";

const Navbar = () => {
    return (
        <nav>
            <h2>Item Purchase Management</h2>

            <div>
                <Link to="/">Dashboard</Link>
                <Link to="/items">Items</Link>
                <Link to="/item-types">Item Types</Link>
                <Link to="/purchases">Purchases</Link>
            </div>
        </nav>
    );
};

export default Navbar;