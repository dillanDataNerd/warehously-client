// ===== Imports =====
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

// ===== Component =====
function InventoryEditPage() {
  // Router hooks
  const navigate = useNavigate();
  const { inventoryId } = useParams(); // Get inventoryId from URL params
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL; // Server URL from env

  // ===== State for form fields =====
  const [sku, setSKU] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [recommendedPrice, setRecommendedPrice] = useState("");
  const [location, setLocation] = useState("");
  const [stockedQty, setStockedQty] = useState("");
  const [availableQty, setAvailableQty] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ===== State for UI feedback =====
  const [openToast, setOpenToast] = useState(false); // Success toast for upload
  const [isUploading, setIsUploading] = useState(false); // Disable upload while uploading
  const [error, setError] = useState(null); // Error messages
  const [submitted, setSubmitted] = useState(true); // Track if form submitted

  // ===== Load existing inventory data on mount =====
  useEffect(() => {
    const getData = async () => {
      const authToken = localStorage.getItem("authToken");
      try {
        const res = await axios.get(
          `${VITE_SERVER_URL}/api/inventory/${inventoryId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        const d = res.data || {};
        // Initialize form fields with fetched values
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

  // ===== Hidden file input for image upload =====
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

  // ===== Handle file upload =====
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
      setImageUrl(response.data.imageUrl); // Save image URL in state
      setIsUploading(false);
      setOpenToast(true); // Show success toast
    } catch {
      setIsUploading(false);
      setError("Failed to upload image. Check it is an image and < 10 MB.");
    }
  };

  // ===== Validation helpers =====
  const num = (v) => (v === "" ? NaN : Number(v)); // Convert string to number or NaN
  const titleError = submitted && !title.trim() ? "Title is required" : "";
  const skuError = submitted && !sku.trim() ? "SKU is required" : "";
  const descriptionError =
    submitted && !description.trim() ? "Description is required" : "";
  const costError =
    submitted &&
    (cost === ""
      ? "Cost is required"
      : num(cost) < 0
        ? "Cost must be ≥ 0"
        : "");
  const priceError =
    submitted &&
    (recommendedPrice === ""
      ? "Price is required"
      : num(recommendedPrice) < 0
        ? "Price must be ≥ 0"
        : "");
  const stockedError =
    submitted &&
    (stockedQty === ""
      ? "Stocked qty is required"
      : num(stockedQty) < 0
        ? "Must be ≥ 0"
        : "");
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

  // Whether form has any validation errors
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

  // ===== Submit handler =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Trigger validation messages
    if (hasErrors) return; // Block submit if errors

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
      navigate(`/inventory/${inventoryId}`); // Redirect on success
    } catch {
      setError("Update failed. Check your inputs or try again.");
    }
  };

  // ===== Render =====
  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 2, pt: 0, maxWidth: 640 }}
      >
        {/* Page title */}
        <Toolbar />
        <Typography variant="h4" sx={{ mb: 2 }}>
          Edit Inventory
        </Typography>

        {/* Form fields */}
        <Stack spacing={2}>
          {/* Title */}
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

          {/* SKU */}
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

          {/* Description */}
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

          {/* Cost & Price */}
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
              error={Boolean(costError)}
              helperText={costError}
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
              error={Boolean(priceError)}
              helperText={priceError}
            />
          </Stack>

          {/* Stocked & Available qty */}
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
              error={Boolean(stockedError)}
              helperText={stockedError}
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
              error={Boolean(availableError)}
              helperText={availableError}
            />
          </Stack>

          {/* Location */}
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

          {/* Upload image button */}
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

        {/* Action buttons */}
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

        {/* Success toast for image upload */}
        {openToast && (
          <Toast message={"Image successfully uploaded"} success={true} />
        )}
      </Box>

      {/* Error toast for failures */}
      {error && <Toast message={error} success={false} />}
    </>
  );
}

export default InventoryEditPage;
