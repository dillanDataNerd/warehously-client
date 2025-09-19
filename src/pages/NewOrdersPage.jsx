// UI components from MUI
import {
  Typography,
  Box,
  TextField,
  Toolbar,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  FormControl,
  Button,
} from "@mui/material";
// React hooks
import { useEffect, useState, useContext } from "react";
// MUI Date Picker
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// Router + HTTP
import { useNavigate } from "react-router-dom";
import axios from "axios";
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
// Auth context (for user info if needed later)
import { AuthContext } from "../context/auth.context";
// Icons
import CloseIcon from "@mui/icons-material/Close";

function NewOrdersPage() {
  // Controlled form fields
  const [customerName, setCustomerName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    // Default to 3 days from now
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  const [status, setStatus] = useState("draft");

  // Navigation + auth context
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Create order submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    // Payload for API
    const body = {
      customerName,
      deliveryDate,
      status,
    };

    try {
      // POST to create a new order
      const res = await axios.post(`${VITE_SERVER_URL}/api/orders/new`, body, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log(res);
      // Navigate to newly created order details using returned id
      navigate(`/orders/${res.data.response._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ p: 2, pt: 0 }}>
      {/* Reserve space for app bar and set page title */}
      <Toolbar />
      <Typography variant="h6" sx={{ mb: 2, textAlign: "left" }}>
        New Order
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* Form wrapper to enable Enter-to-submit */}
        <Box component="form" fullWidth onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {/* Customer name input */}
            <TextField
              id="customer-name"
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
              required
            />

            {/* Delivery date picker */}
            <DatePicker
              label="Delivery Date"
              value={deliveryDate}
              onChange={(newValue) => setDeliveryDate(newValue)}
              format="dd/MM/yyyy"
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />

            {/* Order status select */}
            <FormControl fullWidth size="small" required>
              <InputLabel id="order-status-label">Order Status</InputLabel>
              <Select
                labelId="order-status-label"
                id="order-status"
                label="Order Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="ready to pick">Ready to pick</MenuItem>
                <MenuItem value="ready to ship">Ready to ship</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
              </Select>
            </FormControl>

            {/* Actions */}
            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1}
              sx={{ mt: 1 }}
            >
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => navigate(`/orders/${orderId}`)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Create Order
              </Button>
            </Stack>
          </Stack>
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default NewOrdersPage;
