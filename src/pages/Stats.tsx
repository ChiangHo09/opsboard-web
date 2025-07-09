import React from 'react';
import { Box, Typography } from '@mui/material'

const Stats: React.FC = () => (
    <Box sx={{ minHeight: '100%', p: 3 }}>
        <Typography variant="h4">统计信息 (Stats)</Typography>
        <Typography sx={{ mt: 2 }}>这里实现一些快速统计的内容，比如列表展示服务器磁盘空间、内存、操作系统</Typography>
    </Box>
)

export default Stats