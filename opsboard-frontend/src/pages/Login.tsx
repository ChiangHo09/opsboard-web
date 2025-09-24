/**
 * @file src/pages/Login.tsx
 * @description 此文件定义了应用的登录页面。
 * @modification
 *   - [认证重构]: 移除了旧的 `onFakeLogin` 逻辑，现在使用 `useAuth` 钩子来访问全局的 `login` 方法。
 *   - [状态解耦]: 组件本身不再管理认证状态、token 或导航逻辑。它只负责收集用户输入并调用 `authContext.login`。
 *   - [用户反馈]: 登录按钮的加载状态和错误信息的显示现在都由 `useAuth` 钩子提供的状态驱动，确保了 UI 与认证过程的实时同步。
 */
import { useState, useRef, useEffect, type JSX } from 'react';
import {
    Box, Card, CardContent, TextField, Button,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { useAuth } from '@/hooks/useAuth'; // 引入 useAuth 钩子
import HoneypotInfo from './HoneypotInfo';
import logoSrc from '../assets/logo.svg';

const Login = (): JSX.Element => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    // 从 AuthContext 获取登录函数和状态
    const { login, isLoading, error } = useAuth();

    useEffect(() => {
        cardRef.current?.focus();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ username, password });
            // 导航逻辑现在由 AuthProvider 处理
        } catch (err) {
            // 错误已在 AuthProvider 中设置，UI 将自动更新
            console.error('Login failed:', err);
        }
    };

    const handleOpenInfoDialog = () => setIsInfoDialogOpen(true);
    const handleCloseInfoDialog = () => setIsInfoDialogOpen(false);

    const tfSX = {
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: theme.palette.primary.main,
        },
    } as const;

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: { xs: 'space-evenly', md: 'center' },
                bgcolor: 'app.background',
                p: { xs: 2, md: 0 },
            }}
        >
            <Box
                sx={{
                    flex: { xs: 'none', md: '0 0 60%' },
                    width: { xs: '100%', md: '60%' },
                    height: { xs: 'auto', md: '100%' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box component="img" src={logoSrc} alt="logo" sx={{ height: { xs: '4rem', sm: '5rem', md: 120 }, width: 'auto' }} />
                    <Typography variant="h4" sx={{ fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, fontWeight: 500, color: 'neutral.main' }}>
                        运维信息表
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ flex: { xs: 'none', md: '0 0 40%' }, width: { xs: '100%', md: '40%' }, height: { xs: 'auto', md: '100%' }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Card ref={cardRef} tabIndex={-1} elevation={0} sx={{ width: '100%', maxWidth: 360, outline: 'none' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>用户登录</Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            {error && (
                                <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
                            <TextField
                                fullWidth margin="normal" label="用户名"
                                value={username} onChange={e => setUsername(e.target.value)} sx={tfSX}
                                disabled={isLoading}
                            />
                            <TextField
                                fullWidth margin="normal" label="密码" type="password"
                                value={password} onChange={e => setPassword(e.target.value)} sx={tfSX}
                                disabled={isLoading}
                            />
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={isLoading ? null : <LoginIcon />}
                                    type="submit"
                                    disabled={isLoading}
                                    sx={{ height: 40 }}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : '登录'}
                                </Button>
                                <Button
                                    variant="contained" color="error" onClick={handleOpenInfoDialog}
                                    sx={{ flexShrink: 0, px: 2 }} aria-label="查看待办的安全实现"
                                    disabled={isLoading}
                                >
                                    <ReportProblemIcon />
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Dialog open={isInfoDialogOpen} onClose={handleCloseInfoDialog} maxWidth="md" fullWidth scroll="paper">
                <DialogTitle fontWeight="bold">TODO: 实施本地化机器人验证机制</DialogTitle>
                <DialogContent dividers>
                    <HoneypotInfo />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInfoDialog} autoFocus>
                        关闭
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Login;