import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';

// 侧栏宽度
const drawerWidth = 280;

const menuItems = [
    { text: '仪表盘', icon: <DashboardIcon /> },
    { text: '客户管理', icon: <PeopleIcon /> },
    { text: '工单中心', icon: <AssignmentIcon /> },
    { text: '设置', icon: <SettingsIcon /> },
];

const SideNav: React.FC = () => {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#1976d2', // 主蓝色 M3 标准蓝
                    color: '#fff',
                    borderRight: 'none',
                },
            }}
        >
            {/* Logo 区域 */}
            <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: 3, bgcolor: '#1565c0' }}>
                <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', color: '#e3f2fd' }}>
                    运维管理
                </Typography>
            </Box>

            {/* 菜单列表 */}
            <List>
                {menuItems.map(({ text, icon }) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                            sx={{
                                '&:hover': { backgroundColor: '#1565c0' },
                                '&.Mui-selected': { backgroundColor: '#42a5f5', color: '#0d47a1' },
                            }}
                            // 这里后续可以加选中状态控制
                        >
                            <ListItemIcon sx={{ color: 'inherit' }}>{icon}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};

export default SideNav;
