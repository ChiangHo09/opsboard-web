/*****************************************************************
 * Dashboard 页面
 * --------------------------------------------------------------
 * 只专注于业务内容，由 MainLayout 负责侧栏与整体布局。
 * 已移除浅蓝色背景块，使用默认背景。
 *****************************************************************/

import React from 'react'
import { Box, Typography } from '@mui/material'

const Dashboard: React.FC = () => {
    const username = 'chiangho' // TODO: 登录后改为实际用户

    return (
        <Box sx={{ minHeight: '100%', p: 3 /* 内边距 24px */ }}>
            <Typography variant="h4" gutterBottom>
                欢迎回来，{username}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                接下来要做什么
            </Typography>

            {/* TODO: 在此放置仪表盘图表 / 快捷入口等组件 */}
        </Box>
    )
}

export default Dashboard
