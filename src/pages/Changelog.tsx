import React from 'react';
import { Box, Typography } from '@mui/material'

const Changelog: React.FC = () => (
    // 页面内容现在在 MainLayout 的 MotionBox 内部渲染，需要自己添加内边距
    <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4">更新日志 (Changelog)</Typography>
        <Typography sx={{ mt: 2 }}>这里实现更新日志的记录/查询/生成工单</Typography>
    </Box>
)

export default Changelog