import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Stack,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Toolbar,
} from "@mui/material";
import PageHeader from "../components/PageHeader";
import OrderTable from "../components/OrderTable";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { NavLink } from "react-router-dom";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function OrdersPage() {
  const { isLoggedIn } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const res = await axios.get(`${VITE_SERVER_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <Box sx={{ p: 2, pt: 0 }}>
      <Toolbar />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField size="small" label="Search (ID, customer)" fullWidth />
        <Button variant="outlined" onClick={getOrders}>
          Refresh
        </Button>
        <Button variant="contained" component={NavLink} to="/orders/new">
          New
        </Button>
      </Stack>

      <OrderTable rows={orders} />
    </Box>
  );
}

export default OrdersPage;
