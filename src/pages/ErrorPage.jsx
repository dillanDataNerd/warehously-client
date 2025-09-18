import { Box, Container, Paper, Stack, Typography, Button } from "@mui/material";
import { NavLink } from "react-router-dom";

function ErrorPage() {
  return (
    <Box
    >
      <Container maxWidth="sm">
        <Paper  sx={{ p: 5, borderRadius: 4, textAlign: "center" }}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h3" fontWeight={700}>
              404
            </Typography>
            <Typography variant="h6">
              This page doesn’t exist.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              An error occurred or the page was moved/removed. Please check the URL or head back home.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 1, justifyContent: "center" }}
            >
              <Button variant="contained" component={NavLink} to="/">
                Go home
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default ErrorPage;
