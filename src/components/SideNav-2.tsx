// /*****************************************************************
//  *  src/components/SideNav.tsx —— 侧边导航（Drawer）
//  *  --------------------------------------------------------------
//  *  设计目标（Material Design 3）：
//  *    1. 桌面端：Permanent Drawer（固定侧栏）
//  *       - 宽度 240px，背景用 `surfaceContainer`，与 AppBar 视觉分层
//  *    2. 移动端：Swipeable Drawer（滑入 / 滑出）
//  *       - 手势关闭，保留波纹反馈
//  *    3. 支持“当前路由高亮”+ 图标 + ripple
//  *
// //  *  使用方法：
// //  *    <SideNav
// //  *       mobileOpen={mobileOpen}
// //  *       onClose={() => setMobileOpen(false)}
// //  *       variant="permanent" /* or "temporary" */
// // *    />
// // *****************************************************************/
//
// import { Fragment } from 'react'
// import { NavLink }  from 'react-router-dom'
//
// /* -------- MUI 单独导入，可避免 re-export 不一致 -------- */
// import SwipeableDrawer from '@mui/material/SwipeableDrawer'
// import List            from '@mui/material/List'
// import ListItemButton  from '@mui/material/ListItemButton'
// import ListItemIcon    from '@mui/material/ListItemIcon'
// import ListItemText    from '@mui/material/ListItemText'
// import Divider         from '@mui/material/Divider'
// import Box             from '@mui/material/Box'
// import Typography      from '@mui/material/Typography'
//
// /* -------- MUI Icons -------- */
// import DashboardIcon   from '@mui/icons-material/Dashboard'
// import StorageIcon     from '@mui/icons-material/Storage'
// import NoteAddIcon     from '@mui/icons-material/NoteAdd'
// import ReceiptIcon     from '@mui/icons-material/ReceiptLong'
// import AssessmentIcon  from '@mui/icons-material/Assessment'
// import ScienceIcon     from '@mui/icons-material/Science'
// import SettingsIcon    from '@mui/icons-material/Settings'
// import SearchIcon      from '@mui/icons-material/Search'
//
// /* -------- 类型定义 -------- */
// interface SideNavProps {
//     /** 移动端 Drawer 是否打开 */
//     mobileOpen: boolean
//     /** 关闭 Drawer 的回调 */
//     onClose: () => void
//     /** Drawer 类型：permanent | temporary */
//     variant?: 'permanent' | 'temporary'
// }
//
// /* -------- 菜单项配置 -------- */
// const navItems = [
//     { label: '搜索',          path: '/search',    icon: <SearchIcon /> },
//     { label: '概览',        path: '/dashboard', icon: <DashboardIcon /> },
//     { label: '服务器',        path: '/servers',   icon: <StorageIcon /> },
//     { label: '更新记录',      path: '/changelog', icon: <NoteAddIcon /> },
//     { label: '工单管理',      path: '/tickets',   icon: <ReceiptIcon /> },
//     { label: '统计分析',      path: '/stats',     icon: <AssessmentIcon /> },
//     { label: '实验性功能',        path: '/labs',      icon: <ScienceIcon /> },
//     { label: '系统设置',      path: '/settings',  icon: <SettingsIcon /> },
// ]
//
//
// /* -------- 组件实现 -------- */
// export default function SideNav({
//                                     mobileOpen,
//                                     onClose,
//                                     variant = 'permanent',   // 默认桌面端固定侧栏
//                                 }: SideNavProps) {
//     /* Drawer 宽度常量 */
//     const drawerWidth = 240
//
//     /* 抽屉内容：Logo + NavList */
//     const drawerContent = (
//         <Fragment>
//             {/* 顶部 Logo / 标题 */}
//             <Box
//                 sx={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     height: 64,
//                 }}
//             >
//                 <Typography variant="titleLarge">OpsBoard</Typography>
//             </Box>
//             <Divider />
//
//             {/* 菜单列表 */}
//             <List>
//                 {navItems.map(({ label, path, icon }) => (
//                     <ListItemButton
//                         key={path}
//                         /* NavLink 负责路由切换 & active 状态 */
//                         component={NavLink}
//                         to={path}
//                         sx={{
//                             '&.active': {
//                                 bgcolor: 'primary.container',        // M3 建议选 surfaceContainerHigh
//                                 color: 'primary.main',
//                                 '& .MuiListItemIcon-root': {
//                                     color: 'primary.main',
//                                 },
//                             },
//                         }}
//                     >
//                         <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
//                         <ListItemText primary={label} />
//                     </ListItemButton>
//                 ))}
//             </List>
//         </Fragment>
//     )
//
//     /* ========== 选择 Drawer 类型 ========== */
//     return variant === 'permanent' ? (
//         /* 桌面端固定侧栏 */
//         <Box
//             component="nav"
//             sx={{
//                 width: { md: drawerWidth },      // 仅 >=960px 固定宽度
//                 flexShrink: { md: 0 },
//             }}
//         >
//             <SwipeableDrawer
//                 variant="permanent"
//                 open
//                 onClose={onClose}
//                 onOpen={() => { /* required by SwipeableDrawer */ }}
//                 ModalProps={{ keepMounted: true }}       // 性能优化：移动端保留 DOM
//                 sx={{
//                     '& .MuiDrawer-paper': {
//                         width: drawerWidth,
//                         boxSizing: 'border-box',
//                         borderRight: 'none',                 // 取消旧版 1px 边框
//                     },
//                 }}
//             >
//                 {drawerContent}
//             </SwipeableDrawer>
//         </Box>
//     ) : (
//         /* 移动端临时抽屉 */
//         <SwipeableDrawer
//             variant="temporary"
//             open={mobileOpen}
//             onOpen={() => {}}
//             onClose={onClose}
//             ModalProps={{ keepMounted: true }}         // iOS 优化
//             sx={{
//                 '& .MuiDrawer-paper': {
//                     width: drawerWidth,
//                     boxSizing: 'border-box',
//                 },
//             }}
//         >
//             {drawerContent}
//         </SwipeableDrawer>
//     )
// }
