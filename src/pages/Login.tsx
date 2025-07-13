/**
 * 文件功能：
 * 此文件定义了应用的登录页面，包含用户输入表单和品牌标识。
 * 它采用了响应式设计，以适应桌面和移动设备。
 *
 * 本次修改：
 * - 防止页面加载时输入框自动获得焦点。
 * - 引入了 `useRef` 和 `useEffect` Hooks。
 * - 为登录表单的 `Card` 组件添加了 `ref` 和 `tabIndex={-1}` 属性，使其可以被程序化地聚焦。
 * - 通过 `useEffect` 在组件挂载时将焦点设置到 `Card` 上，从而移开输入框的默认焦点。
 * - 在 `Card` 的 `sx` 样式中添加了 `outline: 'none'`，以移除聚焦时产生的默认轮廓线。
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Card, CardContent, TextField, Button,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HoneypotInfo from './HoneypotInfo';

interface LoginProps {
    onFakeLogin: () => void;
}

export default function Login({ onFakeLogin }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 将焦点设置到 Card 上，以防止 TextField 自动聚焦
        cardRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onFakeLogin();
        navigate('/app/dashboard');
    };

    const handleOpenInfoDialog = () => setIsInfoDialogOpen(true);
    const handleCloseInfoDialog = () => setIsInfoDialogOpen(false);

    const tfSX = {
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#1976d2',
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
                bgcolor: '#f7f9fd',
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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        component="img"
                        src="/favicon.svg"
                        alt="logo"
                        sx={{
                            height: { xs: '4rem', sm: '5rem', md: 120 },
                            width: 'auto',
                        }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                            fontWeight: 500
                        }}
                    >
                        运维信息表
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    flex: { xs: 'none', md: '0 0 40%' },
                    width: { xs: '100%', md: '40%' },
                    height: { xs: 'auto', md: '100%' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Card
                    ref={cardRef}
                    tabIndex={-1}
                    elevation={3}
                    sx={{
                        width: '100%',
                        maxWidth: 360,
                        outline: 'none', // 移除聚焦时的轮廓线
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" gutterBottom>用户登录</Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                fullWidth margin="normal" label="用户名"
                                value={username} onChange={e => setUsername(e.target.value)} sx={tfSX}
                            />
                            <TextField
                                fullWidth margin="normal" label="密码" type="password"
                                value={password} onChange={e => setPassword(e.target.value)} sx={tfSX}
                            />
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button
                                    fullWidth variant="contained" disableElevation
                                    startIcon={<LoginIcon />} type="submit"
                                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                                >
                                    登录
                                </Button>
                                <Button
                                    variant="contained" color="error" onClick={handleOpenInfoDialog}
                                    sx={{ flexShrink: 0, px: 2 }} aria-label="查看待办的安全实现"
                                >
                                    <ReportProblemIcon />
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Dialog
                open={isInfoDialogOpen}
                onClose={handleCloseInfoDialog}
                maxWidth="md"
                fullWidth
                scroll="paper"
            >
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
}