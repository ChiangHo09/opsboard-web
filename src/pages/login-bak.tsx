/*****************************************************************
 *  src/pages/Login.tsx
 *  —— 响应式：Box + Flexbox（无需 Grid）
 *****************************************************************/
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LoginIcon from '@mui/icons-material/Login'

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

    const tfSX = {
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#1976d2',
        },
    } as const

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                height: '100vh',
                bgcolor: 'background.default',
            }}
        >
            {/* 左侧 Logo + 标题 */}
            <Box
                sx={{
                    flex: { xs: 'none', md: '0 0 60%' },
                    width: { xs: '100%', md: '60%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 2, md: 4 },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'row', md: 'column' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        component="img"
                        src="/favicon.svg"
                        alt="logo"
                        sx={{
                            height: { xs: '1.5rem', md: 120 },
                            width: 'auto',
                        }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            fontWeight: 500,
                        }}
                    >
                        运维信息表
                    </Typography>
                </Box>
            </Box>

            {/* 右侧 登录卡片 */}
            <Box
                sx={{
                    flex: { xs: 'none', md: '0 0 40%' },
                    width: { xs: '100%', md: '40%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 2, md: 4 },
                }}
            >
                <Card elevation={3} sx={{ width: '100%', maxWidth: 360 }}>
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
                                sx={tfSX}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="密码"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                sx={tfSX}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                disableElevation
                                startIcon={<LoginIcon />}
                                type="submit"
                                sx={{
                                    mt: 2,
                                    bgcolor: '#1976d2',
                                    '&:hover': { bgcolor: '#1565c0' },
                                }}
                            >
                                登录
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}
