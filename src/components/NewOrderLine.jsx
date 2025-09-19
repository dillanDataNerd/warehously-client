import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Stack, Box, IconButton } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import Toast from "./Toast";
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function NewOrderLine({ orderLines, setOrderLines, setDraftLine }) {
  const [priceEach, setPriceEach] = useState("");
  const [quantity, setQuantity] = useState("");
  const [inventory, setInventory] = useState("");
  const [inventoryOptions, setInventoryOptions] = useState([]);
  const { orderId } = useParams();
  const [error, setError] = useState(null)

  // get all inventory items and format them to be SKU-Title. This will be used in the select box
  const getInventoryOptions = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const { data } = await axios.get(`${VITE_SERVER_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setInventoryOptions(
        data.map((item) => ({
          id: item._id,
          label: `${item.sku} - ${item.title}`,
        }))
      );
    } catch (error) {
    }
  };

  useEffect(() => {
    getInventoryOptions();
  }, []);

  const handleCancel = () => setDraftLine(false);


  const handleSave = async () => {
    const authToken = localStorage.getItem("authToken");
    const body = {
      priceEach: Number(priceEach),
      quantity: Number(quantity),
      inventory: inventory.id,
      order: orderId,
    };
    try {
      const res = await axios.post(
        `${VITE_SERVER_URL}/api/orderLines/new`,
        body,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(res);
      setDraftLine(false);
      setOrderLines([orderLines.push(body)]);
      
    } catch (err) {
      console.log(err);
      setError("Failed to create orderline. Check that you have enough inventory for this order.")
    }
  };

  return (
    <>
    <Stack
    direction={{ xs: "column", md: "row" }}
    spacing={2}
    alignItems="center"
    sx={{ mb: 2 }}
    >
      {/* Order line inputs from the user */}
      <Box sx={{ flex: "1 1 32%" }}>
        <Autocomplete
          value={inventory}
          onChange={(event, newValue) => setInventory(newValue)}
          options={inventoryOptions}
          getOptionLabel={(o) => o?.label ?? ""}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          renderInput={(params) => (
            <TextField {...params} label="Inventory" size="small" />
          )}
          fullWidth
          slotProps={{
            paper: {
              sx: {
                "& .MuiAutocomplete-option": {
                  textAlign: "left",
                  justifyContent: "flex-start",
                },
              },
            },
          }}
          />
      </Box>

      <Box sx={{ flex: "0 1 16%" }}>
        <TextField
          size="small"
          label="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          inputProps={{ min: 0, step: 1, inputMode: "numeric" }}
          fullWidth
          />
      </Box>

      <Box sx={{ flex: "0 1 16%" }}>
        <TextField
          size="small"
          label="price"
          type="number"
          value={priceEach}
          onChange={(e) => setPriceEach(Number(e.target.value))}
          inputProps={{ min: 0, inputMode: "decimal" }}
          fullWidth
          />
      </Box>
{/* action buttons to save or discard the draft order line */}
      <IconButton aria-label="cancel" onClick={handleCancel} type="button">
        <CloseIcon />
      </IconButton>
      <IconButton aria-label="save" onClick={handleSave} type="button">
        <SendIcon />
      </IconButton>
    </Stack>
    {error &&<Toast message={error} variant={false}/>}
    </>
  );
}

export default NewOrderLine;
