/*****************************************************************
 *  MainLayout.tsx  ——  后台主框架（无顶栏）
 *  --------------------------------------------------------------
 *  • 左侧 SideNav 负责导航 + 用户头像浮窗
 *  • 右侧 <Outlet/> 显示子页面
 *****************************************************************/

import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'

/* 侧边栏组件（新增 onFakeLogout prop） */
import SideNav from '../components/SideNav'

interface MainLayoutProps {
    onFakeLogout: () => void
}

const MainLayout: React.FC<MainLayoutProps> = ({ onFakeLogout }) => (
    <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* 侧边栏（把登出函数交给它） */}
        <SideNav onFakeLogout={onFakeLogout} />

        {/* 主内容区 */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
            <Outlet />
        </Box>
    </Box>
)

export default MainLayout
