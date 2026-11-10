
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Groups as GroupsIcon,
  AccessTime as AttendanceIcon,
  EventNote as LeaveIcon,
  Payments as PayrollIcon,
  Apartment as DepartmentIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Logout,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";

import { useLogoutMutation } from "../services/authApi";
import { clearCredentials } from "../features/auth/authSlice";

const drawerWidth = 250;

const menuItems = [
  { title: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { title: "Employees", icon: <GroupsIcon />, path: "/employees" },
  { title: "Attendance", icon: <AttendanceIcon />, path: "/attendance" },
  { title: "Leave Management", icon: <LeaveIcon />, path: "/leaves" },
  { title: "Payroll", icon: <PayrollIcon />, path: "/payroll" },
  { title: "Departments", icon: <DepartmentIcon />, path: "/departments" },
  { title: "Reports", icon: <ReportsIcon />, path: "/reports" },
  { title: "Settings", icon: <SettingsIcon />, path: "/settings" },
];

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      dispatch(clearCredentials());
      navigate("/login", { replace: true });
    }
  };

  const sidebar = (
    <Box sx={{ height: "100%", bgcolor: "#fff" }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={800} color="primary">
          NexHR<span style={{ color: "#0F172A" }}>.</span>
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Human Capital Management
        </Typography>
      </Box>

      <Box sx={{ px: 2, pb: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
        >
          WORKSPACE
        </Typography>
      </Box>

      <List sx={{ px: 1.5 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: "text.secondary",

              "&.active": {
                backgroundColor: "#EFF6FF",
                color: "#2563EB",
              },

              "&.active .MuiListItemIcon-root": {
                color: "#2563EB",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.title}
              slotProps={{
                primary: {
                  sx: {
                    fontSize: 14,
                    fontWeight: 600,
                  },
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: "1px solid #E8EDF5",
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "#FFFFFF",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {!isDesktop && (
              <IconButton onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography fontWeight={600} color="text.primary">
              Human Resources
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box
              sx={{
                textAlign: "right",
                display: { xs: "none", sm: "block" },
              }}
            >
              <Typography fontSize={13} fontWeight={700}>
                {user?.fullName || "User"}
              </Typography>

              <Typography fontSize={11} color="text.secondary">
                {user?.role?.toUpperCase() || "USER"}
              </Typography>
            </Box>

            <Avatar sx={{ bgcolor: "primary.main" }}>
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </Avatar>

            <Button
              color="error"
              variant="outlined"
              size="small"
              startIcon={<Logout />}
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop || mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: isDesktop ? drawerWidth : undefined,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #E8EDF5",
          },
        }}
      >
        {sidebar}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, sm: 3 },
          mt: "64px",
          bgcolor: "background.default",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
