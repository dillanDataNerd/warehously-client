import { Box, Typography, Stack } from "@mui/material";
function PageHeader({ title, actions }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">{title}</Typography>
        <Stack direction="row" spacing={1}>{actions}</Stack>
      </Stack>
    </Box>
  );
}

export default PageHeader