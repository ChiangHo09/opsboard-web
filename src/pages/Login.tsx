/*****************************************************************
 *  src/pages/Login.tsx  ——  登录页（MUI v7 / Grid v2 语法）
 *  --------------------------------------------------------------
 *  • 根路径 “/” 渲染本页面
 *  • 调用父组件传入的 onFakeLogin() → 写入 localStorage → 跳后台
 *****************************************************************/

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* -------- MUI 组件（Grid 用默认导入 + size 写法） -------- */
import Grid        from '@mui/material/Grid'
import Box         from '@mui/material/Box'
import Card        from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField   from '@mui/material/TextField'
import Button      from '@mui/material/Button'
import Typography  from '@mui/material/Typography'
import LoginIcon   from '@mui/icons-material/Login'

/* 假登录回调由 App.tsx 传入 */
interface LoginProps {
    onFakeLogin: () => void
}

export default function Login({ onFakeLogin }: LoginProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    /* 提交登录表单：调用假登录 → 跳转后台首页 */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onFakeLogin()                 // 写 localStorage & setAuthed(true)
        navigate('/app/dashboard')    // 进入后台
    }

    return (
        <Grid container sx={{ minHeight: '100vh' }}>
            {/* ---------- 左侧品牌区 ---------- */}
            <Grid
                size={{ xs: 12, md: 7 }}    /* ✅ Grid v2：用 size 属性 */
                sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box textAlign="center">
                    <img src="/vite.svg" width={96} height={96} alt="logo" />
                    <Typography variant="h5" mt={3}>
                        运维信息管理系统
                    </Typography>
                </Box>
            </Grid>

            {/* ---------- 右侧表单区 ---------- */}
            <Grid
                size={{ xs: 12, md: 5 }}    /* ✅ 同样用 size */
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                }}
            >
                <Card elevation={3} sx={{ width: 360 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            用户登录
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="用户名"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoFocus
                            />

                            <TextField
                                fullWidth
                                margin="normal"
                                label="密码"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<LoginIcon />}
                                type="submit"
                                sx={{ mt: 2 }}
                            >
                                登录
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}
