/*****************************************************************
 * Dashboard —— 欢迎语 + 右侧功能按钮
 *****************************************************************/
import React from 'react'
import { Box, Typography, Button } from '@mui/material'

const sideBlue = '#1976d2'
const btnStyle = {
    flex: '1 1 200px',
    minWidth: 120,
    height: 200,
    borderRadius: 3,
    bgcolor: sideBlue,
    color: '#fff',
    fontSize: 18,
    '&:hover': { bgcolor: '#1565c0' },
}

const Dashboard: React.FC = () => (
    <Box sx={{ minHeight: '100%' }}>
        <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: 4,
        }}>
            {/* 左侧文字 */}
            <Box sx={{ flex: '0 1 360px', minWidth: 260 }}>
                <Typography variant="h3" gutterBottom>运维信息表</Typography>
                <Typography variant="h5" gutterBottom>
                    欢迎回来，chiangho，接下来做什么？
                </Typography>
            </Box>

            {/* 右侧按钮 */}
            <Box sx={{
                ml: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: 4,
                maxWidth: 800,
            }}>
                <Button sx={btnStyle}>新建更新记录</Button>
                <Button sx={btnStyle}>生成工单</Button>
                <Button sx={btnStyle}>查看服务器信息</Button>
            </Box>
        </Box>
    </Box>
)

export default Dashboard
