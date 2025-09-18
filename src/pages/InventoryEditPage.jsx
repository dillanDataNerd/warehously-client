import {
  TextField,
  Box,
  Toolbar,
  Typography,
  Stack,
  Button,
  styled,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Toast from "../components/Toast";

function InventoryEditPage() {
  const navigate = useNavigate();
  const { inventoryId } = useParams();
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // Keep inputs as strings so TextFields remain controlled
  const [sku, setSKU] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");                 // string
  const [recommendedPrice, setRecommendedPrice] = useState(""); // string
  const [location, setLocation] = useState("");
  const [stockedQty, setStockedQty] = useState("");     // string
  const [availableQty, setAvailableQty] = useState(""); // string
  const [imageUrl, setImageUrl] = useState("");

  const [openToast, setOpenToast] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Load existing item
  useEffect(() => {
    const getData = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const res = await axios.get(
          `${VITE_SERVER_URL}/api/inventory/${inventoryId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        const d = res.data || {};
        setSKU(d.sku ?? "");
        setTitle(d.title ?? "");
        setDescription(d.description ?? "");
        setCost(d.cost === undefined ? "" : String(d.cost));
        setRecommendedPrice(
          d.recommendedPrice === undefined ? "" : String(d.recommendedPrice)
        );
        setLocation(d.location ?? "");
        setStockedQty(d.stockedQty === undefined ? "" : String(d.stockedQty));
        setAvailableQty(
          d.availableQty === undefined ? "" : String(d.availableQty)
        );
        setImageUrl(d.imageUrl ?? "");
      } catch (e) {
        setError("Failed to load inventory item.");
      }
    };
    getData();
  }, [inventoryId, VITE_SERVER_URL]);

  // Upload
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleFileUpload = async (event) => {
    if (!event.target.files?.[0]) return;
    setIsUploading(true);
    const uploadData = new FormData();
    uploadData.append("image", event.target.files[0]);

    try {
      const response = await axios.post(
        `${VITE_SERVER_URL}/api/upload`,
        uploadData
      );
      setImageUrl(response.data.imageUrl);
      setIsUploading(false);
      setOpenToast(true);
    } catch {
      setIsUploading(false);
      setError("Failed to upload image. Check it is an image and < 10 MB.");
    }
  };

  // ===== Validation (same pattern as New page) =====
  const num = (v) => (v === "" ? NaN : Number(v));
  const getErrors = () => ({
    title: !title.trim() ? "Title is required" : "",
    sku: !sku.trim() ? "SKU is required" : "",
    description: !description.trim() ? "Description is required" : "",
    cost: cost === "" ? "Cost is required" : num(cost) < 0 ? "Cost must be ≥ 0" : "",
    price:
      recommendedPrice === ""
        ? "Price is required"
        : num(recommendedPrice) < 0
        ? "Price must be ≥ 0"
        : "",
    stocked:
      stockedQty === "" ? "Stocked qty is required" : num(stockedQty) < 0 ? "Must be ≥ 0" : "",
    available:
      availableQty === ""
        ? "Available qty is required"
        : num(availableQty) < 0
        ? "Must be ≥ 0"
        : !isNaN(num(stockedQty)) && num(availableQty) > num(stockedQty)
        ? "Available cannot exceed stocked"
        : "",
    location: !location.trim() ? "Location is required" : "",
  });

  const errors = getErrors();
  const hasErrors = Object.values(errors).some(Boolean);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);        // show messages
    if (hasErrors) return;     // block submit if invalid

    const authToken = localStorage.getItem("authToken");
    const body = {
      sku: sku.trim(),
      title: title.trim(),
      description: description.trim(),
      cost: Number(cost),
      recommendedPrice: Number(recommendedPrice),
      location: location.trim(),
      stockedQty: Number(stockedQty),
      availableQty: Number(availableQty),
      imageUrl,
    };

    try {
      await axios.patch(
        `${VITE_SERVER_URL}/api/inventory/${inventoryId}`,
        body,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      navigate(`/inventory/${inventoryId}`);
    } catch {
      setError("Update failed. Check your inputs or try again.");
    }
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, pt: 0, maxWidth: 640 }}>
        <Toolbar />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Edit Inventory
        </Typography>

        <Stack spacing={2}>
          <TextField
            id="title"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            size="medium"
            error={submitted && Boolean(errors.title)}
            helperText={submitted ? errors.title : ""}
          />

          <TextField
            id="sku"
            label="SKU"
            value={sku}
            onChange={(e) => setSKU(e.target.value)}
            fullWidth
            size="medium"
            error={submitted && Boolean(errors.sku)}
            helperText={submitted ? errors.sku : ""}
          />

          <TextField
            id="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            size="medium"
            multiline
            rows={3}
            error={submitted && Boolean(errors.description)}
            helperText={submitted ? errors.description : ""}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              id="cost"
              label="Cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              fullWidth
              size="medium"
              inputProps={{ min: 0, step: "any" }}
              error={submitted && Boolean(errors.cost)}
              helperText={submitted ? errors.cost : ""}
            />
            <TextField
              id="recommendedPrice"
              label="Price"
              type="number"
              value={recommendedPrice}
              onChange={(e) => setRecommendedPrice(e.target.value)}
              fullWidth
              size="medium"
              inputProps={{ min: 0, step: "any" }}
              error={submitted && Boolean(errors.price)}
              helperText={submitted ? errors.price : ""}
            />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              id="stockedQuantity"
              label="Stocked Qty"
              type="number"
              value={stockedQty}
              onChange={(e) => setStockedQty(e.target.value)}
              fullWidth
              size="medium"
              inputProps={{ min: 0, step: 1 }}
              error={submitted && Boolean(errors.stocked)}
              helperText={submitted ? errors.stocked : ""}
            />
            <TextField
              id="availableQuantity"
              label="Available Qty"
              type="number"
              value={availableQty}
              onChange={(e) => setAvailableQty(e.target.value)}
              fullWidth
              size="medium"
              inputProps={{ min: 0, step: 1 }}
              error={submitted && Boolean(errors.available)}
              helperText={submitted ? errors.available : ""}
            />
          </Stack>

          <TextField
            id="location"
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            fullWidth
            size="medium"
            error={submitted && Boolean(errors.location)}
            helperText={submitted ? errors.location : ""}
          />

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            disabled={isUploading}
            startIcon={<CloudUploadIcon />}
            fullWidth
          >
            Upload photo
            <VisuallyHiddenInput type="file" onChange={handleFileUpload} />
          </Button>
        </Stack>

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          sx={{ mt: 2 }}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={() => navigate(`/inventory/${inventoryId}`)}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Update Inventory
          </Button>
        </Stack>

        {openToast && (
          <Toast message={"Image successfully uploaded"} success={true} />
        )}
      </Box>

      {error && <Toast message={error} success={false} />}
    </>
  );
}

export default InventoryEditPage;
