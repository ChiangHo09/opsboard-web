import React from 'react';
import { Box, Typography } from '@mui/material'

const Settings: React.FC = () => (
    <Box sx={{ minHeight: '100%', p: 3 }}>
        <Typography variant="h4">设置 (Settings)</Typography>
        <Typography sx={{ mt: 2 }}>这里实现一些系统设置内容（还没想好要设置啥）</Typography>
    </Box>
)

export default Settings