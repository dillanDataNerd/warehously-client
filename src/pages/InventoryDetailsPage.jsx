import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Stack, Button } from "@mui/material";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

function InventoryDetailsPage() {
  const { inventoryId } = useParams();
  const [inv, setInv] = useState(null);
  const [imgError, setImgError] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const res = await axios.get(`${VITE_SERVER_URL}/api/inventory/${inventoryId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setInv(res.data);
        setImgError(false); // reset for each item
      } catch (e) {
        console.error(e);
        setError("Failed to load inventory.");
      }
    };
    getData();
  }, [inventoryId]);

  const handleDelete = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      await axios.delete(`${VITE_SERVER_URL}/api/inventory/${inventoryId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      navigate(`/inventory`);
    } catch (err) {
      console.log(err);
    }
  };

  const fmtMoney = (n) =>
    typeof n === "number" ? n.toLocaleString(undefined, { style: "currency", currency: "EUR" }) : "—";
  const fmtNumber = (n) => (typeof n === "number" ? n.toLocaleString() : "—");
  const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "—");
  const val = (v) => v ?? "—";

  if (error) return <Box sx={{ p: 2, textAlign: "left" }}>{error}</Box>;
  if (!inv) return <Box sx={{ p: 2, textAlign: "left" }}>Loading…</Box>;

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", p: 2, textAlign: "left" }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Inventory Details
      </Typography>

      {/* Image with error + empty URL handling */}
      {inv.imageUrl && !imgError ? (
        <Box
          component="img"
          src={inv.imageUrl}
          alt={inv.title || "Inventory image"}
          onError={() => setImgError(true)}
          sx={{ width: "100%", height: "auto", borderRadius: 2, mb: 2 }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            height: 220,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "action.hover",
            borderRadius: 2,
            mb: 2,
            gap: 1,
          }}
        >
          <ImageNotSupportedIcon />
          <Typography variant="body2">No image available</Typography>
        </Box>
      )}

      <Box
        component="dl"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "140px 1fr", sm: "180px 1fr" },
          columnGap: 2,
          rowGap: 1,
          "& dt, & dd": { m: 0 },
          "& dt": { color: "text.secondary" },
        }}
      >
        <Box component="dt">SKU</Box>                <Box component="dd">{val(inv.sku)}</Box>
        <Box component="dt">Title</Box>              <Box component="dd">{val(inv.title)}</Box>
        <Box component="dt">Description</Box>        <Box component="dd">{val(inv.description)}</Box>
        <Box component="dt">Cost</Box>               <Box component="dd">{fmtMoney(inv.cost)}</Box>
        <Box component="dt">Recommended Price</Box>  <Box component="dd">{fmtMoney(inv.recommendedPrice)}</Box>
        <Box component="dt">Location</Box>           <Box component="dd">{val(inv.location)}</Box>
        <Box component="dt">Stocked Qty</Box>        <Box component="dd">{fmtNumber(inv.stockedQty)}</Box>
        <Box component="dt">Available Qty</Box>      <Box component="dd">{fmtNumber(inv.availableQty)}</Box>
        <Box component="dt">Created</Box>            <Box component="dd">{fmtDate(inv.createdAt)}</Box>
      </Box>

      <Stack direction="row" justifyContent="flex-start" spacing={1} sx={{ mt: 1 }}>
        <Button
          type="button"
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/inventory/edit/${inventoryId}`)}
        >
          Edit
        </Button>
        <Button
          type="button"
          variant="contained"
          startIcon={<DeleteIcon />}
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>
    </Box>
  );
}

export default InventoryDetailsPage;
