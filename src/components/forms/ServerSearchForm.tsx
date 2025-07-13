/*
 * [文件用途说明]
 * - 此文件定义了服务器搜索表单组件（ServerSearchForm）。
 * - 这是一个完全独立的、可复用的组件，封装了服务器搜索所需的所有UI输入字段、内部状态管理以及操作按钮（重置/搜索）。
 * - 它通过 onSearch prop 将最终的搜索条件对象向上提交给使用它的父页面组件。
 *
 * [本次修改记录]
 * - 新建文件，作为重构的第一步，将原本在 Servers.tsx 中零散的表单UI和逻辑聚合于此。
 */
import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';

// 定义此表单将向外提交的数据结构，提供类型安全
export interface ServerSearchValues {
    ip: string;
    serverName: string;
    status: string;
}

// 定义组件的 Props 接口，明确与父组件的契约
interface ServerSearchFormProps {
    onSearch: (values: ServerSearchValues) => void;
    onReset?: () => void;
}

const ServerSearchForm: React.FC<ServerSearchFormProps> = ({ onSearch, onReset }) => {
    // 1. 表单自己管理自己的内部状态
    const [ip, setIp] = useState('');
    const [serverName, setServerName] = useState('');
    const [status, setStatus] = useState('');

    const handleSearchClick = () => {
        // 2. 当搜索时，将内部状态组合成对象，通过 prop 回调给父页面
        onSearch({ ip, serverName, status });
    };

    const handleResetClick = () => {
        // 3. 重置时，清空自己的状态，并调用外部传入的 onReset
        setIp('');
        setServerName('');
        setStatus('');
        if (onReset) {
            onReset();
        }
    };

    return (
        // 使用 Stack 布局，将表单内容和操作按钮垂直分开
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 表单字段区域，允许垂直滚动 */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="IP 地址"
                    variant="outlined"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="服务器名称"
                    variant="outlined"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="状态"
                    variant="outlined"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
            </Box>
            {/* 操作按钮区域，固定在底部 */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end', flexShrink: 0 }}>
                {onReset && <Button variant="outlined" onClick={handleResetClick} size="large">重置</Button>}
                <Button variant="contained" onClick={handleSearchClick} size="large">搜索</Button>
            </Stack>
        </Stack>
    );
};

export default ServerSearchForm;