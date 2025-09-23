/**
 * @file src/components/ui/ActionButtons.tsx
 * @description 定义了一个标准化的、分段式的操作按钮组，用于页面顶部。
 * @modification
 *   - [交互优化]：为所有按钮的点击事件引入了异步延迟处理。现在，在执行实际操作（如打开搜索面板）前会有一个 200 毫秒的短暂延迟。
 *   - [根本原因]：之前的实现中，功能执行（如 `onSearchClick`）与点击事件同步触发，导致视觉反馈（涟漪效果）还未完成，功能就已经执行，体验非常突兀。
 *   - [解决方案]：将每个 `onClick` 处理器都改为 `async` 函数。在函数内部，首先 `await` 一个延时 Promise，让涟漪动画有时间播放，然后再执行从 props 传入的回调函数。这极大地提升了交互的流畅度和质感。
 *   - [UI/UX]：修复了在触摸设备上，按钮点击后残留高亮背景色的问题，并增强了键盘导航的可访问性。
 */
import {type JSX} from 'react';
import {Button, ButtonGroup, Typography, useTheme} from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

interface ActionButtonsProps {
    showEditButton?: boolean; // 控制编辑按钮是否显示的 prop
    onEditClick?: () => void;
    onExportClick?: () => void;
    onSearchClick?: () => void;
}

// 定义一个延迟常量，用于在执行操作前等待涟漪动画开始
const RIPPLE_DELAY_MS = 200;

const ActionButtons = ({
                           showEditButton = true, // 默认为 true，方便展示
                           onEditClick,
                           onExportClick,
                           onSearchClick,
                       }: ActionButtonsProps): JSX.Element => {

    const theme = useTheme(); // 引入主题以访问调色板

    // 定义按钮的通用样式
    const buttonStyle = {
        height: 42,
        textTransform: 'none',
        px: 3,
        bgcolor: 'app.button.background',
        color: 'neutral.main',
        borderColor: 'transparent',
        boxShadow: 'none',
        // 简洁的悬浮效果，只改变背景色
        '&:hover': {
            bgcolor: 'app.button.hover',
            borderColor: 'transparent',
            boxShadow: 'none',
            transform: 'none',
        },
        // 处理触摸点击后的焦点状态
        '&:focus, &.Mui-focusVisible': {
            bgcolor: 'app.button.background',
            boxShadow: 'none',
        },
        // 为键盘导航提供清晰的焦点指示
        '&.Mui-focusVisible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: '2px',
        },
    };

    return (
        <ButtonGroup
            variant="contained"
            size="large"
            aria-label="action button group"
            sx={{
                boxShadow: 'none',
                // --- 强制设置首尾按钮的圆角 ---
                '& .MuiButton-root:first-of-type': {
                    borderTopLeftRadius: '50px',
                    borderBottomLeftRadius: '50px',
                },
                '& .MuiButton-root:last-of-type': {
                    borderTopRightRadius: '50px',
                    borderBottomRightRadius: '50px',
                },
                // --- 利用“透明边框”创建间隙 ---
                '& .MuiButton-root:not(:last-of-type)': {
                    borderRightWidth: '2px',
                },
            }}
        >
            {/* 只有在 showEditButton 为 true 时才渲染此按钮 */}
            {showEditButton && (
                <Button
                    startIcon={<DriveFileRenameOutlineIcon/>}
                    sx={buttonStyle}
                    onClick={async () => {
                        // 仅在 prop 存在时执行
                        if (!onEditClick) return;
                        // 等待一小段时间，让涟漪动画开始
                        await new Promise(resolve => setTimeout(resolve, RIPPLE_DELAY_MS));
                        // 然后再执行实际的操作
                        onEditClick();
                    }}
                >
                    <Typography component="span" sx={{transform: 'translateY(1px)'}}>编辑</Typography>
                </Button>
            )}
            <Button
                startIcon={<ShareOutlinedIcon/>}
                sx={buttonStyle}
                onClick={async () => {
                    if (!onExportClick) return;
                    await new Promise(resolve => setTimeout(resolve, RIPPLE_DELAY_MS));
                    onExportClick();
                }}
            >
                <Typography component="span" sx={{transform: 'translateY(1px)'}}>导出</Typography>
            </Button>
            <Button
                startIcon={<SearchRoundedIcon/>}
                sx={buttonStyle}
                onClick={async () => {
                    if (!onSearchClick) return;
                    await new Promise(resolve => setTimeout(resolve, RIPPLE_DELAY_MS));
                    onSearchClick();
                }}
            >
                <Typography component="span" sx={{transform: 'translateY(1px)'}}>搜索</Typography>
            </Button>
        </ButtonGroup>
    );
};

export default ActionButtons;