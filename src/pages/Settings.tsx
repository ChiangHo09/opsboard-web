/**
 * 文件名：Settings.tsx
 * 描述：此文件定义了应用的“设置”页面。
 *
 * 本次修改：
 * - 更新了页面标题的样式，使其与应用内其他页面的标题（如“服务器信息”）保持一致。
 * - 将标题颜色绑定到全局主题的 `primary.main` 颜色，确保其能跟随主题变化。
 */
import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material'
import { useLayout } from '../contexts/LayoutContext.tsx';

const Settings: React.FC = () => {
    const { setIsPanelRelevant } = useLayout();

    useEffect(() => {
        // 组件挂载时：标记当前页面与面板不相关
        setIsPanelRelevant(false);

        // 组件卸载时：确保标记当前页面与面板不相关
        return () => {
            setIsPanelRelevant(false);
        };
    }, [setIsPanelRelevant]);

    return (
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
                width: { xs: '90%', md: '80%' },
                maxWidth: 1280,
                mx: 'auto',
                py: 4,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        color: 'primary.main',
                        fontSize: '2rem'
                    }}
                >
                    设置 (Settings)
                </Typography>
                <Typography sx={{ mt: 2 }}>这里实现一些系统设置内容（还没想好要设置啥）</Typography>
            </Box>
        </Box>
    );
};

export default Settings;