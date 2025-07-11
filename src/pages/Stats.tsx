import React from 'react';
import { Box, Typography } from '@mui/material'

const Stats: React.FC = () => (
    // 页面内容现在在 MainLayout 的 MotionBox 内部渲染，需要自己添加内边距
    <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4">统计信息 (Stats)</Typography>
        <Typography sx={{ mt: 2 }}>这里实现一些快速统计的内容，比如列表展示服务器磁盘空间、内存、操作系统</Typography>
    </Box>
)

export default Stats