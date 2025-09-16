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
import InventoryTable from "../components/InventoryTable";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { NavLink } from "react-router-dom";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function InventoryPage() {

  const { isLoggedIn } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);

  const getInventory = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const res = await axios.get(`${VITE_SERVER_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setInventory(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  return (
    <Box sx={{ p: 2, pt: 0 }}>
      <Toolbar />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField size="small" label="Search SKU, title)" fullWidth />
        <Button variant="outlined" onClick={getInventory}>
          Refresh
        </Button>
        <Button variant="contained" component={NavLink} to="/inventory/new">
          New
        </Button>
      </Stack>

      <InventoryTable rows={inventory} />
    </Box>
  );
}

export default InventoryPage