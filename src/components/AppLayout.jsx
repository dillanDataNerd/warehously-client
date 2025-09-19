import { Outlet, NavLink } from "react-router-dom";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 180;

// This component wraps the entire webapp. It is the nav bar on the left and title bar on the top of the page
function AppLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Top header bar*/}
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            WAREHOUSLY
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Left nav bar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {/* The toolbar pushes actual content below AppBar height */}
        <Toolbar />
        <Box sx={{ overflow: "auto", p: 2 }}>
          <List>
            <ListItemButton component={NavLink} to="/orders">
              <ListItemIcon>
                <ShoppingBasketIcon />
              </ListItemIcon>
              <ListItemText primary="Orders" />
            </ListItemButton>

            <ListItemButton component={NavLink} to="/inventory">
              <ListItemIcon>
                <InventoryIcon />
              </ListItemIcon>
              <ListItemText primary="Inventory" />
            </ListItemButton>

            <Divider sx={{ my: 1 }} />
          </List>
        </Box>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ my: 1 }} />
          <ListItemButton
            onClick={() => {localStorage.removeItem("authToken");}}
            component={NavLink}
            to="/home"
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </Box>
      </Drawer>
      <Outlet />
    </Box>
  );
}

export default AppLayout;
