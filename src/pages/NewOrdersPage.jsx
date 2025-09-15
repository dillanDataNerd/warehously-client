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
import { useEffect, useState, useContext } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
import { AuthContext } from "../context/auth.context";

function NewOrdersPage() {
  const [customerName, setCustomerName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  const [status, setStatus] = useState("draft");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");
    const body = {
      customerName,
      deliveryDate,
      status,
    };
    console.log(body)

    try {
      const res = await axios.post(`${VITE_SERVER_URL}/api/orders/new`, body, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log(res);
      navigate(`/orders/edit/${res.data.response._id}`)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box sx={{ p: 2, pt: 0, maxWidth: 640 }}>
      <Toolbar />
      <Typography variant="h4" sx={{ mb: 2 }}>
        New Order
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              id="customer-name"
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
              size="small"
              required
            />

            <DatePicker
              label="Delivery Date"
              value={deliveryDate}
              onChange={(newValue) => setDeliveryDate(newValue)}
              format="dd/MM/yyyy"
              disablePast
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  required: true,
                },
              }}
            />

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

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1}
              sx={{ mt: 1 }}
            >
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
