/**
 * @file src/components/ui/ActionButtons.tsx
 * @description 定义了一个标准化的、分段式的操作按钮组，用于页面顶部。
 * @modification
 *   - [UI/UX]：彻底修复了按钮悬浮（hover）效果不正确的问题。
 *   - [根本原因]：MUI 的 Button 组件在 `variant="contained"` 时，其默认主题样式中包含了 `box-shadow` 等悬浮效果。之前的实现未能显式覆盖这些默认样式。
 *   - [解决方案]：在 `buttonStyle` 的 `&:hover` 伪类中，显式地将 `boxShadow` 和 `transform` 设置为 `none`，从而强制移除了所有不需要的悬浮效果，只保留了背景颜色的变化。
 */
import {type JSX} from 'react';
import {Button, ButtonGroup, Typography} from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

interface ActionButtonsProps {
    showEditButton?: boolean; // 控制编辑按钮是否显示的 prop
    onEditClick?: () => void;
    onExportClick?: () => void;
    onSearchClick?: () => void;
}

const ActionButtons = ({
                           showEditButton = true, // 默认为 true，方便展示
                           onEditClick,
                           onExportClick,
                           onSearchClick,
                       }: ActionButtonsProps): JSX.Element => {

    // 定义按钮的通用样式
    const buttonStyle = {
        height: 42,
        textTransform: 'none',
        px: 3,
        bgcolor: 'app.button.background',
        color: 'neutral.main',
        borderColor: 'transparent',
        boxShadow: 'none', // 默认状态下也移除阴影
        // 简洁的悬浮效果，只改变背景色
        '&:hover': {
            bgcolor: 'app.button.hover',
            borderColor: 'transparent', // 悬浮时也必须保持边框透明
            boxShadow: 'none', // 关键修复：在悬浮时也显式地移除阴影
            transform: 'none', // 关键修复：确保没有缩放效果
        }
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
                    // 关键：设置一个宽度，这个透明的边框就变成了间隙
                    borderRightWidth: '2px',
                },
            }}
        >
            {/* 只有在 showEditButton 为 true 时才渲染此按钮 */}
            {showEditButton && (
                <Button
                    startIcon={<DriveFileRenameOutlineIcon/>}
                    sx={buttonStyle}
                    onClick={onEditClick}
                >
                    <Typography component="span" sx={{transform: 'translateY(1px)'}}>编辑</Typography>
                </Button>
            )}
            <Button
                startIcon={<ShareOutlinedIcon/>}
                sx={buttonStyle}
                onClick={onExportClick}
            >
                <Typography component="span" sx={{transform: 'translateY(1px)'}}>导出</Typography>
            </Button>
            <Button
                startIcon={<SearchRoundedIcon/>}
                sx={buttonStyle}
                onClick={onSearchClick}
            >
                <Typography component="span" sx={{transform: 'translateY(1px)'}}>搜索</Typography>
            </Button>
        </ButtonGroup>
    );
};

export default ActionButtons;