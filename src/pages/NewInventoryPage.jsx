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

function NewInventoryPage() {
  const navigate = useNavigate();
  const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [sku, setSKU] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [cost, setCost] = useState(null);
  const [recommendedPrice, setRecommendedPrice] = useState(null);
  const [location, setLocation] = useState(null);
  const [stockedQty, setStockedQuantity] = useState(null);
  const [availableQty, setAvailableQty] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [isUploading, setIsUploading] = useState(false); // for a loading animation effect

  // below function should be the only function invoked when the file type input changes => onChange={handleFileUpload}
  const handleFileUpload = async (event) => {
    console.log("The file to be uploaded is: ", e.target.files[0]);

    if (!event.target.files[0]) {
      // to prevent accidentally clicking the choose file button and not selecting a file
      return;
    }

    setIsUploading(true); // to start the loading animation

    const uploadData = new FormData(); // images and other files need to be sent to the backend in a FormData
    uploadData.append("image", event.target.files[0]);
        console.log("The file to be uploaded is: ", e.target.files[0]);
                   
    //     this name needs to match the name used in the middleware in the backend => uploader.single("image")

    try {
      const response = await axios.post(
        `${VITE_SERVER_URL}/api/upload`,
        uploadData
      );
      // !IMPORTANT: Adapt the request structure to the one in your proyect (services, .env, auth, etc...)
console.log(response)
      setImageUrl(response.data.imageUrl);

      //                          |
      //     this is how the backend sends the image to the frontend => res.json({ imageUrl: req.file.path });

      setIsUploading(false); // to stop the loading animation
    } catch (error) {
      navigate("/error");
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

    const res = await axios.post(`${VITE_SERVER_URL}/api/inventory/new`, body, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
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
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            disabled={isUploading}
            startIcon={<CloudUploadIcon />}
          >
            Upload files
            <VisuallyHiddenInput
              type="file"
              onChange={() => handleFileUpload}
            />
          </Button>
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
              onChange={(e) => {
                setStockedQuantity(e.target.value);
              }}
              fullWidth
              size="medium"
              required
            />
            <TextField
              id="availableQuantity"
              label="available Qty"
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
              navigate("/inventory");
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            onClick={() => handleSubmit()}
          >
            Create Order
          </Button>
        </Stack>
      </Box>
    </>
  );
}
export default NewInventoryPage;
