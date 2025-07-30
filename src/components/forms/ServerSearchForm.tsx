/**
 * 文件名：src/components/forms/ServerSearchForm.tsx
 * 描述：此文件定义了服务器搜索表单组件（ServerSearchForm）。
 *
 * 本次修改：
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {useState, type JSX} from 'react';
import {Box, TextField, Button, Stack, Typography} from '@mui/material';

export interface ServerSearchValues {
    customerName: string;
    serverName: string;
    ip: string;
    enabledStatus: string;
}

interface ServerSearchFormProps {
    onSearch: (values: ServerSearchValues) => void;
    onReset?: () => void;
}

// 【核心修改】移除 React.FC，使用现代写法
const ServerSearchForm = ({onSearch, onReset}: ServerSearchFormProps): JSX.Element => {
    const [customerName, setCustomerName] = useState('');
    const [serverName, setServerName] = useState('');
    const [ip, setIp] = useState('');
    const [enabledStatus, setEnabledStatus] = useState('');

    const handleSearchClick = () => {
        onSearch({customerName, serverName, ip, enabledStatus});
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

    return (
        <Stack spacing={2} sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box sx={{flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1}}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="客户名称"
                    variant="outlined"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
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
                    label="IP 地址"
                    variant="outlined"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="启用状态"
                    variant="outlined"
                    value={enabledStatus}
                    onChange={(e) => setEnabledStatus(e.target.value)}
                />
            </Box>
            <Stack direction="row" spacing={2} sx={{justifyContent: 'center', flexShrink: 0}}>
                {onReset && (
                    <Button
                        variant="outlined"
                        onClick={handleResetClick}
                        fullWidth
                        sx={{
                            height: 48,
                            borderRadius: 99,
                            borderColor: 'neutral.main',
                            color: 'neutral.main',
                            '&:hover': {
                                bgcolor: 'custom.hoverOpacity',
                                borderColor: 'neutral.main',
                            }
                        }}
                    >
                        <Typography component="span" sx={{transform: 'translateY(1px)', fontWeight: 500}}>
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
                        bgcolor: 'neutral.main',
                        color: 'neutral.contrastText',
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: 'neutral.dark',
                            boxShadow: 'none',
                        }
                    }}
                >
                    <Typography component="span" sx={{transform: 'translateY(1px)', fontWeight: 500}}>
                        搜索
                    </Typography>
                </Button>
            </Stack>
        </Stack>
    );
};

export default ServerSearchForm;