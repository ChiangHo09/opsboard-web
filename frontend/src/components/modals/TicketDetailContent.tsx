/**
 * 文件名: src/components/modals/TicketDetailContent.tsx
 *
 * 文件功能描述:
 * 此文件提供了工单详情内容的具体实现。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {Box, Typography} from '@mui/material';
import type { JSX } from 'react';

export interface TicketDetailContentProps {
    ticketId: string;
}

// 【核心修改】移除 React.FC，使用现代写法
const TicketDetailContent = ({ticketId}: TicketDetailContentProps): JSX.Element => {
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
                工单详情: {ticketId}
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
                    这里是工单的详细信息占位符，ID 为 {ticketId}。
                </Typography>
                <Typography sx={{mt: 2}}>
                    这里可以渲染更复杂的工单数据，例如操作步骤、日志、附件等。
                </Typography>
            </Box>
        </Box>
    );
};

export default TicketDetailContent;