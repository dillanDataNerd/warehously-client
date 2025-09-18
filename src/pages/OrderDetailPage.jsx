import {
  Typography,
  Box,
  Stack,
  Button,
  IconButton,
  Toolbar,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import OrderLine from "../components/OrderLine";
import NewOrderLine from "../components/NewOrderLine";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function OrderDetailPage() {
  const [customerName, setCustomerName] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  );
  const [status, setStatus] = useState("draft");
  const [orderLines, setOrderLines] = useState([]);
  const [draftLine, setDraftLine] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const navigate = useNavigate();
  const { orderId } = useParams();

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : "—";

  const handleDelete = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.delete(`${VITE_SERVER_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      navigate(`/orders`);
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const orderRes = await axios.get(
        `${VITE_SERVER_URL}/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setCustomerName(orderRes.data.customerName || "");
      setDeliveryDate(
        orderRes.data.deliveryDate ? new Date(orderRes.data.deliveryDate) : null
      );
      setStatus(orderRes.data.status || "draft");

      const linesRes = await axios.get(
        `${VITE_SERVER_URL}/api/orderLines/order/${orderId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setOrderLines(linesRes.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // Load on mount, when orderId changes, and refresh after closing draft line
  useEffect(() => {
    getData();
    if (firstLoad){
      setFirstLoad(false)
      setDraftLine(orderLines.length === 0)
    }
  }, [orderId,draftLine]);

  return (
    <Box sx={{ p: 2, pt: 0, pb: 2, maxWidth: 640 }}>
      <Toolbar />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Order: {orderId}
      </Typography>

      <Box
        component="dl"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "140px 1fr", sm: "180px 1fr" },
          columnGap: 2,
          rowGap: 1,
          "& dt, & dd": { m: 0 },
          "& dt": { color: "text.secondary" },
          textAlign: "left",
        }}
      >
        <Box component="dt">Customer</Box>
        <Box component="dd">{customerName || "—"}</Box>

        <Box component="dt">Delivery date</Box>
        <Box component="dd">{fmtDate(deliveryDate)}</Box>

        <Box component="dt">Status</Box>
        <Box component="dd">{status || "—"}</Box>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button
          type="button"
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/orders/edit/${orderId}`)}
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="outlined"
          startIcon={<DeleteIcon />}
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" textAlign={"left"}>
        Order Lines
      </Typography>

      <Stack spacing={1} sx={{ mt: 2 }}>
        {orderLines.map((line) => (
          <OrderLine
            key={line._id}
            resId={line._id}
            resInventoryId={line.inventory?._id || line.inventory}
            resSku={line.inventory?.sku}
            resTitle={line.inventory?.title}
            resPriceEach={line.priceEach}
            resQuantity={line.quantity}
            setOrderLines={setOrderLines}
          />
        ))}

        {draftLine && (
          <NewOrderLine
            orderLines={orderLines}
            setOrderLines={setOrderLines}
            setDraftLine={setDraftLine}
          />
        )}
      </Stack>

      <IconButton
        aria-label="addOrderLine"
        disabled={draftLine}
        onClick={() => setDraftLine(true)}
        type="button"
        sx={{ mt: 1 }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
}

export default OrderDetailPage;
