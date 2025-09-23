/**
 * @file src/components/forms/ServerSearchForm.tsx
 * @description 此文件定义了服务器搜索表单组件（ServerSearchForm）。
 * @modification
 *   - [Bug修复]：修复 `TS6133: 'child' is declared but its value is never read.` 警告。将 `handleChange` 函数签名中的未使用参数 `child` 更名为 `_child`，以明确表示其为有意未使用的参数。
 *   - [Bug修复]：更新 `handleChange` 函数签名，使其兼容 `TextField` 组件的 `onChange` 事件类型，解决 `TS2322` 错误。
 *   - [性能优化]：使用 `React.memo` 包裹 `ServerSearchForm` 组件，以减少不必要的重新渲染。
 *   - [性能优化]：将所有独立的 `useState` 钩子合并为一个单一的 `useState` 对象，管理所有表单字段值，减少状态更新次数。
 *   - [性能优化]：为每个输入字段的 `onChange` 处理函数创建记忆化的 `useCallback` 钩子，确保函数引用稳定，从而允许子组件进行更有效的渲染优化。
 *   - [组件写法现代化]：移除了 `React.FC`，采用了现代的函数组件定义方式，并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {useState, type JSX, memo, useCallback, type ChangeEvent} from 'react';
import {Box, TextField, Button, Stack, Typography, type SelectChangeEvent} from '@mui/material';

// 定义一个联合类型，用于处理 TextField 和 Select 的 onChange 事件
type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>;

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

const ServerSearchForm = memo(({onSearch, onReset}: ServerSearchFormProps): JSX.Element => {
    const [formValues, setFormValues] = useState<ServerSearchValues>({
        customerName: '',
        serverName: '',
        ip: '',
        enabledStatus: ''
    });

    // 【核心修改】将 child 参数更名为 _child
    const handleChange = useCallback((e: FormChangeEvent, _child?: React.ReactNode) => {
        const name = (e.target as { name?: string }).name || '';
        const value = e.target.value;

        if (name) {
            setFormValues(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }, []);

    const handleSearchClick = useCallback(() => {
        onSearch(formValues);
    }, [onSearch, formValues]);

    const handleResetClick = useCallback(() => {
        setFormValues({
            customerName: '',
            serverName: '',
            ip: '',
            enabledStatus: ''
        });
        if (onReset) {
            onReset();
        }
    }, [onReset]);

    return (
        <Stack spacing={2} sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box sx={{flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1}}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="客户名称"
                    variant="outlined"
                    name="customerName"
                    value={formValues.customerName}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="服务器名称"
                    variant="outlined"
                    name="serverName"
                    value={formValues.serverName}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="IP 地址"
                    variant="outlined"
                    name="ip"
                    value={formValues.ip}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="启用状态"
                    variant="outlined"
                    name="enabledStatus"
                    value={formValues.enabledStatus}
                    onChange={handleChange}
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
});

export default ServerSearchForm;