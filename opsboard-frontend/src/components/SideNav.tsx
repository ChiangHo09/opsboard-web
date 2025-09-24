/**
 * @file src/components/SideNav.tsx
 * @description 定义了应用的侧边导航栏组件（SideNav）。
 * @modification
 *   - [认证集成]: 引入 `useAuth` 钩子以从全局 `AuthContext` 获取当前登录的用户信息。
 *   - [动态渲染]: 移除了所有硬编码的用户名和邮箱，现在动态显示来自 `user` 对象的数据（如 `nickname`）。
 *   - [类型修复]: 将 `SideNavProps` 接口中的 `onFakeLogout` 重命名为 `onLogout`，以匹配 `MainLayout` 传递的属性，解决 TypeScript 类型不匹配的错误。
 *   - [功能集成]: “退出登录”按钮现在调用从 props 传入的真实 `onLogout` 函数。
 */
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Drawer, Box, List, ListItem, ButtonBase, Typography,
    Tooltip, Avatar,
    Menu,
    MenuItem,
    IconButton,
    useTheme,
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
import { useLayout } from '@/contexts/LayoutContext';
import { useAuth } from '@/hooks/useAuth'; // 引入 useAuth 钩子
import logoSrc from '../assets/logo.svg';

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

// 【核心修改】修复 Props 类型定义
interface SideNavProps {
    open: boolean;
    onToggle: () => void;
    onLogout: () => void; // 将 onFakeLogout 重命名为 onLogout
}

const SideNav = ({ open, onToggle, onLogout }: SideNavProps): JSX.Element => {
    const { pathname } = useLocation();
    const nav = useNavigate();
    const theme = useTheme();
    const { isMobile } = useLayout();
    const { user } = useAuth(); // 从 AuthContext 获取用户信息
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const navItemIconSx = { fontSize: ICON_SIZE, color: 'neutral.main', position: 'relative', top: '3px' };
    const controlIconSx = { fontSize: ICON_SIZE, color: 'neutral.main', position: 'relative', top: '1px' };

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
                        position: 'absolute', height: BTN_SIZE, borderRadius: 9999, left: HORIZONTAL_PADDING,
                        display: 'flex', alignItems: 'center', justifyContent: 'flex-start', p: 0, overflow: 'hidden',
                        bgcolor: selected ? 'rgba(0,0,0,0.12)' : 'transparent',
                        '@media (hover: hover)': { '&:hover': { bgcolor: selected ? 'rgba(0,0,0,0.16)' : theme.palette.action.hover } }
                    }}
                >
                    <Tooltip
                        title={!open && !isMobile ? item.label : ''}
                        placement="right"
                    >
                        <Box sx={{
                            width: BTN_SIZE,
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <Box component="span" sx={navItemIconSx}>{item.icon}</Box>
                        </Box>
                    </Tooltip>
                    <Box sx={{ pl: 0.5 }}>
                        <AnimatePresence>
                            {(open || isMobile) && (
                                <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
                                    <Typography sx={{ fontSize: 14, whiteSpace: 'nowrap' }}>{item.label}</Typography>
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
            slotProps={{ paper: { sx: { ml: 1, p: 1, width: 220 } } }}
        >
            <MenuItem
                disabled
                sx={{
                    opacity: '1 !important',
                    py: 1,
                    px: 2,
                }}
            >
                <Box>
                    {/* 【核心修改】动态显示用户信息 */}
                    <Typography fontWeight="bold">{user?.nickname || '未知用户'}</Typography>
                    <Typography variant="caption" color="text.secondary">{user?.username}</Typography>
                </Box>
            </MenuItem>
            <MenuItem
                onClick={() => {
                    setAnchorEl(null);
                    onLogout(); // 【核心修改】调用真实的登出函数
                }}
                sx={{ color: 'error.main', borderRadius: 1.5, mx: 1, mt: 1 }}
            >
                <>
                    <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                    退出登录
                </>
            </MenuItem>
        </Menu>
    );

    if (isMobile) {
        return (
            <React.Fragment>
                <Box sx={{
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
                    boxShadow: 'none'
                }}>
                    <IconButton onClick={() => setMobileDrawerOpen(true)} aria-label="open drawer">
                        <ViewStreamRoundedIcon sx={controlIconSx} />
                    </IconButton>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {bottomNavItems.filter(item => item.isMobileTopBarItem).map(item => (
                            <IconButton key={item.path} onClick={() => nav(item.path)} aria-label={item.label}>
                                <Tooltip
                                    title={item.label}
                                    placement="bottom"
                                >
                                    <Box component="span" sx={controlIconSx}>{item.icon}</Box>
                                </Tooltip>
                            </IconButton>
                        ))}
                        <IconButton onClick={(e: MouseEvent<HTMLButtonElement>) => {
                            e.stopPropagation();
                            setAnchorEl(e.currentTarget);
                        }} aria-label="account">
                            <Avatar src={user?.avatar} sx={{ width: 32, height: 32, bgcolor: 'rgba(0,0,0,.05)' }}>
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
                            overflow: 'hidden'
                        }
                    }}
                >
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: MOBILE_TOP_BAR_HEIGHT,
                            boxSizing: 'border-box',
                            p: 2
                        }}>
                            <Box component="img" src={logoSrc} alt="logo"
                                 sx={{ height: 28, width: 'auto', mr: 1.5 }} />
                            <Typography variant="h6" sx={{
                                fontSize: '1rem',
                                fontWeight: 600,
                                color: 'neutral.main'
                            }}>运维信息表</Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', pt: `${GAP}px`, pb: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {mainNavItems.map(item => renderNavButton(item, () => setMobileDrawerOpen(false)))}
                            </List>
                        </Box>
                        <Box sx={{ py: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {bottomNavItems.filter(item => !item.isMobileTopBarItem).map(item => renderNavButton(item, () => setMobileDrawerOpen(false)))}
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
                            '@media (hover: hover)': { cursor: 'pointer' }
                        }
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
                                        position: 'absolute',
                                        height: BTN_SIZE,
                                        borderRadius: 9999,
                                        left: HORIZONTAL_PADDING,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        p: 0,
                                        overflow: 'hidden',
                                        '@media (hover: hover)': { '&:hover': { bgcolor: 'action.hover' } }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Tooltip title={open ? '' : '展开'} placement="right">
                                            <Box sx={{
                                                width: BTN_SIZE,
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0
                                            }}>
                                                <motion.div animate={{ rotate: open ? 90 : 0 }}
                                                            transition={{ duration: TRANS_DUR }}>
                                                    <ViewStreamRoundedIcon sx={controlIconSx} />
                                                </motion.div>
                                            </Box>
                                        </Tooltip>
                                        <Box sx={{ pl: 0.5 }}>
                                            <AnimatePresence>
                                                {open && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -8 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -8 }}
                                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                                    >
                                                        <Typography
                                                            sx={{ fontSize: 14, whiteSpace: 'nowrap' }}>收起</Typography>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Box>
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
                                            position: 'absolute',
                                            height: BTN_SIZE,
                                            borderRadius: 9999,
                                            left: HORIZONTAL_PADDING,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-start',
                                            p: 0,
                                            overflow: 'hidden',
                                            '@media (hover: hover)': { '&:hover': { bgcolor: 'action.hover' } }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Tooltip title={!open ? user?.nickname || '' : ''} placement="right">
                                                <Box sx={{
                                                    width: BTN_SIZE,
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0
                                                }}>
                                                    <Avatar src={user?.avatar} sx={{ width: 32, height: 32, bgcolor: 'rgba(0,0,0,.05)' }}>
                                                        <AccountIcon sx={controlIconSx} />
                                                    </Avatar>
                                                </Box>
                                            </Tooltip>
                                            <Box sx={{ pl: 0.5 }}>
                                                <AnimatePresence>
                                                    {open && (
                                                        <motion.div
                                                            initial={{ opacity: 0, x: -8 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -8 }}
                                                            transition={{ duration: 0.2, ease: 'easeOut' }}
                                                        >
                                                            <Typography sx={{
                                                                fontSize: 14,
                                                                whiteSpace: 'nowrap'
                                                            }}>{user?.nickname}</Typography>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </Box>
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
};

export default SideNav;