import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OrdersPage from "./pages/OrdersPage"
import InventoryPage from "./pages/InventoryPage";
import PickingRunPage from "./pages/PickingRunPage";
import ErrorPage from "./pages/ErrorPage";
import IsPrivate from "./components/IsPrivate";

function App() {
  return (
    <>
      <Routes>
        <Route path={"/home"} element={<LoginPage />}></Route>
        <Route path={"/signup"} element={<SignUpPage />}></Route>
        <Route path={"/orders"} element={<IsPrivate><OrdersPage /></IsPrivate>}></Route>
        <Route path={"/inventory"} element={<IsPrivate><InventoryPage /></IsPrivate>}></Route>
        <Route path={"/picking-run"} element={<IsPrivate><PickingRunPage /></IsPrivate>}></Route>
        <Route path={"/*"} element={<ErrorPage />}></Route>

      </Routes>
    </>
  );
}

export default App;
