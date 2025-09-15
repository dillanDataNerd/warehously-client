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
import EditIcon from "@mui/icons-material/Edit";
import OrderLine from "../components/OrderLine";

function OrderDetailPage() {
  const [customerName, setCustomerName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  const [status, setStatus] = useState("draft");
  const [orderLines, setOrderLines] = useState([]);
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
      const orderResponse = await axios.get(
        `${VITE_SERVER_URL}/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCustomerName(orderResponse.data.customerName);
      setDeliveryDate(new Date(orderResponse.data.deliveryDate));
      setStatus(orderResponse.data.status);

      const orderLineResponse = await axios.get(
        `${VITE_SERVER_URL}/api/orderLines/order/${orderId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(orderLineResponse);
      setOrderLines(orderLineResponse.data);
      console.log(orderLines);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(orderId);
    getData();
  }, []);

  return (
    <Box sx={{ p: 2, pt: 0, pb: 2, maxWidth: 640 }}>
      <Toolbar />
      <Typography variant="h4" sx={{ mb: 2 }}>
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
              size="small"
              required
              disabled
              sx={{ width: "50%" }}
            />

            <DatePicker
              label="Delivery Date"
              value={deliveryDate}
              onChange={(newValue) => setDeliveryDate(newValue)}
              format="dd/MM/yyyy"
              disabled
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  required: true,
                  sx: { width: "50%" },
                },
              }}
            />

            <FormControl
              fullWidth
              size="small"
              required
              disabled
              sx={{ width: "50%" }}
            >
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
              justifyContent="flex-start"
              spacing={1}
              sx={{ mt: 1 }}
            >
              <Button
                type="Edit"
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => {
                  navigate(`/orders/edit/${orderId}`);
                }}
              >
                Edit
              </Button>
            </Stack>
            {orderLines.map((line) => {
              return (
                <OrderLine
                  key={line._id}
                  resId={line._id}
                  resInventoryId={line.inventory._id}
                  resSku={line.inventory.sku}
                  resTitle={line.inventory.title}
                  resPriceEach={line.priceEach}
                  resQuantity={line.quantity}
                />
              );
            })}
          </Stack>
        </Box>
      </LocalizationProvider>
    </Box>
  );
}

export default OrderDetailPage;

// make an order line new button at the bottom of oage
// make button create a new order line component
// on save of new componenet rerender page?
