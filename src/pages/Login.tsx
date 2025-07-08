/*****************************************************************
 *  登录页 —— Material Design 3 风格（兼容 MUI v7 Grid v2）
 *****************************************************************/

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* -------- MUI 组件（默认导入写法，避免 re-export 差异） -------- */
import Grid         from '@mui/material/Grid'
import Box          from '@mui/material/Box'
import Card         from '@mui/material/Card'
import CardContent  from '@mui/material/CardContent'
import Typography   from '@mui/material/Typography'
import TextField    from '@mui/material/TextField'
import Button       from '@mui/material/Button'

/* -------- 图标 -------- */
import LoginIcon from '@mui/icons-material/Login'

export default function Login() {
    /* 本地状态 */
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    /* 路由跳转 */
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        /* TODO: 调用后端登录接口 */
        navigate('/dashboard')
    }

    return (
        <Grid container sx={{ minHeight: '100vh' }}>
            {/* 左侧品牌区：小屏 100%，≥960px 占 7/12 */}
            <Grid
                size={{ xs: 12, md: 7 }}
                sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                }}
            >
                <Box textAlign="center">
                    <img src="/vite.svg" width={96} height={96} alt="Logo" />
                    <Typography variant="headlineMedium" mt={3}>
                        运维信息管理系统
                    </Typography>
                    <Typography sx={{ opacity: 0.85 }}>
                        Offline · Cross-platform · One-click Start
                    </Typography>
                </Box>
            </Grid>

            {/* 右侧表单区：小屏 100%，≥960px 占 5/12 */}
            <Grid
                size={{ xs: 12, md: 5 }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                }}
            >
                <Card elevation={3} sx={{ width: 360 }}>
                    <CardContent>
                        <Typography variant="titleLarge" gutterBottom>
                            用户登录
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                label="用户名"
                                fullWidth
                                margin="normal"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoComplete="username"
                                autoFocus
                            />

                            <TextField
                                label="密码"
                                fullWidth
                                margin="normal"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                startIcon={<LoginIcon />}
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
