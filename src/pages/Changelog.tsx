import React from 'react';
import { Box, Typography } from '@mui/material'

const Changelog: React.FC = () => (
    <Box sx={{ minHeight: '100%', p: 3 }}>
        <Typography variant="h4">更新日志 (Changelog)</Typography>
        <Typography sx={{ mt: 2 }}>这里实现更新日志的记录/查询/生成工单</Typography>
    </Box>
)

export default Changelog