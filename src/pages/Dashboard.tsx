/*****************************************************************
 *  src/pages/Dashboard.tsx
 *  --------------------------------------------------------------
 *  • 三个快捷按钮点击后跳转至：
 *      - /app/changelog   （更新日志页）
 *      - /app/tickets     （工单页）
 *      - /app/servers     （服务器页）
 *****************************************************************/

import { Box, Typography, Button, Stack } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import StorageIcon from '@mui/icons-material/Storage'
import { useNavigate } from 'react-router-dom'
import type { JSX } from 'react'

export default function Dashboard() {
    const nickname = 'chiangho'        // TODO: 从后端获取
    const navigate = useNavigate()     // ← 路由跳转

    /* 公共按钮样式 */
    const quickBtnSX = {
        height: 44,
        minWidth: 160,
        px: 4,
        borderRadius: 30,
        bgcolor: '#1976d2',
        color: '#fff',
        boxShadow: 0,
        textTransform: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 1.5,
        '&:hover': { bgcolor: '#1565c0', boxShadow: 0 },
        '& .MuiButton-startIcon': {
            margin: 0,
            display: 'inline-flex',
            alignItems: 'center',
        },
    } as const

    /* 图标 + 微调文字 */
    const label = (icon: JSX.Element, text: string) => (
        <>
            {icon}
            <Typography
                component="span"
                variant="button"
                sx={{ lineHeight: 1, transform: 'translateY(1px)', fontWeight: 500 }}
            >
                {text}
            </Typography>
        </>
    )

    return (
        <Box sx={{ flex: 1, py: 6 }}>
            <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3 }}>
                {/* 欢迎语 */}
                <Stack spacing={1} mb={6}>
                    <Typography variant="h5" sx={{ color: '#1976d2' }}>
                        运维信息表
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        欢迎回来，{nickname}！接下来想做些什么？
                    </Typography>
                </Stack>

                {/* 快捷按钮区 */}
                <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={quickBtnSX}
                        onClick={() => navigate('/app/changelog')}
                        startIcon={<NoteAddIcon />}
                    >
                        {label(<></>, '新建更新记录')}
                    </Button>

                    <Button
                        variant="contained"
                        disableElevation
                        sx={quickBtnSX}
                        onClick={() => navigate('/app/tickets')}
                        startIcon={<ReceiptLongIcon />}
                    >
                        {label(<></>, '生成工单')}
                    </Button>

                    <Button
                        variant="contained"
                        disableElevation
                        sx={quickBtnSX}
                        onClick={() => navigate('/app/servers')}
                        startIcon={<StorageIcon />}
                    >
                        {label(<></>, '查看服务器信息')}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

