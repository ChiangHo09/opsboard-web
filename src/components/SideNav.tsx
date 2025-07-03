// src/components/SideNav.tsx
// -----------------------------------------------------------------------------
// 侧边栏：按钮固定 80×80，上下间距 4px，左右间距 8px，无缩放；头像弹出账户菜单
// -----------------------------------------------------------------------------

// 1. React 相关 ----------------------------------------------------------------
import React, { useState, type MouseEvent } from 'react'


// 2. MUI 组件 -------------------------------------------------------------------
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    Typography,
    Avatar,
    Tooltip,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
} from '@mui/material'

// 3. MUI 图标 -------------------------------------------------------------------
import SearchIcon        from '@mui/icons-material/Search'
import DashboardIcon     from '@mui/icons-material/Dashboard'
import DnsIcon           from '@mui/icons-material/Dns'
import UpdateIcon        from '@mui/icons-material/Update'
import AssignmentIcon    from '@mui/icons-material/Assignment'
import ScienceIcon       from '@mui/icons-material/Science'
import SettingsIcon      from '@mui/icons-material/Settings'
import LogoutIcon        from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

// 4. 类型定义 -------------------------------------------------------------------
interface NavItem {
    label: string
    path:  string
    icon?: React.ReactNode
}

// 5. 导航数据 -------------------------------------------------------------------
const navItems: NavItem[] = [
    { label: '搜索',         path: '/search',    icon: <SearchIcon /> },
    { label: '概览',         path: '/dashboard', icon: <DashboardIcon /> },
    { label: '服务器',       path: '/servers',   icon: <DnsIcon /> },
    { label: '更新日志',     path: '/changelog', icon: <UpdateIcon /> },
    { label: '工单',         path: '/tickets',   icon: <AssignmentIcon /> },
    { label: '实验性\n功能', path: '/labs',      icon: <ScienceIcon /> },
    { label: '设置',         path: '/settings',  icon: <SettingsIcon /> },
]

// 6. 样式常量 -------------------------------------------------------------------
const BASE_WIDTH = 96          // 侧边栏宽度
const BTN_SIZE   = 80          // 按钮边长
const btnStyle = {             // 主按钮统一样式
    width:       BTN_SIZE,
    height:      BTN_SIZE,
    minWidth:    BTN_SIZE,
    minHeight:   BTN_SIZE,
    maxWidth:    BTN_SIZE,
    maxHeight:   BTN_SIZE,
    mx: 1,                       // 左右外边距 8px
    my: 0.5,                     // 上下外边距 4px（与你要求的相同）
    p: 0,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    boxSizing: 'border-box',
    overflow: 'hidden',
}

// 7. 组件 -----------------------------------------------------------------------
const SideNav: React.FC = () => {
    const [selected, setSelected] = useState<string>('/dashboard')
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const menuOpen = Boolean(anchorEl)

    // 点击导航按钮
    const handleMainClick = (item: NavItem) => setSelected(item.path)

    // 头像菜单
    const handleAvatarOpen = (e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)
    const handleMenuClose  = () => setAnchorEl(null)
    const handleLogout     = () => { handleMenuClose(); alert('退出登录') } // TODO: 替换真实逻辑

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: BASE_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: BASE_WIDTH,
                        backgroundColor: '#1976d2',
                        borderRight: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    },
                }}
            >
                {/* 顶部导航按钮列表 */}
                <Box sx={{ mt: 1 }}>
                    <List disablePadding>
                        {navItems.map(item => (
                            <ListItem key={item.path} disablePadding sx={{ justifyContent: 'center' }}>
                                <ListItemButton
                                    onClick={() => handleMainClick(item)}
                                    sx={{
                                        ...btnStyle,
                                        backgroundColor: selected === item.path ? '#64b5f6' : 'transparent',
                                        transition: 'background-color 0.3s ease',
                                        '&:hover': { backgroundColor: '#64b5f6' }, // 悬停仅变色
                                    }}
                                >
                                    {item.icon}
                                    <Typography
                                        sx={{
                                            fontSize: 12,
                                            textAlign: 'center',
                                            whiteSpace: 'pre-line',
                                            lineHeight: 1.2,
                                            mt: 0.5,
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* 底部头像与账户菜单 */}
                <Box sx={{ textAlign: 'center', pb: 3 }}>
                    <Tooltip title="账户菜单" placement="right">
                        <Avatar
                            sx={{
                                mx: 'auto', mb: 1,
                                bgcolor: '#64b5f6',
                                width: 40, height: 40,
                                cursor: 'pointer',
                            }}
                            onClick={handleAvatarOpen}
                            onMouseEnter={handleAvatarOpen}
                        >
                            <AccountCircleIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                        </Avatar>
                    </Tooltip>

                    {/* 弹出菜单 */}
                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
                        disableAutoFocusItem
                    >
                        <MenuItem disabled>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                用户信息
                            </Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            退出登录
                        </MenuItem>
                    </Menu>
                </Box>
            </Drawer>
        </Box>
    )
}

export default SideNav
