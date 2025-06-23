import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // 模拟登录成功，跳转到 dashboard
        if (username && password) {
            navigate('/dashboard');
        } else {
            alert('请输入用户名和密码');
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f0f2f5"
        >
            <Paper elevation={3} style={{ padding: '2rem', width: '300px' }}>
                <Typography variant="h5" gutterBottom>
                    运维信息系统 登录
                </Typography>
                <TextField
                    label="用户名"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="密码"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    fullWidth
                    color="primary"
                    onClick={handleLogin}
                    sx={{ marginTop: 2 }}
                >
                    登录
                </Button>
            </Paper>
        </Box>
    );
};

export default Login;
