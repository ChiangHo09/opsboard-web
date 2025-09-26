/**
 * @file src/components/SessionTimeoutModal.tsx
 * @description 一个模态框组件，用于在会话即将超时时警告用户。
 * @modification
 *   - [Style Update]: 更新了 `Dialog` 组件的 `slotProps`，将 `backdrop` 的样式与项目中其他模态框（如模板详情弹窗）的样式统一。
 *   - [Style Details]: 背景现在是带有模糊效果（`backdropFilter: 'blur(4px)'`）的半透明白色，提供了更一致、更现代的用户体验。
 */
import { type JSX, useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
    Typography,
    Paper
} from '@mui/material';

interface SessionTimeoutModalProps {
    open: boolean;
    countdownSeconds: number;
    onStayLoggedIn: () => void;
    onLogout: () => void;
}

export const SessionTimeoutModal = ({
                                        open,
                                        countdownSeconds,
                                        onStayLoggedIn,
                                        onLogout
                                    }: SessionTimeoutModalProps): JSX.Element => {
    const [countdown, setCountdown] = useState(countdownSeconds);

    useEffect(() => {
        if (open) {
            setCountdown(countdownSeconds);
            const interval = setInterval(() => {
                setCountdown(prev => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [open, countdownSeconds]);

    return (
        <Dialog
            open={open}
            aria-labelledby="session-timeout-title"
            // --- 【核心修改】 ---
            slotProps={{
                backdrop: {
                    sx: {
                        // 与模板详情弹窗的背景样式保持一致
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(4px)',
                    },
                },
            }}
            // 为了让弹窗本身与模糊背景更好地融合，可以去除其默认阴影
            PaperComponent={(props) => <Paper elevation={0} {...props} />}
        >
            <DialogTitle id="session-timeout-title">会话即将过期</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    由于您长时间未操作，您的登录会话即将自动结束以确保安全。
                </DialogContentText>
                <Box sx={{ textAlign: 'center', my: 2 }}>
                    <Typography variant="h4" component="div" color="primary">
                        {countdown}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        秒后将自动登出
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: '0 24px 16px' }}>
                <Button onClick={onLogout} color="error">
                    立即登出
                </Button>
                <Button onClick={onStayLoggedIn} variant="contained" autoFocus>
                    继续使用
                </Button>
            </DialogActions>
        </Dialog>
    );
};