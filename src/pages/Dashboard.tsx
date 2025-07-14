/*
 * [文件用途说明]
 * - 此文件定义了应用的仪表盘（Dashboard）页面，是用户登录后看到的主界面。
 * - 它展示了欢迎信息和一组快捷操作按钮，用于导航到应用的其他核心功能区。
 *
 * [本次修改记录]
 * - 更新了快捷操作按钮的样式对象 `quickBtnSX`。
 * - 将按钮的背景色 `bgcolor` 和文字颜色 `color` 修改为与侧边栏一致的风格（浅灰背景，深灰文字），以增强整个应用的视觉统一性。
 * - 相应地更新了按钮的 `&:hover` 状态颜色。
 * - 【新增】在组件挂载时设置 `isPanelRelevant` 为 `false`，在卸载时设置为 `false`。
 */
import { Box, Typography, Button, Stack } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import StorageIcon from '@mui/icons-material/Storage'
import { useNavigate } from 'react-router-dom'
import type { JSX } from 'react'
import { useEffect } from 'react'; // 导入 useEffect
import { useLayout } from '../contexts/LayoutContext.tsx'; // 导入 useLayout

export default function Dashboard() {
    const nickname = 'chiangho'        // TODO: 从后端获取
    const navigate = useNavigate()
    const { setIsPanelRelevant } = useLayout(); // 获取 setIsPanelRelevant

    /* --- START OF MODIFICATION --- */
    const quickBtnSX = {
        height: 44,
        minWidth: 160,
        px: 4,
        borderRadius: 30,
        bgcolor: '#F0F4F9',      // 1. 背景色匹配侧边栏
        color: '#424242',        // 2. 文字/图标颜色匹配侧边栏
        boxShadow: 0,
        textTransform: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        columnGap: 1.5,
        '&:hover': {
            bgcolor: '#E1E5E9',   // 3. 定义匹配的悬停颜色
            boxShadow: 0
        },
        '& .MuiButton-startIcon': {
            margin: 0,
            display: 'inline-flex',
            alignItems: 'center',
        },
    } as const
    /* --- END OF MODIFICATION --- */

    useEffect(() => {
        // 组件挂载时：标记当前页面与面板不相关
        setIsPanelRelevant(false);

        // 组件卸载时：确保标记当前页面与面板不相关
        return () => {
            setIsPanelRelevant(false);
        };
    }, [setIsPanelRelevant]); // 依赖项

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
        <Box sx={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{
                width: { xs: '90%', md: '80%' },
                maxWidth: 1280,
                mx: 'auto',
                py: 4,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
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
                        sx={{ fontSize: '1.5rem' }}
                    >
                        欢迎回来，{nickname}！接下来想做些什么？
                    </Typography>
                </Stack>

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