/**
 * 文件名：InspectionBackupSearchForm.tsx
 * 描述：此文件定义了“巡检备份”功能的搜索表单组件。
 *
 * 本次修改：
 * - 【核心简化】移除了本地的 `textFieldSx` 样式对象。因为相关的焦点样式（边框和标签颜色）现在已通过 `theme.ts` 在全局统一配置，不再需要局部覆盖。
 * - 【颜色常量化】更新了底部操作按钮的样式，使其颜色值从硬编码改为引用自全局主题（`theme.palette`），以实现颜色的统一管理。
 */
import React, { useState, type FC } from 'react';
import {
    Box,
    TextField,
    Button,
    Stack,
    InputLabel,
    MenuItem,
    FormControl,
    Select,
    Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Dayjs } from 'dayjs';

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

const InspectionBackupSearchForm: FC<InspectionBackupSearchFormProps> = ({ onSearch, onReset }) => {
    const [region, setRegion] = useState<string>('');
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);
    const [serverType, setServerType] = useState<string>('');
    const [operationType, setOperationType] = useState<string>('');
    const [updateCategory, setUpdateCategory] = useState<string>('');

    const handleSearchClick = (): void => {
        onSearch({
            region,
            startTime,
            endTime,
            serverType,
            operationType,
            updateCategory
        });
    };

    const handleResetClick = (): void => {
        setRegion('');
        setStartTime(null);
        setEndTime(null);
        setServerType('');
        setOperationType('');
        setUpdateCategory('');
        if (onReset) {
            onReset();
        }
    };

    // 【移除】不再需要本地的 textFieldSx，样式已在 theme.ts 中全局定义

    return (
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="地区"
                    variant="outlined"
                    value={region}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegion(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="服务器类型"
                    variant="outlined"
                    value={serverType}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setServerType(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="更新类别"
                    variant="outlined"
                    value={updateCategory}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateCategory(e.target.value)}
                />

                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="operation-type-label">操作类型</InputLabel>
                    <Select
                        labelId="operation-type-label"
                        id="operation-type-select"
                        value={operationType}
                        label="操作类型"
                        onChange={(e) => setOperationType(e.target.value as string)}
                    >
                        <MenuItem value=""><em>选择操作类型</em></MenuItem>
                        <MenuItem value="inspection">
                            <Typography component="span" sx={{ transform: 'translateY(1px)' }}>巡检</Typography>
                        </MenuItem>
                        <MenuItem value="backup">
                            <Typography component="span" sx={{ transform: 'translateY(1px)' }}>备份</Typography>
                        </MenuItem>
                    </Select>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="起始时间"
                        value={startTime}
                        onChange={(newValue: Dayjs | null) => setStartTime(newValue)}
                        format="YYYY-MM-DD"
                        slotProps={{
                            textField: { fullWidth: true, margin: 'normal' }
                        }}
                    />
                    <DatePicker
                        label="截止时间"
                        value={endTime}
                        onChange={(newValue: Dayjs | null) => setEndTime(newValue)}
                        format="YYYY-MM-DD"
                        slotProps={{
                            textField: { fullWidth: true, margin: 'normal' }
                        }}
                    />
                </LocalizationProvider>
            </Box>

            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexShrink: 0 }}>
                {onReset && (
                    <Button
                        variant="outlined"
                        onClick={handleResetClick}
                        fullWidth
                        sx={{
                            height: 48,
                            borderRadius: 99,
                            borderColor: 'neutral.main', // 使用主题颜色
                            color: 'neutral.main',       // 使用主题颜色
                            '&:hover': {
                                bgcolor: 'custom.hoverOpacity', // 使用主题颜色
                                borderColor: 'neutral.main',    // 使用主题颜色
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
                        bgcolor: 'neutral.main',            // 使用主题颜色
                        color: 'neutral.contrastText',      // 使用主题颜色
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: 'neutral.dark',        // 使用主题颜色
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

export default InspectionBackupSearchForm;