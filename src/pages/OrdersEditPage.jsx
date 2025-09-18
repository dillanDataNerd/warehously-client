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
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

function OrdersEditPage() {
  const [customerName, setCustomerName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  const [status, setStatus] = useState("draft");
  const navigate = useNavigate();
  const { orderId } = useParams();

  const handleSave = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    const body = {
      customerName,
      deliveryDate,
      status,
    };

    try {
      const res = await axios.patch(
        `${VITE_SERVER_URL}/api/orders/${orderId}`,
        body,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      navigate(`/orders/${res.data._id}`);
      
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await axios.get(
        `${VITE_SERVER_URL}/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCustomerName(response.data.customerName);
      setDeliveryDate(new Date(response.data.deliveryDate));
      setStatus(response.data.status);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box sx={{ p: 2, pt: 0, maxWidth: 640 }}>
      <Toolbar />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Order: {orderId} {}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box component="form" onSubmit={handleSave}>
          <Stack spacing={2}>
            <TextField
              id="customer-name"
              label="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
              size="medium"
              required
            />

            <DatePicker
              label="Delivery Date"
              value={deliveryDate}
              onChange={(newValue) => setDeliveryDate(newValue)}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "medium",
                  required: true,
                },
              }}
            />

            <FormControl fullWidth size="medium" required>
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
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => navigate(`/orders/${orderId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                onSubmit={handleSave}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default OrdersEditPage;
