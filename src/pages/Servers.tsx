import React from 'react';
import { Box, Typography } from '@mui/material'

const Servers: React.FC = () => (
    <Box sx={{ minHeight: '100%', p: 3 }}>
        <Typography variant="h4">服务器信息 (Servers)</Typography>
        <Typography sx={{ mt: 2 }}>这里实现服务器信息的展示和修改</Typography>
    </Box>
)

export default Servers