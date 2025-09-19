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
import OrderTable from "../components/OrderTable";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { NavLink } from "react-router-dom";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function OrdersPage() {
  const { isLoggedIn } = useContext(AuthContext);
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders,setFilteredOrders]=useState([])
  const [searchString,setSearchString]=useState("")

  const getOrders = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const res = await axios.get(`${VITE_SERVER_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setAllOrders(res.data);
      setFilteredOrders(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  // clean the the search field input and use it to filter the customerName and id properties of an order.
  // this is then passed to the order table componenet to be rendered
  const filterOrders= () => {
    const query = searchString.trim().toLowerCase()

    let reducedOrders = allOrders.filter((row) =>{
      const idCheck= row._id.includes(query) 
      const customerCheck= String(row?.customerName || "").trim().toLowerCase().includes(query);
    return idCheck || customerCheck}
    );
    setFilteredOrders(reducedOrders);
  };

  useEffect(() => {
    getOrders();
  }, []);

    useEffect(() => {
    filterOrders();
  }, [searchString]);

  return (
    <Box sx={{ p: 2, pt: 0 }}>
      <Toolbar />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField
          value={searchString}
          onChange={(e) => {
            setSearchString(e.target.value)
          }}
          size="small"
          label="Search ID and customer)"
          fullWidth
        />     
        <Button variant="contained" component={NavLink} to="/orders/new">
          New
        </Button>
      </Stack>

      <OrderTable rows={filteredOrders} />
    </Box>
  );
}

export default OrdersPage;
