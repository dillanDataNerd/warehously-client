import axios from "axios";
import Navbar from "../components/navbar";
import OrderTable from "../components/OrderTable";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Button } from "@mui/material";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function OrdersPage() {
  const { isLoggedIn } = useContext(AuthContext); // grab what you actually expose
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const res = await axios.get(`${VITE_SERVER_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      console.log(res);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getOrders();
  },[]);

  return (
    <>
      <Navbar />
      {/* Pass orders to your table if it expects rows/props */}
      <OrderTable rows={orders} />
    </>
  );
}

export default OrdersPage;