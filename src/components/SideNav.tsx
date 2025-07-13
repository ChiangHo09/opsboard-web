/*
 * [文件用途说明]
 * - 此文件定义了应用的侧边导航栏组件（SideNav），负责应用的页面路由导航。
 * - 它实现了响应式设计，能够在桌面端和移动端提供不同的布局和交互体验。
 *
 * [本次修改记录]
 * - 针对移动设备视图进行了两项样式优化，以匹配 Google AI Studio 的风格：
 *   1. 将顶部栏的背景色 `bgcolor` 从 `background.paper` (白色) 修改为 `#F0F4F9`，使其与应用主背景色融为一体。
 *   2. 移除了顶部栏的 `boxShadow`，消除了与下方工作区的分割线，实现了无缝连接。
 */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Drawer, Box, List, ListItem, ButtonBase, Typography,
    Tooltip, Avatar,
    Menu,
    MenuItem,
    Divider,
    IconButton,
    useMediaQuery, useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Dashboard as DashboardIcon,
    Dns as DnsIcon,
    Article as ArticleIcon,
    Build as BuildIcon,
    Assignment as AssignmentIcon,
    BarChart as BarChartIcon,
    Science as ScienceIcon,
    Settings as SettingsIcon,
    AccountCircle as AccountIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactElement, MouseEvent, JSX } from 'react';

/* ---------- 常量 ---------- */
const W_COLLAPSED = 64;
const W_EXPANDED = 220;
const BTN_SIZE = 40;
const GAP = 8;
const ICON_SIZE = 22;
const GRAY = '#424242';
const TRANS_DUR = 0.28;

const MOTION_EASING = [0.4, 0, 0.2, 1] as const;

const HORIZONTAL_PADDING = (W_COLLAPSED - BTN_SIZE) / 2;
const W_EXPANDED_CONTENT = W_EXPANDED - 2 * HORIZONTAL_PADDING;
const MOBILE_TOP_BAR_HEIGHT = 56;

const MotionDrawer = motion(Drawer);
const MotionButtonBase = motion(ButtonBase);

/* ---------- 导航定义 ---------- */
interface NavItem {
    label: string;
    path: string;
    icon: ReactElement;
    isMobileTopBarItem?: boolean;
}
const mainNavItems: NavItem[] = [
    { label: '概览', path: '/app/dashboard', icon: <DashboardIcon /> },
    { label: '服务器', path: '/app/servers', icon: <DnsIcon /> },
    { label: '更新日志', path: '/app/changelog', icon: <ArticleIcon /> },
    { label: '巡检备份', path: '/app/inspection-backup', icon: <BuildIcon /> },
    { label: '工单', path: '/app/tickets', icon: <AssignmentIcon /> },
    { label: '统计信息', path: '/app/stats', icon: <BarChartIcon /> },
    { label: '实验性功能', path: '/app/labs', icon: <ScienceIcon /> },
];

const bottomNavItems: NavItem[] = [
    { label: '搜索', path: '/app/search', icon: <SearchIcon />, isMobileTopBarItem: true },
    { label: '设置', path: '/app/settings', icon: <SettingsIcon />, isMobileTopBarItem: true },
];

/* ---------- Props ---------- */
interface SideNavProps {
    open: boolean;
    onToggle: () => void;
    onFakeLogout: () => void;
}

/* ============================================================= */
export default function SideNav({ open, onToggle, onFakeLogout }: SideNavProps) {
    const { pathname } = useLocation();
    const nav = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const navItemIconSx = { fontSize: ICON_SIZE, color: GRAY, position: 'relative', top: '3px' };
    const controlIconSx = { fontSize: ICON_SIZE, color: GRAY, position: 'relative', top: '1px' };

    const tooltipSx = {
        bgcolor: '#F0F4F9',
        color: GRAY,
        borderRadius: 0.75,
        border: '1px solid rgba(0,0,0,0.12)',
        p: '4px 9px',
        fontSize: '13px',
        fontWeight: 500,
    };

    const renderNavButton = (item: NavItem, onClickCallback?: () => void): JSX.Element => {
        const selected = pathname.startsWith(item.path);
        return (
            <ListItem key={item.path} disablePadding sx={{ position: 'relative', height: BTN_SIZE }}>
                <MotionButtonBase
                    onClick={(e) => {
                        e.stopPropagation();
                        nav(item.path);
                        if (onClickCallback) onClickCallback();
                    }}
                    animate={{ width: isMobile ? W_EXPANDED_CONTENT : (open ? W_EXPANDED_CONTENT : BTN_SIZE) }}
                    transition={{ duration: TRANS_DUR, ease: MOTION_EASING }}
                    sx={{
                        position: 'absolute', height: BTN_SIZE, borderRadius: 9999,
                        left: HORIZONTAL_PADDING, display: 'flex', alignItems: 'center',
                        justifyContent: 'flex-start', p: 0, overflow: 'hidden',
                        bgcolor: selected ? 'rgba(0,0,0,0.12)' : 'transparent',
                        '&:hover': {
                            bgcolor: selected ? 'rgba(0,0,0,0.16)' : 'rgba(0,0,0,0.04)'
                        }
                    }}
                >
                    <Tooltip
                        title={!open && !isMobile ? item.label : ''}
                        placement="right"
                        slotProps={{ tooltip: { sx: tooltipSx } }}
                    >
                        <Box sx={{
                            width: BTN_SIZE, height: '100%', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', flexShrink: 0,
                        }}>
                            <Box component="span" sx={navItemIconSx}>{item.icon}</Box>
                        </Box>
                    </Tooltip>
                    <Box sx={{ pl: 0.5 }}>
                        <AnimatePresence>
                            {(open || isMobile) && (
                                <motion.div
                                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2, ease: 'easeOut' }}
                                >
                                    <Typography sx={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                                        {item.label}
                                    </Typography>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Box>
                </MotionButtonBase>
            </ListItem>
        );
    };

    const accountMenu = (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            slotProps={{ paper: { sx: { ml: 1 } } }}
        >
            <Box sx={{ p: 2, minWidth: 200 }}>
                <Typography fontWeight="bold">chiangho</Typography>
                <Typography variant="caption" color="text.secondary">user@example.com</Typography>
            </Box>
            <Divider />
            <MenuItem
                onClick={() => { setAnchorEl(null); onFakeLogout(); }}
                sx={{ color: 'error.main' }}
            >
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                退出登录
            </MenuItem>
        </Menu>
    );

    if (isMobile) {
        return (
            <React.Fragment>
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: MOBILE_TOP_BAR_HEIGHT,
                        bgcolor: '#F0F4F9', // 1. 背景色与主应用背景一致
                        zIndex: theme.zIndex.appBar + 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        boxShadow: 'none', // 2. 移除阴影/分割线
                    }}
                >
                    <IconButton onClick={() => setMobileDrawerOpen(true)} aria-label="open drawer">
                        <MenuIcon sx={controlIconSx} />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {bottomNavItems
                            .filter(item => item.isMobileTopBarItem)
                            .map(item => (
                                <IconButton key={item.path} onClick={() => nav(item.path)} aria-label={item.label}>
                                    <Tooltip
                                        title={item.label}
                                        placement="bottom"
                                        slotProps={{ tooltip: { sx: tooltipSx } }}
                                    >
                                        <Box component="span" sx={controlIconSx}>{item.icon}</Box>
                                    </Tooltip>
                                </IconButton>
                            ))}
                        <IconButton
                            onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                e.stopPropagation();
                                setAnchorEl(e.currentTarget);
                            }}
                            aria-label="account"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(0,0,0,.05)' }}>
                                <AccountIcon sx={controlIconSx} />
                            </Avatar>
                        </IconButton>
                    </Box>
                </Box>
                <MotionDrawer
                    variant="temporary"
                    open={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)}
                    ModalProps={{ keepMounted: true }}
                    animate={{ width: mobileDrawerOpen ? W_EXPANDED : 0 }}
                    transition={{ duration: TRANS_DUR, ease: MOTION_EASING }}
                    sx={{
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: W_EXPANDED,
                            bgcolor: '#F0F4F9',
                            border: 'none',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                        },
                    }}
                >
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', height: MOBILE_TOP_BAR_HEIGHT, boxSizing: 'border-box' }}>
                            <Box
                                component="img"
                                src="/favicon.svg"
                                alt="logo"
                                sx={{ height: 28, width: 'auto', mr: 1.5 }}
                            />
                            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: GRAY }}>
                                运维信息表
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', pt: `${GAP}px`, pb: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {mainNavItems.map(item => renderNavButton(item, () => setMobileDrawerOpen(false)))}
                            </List>
                        </Box>
                        <Box sx={{ py: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {bottomNavItems
                                    .filter(item => !item.isMobileTopBarItem)
                                    .map(item => renderNavButton(item, () => setMobileDrawerOpen(false)))}
                            </List>
                        </Box>
                    </Box>
                </MotionDrawer>
                {accountMenu}
            </React.Fragment>
        );
    } else {
        return (
            <React.Fragment>
                <MotionDrawer
                    variant="permanent"
                    animate={{ width: open ? W_EXPANDED : W_COLLAPSED }}
                    transition={{ duration: TRANS_DUR, ease: MOTION_EASING }}
                    sx={{
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 'inherit',
                            bgcolor: '#F0F4F9',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            cursor: 'pointer',
                        },
                    }}
                >
                    <Box onClick={onToggle} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ py: `${GAP}px` }}>
                            <ListItem disablePadding sx={{ position: 'relative', height: BTN_SIZE }}>
                                <MotionButtonBase
                                    onClick={(e: MouseEvent) => {
                                        e.stopPropagation();
                                        onToggle();
                                    }}
                                    animate={{ width: open ? W_EXPANDED_CONTENT : BTN_SIZE }}
                                    transition={{ duration: TRANS_DUR, ease: MOTION_EASING }}
                                    sx={{
                                        position: 'absolute', height: BTN_SIZE, borderRadius: 9999,
                                        left: HORIZONTAL_PADDING, display: 'flex', alignItems: 'center',
                                        justifyContent: 'flex-start', p: 0, overflow: 'hidden',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,.04)' },
                                    }}
                                >
                                    <Tooltip
                                        title={open ? '' : '展开'}
                                        placement="right"
                                        slotProps={{ tooltip: { sx: tooltipSx } }}
                                    >
                                        <Box sx={{
                                            width: BTN_SIZE, height: '100%', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: TRANS_DUR }}>
                                                <MenuIcon sx={controlIconSx} />
                                            </motion.div>
                                        </Box>
                                    </Tooltip>
                                    <Box sx={{ pl: 0.5 }}>
                                        <AnimatePresence>
                                            {open && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2, ease: 'easeOut' }}
                                                >
                                                    <Typography sx={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                                                        收起
                                                    </Typography>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </Box>
                                </MotionButtonBase>
                            </ListItem>
                        </Box>

                        <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {mainNavItems.map(item => renderNavButton(item))}
                            </List>
                        </Box>

                        <Box sx={{ py: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {bottomNavItems.map(item => renderNavButton(item))}
                                <ListItem disablePadding sx={{ position: 'relative', height: BTN_SIZE }}>
                                    <MotionButtonBase
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            setAnchorEl(e.currentTarget);
                                        }}
                                        animate={{ width: open ? W_EXPANDED_CONTENT : BTN_SIZE }}
                                        transition={{ duration: TRANS_DUR, ease: MOTION_EASING }}
                                        sx={{
                                            position: 'absolute', height: BTN_SIZE, borderRadius: 9999,
                                            left: HORIZONTAL_PADDING, display: 'flex', alignItems: 'center',
                                            justifyContent: 'flex-start', p: 0, overflow: 'hidden',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,.04)' },
                                        }}
                                    >
                                        <Tooltip
                                            title={!open ? "chiangho" : ''}
                                            placement="right"
                                            slotProps={{ tooltip: { sx: tooltipSx } }}
                                        >
                                            <Box sx={{
                                                width: BTN_SIZE, height: '100%', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', flexShrink: 0,
                                            }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(0,0,0,.05)' }}>
                                                    <AccountIcon sx={controlIconSx} />
                                                </Avatar>
                                            </Box>
                                        </Tooltip>
                                        <Box sx={{ pl: 0.5 }}>
                                            <AnimatePresence>
                                                {open && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2, ease: 'easeOut' }}
                                                    >
                                                        <Typography sx={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                                                            chiangho
                                                        </Typography>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Box>
                                    </MotionButtonBase>
                                </ListItem>
                            </List>
                        </Box>
                    </Box>
                </MotionDrawer>
                {accountMenu}
            </React.Fragment>
        );
    }
}