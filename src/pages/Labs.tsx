import React from 'react';
import { Box, Typography } from '@mui/material'

const Labs: React.FC = () => (
    <Box sx={{ minHeight: '100%', p: 3 }}>
        <Typography variant="h4">实验性功能 (Labs)</Typography>
        <Typography sx={{ mt: 2 }}>这里实现一些不常用的功能，比如自定义内容的工单</Typography>
    </Box>
)

export default Labs