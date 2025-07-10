/*****************************************************************
 *  src/components/SideNav.tsx
 *  --------------------------------------------------------------
 *  Google AI Studio 风格侧边栏
 *  - 圆形按钮锚点固定，展开时从圆心向右伸展
 *  - 默认收起；汉堡菜单控制展开/收起
 *  - 用户头像固定底端（hover/click 弹出信息、含退出）
 *  - 依赖: @mui/material @mui/icons-material framer-motion
 *****************************************************************/

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Drawer, Box, List, ListItem, ButtonBase, Typography,
    Tooltip, Avatar, Menu, MenuItem, Divider,
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
import type { ReactElement } from 'react';

/* ---------- 常量 ---------- */
const W_COLLAPSED = 64;
const W_EXPANDED = 220;
const BTN_SIZE = 40;
const GAP = 8;
const ICON_SIZE = 22;
const GRAY = '#424242';
const TRANS_DUR = 0.28;

const MOTION_EASING = [0.4, 0, 0.2, 1] as const;
// const CSS_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

const HORIZONTAL_PADDING = (W_COLLAPSED - BTN_SIZE) / 2;
const W_EXPANDED_CONTENT = W_EXPANDED - 2 * HORIZONTAL_PADDING;

// 修复: 将 Drawer 和 ButtonBase 包装成可动画的组件
const MotionDrawer = motion(Drawer);
const MotionButtonBase = motion(ButtonBase);

/* ---------- 导航定义 ---------- */
interface NavItem {
    label: string;
    path: string;
    icon: ReactElement;
}
const navItems: NavItem[] = [
    { label: '搜索', path: '/app/search', icon: <SearchIcon /> },
    { label: '概览', path: '/app/dashboard', icon: <DashboardIcon /> },
    { label: '服务器', path: '/app/servers', icon: <DnsIcon /> },
    { label: '更新日志', path: '/app/changelog', icon: <UpdateIcon /> },
    { label: '工单', path: '/app/tickets', icon: <AssignmentIcon /> },
    { label: '统计信息', path: '/app/stats', icon: <BarChartIcon /> },
    { label: '实验性功能', path: '/app/labs', icon: <ScienceIcon /> },
    { label: '设置', path: '/app/settings', icon: <SettingsIcon /> },
];

/* ---------- Props ---------- */
// 修复: 修改 Props，使其成为受控组件
interface SideNavProps {
    open: boolean;
    onToggle: () => void;
    onFakeLogout: () => void;
}

/* ============================================================= */
// 修复: 接收 open 和 onToggle 从 props
export default function SideNav({ open, onToggle, onFakeLogout }: SideNavProps) {
    // 内部状态 anchorEl 保持不变
    const { pathname } = useLocation();
    const nav = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const navItemIconSx = { fontSize: ICON_SIZE, color: GRAY, position: 'relative', top: '3px' };
    const controlIconSx = { fontSize: ICON_SIZE, color: GRAY, position: 'relative', top: '1px' };

    return (
        // 修复: 使用 MotionDrawer 并通过 animate prop 控制宽度
        <MotionDrawer
            variant="permanent"
            animate={{ width: open ? W_EXPANDED : W_COLLAPSED }}
            transition={{ duration: TRANS_DUR, ease: MOTION_EASING }}
            sx={{
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    // 修复: 移除这里的 CSS transition，让 Framer Motion 完全接管
                    width: 'inherit', // 继承 MotionDrawer 的宽度
                    bgcolor: '#f7f9fd',
                    border: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                },
            }}
        >
            <Box sx={{ py: `${GAP}px` }}>
                <ListItem disablePadding sx={{ position: 'relative', height: BTN_SIZE }}>
                    <Tooltip title={open ? '收起' : '展开'} placement="right">
                        {/* 修复: onClick 调用从 props 传入的 onToggle */}
                        <MotionButtonBase
                            onClick={onToggle}
                            animate={{ width: open ? W_EXPANDED_CONTENT : BTN_SIZE }}
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
                                <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: TRANS_DUR }}>
                                    <MenuIcon sx={controlIconSx} />
                                </motion.div>
                            </Box>
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
                    </Tooltip>
                </ListItem>
            </Box>

            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                    {navItems.map(({ label, path, icon }) => {
                        const selected = pathname.startsWith(path);
                        return (
                            <ListItem key={path} disablePadding sx={{ position: 'relative', height: BTN_SIZE }}>
                                <Tooltip title={!open ? label : ''} placement="right">
                                    <MotionButtonBase
                                        onClick={() => nav(path)}
                                        animate={{ width: open ? W_EXPANDED_CONTENT : BTN_SIZE }}
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
                                        <Box sx={{
                                            width: BTN_SIZE, height: '100%', display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <Box component="span" sx={navItemIconSx}>{icon}</Box>
                                        </Box>
                                        <Box sx={{ pl: 0.5 }}>
                                            <AnimatePresence>
                                                {open && (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.2, ease: 'easeOut' }}
                                                    >
                                                        <Typography sx={{ fontSize: 14, whiteSpace: 'nowrap' }}>
                                                            {label}
                                                        </Typography>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Box>
                                    </MotionButtonBase>
                                </Tooltip>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Box sx={{ py: `${GAP}px` }}>
                <ListItem disablePadding sx={{ position: 'relative', height: BTN_SIZE }}>
                    <Tooltip title={!open ? "账户信息" : ''} placement="right">
                        <MotionButtonBase
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            animate={{ width: open ? W_EXPANDED_CONTENT : BTN_SIZE }}
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
                    </Tooltip>
                </ListItem>
            </Box>

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
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> 退出登录
                </MenuItem>
            </Menu>
        </MotionDrawer>
    );
}