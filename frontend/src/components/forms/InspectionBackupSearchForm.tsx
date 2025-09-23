/**
 * @file src/components/forms/InspectionBackupSearchForm.tsx
 * @description 此文件定义了“巡检备份”功能的搜索表单组件。
 * @modification
 *   - [Bug修复]：修复 `TS6133: 'child' is declared but its value is never read.` 警告。将 `handleChange` 函数签名中的未使用参数 `child` 更名为 `_child`，以明确表示其为有意未使用的参数。
 *   - [Bug修复]：更新 `handleChange` 函数签名，使其兼容 `TextField` 和 `Select` 组件的 `onChange` 事件类型，解决 `TS2322` 错误。
 *   - [性能优化]：使用 `React.memo` 包裹 `InspectionBackupSearchForm` 组件，以减少不必要的重新渲染。
 *   - [性能优化]：将所有独立的 `useState` 钩子合并为一个单一的 `useState` 对象，管理所有表单字段值，减少状态更新次数。
 *   - [性能优化]：为每个输入字段的 `onChange` 处理函数创建记忆化的 `useCallback` 钩子，确保函数引用稳定，从而允许子组件进行更有效的渲染优化。
 *   - [组件写法现代化]：移除了 `React.FC`，采用了现代的函数组件定义方式，并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {useState, type JSX, memo, useCallback, type ChangeEvent} from 'react';
import {
    Box, TextField, Button, Stack, InputLabel, MenuItem, FormControl, Select, Typography, type SelectChangeEvent
} from '@mui/material';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {type Dayjs} from 'dayjs';

// 定义一个联合类型，用于处理 TextField 和 Select 的 onChange 事件
type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>;

export interface InspectionBackupSearchValues {
    region: string;
    startTime: Dayjs | null;
    endTime: Dayjs | null;
    serverType: string;
    operationType: string;
    updateCategory: string;
}

interface InspectionBackupSearchFormProps {
    onSearch: (values: InspectionBackupSearchValues) => void;
    onReset?: () => void;
}

const InspectionBackupSearchForm = memo(({onSearch, onReset}: InspectionBackupSearchFormProps): JSX.Element => {
    const [formValues, setFormValues] = useState<InspectionBackupSearchValues>({
        region: '',
        startTime: null,
        endTime: null,
        serverType: '',
        operationType: '',
        updateCategory: ''
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

    const handleDateChange = useCallback((field: 'startTime' | 'endTime') => (newValue: Dayjs | null) => {
        setFormValues(prev => ({
            ...prev,
            [field]: newValue
        }));
    }, []);

    const handleSearchClick = useCallback((): void => {
        onSearch(formValues);
    }, [onSearch, formValues]);

    const handleResetClick = useCallback((): void => {
        setFormValues({
            region: '',
            startTime: null,
            endTime: null,
            serverType: '',
            operationType: '',
            updateCategory: ''
        });
        if (onReset) onReset();
    }, [onReset]);

    return (
        <Stack spacing={2} sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box sx={{flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1}}>
                <TextField fullWidth margin="normal" label="地区" variant="outlined"
                           name="region"
                           value={formValues.region}
                           onChange={handleChange}/>
                <TextField fullWidth margin="normal" label="服务器类型" variant="outlined"
                           name="serverType"
                           value={formValues.serverType}
                           onChange={handleChange}/>
                <TextField fullWidth margin="normal" label="更新类别" variant="outlined"
                           name="updateCategory"
                           value={formValues.updateCategory}
                           onChange={handleChange}/>
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="operation-type-label">操作类型</InputLabel>
                    <Select labelId="operation-type-label" id="operation-type-select"
                            name="operationType"
                            value={formValues.operationType}
                            label="操作类型"
                            onChange={handleChange}
                    >
                        <MenuItem value=""><em>选择操作类型</em></MenuItem>
                        <MenuItem value="inspection"><Typography component="span"
                                                                 sx={{transform: 'translateY(1px)'}}>巡检</Typography></MenuItem>
                        <MenuItem value="backup"><Typography component="span"
                                                             sx={{transform: 'translateY(1px)'}}>备份</Typography></MenuItem>
                    </Select>
                </FormControl>

                <DatePicker label="起始时间"
                            value={formValues.startTime}
                            onChange={handleDateChange('startTime')}
                            format="YYYY-MM-DD" slotProps={{textField: {fullWidth: true, margin: 'normal'}}}/>
                <DatePicker label="截止时间"
                            value={formValues.endTime}
                            onChange={handleDateChange('endTime')}
                            format="YYYY-MM-DD" slotProps={{textField: {fullWidth: true, margin: 'normal'}}}/>
            </Box>
            <Stack direction="row" spacing={2} sx={{justifyContent: 'center', flexShrink: 0}}>
                {onReset && (
                    <Button variant="outlined"
                            onClick={handleResetClick}
                            fullWidth sx={{
                        height: 48,
                        borderRadius: 99,
                        borderColor: 'neutral.main',
                        color: 'neutral.main',
                        '&:hover': {bgcolor: 'custom.hoverOpacity', borderColor: 'neutral.main'}
                    }}>
                        <Typography component="span"
                                    sx={{transform: 'translateY(1px)', fontWeight: 500}}>重置</Typography>
                    </Button>
                )}
                <Button variant="contained"
                        onClick={handleSearchClick}
                        fullWidth sx={{
                    height: 48,
                    borderRadius: 99,
                    bgcolor: 'neutral.main',
                    color: 'neutral.contrastText',
                    boxShadow: 'none',
                    '&:hover': {bgcolor: 'neutral.dark', boxShadow: 'none'}
                }}>
                    <Typography component="span" sx={{transform: 'translateY(1px)', fontWeight: 500}}>搜索</Typography>
                </Button>
            </Stack>
        </Stack>
    );
});

export default InspectionBackupSearchForm;