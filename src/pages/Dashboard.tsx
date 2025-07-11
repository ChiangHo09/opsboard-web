import { Box, Typography, Button, Stack } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import StorageIcon from '@mui/icons-material/Storage'
import { useNavigate } from 'react-router-dom'
import type { JSX } from 'react'

export default function Dashboard() {
    const nickname = 'chiangho'        // TODO: 从后端获取
    const navigate = useNavigate()

    /* 公共按钮样式（保持不变） */
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

    /* 图标 + 微调文字（保持不变） */
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
        // Dashboard 页面现在在 MainLayout 的 MotionBox 内部渲染，需要自己添加内边距
        // 这个最外层的 Box 负责整体页面区域的填充和其固定的四边内边距 (p:3)
        <Box sx={{
            width: '100%',
            height: '100%',
            p: 3, // 保持所有方向的内边距，这是页面外边距
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* 这个 Box 负责内容的实际显示区域，通过响应式宽度和 mx: 'auto' 控制左右留白 */}
            {/* 同时，为其添加 py:4 (MUI 默认间距单位的 4 倍，即 32px) 作为内部上下边距 */}
            <Box sx={{
                width: { xs: '90%', md: '80%' }, // 小屏幕 90% 宽度 (各留 5% 留白)，中大屏幕 80% 宽度 (各留 10% 留白)
                maxWidth: 1280, // 内容最大宽度限制
                mx: 'auto', // 自动左右外边距，实现居中和两侧留白
                py: 4, // 新增：为内容区域添加上下内边距，提供视觉余地
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* 欢迎语 */}
                <Stack spacing={1} mb={6}>
                    <Typography
                        variant="h5"
                        sx={{ color: '#1976d2', fontSize: '2rem' }}
                    >
                        运维信息表
                    </Typography>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ fontSize: '1.5rem' }} // 字号已调大
                    >
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
