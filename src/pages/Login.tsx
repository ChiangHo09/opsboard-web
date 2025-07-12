/* --- START OF FILE Login.tsx --- */

/*****************************************************************
 *  src/pages/Login.tsx
 *  —— 响应式：Box + Flexbox（无需 Grid）
 *  —— 修复: 引用独立的 HoneypotInfo 组件来展示弹窗内容
 *  —— 调整: 移动端视图布局，实现居中、Logo-文字垂直排列及Logo-文字组合定位
 *  —— 调整: 登录页面的背景色改为 #f7f9fd
 *****************************************************************/
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Card, CardContent, TextField, Button,
    Typography, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import HoneypotInfo from './HoneypotInfo'; // 引入内容组件

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
        // 最外层 Box: 控制整个登录页面的高度、背景色、以及主要区域（Logo+卡片）的整体居中和响应式布局。
        <Box
            sx={{
                height: '100vh', // 占据整个视口高度。
                display: 'flex', // 启用 Flexbox 布局。
                flexDirection: { xs: 'column', md: 'row' }, // 移动端垂直堆叠 (column)，桌面端水平排列 (row)。
                alignItems: 'center', // 在主轴（移动端垂直，桌面端水平）的交叉轴上居中。
                // 移动端：水平居中 Logo 和卡片区域。
                // 桌面端：垂直居中 Logo 和卡片区域。
                justifyContent: { xs: 'space-evenly', md: 'center' }, // 在主轴上分布内容。
                // 移动端：均匀分布 Logo 区域和卡片区域，使它们在垂直方向上有“呼吸空间”，Logo 偏上，卡片偏下。
                // 桌面端：在水平方向上居中两个区域。
                bgcolor: '#f7f9fd', // 背景色已修改为 #f7f9fd。
                p: { xs: 2, md: 0 }, // 移动端添加一些外层内边距，防止内容紧贴边缘，桌面端不需要。
            }}
        >
            {/* 左侧 Logo + 标题区域：在移动端位于顶部，桌面端位于左侧。 */}
            <Box
                sx={{
                    flex: { xs: 'none', md: '0 0 60%' }, // 移动端不伸缩 (根据内容高度)，桌面端占据 60% 宽度。
                    width: { xs: '100%', md: '60%' }, // 移动端占据 100% 宽度，桌面端 60%。
                    height: { xs: 'auto', md: '100%' }, // 移动端高度自适应，桌面端占据 100% 高度。
                    display: 'flex', // 启用 Flexbox 布局。
                    flexDirection: 'column', // 内部 Logo 和文字总是垂直堆叠。
                    alignItems: 'center', // 内部内容（Logo和文字）水平居中。
                    justifyContent: 'center', // 内部内容（Logo和文字）垂直居中。
                    // 移除原有的 p，因为外层 Box 已经处理了整体间距，且内部 flex 布局会控制内容位置。
                }}
            >
                <Box // 实际的 Logo + 标题内容 Box。
                    sx={{
                        display: 'flex', // 启用 Flexbox 布局。
                        flexDirection: 'column', // Logo 和文字垂直堆叠。
                        alignItems: 'center', // Logo 和文字水平居中。
                        gap: 2, // Logo 和文字之间的间距。
                    }}
                >
                    <Box // Logo 图片。
                        component="img" // 指定组件为图片。
                        src="/favicon.svg" // 图片源地址。
                        alt="logo" // 图片替代文本。
                        sx={{ // 响应式 Logo 尺寸。
                            height: { xs: '4rem', sm: '5rem', md: 120 }, // 移动端较小，桌面端较大。
                            width: 'auto' // 宽度自适应。
                        }}
                    />
                    <Typography // 标题文字。
                        variant="h4" // 使用 h4 字体变体。
                        sx={{ // 响应式字体大小和字重。
                            fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, // 移动端较小，桌面端较大。
                            fontWeight: 500 // 字重。
                        }}
                    >
                        运维信息表
                    </Typography>
                </Box>
            </Box>

            {/* 右侧 登录卡片区域：在移动端位于底部，桌面端位于右侧。 */}
            <Box
                sx={{
                    flex: { xs: 'none', md: '0 0 40%' }, // 移动端不伸缩，桌面端占据 40% 宽度。
                    width: { xs: '100%', md: '40%' }, // 移动端占据 100% 宽度，桌面端 40%。
                    height: { xs: 'auto', md: '100%' }, // 移动端高度自适应，桌面端占据 100% 高度。
                    display: 'flex', // 启用 Flexbox 布局。
                    alignItems: 'center', // 内部内容（卡片）在交叉轴上居中。
                    // 移动端：水平居中卡片。
                    // 桌面端：垂直居中卡片。
                    justifyContent: 'center', // 内部内容（卡片）在主轴上居中。
                    // 移动端：垂直居中卡片。
                    // 桌面端：水平居中卡片。
                    // 移除原有的 p，原因同左侧区域。
                }}
            >
                <Card elevation={3} // 卡片组件，带阴影。
                      sx={{
                          width: '100%', // 卡片占据其父容器的全部宽度。
                          maxWidth: 360 // 卡片的最大宽度。
                      }}
                >
                    <CardContent> {/* 卡片内容区域 */}
                        <Typography variant="h6" gutterBottom>用户登录</Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate> {/* 登录表单 */}
                            <TextField // 用户名输入框
                                fullWidth margin="normal" label="用户名"
                                value={username} onChange={e => setUsername(e.target.value)} sx={tfSX}
                            />
                            <TextField // 密码输入框
                                fullWidth margin="normal" label="密码" type="password"
                                value={password} onChange={e => setPassword(e.target.value)} sx={tfSX}
                            />
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}> {/* 按钮组 */}
                                <Button // 登录按钮
                                    fullWidth variant="contained" disableElevation
                                    startIcon={<LoginIcon />} type="submit"
                                    sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                                >
                                    登录
                                </Button>
                                <Button // 警告/信息按钮
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

            {/* 待办事项信息弹窗：与主要布局分离，不影响Flexbox排布。 */}
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
/* --- END OF FILE Login.tsx --- */