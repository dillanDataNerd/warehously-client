import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Stack,Box } from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
import { useState } from "react";

function NewOrderLine() {
  const [priceEach, setPriceEach] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [inventory, setInventory] = useState("");
  const [inventoryOptions,setInventoryOptions]=useState([])

  const getInventoryOptions = async () => {
    const authToken = localStorage.getItem("authToken");
    let optionsList=[]

    try {
      const response = await axios.get(
  `${VITE_SERVER_URL}/api/inventory`,
  {
    headers: { Authorization: `Bearer ${authToken}` },
  }
)
        response.data.map((item)=>
            optionsList.push({"id":item._id,"label":`${item.sku} - ${item.title}`}))
        setInventoryOptions(optionsList)
        console.log(optionsList)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInventoryOptions()
  });

  useEffect(() => {
    setPriceEach(priceEach);
    setQuantity(quantity);
    setInventory(inventory);
  }, [priceEach, quantity]);

  useEffect(() => {
    setInventory(inventory)},[])

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Box sx={{ flex: "1 1 32%" }}>
        <Autocomplete
          disablePortal
          label="Inventory"
          value={inventory}
          options={inventoryOptions}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Inventory" />}
        />
      </Box>

      <Box sx={{ flex: "0 1 16%" }}>
        <TextField
          size="small"
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value === "" ? "" : Number(e.target.value))
          }
          inputProps={{ min: 0, step: 1, inputMode: "numeric" }}
          fullWidth
        />
      </Box>

      <Box sx={{ flex: "0 1 16%" }}>
        <TextField
          size="small"
          label="Price"
          type="number"
          value={priceEach}
          onChange={(e) => setPriceEach(e.target.value)}
          inputProps={{ min: 0, inputMode: "decimal" }}
          fullWidth
        />
      </Box>
    </Stack>
  );
}
export default NewOrderLine;
