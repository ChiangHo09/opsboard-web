import React from 'react';
import { Box, Typography } from '@mui/material'

const Changelog: React.FC = () => (
    // 页面内容现在在 MainLayout 的 MotionBox 内部渲染，需要自己添加内边距
    <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        {/* 新增的 Box，用于控制内容的响应式宽度和居中 */}
        <Box sx={{
            width: { xs: '90%', md: '80%' }, // 小屏幕 90% 宽度 (各留 5% 留白)，中大屏幕 80% 宽度 (各留 10% 留白)
            maxWidth: 1280, // 内容最大宽度限制
            mx: 'auto', // 自动左右外边距，实现居中和两侧留白
            py: 4, // 新增：为内容区域添加上下内边距
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="h4">更新日志 (Changelog)</Typography>
            <Typography sx={{ mt: 2 }}>这里实现更新日志的记录/查询/生成工单</Typography>
        </Box>
    </Box>
)

export default Changelog