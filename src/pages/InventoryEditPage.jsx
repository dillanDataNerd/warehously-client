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
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [sku, setSKU] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [recommendedPrice, setRecommendedPrice] = useState("");
  const [location, setLocation] = useState("");
  const [stockedQty, setStockedQty] = useState(0);
  const [availableQty, setAvailableQty] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [openToast, setOpenToast] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const inventoryId = useParams().inventoryId;

  const getData = async () => {
    console.log(inventoryId);
    const authToken = localStorage.getItem("authToken");
    try {
      const res = await axios.get(
        `${VITE_SERVER_URL}/api/inventory/${inventoryId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setSKU(res.data.sku);
      setTitle(res.data.title);
      setDescription(res.data.description);
      setCost(res.data.cost);
      setRecommendedPrice(res.data.recommendedPrice);
      setLocation(res.data.location);
      setStockedQty(res.data.stockedQty);
      setAvailableQty(res.data.availableQty);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleFileUpload = async (event) => {
    console.log("The file to be uploaded is: ", event.target.files[0]);

    if (!event.target.files[0]) {
      return;
    }

    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append("image", event.target.files[0]);
    console.log("The file to be uploaded is: ", event.target.files[0]);

    try {
      const response = await axios.post(
        `${VITE_SERVER_URL}/api/upload`,
        uploadData
      );
      setImageUrl(response.data.imageUrl);
      setIsUploading(false);
      setOpenToast(true);
    } catch (error) {
      console.log("There was an error uploading the file");
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

  const handleSubmit = async () => {
    const authToken = localStorage.getItem("authToken");
    const body = {
      sku,
      title,
      description,
      cost,
      recommendedPrice,
      location,
      stockedQty,
      availableQty,
      imageUrl,
    };
    try {
      const res = await axios.patch(
        `${VITE_SERVER_URL}/api/inventory/${inventoryId}`,
        body,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log(res);
      navigate(`/inventory/${inventoryId}`)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box sx={{ p: 2, pt: 0, maxWidth: 640 }}>
        <Toolbar />
        <Typography variant="h4" sx={{ mb: 2 }}>
          New Inventory
        </Typography>
        <Stack spacing={2}>
          <TextField
            id="title"
            label="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            fullWidth
            size="medium"
            required
          />
          <TextField
            id="sku"
            label="SKU"
            value={sku}
            onChange={(e) => {
              setSKU(e.target.value);
            }}
            fullWidth
            size="medium"
            required
          />
          <TextField
            id="description"
            label="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            fullWidth
            size="medium"
            multiline
            rows={3}
            required
          />
          <Stack direction={"row"} spacing={2}>
            <TextField
              id="cost"
              label="Cost"
              type="number"
              value={cost}
              onChange={(e) => {
                setCost(e.target.value);
              }}
              fullWidth
              size="medium"
              required
            />
            <TextField
              id="recommendedPrice"
              label="Price"
              value={recommendedPrice}
              type="number"
              onChange={(e) => {
                setRecommendedPrice(e.target.value);
              }}
              fullWidth
              size="medium"
              required
            />
          </Stack>
          <Stack direction={"row"} spacing={2}>
            <TextField
              id="stockedQuantity"
              label="Stocked Qty"
              value={stockedQty}
              type="number"
              onChange={(e) => {
                setStockedQty(e.target.value);
              }}
              fullWidth
              size="medium"
              required
            />
            <TextField
              id="availableQuantity"
              label="available Qty"
              type="number"
              value={availableQty}
              onChange={(e) => {
                setAvailableQty(e.target.value);
              }}
              fullWidth
              size="medium"
              required
            />
          </Stack>
          <TextField
            id="location"
            label="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            fullWidth
            size="medium"
            required
          />
        </Stack>
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
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          sx={{ mt: 1 }}
        >
          <Button
            type="cancel"
            variant="outlined"
            onClick={() => {
              navigate(`/inventory/${inventoryId}`);
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => handleSubmit()}
          >
            Update Inventory
          </Button>
        </Stack>
        {openToast && (
          <Toast message={"Image successfully uploaded"} success={true} />
        )}
      </Box>
    </>
  );
}

export default InventoryEditPage;
