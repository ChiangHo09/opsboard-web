// SideNav.tsx — 主栏82px + 二级侧栏覆盖后滑出动画(M3风格)
/**
 * 需求：
 *  - 主栏保持82px宽；点击含子菜单项时，二级侧栏覆盖主栏后滑出至右侧。
 *  - 加入 Material Design 风格动画：淡入 + 滑动 + 折叠高度过渡。
 */
import React, { useState } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Box,
    Avatar,
    Tooltip,
    Typography,
    Collapse,
    Slide,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DnsIcon from '@mui/icons-material/Dns';
import UpdateIcon from '@mui/icons-material/Update';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScienceIcon from '@mui/icons-material/Science';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BASE_W = 82;   // 主栏宽度
const EXTRA_W = 220; // 子栏宽度

interface NavItem {
    label: string;
    path: string;
    icon?: React.ReactNode;
    children?: NavItem[];
}

const navItems: NavItem[] = [
    { label: '搜索', path: '/search', icon: <SearchIcon /> },
    { label: '概览', path: '/', icon: <DashboardIcon /> },
    {
        label: '客户信息', path: '/customers', icon: <PeopleIcon />, children: [
            { label: '某某市', path: '/customers/city', children: [{ label: '某某区', path: '/customers/city/district' }] },
        ],
    },
    { label: '服务器信息', path: '/servers', icon: <DnsIcon /> },
    { label: '更新日志', path: '/changelog', icon: <UpdateIcon /> },
    { label: '工单', path: '/tickets', icon: <AssignmentIcon /> },
    { label: '实验性功能', path: '/labs', icon: <ScienceIcon /> },
    { label: '设置', path: '/settings', icon: <SettingsIcon /> },
];

const mainBtn = {
    width: 70,
    height: 70,
    m: 0.5,
    p: 0,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
};

const SideNav: React.FC = () => {
    const [selected, setSelected] = useState<string>('');
    const [subMenu, setSubMenu] = useState<NavItem[] | null>(null);
    const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

    const handleMainClick = (item: NavItem) => {
        setSelected(item.path);
        setSubMenu(item.children ?? null);
        setOpenMap({});
    };
    const toggleFold = (path: string) => setOpenMap((o) => ({ ...o, [path]: !o[path] }));

    const renderSubItems = (items: NavItem[], depth = 0) => (
        <List disablePadding sx={{ pl: depth * 2, transition: 'padding .3s ease' }}>
            {items.map((it) => {
                const has = !!it.children?.length;
                const open = openMap[it.path] || false;
                return (
                    <React.Fragment key={it.path}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => (has ? toggleFold(it.path) : setSelected(it.path))}
                                sx={{
                                    py: 1,
                                    pr: 1,
                                    borderRadius: 1,
                                    color: '#fff',
                                    backgroundColor: selected === it.path ? '#64b5f6' : 'transparent',
                                    '&:hover': { backgroundColor: '#5fa8ec' },
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    transition: 'background-color .3s ease',
                                }}
                            >
                                <Typography sx={{ fontSize: 14 - depth, transition: 'font-size .3s ease' }}>{it.label}</Typography>
                                {has && (open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
                            </ListItemButton>
                        </ListItem>
                        {has && (
                            <Collapse in={open} timeout={300} unmountOnExit sx={{ transition: 'height .3s ease' }}>
                                {renderSubItems(it.children!, depth + 1)}
                            </Collapse>
                        )}
                    </React.Fragment>
                );
            })}
        </List>
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: BASE_W,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: BASE_W,
                        backgroundColor: '#1976d2',
                        borderRight: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    },
                }}
            >
                <Box sx={{ mt: 1 }}>
                    <List disablePadding>
                        {navItems.map((item) => (
                            <ListItem key={item.path} disablePadding sx={{ justifyContent: 'center' }}>
                                <ListItemButton
                                    onClick={() => handleMainClick(item)}
                                    sx={{
                                        ...mainBtn,
                                        backgroundColor: selected === item.path ? '#64b5f6' : 'transparent',
                                        '&:hover': { backgroundColor: '#64b5f6' },
                                        transition: 'background-color .3s ease',
                                    }}
                                >
                                    {item.icon}
                                    <Typography sx={{ fontSize: 12, transition: 'font-size .3s ease', textAlign: 'center', whiteSpace: 'pre-line' }}>
                                        {item.label}
                                    </Typography>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Box sx={{ textAlign: 'center', pb: 1 }}>
                    <Tooltip title="用户信息">
                        <Avatar sx={{ mx: 'auto', mb: 1, bgcolor: '#64b5f6', width: 40, height: 40 }}>
                            <AccountCircleIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                        </Avatar>
                    </Tooltip>
                    <Tooltip title="退出登录">
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                m: 0.5,
                                p: 0,
                                borderRadius: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: '#fff',
                                cursor: 'pointer',
                                transition: 'background-color .3s ease',
                            }}
                            onClick={() => alert('退出登录')}
                        >
                            <LogoutIcon fontSize="small" />
                        </Box>
                    </Tooltip>
                </Box>
            </Drawer>
            {subMenu && (
                <Slide
                    direction="right"
                    in={Boolean(subMenu)}
                    mountOnEnter
                    unmountOnExit
                    timeout={300}
                    style={{ transformOrigin: '0 0', position: 'absolute', left: BASE_W, top: 0 }}
                >
                    <Box
                        sx={{
                            width: EXTRA_W,
                            height: '100%',
                            bgcolor: '#1976d2',
                            overflowY: 'auto',
                        }}
                    >
                        {renderSubItems(subMenu)}
                    </Box>
                </Slide>
            )}
        </Box>
    );
};

export default SideNav;
