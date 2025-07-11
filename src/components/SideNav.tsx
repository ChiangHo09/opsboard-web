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

import React, { useState } from 'react'; // 修复: 确保 React 被正确导入，解决 UMD global 和 JSX 类型问题
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Drawer, Box, List, ListItem, ButtonBase, Typography,
    Tooltip, Avatar,
    Menu, // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Menu 组件在 JSX 中使用
    MenuItem, // eslint-disable-next-line @typescript-eslint/no-unused-vars -- MenuItem 组件在 JSX 中使用
    Divider, // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Divider 组件在 JSX 中使用
    IconButton,
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
    Logout as LogoutIcon, // eslint-disable-next-line @typescript-eslint/no-unused-vars -- LogoutIcon 在 MenuItem 中使用
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReactElement, MouseEvent, JSX } from 'react'; // 引入 JSX 类型以明确表示 JSX 元素

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
const MOBILE_TOP_BAR_HEIGHT = 56; // 移动端顶部栏高度

const MotionDrawer = motion(Drawer);
const MotionButtonBase = motion(ButtonBase);

/* ---------- 导航定义 ---------- */
interface NavItem {
    label: string;
    path: string;
    icon: ReactElement; // icon 仍是 ReactElement
    isMobileTopBarItem?: boolean; // 新增：标记是否为移动端顶部栏显示项
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
    // 账户信息作为特殊项，其逻辑在渲染部分单独处理，但在概念上它也是移动端顶部栏项
];

/* ---------- Props ---------- */
interface SideNavProps {
    open: boolean; // 桌面端侧边栏的展开状态
    onToggle: () => void; // 桌面端侧边栏的切换函数
    onFakeLogout: () => void;
}

/* ============================================================= */
export default function SideNav({ open, onToggle, onFakeLogout }: SideNavProps) {
    const { pathname } = useLocation();
    const nav = useNavigate();
    const theme = useTheme();
    // 判断是否为移动设备（根据 md 断点，即宽度小于 900px）
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- anchorEl 变量用于控制 Menu 组件的 open 状态
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false); // 控制移动端侧边抽屉的打开状态

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

    // 渲染导航按钮的通用函数
    // 修复: 明确返回类型为 JSX.Element
    const renderNavButton = (item: NavItem, onClickCallback?: () => void): JSX.Element => {
        const selected = pathname.startsWith(item.path);
        return (
            <ListItem key={item.path} disablePadding sx={{ position: 'relative', height: BTN_SIZE }}>
                <MotionButtonBase
                    onClick={(e) => {
                        e.stopPropagation();
                        nav(item.path);
                        if (onClickCallback) onClickCallback(); // 如果有回调，执行回调（例如关闭移动抽屉）
                    }}
                    // 桌面端动画控制，移动端抽屉内的按钮始终按展开状态渲染
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
                        title={!open && !isMobile ? item.label : ''} // 桌面端收起时显示，移动端不显示
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
                            {(open || isMobile) && ( // 桌面端展开或移动端时显示文本
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

    // 统一处理账户信息菜单，无论桌面端还是移动端
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
                // eslint-disable-next-line @typescript-eslint/no-unused-vars -- onFakeLogout prop 在此处被调用
                onClick={() => { setAnchorEl(null); onFakeLogout(); }}
                sx={{ color: 'error.main' }}
            >
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                退出登录
            </MenuItem>
        </Menu>
    );

    // 如果是移动设备
    if (isMobile) {
        return (
            <React.Fragment>
                {/* 移动端顶部导航栏 */}
                <Box
                    sx={{
                        position: 'fixed', // 固定在屏幕顶部
                        top: 0,
                        left: 0,
                        right: 0,
                        height: MOBILE_TOP_BAR_HEIGHT, // 固定高度
                        bgcolor: 'background.paper', // 背景色
                        zIndex: theme.zIndex.appBar + 1, // 确保在其他内容之上
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        px: 2, // 水平内边距
                        boxShadow: 1, // 底部阴影，提供立体感
                    }}
                >
                    {/* 左侧汉堡菜单按钮 */}
                    <IconButton onClick={() => setMobileDrawerOpen(true)} aria-label="open drawer">
                        <MenuIcon sx={controlIconSx} />
                    </IconButton>
                    {/* 右侧功能图标 */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {bottomNavItems
                            .filter(item => item.isMobileTopBarItem) // 筛选出需要在顶部栏显示的项
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
                        {/* 用户头像按钮 */}
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

                {/* 移动端侧边抽屉（展开后的侧边栏） */}
                <MotionDrawer
                    variant="temporary" // 临时抽屉，悬浮在内容上方
                    open={mobileDrawerOpen}
                    onClose={() => setMobileDrawerOpen(false)} // 点击外部或 Esc 键关闭
                    ModalProps={{ keepMounted: true }} // 优化性能，在关闭时卸载 DOM
                    // Framer Motion 动画与桌面版侧边栏动画保持一致
                    animate={{ width: mobileDrawerOpen ? W_EXPANDED : 0 }}
                    transition={{ duration: TRANS_DUR, ease: MOTION_EASING }}
                    sx={{
                        flexShrink: 0, // 确保 Drawer 不收缩，避免移动端布局问题
                        '& .MuiDrawer-paper': {
                            width: W_EXPANDED, // 显式设置展开宽度
                            bgcolor: '#f7f9fd',
                            border: 'none',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            // 留出顶部栏的空间
                            pt: `${MOBILE_TOP_BAR_HEIGHT}px`,
                        },
                    }}
                >
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* 主要导航项列表 */}
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', py: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {mainNavItems.map(item => renderNavButton(item, () => setMobileDrawerOpen(false)))}
                            </List>
                        </Box>
                        {/* 底部导航项列表 (排除已在顶部栏显示的) */}
                        <Box sx={{ py: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {bottomNavItems
                                    .filter(item => !item.isMobileTopBarItem) // 排除已在顶部栏显示的项
                                    .map(item => renderNavButton(item, () => setMobileDrawerOpen(false)))}
                                {/* 账户信息项，仅在侧边栏显示，且点击后关闭抽屉 */}
                                <ListItem disablePadding sx={{ position: 'relative', height: BTN_SIZE }}>
                                    <MotionButtonBase
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            setAnchorEl(e.currentTarget);
                                            setMobileDrawerOpen(false); // 点击账户信息后关闭抽屉
                                        }}
                                        animate={{ width: W_EXPANDED_CONTENT }} // 在抽屉内总是展开
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
                {/* 账户信息菜单 (在移动端和桌面端都渲染) */}
                {accountMenu}
            </React.Fragment>
        );
    } else {
        // 桌面端侧边栏 (保持原有逻辑不变)
        return (
            <React.Fragment>
                <MotionDrawer
                    variant="permanent" // 永久抽屉，推动内容
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
                                {mainNavItems.map(renderNavButton)}
                            </List>
                        </Box>

                        <Box sx={{ py: `${GAP}px` }}>
                            <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                                {bottomNavItems.map(renderNavButton)}
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
                {accountMenu} {/* 桌面端也渲染账户菜单 */}
            </React.Fragment>
        );
    }
}