/*****************************************************************
 *  src/pages/Login.tsx  ——  登录页（放大左侧 LOGO）
 *  --------------------------------------------------------------
 *  • 左侧 logo 尺寸从 80 → 120 px
 *****************************************************************/

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/* -------- MUI 组件 -------- */
import Grid        from '@mui/material/Grid'
import Box         from '@mui/material/Box'
import Card        from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField   from '@mui/material/TextField'
import Button      from '@mui/material/Button'
import Typography  from '@mui/material/Typography'
import LoginIcon   from '@mui/icons-material/Login'

interface LoginProps {
    onFakeLogin: () => void
}

export default function Login({ onFakeLogin }: LoginProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onFakeLogin()
        navigate('/app/dashboard')
    }

    return (
        <Grid container sx={{ minHeight: '100vh' }}>
            {/* ---------- 左侧 LOGO 区 ---------- */}
            <Grid
                size={{ xs: 12, md: 7 }}
                sx={{
                    bgcolor: 'background.default',
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    {/* LOGO 放大到 120 × 120 px */}
                    <img src="/favicon.svg" width={120} height={120} alt="logo" />
                    <Typography variant="h5" mt={3}>
                        运维信息表
                    </Typography>
                </Box>
            </Grid>

            {/* ---------- 右侧表单区 ---------- */}
            <Grid
                size={{ xs: 12, md: 5 }}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    bgcolor: 'background.default',
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
