/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import MailIcon from '@mui/icons-material/Mail';
import { AccountCircle } from '@mui/icons-material';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AddIcon from '@mui/icons-material/Add';
import BarChartIcon from '@mui/icons-material/BarChart';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Link from 'next/link';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReportIcon from '@mui/icons-material/Report';
import StarBorder from '@mui/icons-material/StarBorder';
import CategoryIcon from '@mui/icons-material/Category';
import SecurityIcon from '@mui/icons-material/Security';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '@/context/AuthContext';
import { CircularProgress, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Skeleton, Fade, LinearProgress } from '@mui/material';

const drawerWidth = 240;

function ResponsiveDrawer(props: any) {
  const { window, children } = props; const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isEmailOpen, setIsEmailOpen] = React.useState(true); // Controls email section expansion
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  // Use actual authentication state and functions
  const { user, logout: handleLogout, loading } = useAuth();
  const isLoggedIn = !!user; // Check if user exists

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleEmailClick = () => {
    setIsEmailOpen(!isEmailOpen); // Toggles email section
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccountClick = () => {
    handleMenuClose();
    // Navigation to account page is handled by Next.js Link component
  }; const handleLogoutClick = () => {
    handleMenuClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    handleLogout();
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const menuId = 'primary-search-account-menu';
  const isMenuOpen = Boolean(anchorEl);

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}    >
      {isLoggedIn
        ? [
          <MenuItem key="account" onClick={handleAccountClick}>
            <Link href="/account" style={{ textDecoration: 'none', color: 'inherit' }}>
              Account
            </Link>
          </MenuItem>,
          <MenuItem key="logout" onClick={handleLogoutClick}>
            Logout
          </MenuItem>,
        ]
        : [
          <MenuItem key="login" onClick={handleMenuClose}>
            <Link href="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
              Login
            </Link>
          </MenuItem>,
          <MenuItem key="register" onClick={handleMenuClose}>
            <Link href="/register" style={{ textDecoration: 'none', color: 'inherit' }}>
              Register
            </Link>
          </MenuItem>,
        ]}
    </Menu>
  );
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>        {/* Public menu items - always visible */}
        {!isLoggedIn && (
          <>
            <ListItemButton component={Link} href="/login">
              <ListItemIcon>
                <LoginIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
            <ListItemButton component={Link} href="/register">
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItemButton>
          </>
        )}

        {/* Protected menu items - only for logged-in users */}
        {isLoggedIn && (
          <>
            <ListItemButton component={Link} href="/product">
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Product Creation" />
            </ListItemButton>

            <ListItemButton component={Link} href="/product-types">
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Product Types" />
            </ListItemButton>

            <ListItemButton component={Link} href="/account">
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Account" />
            </ListItemButton>

            {/* Email section with collapsible items */}
            <ListItemButton onClick={handleEmailClick}>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Email" />
              {isEmailOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={isEmailOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }} component={Link} href="/email">
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>
                  <ListItemText primary="All Email" />
                </ListItemButton>

                <ListItemButton sx={{ pl: 4 }} component={Link} href="/email/trash">
                  <ListItemIcon>
                    <DeleteForeverIcon />
                  </ListItemIcon>
                  <ListItemText primary="Trash" />
                </ListItemButton>

                <ListItemButton sx={{ pl: 4 }} component={Link} href="/email/spam">
                  <ListItemIcon>
                    <ReportIcon />
                  </ListItemIcon>
                  <ListItemText primary="Spam" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 4 }}
                  component={Link}
                  href="/email/selected"
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText primary="Selected" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton component={Link} href="/statistics">
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Statistics" />
            </ListItemButton>

            <ListItemButton component={Link} href="/notification">
              <ListItemIcon>
                <NotificationsIcon />
              </ListItemIcon>
              <ListItemText primary="Notification" />
            </ListItemButton>            <ListItemButton component={Link} href="/sessions">
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="User Sessions" />
            </ListItemButton>
          </>
        )}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>          {/* User info display */}
          {loading && (
            <CircularProgress size={20} color="inherit" sx={{ mr: 2 }} />
          )}
          {isLoggedIn && user && (
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', mr: 2 }}>
              <Typography variant="body2" sx={{ mr: 1 }}>
                Welcome, {user.email}
              </Typography>
              <Chip
                label={user.role}
                size="small"
                color={user.role === 'ADMIN' ? 'primary' : 'default'}
                variant="outlined"
              />
            </Box>
          )}

          {/* Notifications and mail - only for logged-in users */}
          {isLoggedIn && (
            <>
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
              >
                <Badge badgeContent={4} color="error">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </>
          )}

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {children}      </Box>

      {renderMenu}

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to logout? You will need to login again to access the admin panel.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node,
};

export default ResponsiveDrawer;
