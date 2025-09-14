import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OrdersPage from "./pages/OrdersPage";
import InventoryPage from "./pages/InventoryPage";
import PickingRunPage from "./pages/PickingRunPage";
import ErrorPage from "./pages/ErrorPage";
import IsPrivate from "./components/IsPrivate";
import AppLayout from "./components/AppLayout"; 
import NewOrdersPage from "./pages/NewOrdersPage";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/home" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected routes*/}
      <Route element={<IsPrivate><AppLayout /></IsPrivate>}>
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/picking-run" element={<PickingRunPage />} />
        <Route path="/orders/new" element={<NewOrdersPage />} />
      </Route>

      <Route path="/*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;