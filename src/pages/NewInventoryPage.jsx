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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Toast from "../components/Toast";

function NewInventoryPage() {
  const navigate = useNavigate();
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // Keep inputs as strings to avoid null warnings in TextField
  const [sku, setSKU] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");                 // was null
  const [recommendedPrice, setRecommendedPrice] = useState(""); // was null
  const [location, setLocation] = useState("");
  const [stockedQty, setStockedQuantity] = useState(""); // was null
  const [availableQty, setAvailableQty] = useState("");  // was null
  const [imageUrl, setImageUrl] = useState("");

  const [openToast, setOpenToast] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const handleFileUpload = async (event) => {
    if (!event.target.files[0]) return;
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
      setError(
        "Failed to upload item. Ensure it is an image and below 10mb."
      );
    }
  };

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

  // -------- Validation helpers --------
  const num = (v) => (v === "" ? NaN : Number(v));
  const titleError =
    submitted && !title.trim() ? "Title is required" : "";
  const skuError =
    submitted && !sku.trim() ? "SKU is required" : "";
  const descriptionError =
    submitted && !description.trim() ? "Description is required" : "";
  const costError =
    submitted && (cost === "" ? "Cost is required" : num(cost) < 0 ? "Cost must be ≥ 0" : "");
  const priceError =
    submitted && (recommendedPrice === "" ? "Price is required" : num(recommendedPrice) < 0 ? "Price must be ≥ 0" : "");
  const stockedError =
    submitted && (stockedQty === "" ? "Stocked qty is required" : num(stockedQty) < 0 ? "Must be ≥ 0" : "");
  const availableError =
    submitted &&
    (availableQty === ""
      ? "Available qty is required"
      : num(availableQty) < 0
      ? "Must be ≥ 0"
      : !isNaN(num(stockedQty)) && num(availableQty) > num(stockedQty)
      ? "Available cannot exceed stocked"
      : "");
  const locationError =
    submitted && !location.trim() ? "Location is required" : "";

  const hasErrors = [
    titleError,
    skuError,
    descriptionError,
    costError,
    priceError,
    stockedError,
    availableError,
    locationError,
  ].some(Boolean);

  // -------- Submit --------
  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setSubmitted(true);
    if (hasErrors) return;

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
      await axios.post(`${VITE_SERVER_URL}/api/inventory/new`, body, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      navigate("/inventory");
    } catch (err) {
      setError(err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, pt: 0, maxWidth: 640 }}>
      <Toolbar />
      <Typography variant="h4" sx={{ mb: 2 }}>
        New Inventory
      </Typography>

      <Stack spacing={2}>
        <TextField
          id="title"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          size="medium"
          error={Boolean(titleError)}
          helperText={titleError}
        />

        <TextField
          id="sku"
          label="SKU"
          value={sku}
          onChange={(e) => setSKU(e.target.value)}
          fullWidth
          size="medium"
          error={Boolean(skuError)}
          helperText={skuError}
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
          error={Boolean(descriptionError)}
          helperText={descriptionError}
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            id="cost"
            type="number"
            label="Cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            fullWidth
            size="medium"
            error={Boolean(costError)}
            helperText={costError}
            inputProps={{ min: 0, step: "any" }}
          />
          <TextField
            id="recommendedPrice"
            label="Price"
            type="number"
            value={recommendedPrice}
            onChange={(e) => setRecommendedPrice(e.target.value)}
            fullWidth
            size="medium"
            error={Boolean(priceError)}
            helperText={priceError}
            inputProps={{ min: 0, step: "any" }}
          />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            id="stockedQuantity"
            type="number"
            label="Stocked Qty"
            value={stockedQty}
            onChange={(e) => setStockedQuantity(e.target.value)}
            fullWidth
            size="medium"
            error={Boolean(stockedError)}
            helperText={stockedError}
            inputProps={{ min: 0, step: 1 }}
          />
          <TextField
            id="availableQuantity"
            label="Available Qty"
            type="number"
            value={availableQty}
            onChange={(e) => setAvailableQty(e.target.value)}
            fullWidth
            size="medium"
            error={Boolean(availableError)}
            helperText={availableError}
            inputProps={{ min: 0, step: 1 }}
          />
        </Stack>

        <TextField
          id="location"
          label="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
          size="medium"
          error={Boolean(locationError)}
          helperText={locationError}
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

      <Stack direction="row" justifyContent="flex-end" spacing={1} sx={{ mt: 2 }}>
        <Button
          type="button"
          variant="outlined"
          onClick={() => navigate("/inventory")}
        >
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Create Inventory
        </Button>
      </Stack>

      {openToast && (
        <Toast message={"Image successfully uploaded"} success={true} />
      )}

      {error && (
        <Toast
          message={"Inventory not created. SKU already exists in database"}
          success={false}
        />
      )}
    </Box>
  );
}

export default NewInventoryPage;
