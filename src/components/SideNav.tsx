/* --- START OF FILE SideNav.tsx --- */
/*****************************************************************
 *  src/components/SideNav.tsx
 *  --------------------------------------------------------------
 *  Google AI Studio 风格侧边栏
 *  - 圆形按钮锚点固定，展开时从圆心向右伸展
 *  - 默认收起；汉堡菜单控制展开/收起
 *  - 用户头像固定底端（hover/click 弹出信息、含退出）
 *  - 依赖: @mui/material @mui/icons-material framer-motion
 *****************************************************************/

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Drawer, Box, List, ListItem, ButtonBase, Typography,
    Tooltip, Avatar, Menu, MenuItem, Divider, IconButton,
    useMediaQuery, useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    Dashboard as DashboardIcon,
    Dns as DnsIcon,
    Update as UpdateIcon,
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
    { label: '更新日志', path: '/app/changelog', icon: <UpdateIcon /> },
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
        bgcolor: '#f7f9fd',
        color: GRAY,
        borderRadius: 0.75,
        border: '1px solid rgba(0,0,0,0.12)',
        p: '4px 9px',
        fontSize: '13px',
        fontWeight: 500,
    };

    // 修复点1：明确定义参数类型和返回类型
    const renderNavButton = (
        item: NavItem,
        onClickCallback?: () => void // 可选回调函数参数
    ): JSX.Element => {
        const selected = pathname.startsWith(item.path);
        return (
            <ListItem key={item.path} disablePadding sx={{ position: 'relative', height: BTN_SIZE }}>
                <MotionButtonBase
                    // 修复点2：明确指定MouseEvent泛型类型
                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        nav(item.path);
                        if (onClickCallback) onClickCallback(); // 安全调用回调
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
                <Typography fontWeight="bold">用户姓名</Typography>
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
                {/* 移动端顶部导航栏 */}
                <Box sx={{ /* 样式保持不变 */ }}>
                    {/* 左侧汉堡菜单 */}
                    <IconButton onClick={() => setMobileDrawerOpen(true)}>
                        <MenuIcon sx={controlIconSx} />
                    </IconButton>

                    {/* 右侧功能图标 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {bottomNavItems
                            .filter(item => item.isMobileTopBarItem)
                            .map(item => (
                                <IconButton key={item.path} onClick={() => nav(item.path)}>
                                    <Tooltip title={item.label} placement="bottom" slotProps={{ tooltip: { sx: tooltipSx } }}>
                                        <Box component="span" sx={controlIconSx}>{item.icon}</Box>
                                    </Tooltip>
                                </IconButton>
                            ))}
                        {/* 用户头像 */}
                        <IconButton onClick={(e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget)}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(0,0,0,.05)' }}>
                                <AccountIcon sx={controlIconSx} />
                            </Avatar>
                        </IconButton>
                    </Box>
                </Box>

                {/* 移动端侧边抽屉 */}
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
                            bgcolor: '#f7f9fd',
                            border: 'none',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            pt: `${MOBILE_TOP_BAR_HEIGHT}px`,
                        },
                    }}
                >
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* 主要导航项列表 */}
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', py: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {/* 修复点3：移动端传递回调函数 */}
                                {mainNavItems.map(item => renderNavButton(item, () => setMobileDrawerOpen(false)))}
                            </List>
                        </Box>

                        {/* 底部导航项列表 */}
                        <Box sx={{ py: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {bottomNavItems
                                    .filter(item => !item.isMobileTopBarItem)
                                    .map(item => renderNavButton(item, () => setMobileDrawerOpen(false)))}

                                {/* 账户信息项 */}
                                <ListItem disablePadding sx={{ position: 'relative', height: BTN_SIZE }}>
                                    <MotionButtonBase
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            setAnchorEl(e.currentTarget);
                                            setMobileDrawerOpen(false);
                                        }}
                                        animate={{ width: W_EXPANDED_CONTENT }}
                                        transition={{ duration: TRANS_DUR, ease: MOTION_EASING }}
                                        sx={{
                                            position: 'absolute', height: BTN_SIZE, borderRadius: 9999,
                                            left: HORIZONTAL_PADDING, display: 'flex', alignItems: 'center',
                                            justifyContent: 'flex-start', p: 0, overflow: 'hidden',
                                            '&:hover': { bgcolor: 'rgba(0,0,0,.04)' },
                                        }}
                                    >
                                        <Box sx={{
                                            width: BTN_SIZE, height: '100%', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(0,0,0,.05)' }}>
                                                <AccountIcon sx={controlIconSx} />
                                            </Avatar>
                                        </Box>
                                        <Box sx={{ pl: 0.5 }}>
                                            <Typography sx={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                                                账户信息
                                            </Typography>
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
    } else {
        // 桌面端侧边栏
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
                            bgcolor: '#f7f9fd',
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
                                {/* 修复点4：桌面端只传一个参数 */}
                                {mainNavItems.map(item => renderNavButton(item))}
                            </List>
                        </Box>

                        <Box sx={{ py: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {/* 修复点4：桌面端只传一个参数 */}
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
                                            title={!open ? "账户信息" : ''}
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
                                                            账户信息
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