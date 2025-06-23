// ------------------------------------------------------------
// Login.tsx
// ------------------------------------------------------------
// 功能：渲染登录页面。采用左右布局：
//   • 左侧：系统 Logo + 系统名称 + 副标题（占 55% 宽度）。
//   • 右侧：登录表单（占 45% 宽度）。
//   • 整体背景：非常淡的灰色。
//   • 适合桌面端宽屏显示，元素已做相对偏移使视觉更舒适。
//   • 代码中几乎所有结构、方法、变量均添加了初学者友好的中文注释。
// ------------------------------------------------------------

import React, { useState } from 'react';
// useNavigate 用于编程式导航（例如登录成功后跳转到后台首页）
import { useNavigate } from 'react-router-dom';
// MUI（Material‑UI）组件：Box 负责布局、Paper 是带阴影卡片、
// Button 按钮、TextField 输入框、Typography 文字排版
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
// 项目内置的 React Logo SVG，用作临时系统 Logo
import reactLogo from '../assets/react.svg';

/**
 * Login 组件 —— 默认导出。
 * 这是一个「函数组件」（Function Component），类型为 React.FC<{}>，
 * 表示该组件不接收任何 props。
 */
const Login: React.FC = () => {
    // -------------------------------------------------------------------
    // 1. React Router 的导航钩子
    // -------------------------------------------------------------------
    // navigate 是一个函数：调用 navigate('/path') 即可跳转到指定路由。
    const navigate = useNavigate();

    // -------------------------------------------------------------------
    // 2. 受控表单状态（用户名 & 密码）
    // -------------------------------------------------------------------
    // 受控组件：input 框的值由 React state 决定，onChange 时更新 state。
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // -------------------------------------------------------------------
    // 3. 处理登录按钮点击
    // -------------------------------------------------------------------
    /**
     * 当用户点击「登录」按钮时触发。
     * 1) 去掉输入值两端空格，确认非空；
     * 2) 如果有值，则直接跳转到 /dashboard（模拟登录成功）；
     * 3) 否则弹出提示要求输入。
     */
    const handleLogin = (): void => {
        const trimmedUser = username.trim();
        const trimmedPass = password.trim();

        if (trimmedUser && trimmedPass) {
            // 登录逻辑：此处可替换为真实接口校验
            navigate('/dashboard');
        } else {
            // 浏览器 alert 简单提示，生产环境请改为更友好的提示组件
            alert('请输入用户名和密码');
        }
    };

    // -------------------------------------------------------------------
    // 4. 渲染 UI
    // -------------------------------------------------------------------
    return (
        // ======================= 根容器 Box =========================
        <Box
            sx={{
                position: 'fixed', // 固定定位，覆盖视口；防止滚动条
                inset: 0,          // 等价于 top:0; right:0; bottom:0; left:0
                display: 'flex',   // 启用 Flex 布局
                flexDirection: 'row', // 横向分布左右两块
                backgroundColor: '#f5f5f5', // 整体淡灰背景
            }}
        >
            {/* -------------------- 左侧 Logo 区 -------------------- */}
            <Box
                sx={{
                    width: '55%',            // 占容器宽度 55%
                    minWidth: 300,           // 保障最小宽度
                    display: 'flex',
                    flexDirection: 'column', // 纵向堆叠
                    alignItems: 'center',    // 水平居中
                    justifyContent: 'center',// 垂直居中
                    gap: 2,                  // 子元素间隔 theme.spacing(2)
                    color: '#1976d2',        // 深蓝色文字 / 图标色
                    // 视觉微调：整体上移 1vh，让与右侧登录框对齐
                    transform: 'translateY(-1vh)',
                }}
            >
                {/* 系统 Logo：使用 img 直接渲染 SVG，大小 240×240 */}
                <img
                    src={reactLogo}
                    alt="系统 Logo"
                    style={{ width: 240, height: 240 }}
                />

                {/* 系统主标题 */}
                <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
                    运维信息系统
                </Typography>

                {/* 系统副标题 */}
                <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
                    本地部署 · 高性能 · 易用
                </Typography>
            </Box>

            {/* -------------------- 右侧 登录表单区 -------------------- */}
            <Box
                sx={{
                    width: '45%',            // 占容器宽度 45%
                    display: 'flex',
                    alignItems: 'center',    // 垂直居中登录框
                    justifyContent: 'center',// 水平居中登录框
                }}
            >
                {/* Paper：带阴影的卡片容器 */}
                <Paper
                    elevation={3}            // 阴影层级 0~24，值越大阴影越深
                    sx={{
                        width: 350,            // 固定宽度 350px
                        p: 4,                  // padding 4 × theme.spacing = 32px
                        mt: '-1vh',            // 上移 1vh，与左侧保持视觉一致
                    }}
                >
                    {/* 表单标题 */}
                    <Typography variant="h5" mb={3} textAlign="center">
                        登录系统
                    </Typography>

                    {/* ------------------ 用户名输入框 ------------------ */}
                    <TextField
                        label="用户名"        // 输入框标签
                        fullWidth              // 宽度 100%
                        margin="normal"       // MUI 预设上下外边距
                        value={username}       // 当前值（受控）
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                    />

                    {/* ------------------ 密码输入框 ------------------ */}
                    <TextField
                        label="密码"
                        type="password"       // 输入类型为密码
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />

                    {/* ------------------ 登录按钮 ------------------ */}
                    <Button
                        variant="contained"  // MUI 实心按钮
                        fullWidth
                        sx={{ mt: 3 }}        // 上外边距 spacing(3) ≈ 24px
                        onClick={handleLogin}  // 点击触发登录逻辑
                    >
                        登录
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
};

export default Login;
