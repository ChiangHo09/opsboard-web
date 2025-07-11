import React from 'react';
import { Box, Typography } from '@mui/material'

const Settings: React.FC = () => (
    // 页面内容现在在 MainLayout 的 MotionBox 内部渲染，需要自己添加内边距
    <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4">设置 (Settings)</Typography>
        <Typography sx={{ mt: 2 }}>这里实现一些系统设置内容（还没想好要设置啥）</Typography>
    </Box>
)

export default Settings