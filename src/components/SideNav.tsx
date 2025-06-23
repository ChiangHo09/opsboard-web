// ------------------------------------------------------------
// SideNav.tsx — 蓝底 · 白字 · 浅蓝高亮 + 底部头像/退出（最终对齐版）
// ------------------------------------------------------------
// 调整要点：
// 1. ListItemButton 通过 `display:flex + justifyContent:center + alignItems:center`
//    让图标+文字组合绝对垂直居中。
// 2. 内部再包一层 Box（flex 列），更加稳定；gap=4px。
// 3. 单行与双行文字无需 minHeight，只靠 gap 保持紧凑。
// 4. 按钮外边距：左右 8px (mx:1)，上下 4px (my:0.5) —— 与视觉一致。
// ------------------------------------------------------------

import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Box,
    IconButton,
    Avatar,
    Tooltip,
    Divider,
    Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import DnsIcon from '@mui/icons-material/Dns';
import UpdateIcon from '@mui/icons-material/Update';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScienceIcon from '@mui/icons-material/Science';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
}

export const sideNavWidth = 100;

const navItems: NavItem[] = [
    { label: '搜索',           icon: <SearchIcon />,     path: '/search' },
    { label: '首页',           icon: <HomeIcon />,       path: '/' },
    { label: '客户信息',       icon: <PeopleIcon />,     path: '/customers' },
    { label: '服务器\n信息',   icon: <DnsIcon />,        path: '/servers' },
    { label: '更新日志',       icon: <UpdateIcon />,     path: '/changelog' },
    { label: '工单',           icon: <AssignmentIcon />, path: '/tickets' },
    { label: '实验性\n功能',   icon: <ScienceIcon />,    path: '/labs' },
    { label: '设置',           icon: <SettingsIcon />,   path: '/settings' },
];

const SideNav: React.FC = () => {
    const [selected, setSelected] = React.useState('/');

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: sideNavWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: sideNavWidth,
                    borderRight: 'none',
                    backgroundColor: '#1976d2',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
            }}
        >
            {/* 顶部导航列表 */}
            <Box sx={{ mt: 1 }}>
                <List disablePadding>
                    {navItems.map(({ label, icon, path }) => {
                        const isSelected = selected === path;
                        return (
                            <ListItem key={path} disablePadding sx={{ justifyContent: 'center' }}>
                                <ListItemButton
                                    onClick={() => setSelected(path)}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        mx: 1,          // 左右 8px
                                        my: 0.5,        // 上下 4px
                                        p: 0,
                                        borderRadius: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#ffffff',
                                        backgroundColor: isSelected ? '#64b5f6' : 'transparent',
                                        '&:hover': { backgroundColor: '#64b5f6' },
                                        transition: 'background-color 0.2s',
                                    }}
                                >
                                    {/* 内部再包一层列布局，保证图标+文本整体居中 */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                        {icon}
                                        <Typography
                                            sx={{
                                                fontSize: 12,
                                                textAlign: 'center',
                                                whiteSpace: 'pre-line',
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {label}
                                        </Typography>
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            {/* 底部头像 + 退出 */}
            <Box sx={{ mb: 2, textAlign: 'center' }}>
                <Tooltip title="用户信息">
                    <Avatar sx={{ mx: 'auto', bgcolor: '#64b5f6', width: 48, height: 48 }}>
                        <AccountCircleIcon sx={{ color: '#1976d2' }} />
                    </Avatar>
                </Tooltip>
                <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
                <Tooltip title="退出登录">
                    <IconButton sx={{ color: '#ffffff' }} size="large" onClick={() => alert('退出登录逻辑待实现')}>
                        <LogoutIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </Drawer>
    );
};

export default SideNav;
