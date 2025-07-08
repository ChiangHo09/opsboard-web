/*****************************************************************
 *  仪表盘首页 —— Material Design 3 风格（兼容 MUI v7 Grid v2）
 *****************************************************************/

/* -------- MUI 组件 -------- */
import Box        from '@mui/material/Box'
import Grid       from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button     from '@mui/material/Button'
import Stack      from '@mui/material/Stack'

/* -------- 图标 -------- */
import NoteAddIcon     from '@mui/icons-material/NoteAdd'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import StorageIcon     from '@mui/icons-material/Storage'

export default function Dashboard() {
    const nickname = 'chiangho' // TODO: 从后端获取

    return (
        <Box sx={{ flex: 1, bgcolor: 'grey.50', py: 6 }}>
            <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3 }}>
                {/* 欢迎语 */}
                <Stack spacing={1} mb={6}>
                    <Typography variant="headlineMedium">
                        运维信息管理系统
                    </Typography>
                    <Typography variant="titleMedium" color="text.secondary">
                        欢迎回来，{nickname}！接下来想做些什么？
                    </Typography>
                </Stack>

                {/* 快捷按钮区 */}
                <Grid container spacing={3} justifyContent="flex-start">
                    {/* 新建更新记录 */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<NoteAddIcon />}
                            sx={{ height: 160, borderRadius: 3 }}
                            onClick={() => {/* TODO: /changelog/new */}}
                        >
                            新建更新记录
                        </Button>
                    </Grid>

                    {/* 生成工单 */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<ReceiptLongIcon />}
                            sx={{ height: 160, borderRadius: 3 }}
                            onClick={() => {/* TODO: /tickets/new */}}
                        >
                            生成工单
                        </Button>
                    </Grid>

                    {/* 查看服务器信息 */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<StorageIcon />}
                            sx={{ height: 160, borderRadius: 3 }}
                            onClick={() => {/* TODO: /servers */}}
                        >
                            查看服务器信息
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}
