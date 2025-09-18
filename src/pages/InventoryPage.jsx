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
  InputLabel,
  Select,
} from "@mui/material";
import PageHeader from "../components/PageHeader";
import InventoryTable from "../components/InventoryTable";
import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { NavLink } from "react-router-dom";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function InventoryPage() {
  const { isLoggedIn } = useContext(AuthContext);
  const [allInventory, setAllInventory] = useState([]);
  const [filteredInventory,setFilteredInventory]=useState([])
  const [searchString, setSearchString] = useState("");

  const getInventory = async () => {
    const storedToken = localStorage.getItem("authToken");
    try {
      const res = await axios.get(`${VITE_SERVER_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setAllInventory(res.data);
      setFilteredInventory(res.data)
    } catch (err) {
      console.log(err);
    }
  };

  const filterInventory = () => {
    const query = searchString.trim().toLowerCase()

    let reducedInventory = allInventory.filter((row) =>{
      const titleCheck= row.title.toLowerCase().includes(query) 
      const skuCheck= row.sku.toLowerCase().includes(query)
    return titleCheck || skuCheck}
    );
    setFilteredInventory(reducedInventory);
  };

    useEffect(() => {
    getInventory()
    }, []);

  useEffect(() => {
    if (searchString.length==0){
      setFilteredInventory(allInventory)
    }
    if (searchString) {
      filterInventory();
    }

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
          label="Search SKU and Title)"
          fullWidth
        />

        <Button variant="contained" component={NavLink} to="/inventory/new">
          New
        </Button>
      </Stack>

      <InventoryTable rows={filteredInventory} />
    </Box>
  );
}

export default InventoryPage;
