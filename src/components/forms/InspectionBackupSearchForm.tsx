/**
 * 文件名: src/components/forms/InspectionBackupSearchForm.tsx
 *
 * 本次修改内容:
 * - 【全局配置】移除了此组件内部的 `LocalizationProvider` 及其相关导入。
 * - 该功能现已提升至 `MainLayout.tsx` 进行全局统一配置，此组件会自动继承中文本地化设置。
 *
 * 文件功能描述:
 * 此文件定义了“巡检备份”功能的搜索表单组件。
 */
import { useState, type FC } from 'react';
import {
    Box, TextField, Button, Stack, InputLabel, MenuItem, FormControl, Select, Typography
} from '@mui/material';
// 【修改】移除 LocalizationProvider 相关导入
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
// 【修改】移除 dayjs locale 导入

export interface InspectionBackupSearchValues {
    region: string; startTime: Dayjs | null; endTime: Dayjs | null; serverType: string; operationType: string; updateCategory: string;
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

    const handleSearchClick = (): void => { onSearch({ region, startTime, endTime, serverType, operationType, updateCategory }); };
    const handleResetClick = (): void => {
        setRegion(''); setStartTime(null); setEndTime(null); setServerType(''); setOperationType(''); setUpdateCategory('');
        if (onReset) onReset();
    };

    return (
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
                <TextField fullWidth margin="normal" label="地区" variant="outlined" value={region} onChange={(e) => setRegion(e.target.value)} />
                <TextField fullWidth margin="normal" label="服务器类型" variant="outlined" value={serverType} onChange={(e) => setServerType(e.target.value)} />
                <TextField fullWidth margin="normal" label="更新类别" variant="outlined" value={updateCategory} onChange={(e) => setUpdateCategory(e.target.value)} />
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel id="operation-type-label">操作类型</InputLabel>
                    <Select labelId="operation-type-label" id="operation-type-select" value={operationType} label="操作类型" onChange={(e) => setOperationType(e.target.value as string)}>
                        <MenuItem value=""><em>选择操作类型</em></MenuItem>
                        <MenuItem value="inspection"><Typography component="span" sx={{ transform: 'translateY(1px)' }}>巡检</Typography></MenuItem>
                        <MenuItem value="backup"><Typography component="span" sx={{ transform: 'translateY(1px)' }}>备份</Typography></MenuItem>
                    </Select>
                </FormControl>

                {/* 【修改】移除 LocalizationProvider 包裹 */}
                <DatePicker label="起始时间" value={startTime} onChange={(newValue) => setStartTime(newValue)} format="YYYY-MM-DD" slotProps={{ textField: { fullWidth: true, margin: 'normal' } }} />
                <DatePicker label="截止时间" value={endTime} onChange={(newValue) => setEndTime(newValue)} format="YYYY-MM-DD" slotProps={{ textField: { fullWidth: true, margin: 'normal' } }} />
            </Box>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexShrink: 0 }}>
                {onReset && (
                    <Button variant="outlined" onClick={handleResetClick} fullWidth sx={{ height: 48, borderRadius: 99, borderColor: 'neutral.main', color: 'neutral.main', '&:hover': { bgcolor: 'custom.hoverOpacity', borderColor: 'neutral.main' } }}>
                        <Typography component="span" sx={{ transform: 'translateY(1px)', fontWeight: 500 }}>重置</Typography>
                    </Button>
                )}
                <Button variant="contained" onClick={handleSearchClick} fullWidth sx={{ height: 48, borderRadius: 99, bgcolor: 'neutral.main', color: 'neutral.contrastText', boxShadow: 'none', '&:hover': { bgcolor: 'neutral.dark', boxShadow: 'none' } }}>
                    <Typography component="span" sx={{ transform: 'translateY(1px)', fontWeight: 500 }}>搜索</Typography>
                </Button>
            </Stack>
        </Stack>
    );
};

export default InspectionBackupSearchForm;