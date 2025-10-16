/**
 * @file src/components/ui/ActionButtons.tsx
 * @description 定义了一个标准化的、分段式的操作按钮组，用于页面顶部。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [功能变更]：将“编辑”按钮的功能和视觉表现替换为“新增”按钮。
 *   - [属性重命名]：将 `showEditButton` 和 `onEditClick` 属性分别重命名为 `showAddButton` 和 `onAddClick`，以更好地反映其新用途。
 *   - [图标与文本更新]：将图标从 `DriveFileRenameOutlineIcon` 更新为 `AddIcon`，并将按钮文本从“编辑”更改为“新增”，提供了清晰的视觉指引。
 */
import {type JSX} from 'react';
import {Button, ButtonGroup, Typography, useTheme} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

interface ActionButtonsProps {
    /** 控制新增按钮是否显示的 prop */
    showAddButton?: boolean;
    /** 点击新增按钮时的回调函数 */
    onAddClick?: () => void;
    /** 点击导出按钮时的回调函数 */
    onExportClick?: () => void;
    /** 点击搜索按钮时的回调函数 */
    onSearchClick?: () => void;
}

// 定义一个延迟常量，用于在执行操作前等待涟漪动画开始
const RIPPLE_DELAY_MS = 200;

const ActionButtons = ({
                           showAddButton = true, // 默认为 true，方便展示
                           onAddClick,
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
            {/* 只有在 showAddButton 为 true 时才渲染此按钮 */}
            {showAddButton && (
                <Button
                    startIcon={<AddIcon/>}
                    sx={buttonStyle}
                    onClick={async () => {
                        // 仅在 prop 存在时执行
                        if (!onAddClick) return;
                        // 等待一小段时间，让涟漪动画开始
                        await new Promise(resolve => setTimeout(resolve, RIPPLE_DELAY_MS));
                        // 然后再执行实际的操作
                        onAddClick();
                    }}
                >
                    <Typography component="span" sx={{transform: 'translateY(1px)'}}>新增</Typography>
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