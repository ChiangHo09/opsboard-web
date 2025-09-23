/**
 * @file src/components/forms/TicketSearchForm.tsx
 * @description 此文件定义了【工单搜索表单】组件（TicketSearchForm）。
 * @modification
 *   - [Bug修复]：修复 `TS6133: 'child' is declared but its value is never read.` 警告。将 `handleChange` 函数签名中的未使用参数 `child` 更名为 `_child`，以明确表示其为有意未使用的参数。
 *   - [Bug修复]：更新 `handleChange` 函数签名，使其兼容 `TextField` 和 `TextField select` 组件的 `onChange` 事件类型，解决 `TS2322` 错误。
 *   - [性能优化]：使用 `React.memo` 包裹 `TicketSearchForm` 组件，以减少不必要的重新渲染。
 *   - [性能优化]：将所有独立的 `useState` 钩子合并为一个单一的 `useState` 对象，管理所有表单字段值，减少状态更新次数。
 *   - [性能优化]：为每个输入字段的 `onChange` 处理函数创建记忆化的 `useCallback` 钩子，确保函数引用稳定，从而允许子组件进行更有效的渲染优化。
 *   - [组件写法现代化]：移除了 `React.FC`，采用了现代的函数组件定义方式，并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {useState, type JSX, memo, useCallback, type ChangeEvent} from 'react';
import {Box, TextField, Button, Stack, Typography, MenuItem, type SelectChangeEvent} from '@mui/material';

export interface TicketSearchValues {
    region: string;
    customerName: string;
    status: string;
    category: string;
}

interface TicketSearchFormProps {
    onSearch: (values: TicketSearchValues) => void;
    onReset?: () => void;
}

// 定义一个联合类型，用于处理 TextField 和 Select 的 onChange 事件
type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>;

const TicketSearchForm = memo(({onSearch, onReset}: TicketSearchFormProps): JSX.Element => {
    const [formValues, setFormValues] = useState<TicketSearchValues>({
        region: '',
        customerName: '',
        status: '',
        category: ''
    });

    // 【核心修改】将 child 参数更名为 _child
    const handleChange = useCallback((e: FormChangeEvent, _child?: React.ReactNode) => {
        // 安全地获取 name 和 value，因为 SelectChangeEvent 的 name 可能是可选的
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
            region: '',
            customerName: '',
            status: '',
            category: ''
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
                    label="区域"
                    variant="outlined"
                    name="region"
                    value={formValues.region}
                    onChange={handleChange}
                />

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
                    select
                    margin="normal"
                    label="状态"
                    name="status"
                    value={formValues.status}
                    onChange={handleChange}
                >
                    <MenuItem value="挂起">挂起</MenuItem>
                    <MenuItem value="就绪">就绪</MenuItem>
                </TextField>

                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="类别"
                    name="category"
                    value={formValues.category}
                    onChange={handleChange}
                >
                    <MenuItem value="更新">更新</MenuItem>
                    <MenuItem value="备份">备份</MenuItem>
                    <MenuItem value="巡检">巡检</MenuItem>
                </TextField>
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

export default TicketSearchForm;