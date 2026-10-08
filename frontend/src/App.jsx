import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import AddItem from "./pages/AddItem";
import ItemDetails from "./pages/ItemDetails";
import EditItem from "./pages/EditItem";
import Purchases from "./pages/Purchases";
import AddPurchase from "./pages/AddPurchase";
import PurchaseDetails from "./pages/PurchaseDetails";
import EditPurchase from "./pages/EditPurchase";
import ItemTypes from "./pages/ItemTypes";
const App = () => {
    return (
        <>
            
<Navbar/>
  <main>
              <Routes>
                <Route path="/" element={<Dashboard />} />

              <Route path="/purchases" element={<Purchases />} />
              <Route
    path="/purchases/add"
    element={<AddPurchase />}
    />
    <Route
    path="/purchases/:id"
    element={<PurchaseDetails />}
/>
<Route
    path="/purchases/:id/edit"
    element={<EditPurchase />}
/>  
<Route path="/item-types" element={<ItemTypes />} />
                <Route path="/items" element={<Items />} />
                <Route path="/items/add" element={<AddItem />} />
                <Route path="/items/:id" element={<ItemDetails />} />
                <Route path="/items/:id/edit" element={<EditItem />} />
            </Routes>
  </main>
        </>
    );
};

export default App;