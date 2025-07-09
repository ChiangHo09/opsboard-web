import React from 'react';
import { Box, Typography } from '@mui/material'

const Tickets: React.FC = () => (
    <Box sx={{ minHeight: '100%', p: 3 }}>
        <Typography variant="h4">工单 (Tickets)</Typography>
        <Typography sx={{ mt: 2 }}>这里实现一些快速制作工单的功能，通过更新记录直接生成工单</Typography>
    </Box>
)

export default Tickets