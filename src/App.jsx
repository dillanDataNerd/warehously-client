import { Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OrdersPage from "./pages/OrdersPage"
import IsPrivate from "./components/IsPrivate";

function App() {
  return (
    <>
      <Routes>
        <Route path={"/home"} element={<LoginPage />}></Route>
        <Route path={"/signup"} element={<SignUpPage />}></Route>
        <Route path={"/orders"} element={<IsPrivate><OrdersPage /></IsPrivate>}></Route>
      </Routes>
    </>
  );
}

export default App;
