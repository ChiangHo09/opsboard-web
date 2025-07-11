import React from 'react'
import { Box, Typography } from '@mui/material'

const Search: React.FC = () => (
    // 外层 Box: 不再需要 p:3，因为显示区域的边距现在由 MainLayout 中的白色背景 Box 提供。
    <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        {/* 内层 Box，用于控制内容的响应式宽度和居中，并添加内部上下边距 */}
        <Box sx={{
            width: { xs: '90%', md: '80%' },
            maxWidth: 1280,
            mx: 'auto',
            py: 4, // 为内容区域添加上下内边距
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="h4">全局搜索 (Search)</Typography>
            <Typography sx={{ mt: 2 }}>这里实现搜索框与结果…</Typography>
        </Box>
    </Box>
)

export default Search