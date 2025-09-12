import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OrdersPage from "./pages/OrdersPage";

function App() {
  return (
    <>
      <Routes>
        <Route path={"/home"} element={<LoginPage />}></Route>
        <Route path={"/signup"} element={<SignUpPage />}></Route>
        <IsPrivate><Route path={"/orders"} element={<OrdersPage />}></Route></IsPrivate>
      </Routes>
    </>
  );
}

export default App;
