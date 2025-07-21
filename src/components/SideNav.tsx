/**
 * 文件名: src/components/SideNav.tsx
 *
 * 本次修改内容:
 * - 【解耦】移除了在 `SideNav` 组件内本地的移动设备视图判断逻辑。
 * - 改为从 `useLayout` 上下文钩子中直接获取 `isMobile` 状态，实现了逻辑的集中化管理。
 * - `useTheme` hook 仍然保留，因为它被用于多个 `sx` 属性中（如 Tooltip 样式、hover 背景色等）。
 *
 * 文件功能描述:
 * 此文件定义了应用的侧边导航栏组件（SideNav），负责应用的页面路由导航。
 */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Drawer, Box, List, ListItem, ButtonBase, Typography,
    Tooltip, Avatar,
    Menu,
    MenuItem,
    IconButton,
    useTheme, // 【修改】移除了 useMediaQuery
} from '@mui/material';
import {
    ViewStreamRounded as ViewStreamRoundedIcon,
    Search as SearchIcon,
    Dashboard as DashboardIcon,
    Dns as DnsIcon,
    RestorePage as RestorePageIcon,
    PlaylistAddCheckCircle as PlaylistAddCheckCircleIcon,
    Assignment as AssignmentIcon,
    PollRounded as PollRoundedIcon,
    ScienceRounded as ScienceRoundedIcon,
    Settings as SettingsIcon,
    AccountCircle as AccountIcon,
    Logout as LogoutIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactElement, MouseEvent, JSX } from 'react';
import { useLayout } from '../contexts/LayoutContext'; // 【新增】导入 useLayout

const W_COLLAPSED = 64;
const W_EXPANDED = 220;
const BTN_SIZE = 40;
const GAP = 8;
const ICON_SIZE = 22;
const TRANS_DUR = 0.28;

const MOTION_EASING = [0.4, 0, 0.2, 1] as const;

const HORIZONTAL_PADDING = (W_COLLAPSED - BTN_SIZE) / 2;
const W_EXPANDED_CONTENT = W_EXPANDED - 2 * HORIZONTAL_PADDING;
const MOBILE_TOP_BAR_HEIGHT = 56;

const MotionDrawer = motion(Drawer);
const MotionButtonBase = motion(ButtonBase);

interface NavItem {
    label: string;
    path: string;
    icon: ReactElement;
    isMobileTopBarItem?: boolean;
}
const mainNavItems: NavItem[] = [
    { label: '概览', path: '/app/dashboard', icon: <DashboardIcon /> },
    { label: '服务器', path: '/app/servers', icon: <DnsIcon /> },
    { label: '更新日志', path: '/app/changelog', icon: <RestorePageIcon /> },
    { label: '巡检备份', path: '/app/inspection-backup', icon: <PlaylistAddCheckCircleIcon /> },
    { label: '工单', path: '/app/tickets', icon: <AssignmentIcon /> },
    { label: '统计信息', path: '/app/stats', icon: <PollRoundedIcon /> },
    { label: '实验性功能', path: '/app/labs', icon: <ScienceRoundedIcon /> },
];

const bottomNavItems: NavItem[] = [
    { label: '搜索', path: '/app/search', icon: <SearchIcon />, isMobileTopBarItem: true },
    { label: '设置', path: '/app/settings', icon: <SettingsIcon />, isMobileTopBarItem: true },
];

interface SideNavProps {
    open: boolean;
    onToggle: () => void;
    onFakeLogout: () => void;
}

export default function SideNav({ open, onToggle, onFakeLogout }: SideNavProps) {
    const { pathname } = useLocation();
    const nav = useNavigate();
    const theme = useTheme();
    const { isMobile } = useLayout(); // 【修改】从 context 获取 isMobile

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const navItemIconSx = { fontSize: ICON_SIZE, color: 'neutral.main', position: 'relative', top: '3px' };
    const controlIconSx = { fontSize: ICON_SIZE, color: 'neutral.main', position: 'relative', top: '1px' };

    const tooltipSx = {
        bgcolor: 'app.background',
        color: 'neutral.main',
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
                        '@media (hover: hover)': {
                            '&:hover': {
                                bgcolor: selected ? 'rgba(0,0,0,0.16)' : theme.palette.action.hover
                            }
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
            slotProps={{ paper: { sx: { ml: 1, p: 1 } } }}
        >
            <Box sx={{ pt: 1, pb: 1, pr: 2, pl: 4, minWidth: 200 }}>
                <Typography fontWeight="bold">chiangho</Typography>
                <Typography variant="caption" color="text.secondary">user@example.com</Typography>
            </Box>
            <MenuItem
                onClick={() => { setAnchorEl(null); onFakeLogout(); }}
                sx={{ color: 'error.main', borderRadius: 1.5 }}
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
                        bgcolor: 'app.background',
                        zIndex: theme.zIndex.appBar + 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2,
                        boxShadow: 'none',
                    }}
                >
                    <IconButton onClick={() => setMobileDrawerOpen(true)} aria-label="open drawer">
                        <ViewStreamRoundedIcon sx={controlIconSx} />
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
                            bgcolor: 'app.background',
                            border: 'none',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                        },
                    }}
                >
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: MOBILE_TOP_BAR_HEIGHT,
                            boxSizing: 'border-box',
                            p: 2,
                        }}>
                            <Box
                                component="img"
                                src="/favicon.svg"
                                alt="logo"
                                sx={{ height: 28, width: 'auto', mr: 1.5 }}
                            />
                            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: 'neutral.main' }}>
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
                            bgcolor: 'app.background',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            '@media (hover: hover)': {
                                cursor: 'pointer',
                            }
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
                                        '@media (hover: hover)': {
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                            },
                                        },
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
                                                <ViewStreamRoundedIcon sx={controlIconSx} />
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
                                            '@media (hover: hover)': {
                                                '&:hover': {
                                                    bgcolor: 'action.hover',
                                                },
                                            },
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