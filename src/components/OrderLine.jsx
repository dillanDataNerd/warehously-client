import { Stack, Box, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import Toast from "./Toast";

import { useState, useEffect } from "react";
import axios from "axios";
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function OrderLine({
  resId,
  resSku,
  resTitle,
  resPriceEach,
  resQuantity,
  resInventoryId,
  setOrderLines,
}) {
  const [viewOnly, setViewOnly] = useState(true);  
  const [priceEach, setPriceEach] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [inventory, setInventory] = useState("");
  const [error, setError] = useState(null);


  useEffect(() => {
    setInventory(`${resSku} — ${resTitle}`);
    setPriceEach(resPriceEach);
    setQuantity(resQuantity);
  }, [resPriceEach, resQuantity]);

  const handleDelete = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const res = await axios.delete(
        `${VITE_SERVER_URL}/api/orderLines/${resId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      // remove the deleted orderLine from the list of all orderlines and set this for the orderlines state.  
      setOrderLines((prev) => prev.filter((line) => line._id !== resId));
    } catch (err) {
      console.log(err);
      setError("Failed to delete item. Reach out to support to help resolve this issue")
    }
  };

  const handleCancel = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const res = await axios.get(
        `${VITE_SERVER_URL}/api/orderLines/${resId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setInventory(`${res.data.inventory.sku} — ${res.data.inventory.title}`);
      setPriceEach(res.data.priceEach);
      setQuantity(res.data.quantity);
      setViewOnly(true);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    const authToken = localStorage.getItem("authToken");
    const body = { priceEach, quantity, inventory: resInventoryId };
    try {
      const res = await axios.patch(
        `${VITE_SERVER_URL}/api/orderLines/${resId}`,
        body,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(res);
      setViewOnly(true);
    } catch (err) {
      console.log(err);
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
      <Box sx={{ flex: "1 1 32%" }}>
        <TextField
          label="Inventory"
          value={inventory}
          multiline
          minRows={2}
          InputProps={{ readOnly: true }}
          fullWidth
          
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
          InputProps={{ readOnly: viewOnly }}
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
          InputProps={{ readOnly: viewOnly }}
          inputProps={{ min: 0, inputMode: "decimal" }}
          fullWidth
        />
      </Box>
      <Stack direction={"row"}>
        {viewOnly ? (
          <>
            <Stack direction={"row"} />
            <IconButton
              aria-label="edit"
              onClick={() => setViewOnly(false)}
              type="button"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              aria-label="delete"
              onClick={handleDelete}
              type="button"
            >
              <DeleteIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Stack direction={"row"} />

            <IconButton
              aria-label="cancel"
              onClick={handleCancel}
              type="button"
            >
              <CloseIcon />
            </IconButton>
            <IconButton aria-label="save" onClick={handleSave} type="button">
              <SendIcon />
            </IconButton>
          </>
        )}
      </Stack>
    </Stack>
    {error &&<Toast message={error} variant={false}/>}
    </>
  );
}

export default OrderLine;
