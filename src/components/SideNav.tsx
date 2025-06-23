// ------------------------------------------------------------
// SideNav.tsx  — 蓝底·白字·浅蓝选中高亮版（按钮左右留边距）
// ------------------------------------------------------------
// 更新：按钮圆角矩形左右各留 8px 空隙，避免贴满侧栏。
// ------------------------------------------------------------

import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
} from '@mui/material';

// MUI 图标示例
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import CodeIcon from '@mui/icons-material/Code';
import SaveIcon from '@mui/icons-material/Save';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface NavItem {
    label: string;
    icon: React.ReactNode;
    path: string;
}

export const sideNavWidth = 100; // 侧栏固定宽度

const navItems: NavItem[] = [
    { label: '搜索', icon: <SearchIcon />, path: '/search' },
    { label: '首页', icon: <HomeIcon />, path: '/' },
    { label: '入门', icon: <AppsIcon />, path: '/get-started' },
    { label: '开发', icon: <CodeIcon />, path: '/develop' },
    { label: '基础', icon: <SaveIcon />, path: '/foundations' },
    { label: '样式', icon: <ColorLensIcon />, path: '/styles' },
    { label: '组件', icon: <AddCircleOutlineIcon />, path: '/components' },
    { label: '博客', icon: <StarBorderIcon />, path: '/blog' },
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
                    boxSizing: 'border-box',
                    borderRight: 'none',
                    backgroundColor: '#1976d2', // 深蓝底
                },
            }}
        >
            <Box sx={{ mt: 2 }}>
                <List>
                    {navItems.map(({ label, icon, path }) => {
                        const isSelected = selected === path;
                        return (
                            <ListItem key={path} disablePadding sx={{ justifyContent: 'center' }}>
                                <ListItemButton
                                    onClick={() => setSelected(path)}
                                    sx={{
                                        width: 72,            // 按钮自身宽度
                                        height: 72,
                                        mx: 1,                // 左右各留 8px 空隙
                                        borderRadius: 2,
                                        flexDirection: 'column',
                                        my: 1,
                                        color: '#ffffff',
                                        backgroundColor: isSelected ? '#64b5f6' : 'transparent',
                                        '&:hover': { backgroundColor: '#64b5f6' },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            color: '#ffffff',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        {icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={label}
                                        primaryTypographyProps={{
                                            sx: {
                                                fontSize: 12,
                                                mt: 0.5,
                                                textAlign: 'center',
                                                color: '#ffffff',
                                            },
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>
        </Drawer>
    );
};

export default SideNav;
