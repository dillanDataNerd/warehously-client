// layout/AppLayout.jsx
import * as React from "react";
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
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 180;

function AppLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* Top bar (optional) */}
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            WAREHOUSLY
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Left sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        {/* pushes content below AppBar height */}
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

            {/* <ListItemButton component={NavLink} to="/picking-runs">
              <ListItemIcon>
                <LocalShippingIcon />
              </ListItemIcon>
              <ListItemText primary="Picking" />
            </ListItemButton> */}

            <Divider sx={{ my: 1 }} />

            <ListItemButton component={NavLink} to="/users">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
          </List>
        </Box>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ my: 1 }} />
          <ListItemButton
            onClick={() => {
              localStorage.removeItem("authToken");
            }}
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
