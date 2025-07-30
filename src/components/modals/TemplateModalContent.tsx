/**
 * 文件名: src/components/modals/TemplateModalContent.tsx
 *
 * 文件功能描述:
 * 此文件提供了【模板详情】内容的具体实现。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {Box, Typography} from '@mui/material';
import type {JSX} from 'react';

export interface TemplateModalContentProps {
    itemId: string;
}

// 【核心修改】移除 React.FC，使用现代写法
const TemplateModalContent = ({itemId}: TemplateModalContentProps): JSX.Element => {
    return (
        <Box
            sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <Typography
                variant="h5"
                sx={{
                    mb: 2,
                    pt: '2px',
                }}
            >
                模板弹窗详情: {itemId}
            </Typography>

            <Box
                sx={{
                    flexGrow: 1,
                    border: '1px dashed grey',
                    p: 2,
                    overflow: 'auto',
                }}
            >
                <Typography>
                    这里是模板弹窗的详细信息占位符，ID 为 {itemId}。
                </Typography>
            </Box>
        </Box>
    );
};

export default TemplateModalContent;