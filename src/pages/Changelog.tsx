import React from 'react';
import { Box, Typography } from '@mui/material'

const Changelog: React.FC = () => (
    // 外层 Box: 不再需要 p:3，因为显示区域的边距现在由 MainLayout 中的白色背景 Box 提供。
    <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        {/* 内层 Box，用于控制内容的响应式宽度和居中，并添加内部上下边距 */}
        <Box sx={{
            width: { xs: '90%', md: '80%' }, // 小屏幕 90% 宽度 (各留 5% 留白)，中大屏幕 80% 宽度 (各留 10% 留白)
            maxWidth: 1280, // 内容最大宽度限制
            mx: 'auto', // 自动左右外边距，实现居中和两侧留白
            py: 4, // 为内容区域添加上下内边距
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
