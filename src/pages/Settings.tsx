import React from 'react';
import { Box, Typography } from '@mui/material'

const Settings: React.FC = () => (
    // 页面内容现在在 MainLayout 的 MotionBox 内部渲染，需要自己添加内边距
    <Box sx={{ width: '100%', height: '100%', p: 3, boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        {/* 新增的 Box，用于控制内容的响应式宽度和居中 */}
        <Box sx={{
            width: { xs: '90%', md: '80%' },
            maxWidth: 1280,
            mx: 'auto',
            py: 4, // 新增：为内容区域添加上下内边距
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Typography variant="h4">设置 (Settings)</Typography>
            <Typography sx={{ mt: 2 }}>这里实现一些系统设置内容（还没想好要设置啥）</Typography>
        </Box>
    </Box>
)

export default Settings
