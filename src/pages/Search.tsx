import React from 'react'
import { Box, Typography } from '@mui/material'

const Search: React.FC = () => (
    <Box sx={{ minHeight: '100%', p: 3 }}>
        <Typography variant="h4">全局搜索 (Search)</Typography>
        <Typography sx={{ mt: 2 }}>这里实现搜索框与结果…</Typography>
    </Box>
)

export default Search
