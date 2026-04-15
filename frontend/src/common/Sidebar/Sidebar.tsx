import { NavLink, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {
  HomeOutlined,
  FolderOutlined,
  MessageOutlined,
  PersonOutline,
  LogoutOutlined,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../pages/Auth/useAuth';
import { SidebarHeader } from './SidebarHeader';

const drawerWidth = 200;
const collapsedWidth = 60;

const SidebarWrapper = styled(Box)({
  height: '100vh',
  flexShrink: 0,
  whiteSpace: 'nowrap',
});

const menuItemStyles = (open: boolean) => ({
  mb: 0.5,
  borderRadius: 10,
  justifyContent: open ? 'initial' : 'center',
  position: 'relative',
  color: 'text.secondary',
  transition: 'all 0.2s',
  '&.active': {
    color: 'primary.main',
  },
  '&.active .MuiListItemIcon-root': {
    color: 'primary.main',
  },
  '&.active::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 8,
    bottom: 8,
    width: 3,
    bgcolor: 'primary.main',
    borderRadius: 2,
  },
});

const iconStyles = (open: boolean) => ({
  minWidth: 0,
  mr: open ? 1 : 'auto',
  justifyContent: 'center',
  color: 'inherit',
});

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setOpen(!open);

  const menuItems = [
    { label: 'Home', icon: <HomeOutlined />, path: '/' },
    { label: 'Projetos', icon: <FolderOutlined />, path: '/projects' },
    { label: 'Mensagens', icon: <MessageOutlined />, path: '/messages' },
    { label: 'Perfil', icon: <PersonOutline />, path: '/profile/me' },
  ];

  return (
    <SidebarWrapper>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedWidth,
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={toggleSidebar} color="primary">
            <MenuIcon />
          </IconButton>
        </Box>

        { open &&
          <SidebarHeader fullName={user?.fullName || ''} email={user?.email || ''} />
        }

        <Divider />

        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItemButton
              component={NavLink}
              to={item.path}
              end
              sx={menuItemStyles(open)}
            >
              <ListItemIcon
                sx={iconStyles(open)}
              >
                {item.icon}
              </ListItemIcon>

              {open && <ListItemText primary={item.label}  primaryTypographyProps={{variant: 'body2'}} />}
            </ListItemButton>
          ))}
          <ListItemButton onClick={handleLogout} sx={menuItemStyles(open)}>
            <ListItemIcon sx={iconStyles(open)}><LogoutOutlined /></ListItemIcon>
            {open && <ListItemText primary="Sair" primaryTypographyProps={{ variant: 'body2' }} />}
          </ListItemButton>
        </List>
      </Drawer>
    </SidebarWrapper>
  );
};
