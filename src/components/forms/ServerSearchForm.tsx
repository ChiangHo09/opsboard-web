/**
 * 文件功能：
 * 此文件定义了服务器搜索表单组件（ServerSearchForm）。
 * 这是一个完全独立的、可复用的组件，封装了服务器搜索所需的所有UI输入字段、内部状态管理以及操作按钮（重置/搜索）。
 * 它通过 onSearch prop 将最终的搜索条件对象向上提交给使用它的父页面组件。
 *
 * 本次修改：
 * - 根据用户要求，将底部操作按钮的颜色主题恢复为之前的“深灰色”方案。
 * - 新增了自定义样式，将所有文本输入框（TextField）在聚焦（focused）状态下的轮廓线和标签颜色从默认的蓝色修改为深灰色（#424242），以增强表单的视觉统一性。
 */
import React, { useState } from 'react';
import { Box, TextField, Button, Stack, Typography } from '@mui/material';

// 定义此表单将向外提交的数据结构，提供类型安全
export interface ServerSearchValues {
    customerName: string;
    serverName: string;
    ip: string;
    enabledStatus: string;
}

// 定义组件的 Props 接口，明确与父组件的契约
interface ServerSearchFormProps {
    onSearch: (values: ServerSearchValues) => void;
    onReset?: () => void;
}

const ServerSearchForm: React.FC<ServerSearchFormProps> = ({ onSearch, onReset }) => {
    // 1. 表单自己管理自己的内部状态
    const [customerName, setCustomerName] = useState('');
    const [serverName, setServerName] = useState('');
    const [ip, setIp] = useState('');
    const [enabledStatus, setEnabledStatus] = useState('');

    const handleSearchClick = () => {
        onSearch({ customerName, serverName, ip, enabledStatus });
    };

    const handleResetClick = () => {
        setCustomerName('');
        setServerName('');
        setIp('');
        setEnabledStatus('');
        if (onReset) {
            onReset();
        }
    };

    // 为 TextField 定义统一的样式
    const textFieldSx = {
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#424242', // 聚焦时轮廓颜色
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#424242', // 聚焦时标签颜色
        },
    } as const;

    return (
        // 使用 Stack 布局，将表单内容和操作按钮垂直分开
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 表单字段区域，允许垂直滚动 */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="客户名称"
                    variant="outlined"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    sx={textFieldSx}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="服务器名称"
                    variant="outlined"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    sx={textFieldSx}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="IP 地址"
                    variant="outlined"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    sx={textFieldSx}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="启用状态"
                    variant="outlined"
                    value={enabledStatus}
                    onChange={(e) => setEnabledStatus(e.target.value)}
                    sx={textFieldSx}
                />
            </Box>
            {/* 操作按钮区域，固定在底部 */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexShrink: 0 }}>
                {onReset && (
                    <Button
                        variant="outlined"
                        onClick={handleResetClick}
                        fullWidth
                        sx={{
                            height: 48,
                            borderRadius: 99,
                            borderColor: '#424242', // 恢复为深灰色轮廓
                            color: '#424242',
                            '&:hover': {
                                bgcolor: 'rgba(66, 66, 66, 0.04)',
                                borderColor: '#424242',
                            }
                        }}
                    >
                        <Typography component="span" sx={{ transform: 'translateY(1px)', fontWeight: 500 }}>
                            重置
                        </Typography>
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={handleSearchClick}
                    fullWidth
                    sx={{
                        height: 48,
                        borderRadius: 99,
                        bgcolor: '#424242', // 恢复为深灰色背景
                        color: '#fff',
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#333333',
                            boxShadow: 'none',
                        }
                    }}
                >
                    <Typography component="span" sx={{ transform: 'translateY(1px)', fontWeight: 500 }}>
                        搜索
                    </Typography>
                </Button>
            </Stack>
        </Stack>
    );
};

export default ServerSearchForm;