/**
 * @fileOverview 运维仪表盘页面组件
 * @description 位于路径: E:\ProjectFiles\opsboard-web\src\pages\Dashboard.tsx
 * @created 2023-10-15（可根据实际创建时间修改）
 * @author 开发者姓名（可根据实际情况填写）
 *
 * @feature 主要功能：
 * - 显示欢迎语及用户昵称（TODO：需对接后端接口获取真实数据）
 * - 提供三个核心操作入口：
 *   1. 新建更新记录
 *   2. 生成工单
 *   3. 查看服务器信息
 *
 * @structure 组件构成：
 * - 使用Material UI基础组件构建界面
 * - 自定义按钮样式对象 quickBtnSX 统一视觉规范
 * - 标签生成函数 label 实现图标+文字标准化布局
 * - 响应式布局适配不同屏幕尺寸
 *
 * @todo 待办事项：
 * - 替换测试用的 'chiangho' 为真实用户数据（参考 nickname 变量）
 * - 添加按钮点击事件处理逻辑
 * - 补充页面数据统计模块（当前仅为静态UI）
 */


import { Box, Typography, Button, Stack } from '@mui/material'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import StorageIcon from '@mui/icons-material/Storage'
import type { JSX } from "react";


export default function Dashboard() {
    const nickname = 'chiangho' // TODO: 从后端获取

    /* 通用按钮样式 */
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

    /* 统一生成按钮内容：图标 + 微调后的文字 */
    const label = (icon: JSX.Element, text: string) => (
        <>
            {icon}
            <Typography
                component="span"
                variant="button"
                sx={{
                    lineHeight: 1,
                    transform: 'translateY(1px)', // ↓ 文字整体向下 1 px
                    fontWeight: 500,
                }}
            >
                {text}
            </Typography>
        </>
    )

    return (
        <Box sx={{ flex: 1, bgcolor: 'grey.50', py: 6 }}>
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
                    <Button variant="contained" disableElevation sx={quickBtnSX}>
                        {label(<NoteAddIcon />, '新建更新记录')}
                    </Button>

                    <Button variant="contained" disableElevation sx={quickBtnSX}>
                        {label(<ReceiptLongIcon />, '生成工单')}
                    </Button>

                    <Button variant="contained" disableElevation sx={quickBtnSX}>
                        {label(<StorageIcon />, '查看服务器信息')}
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
