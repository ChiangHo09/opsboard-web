/**
 * @file src/components/ReAuthModal.tsx
 * @description 一个模态框组件，用于在用户会话超时后请求重新进行身份认证。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [Hook 修正]：将用于重置组件内部状态的 `useState` Hook 调用修正为正确的 `useEffect` Hook。
 *   - [原因]：修复了因错误使用 Hook 导致的 TypeScript 编译错误 (TS2554)。`useEffect` 是在组件渲染后根据依赖变化执行副作用的正确方式，而 `useState` 的初始化函数不接受依赖数组。
 *   - [依赖导入]：在 `react` 的导入语句中添加了 `useEffect`。
 */
import { useState, useEffect } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

interface ReAuthModalProps {
    open: boolean;
    onLoginSuccess: () => void;
    onLogout: () => void;
}

export const ReAuthModal = ({ open, onLoginSuccess, onLogout }: ReAuthModalProps) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await login({ username, password });
            setUsername('');
            setPassword('');
            onLoginSuccess();
        } catch (err) {
            setError('登录失败，请检查您的凭据。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    // 当模态框从打开变为关闭时，重置其内部状态。
    // 使用 useEffect 来响应 open prop 的变化，这是处理此类副作用的正确模式。
    useEffect(() => {
        if (!open) {
            setError(null);
            setIsLoading(false);
            setUsername('');
            setPassword('');
        }
    }, [open]);

    return (
        <Dialog open={open} disableEscapeKeyDown>
            <DialogTitle>会话已过期</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    为了您的账户安全，长时间未操作后需要重新登录。请输入您的凭据以继续。
                </DialogContentText>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField
                    autoFocus
                    margin="dense"
                    id="username"
                    label="用户名"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                />
                <TextField
                    margin="dense"
                    id="password"
                    label="密码"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                />
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onLogout} color="secondary" disabled={isLoading}>
                    退出登录
                </Button>
                <Box sx={{ position: 'relative' }}>
                    <Button onClick={handleLogin} variant="contained" disabled={isLoading}>
                        重新登录
                    </Button>
                    {isLoading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: '-12px',
                                marginLeft: '-12px',
                            }}
                        />
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};