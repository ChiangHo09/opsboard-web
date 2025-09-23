/**
 * 文件名：src/pages/Login.tsx
 * 描述：
 *     此文件定义了应用的登录页面，包含用户输入表单和品牌标识。
 *
 * 本次修改：
 * - 【组件写法现代化】移除了 `export default function` 的写法，采用了现代的、
 *   不使用 `React.FC` 的类型定义方式，并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {useState, useRef, useEffect, type JSX} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Box, Card, CardContent, TextField, Button,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import {useTheme} from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HoneypotInfo from './HoneypotInfo';

interface LoginProps {
    onFakeLogin: () => void;
}

// 【核心修改】使用现代写法定义 Login 组件
const Login = ({onFakeLogin}: LoginProps): JSX.Element => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    useEffect(() => {
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
                flexDirection: {xs: 'column', md: 'row'},
                alignItems: 'center',
                justifyContent: {xs: 'space-evenly', md: 'center'},
                bgcolor: 'app.background',
                p: {xs: 2, md: 0},
            }}
        >
            <Box
                sx={{
                    flex: {xs: 'none', md: '0 0 60%'},
                    width: {xs: '100%', md: '60%'},
                    height: {xs: 'auto', md: '100%'},
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
                            height: {xs: '4rem', sm: '5rem', md: 120},
                            width: 'auto',
                        }}
                    />
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: {xs: '1.8rem', sm: '2.2rem', md: '2.5rem'},
                            fontWeight: 500,
                            color: 'neutral.main'
                        }}
                    >
                        运维信息表
                    </Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    flex: {xs: 'none', md: '0 0 40%'},
                    width: {xs: '100%', md: '40%'},
                    height: {xs: 'auto', md: '100%'},
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Card
                    ref={cardRef}
                    tabIndex={-1}
                    elevation={0}
                    sx={{
                        width: '100%',
                        maxWidth: 360,
                        outline: 'none',
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
                            <Box sx={{display: 'flex', gap: 1, mt: 2}}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    startIcon={<LoginIcon/>}
                                    type="submit"
                                >
                                    登录
                                </Button>
                                <Button
                                    variant="contained" color="error" onClick={handleOpenInfoDialog}
                                    sx={{flexShrink: 0, px: 2}} aria-label="查看待办的安全实现"
                                >
                                    <ReportProblemIcon/>
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
                    <HoneypotInfo/>
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