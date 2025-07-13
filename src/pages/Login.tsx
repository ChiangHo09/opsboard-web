/*
 * [文件用途说明]
 * - 此文件定义了应用的登录页面，包含用户输入表单和品牌标识。
 * - 它采用了响应式设计，以适应桌面和移动设备。
 *
 * [本次修改记录]
 * - 根据用户要求，将登录页的 Logo 从 Material-UI 的 <CodeOffIcon /> 组件改回使用 `/favicon.svg` 图片文件。
 * - 使用了 `<Box component="img">` 来渲染该 SVG，并为其设置了响应式的高度，确保了与之前图标相似的视觉尺寸。
 */
import { useState } from 'react';
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
                    {/* --- START OF MODIFICATION --- */}
                    <Box
                        component="img"
                        src="/favicon.svg"
                        alt="logo"
                        sx={{
                            height: { xs: '4rem', sm: '5rem', md: 120 },
                            width: 'auto',
                        }}
                    />
                    {/* --- END OF MODIFICATION --- */}
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
                <Card elevation={3}
                      sx={{
                          width: '100%',
                          maxWidth: 360
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