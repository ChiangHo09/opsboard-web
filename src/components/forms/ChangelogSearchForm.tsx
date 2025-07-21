/**
 * 文件名: src/components/forms/ChangelogSearchForm.tsx
 *
 * 本次修改内容:
 * - 【全局配置】移除了此组件内部的 `LocalizationProvider` 及其相关导入。
 * - 该功能现已提升至 `MainLayout.tsx` 进行全局统一配置，此组件会自动继承中文本地化设置。
 *
 * 文件功能描述:
 * 此文件定义了更新日志搜索表单组件（ChangelogSearchForm）。
 */
import React, { useState } from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';
// 【修改】移除 LocalizationProvider 相关导入
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Dayjs } from 'dayjs';
// 【修改】移除 dayjs locale 导入

export interface ChangelogSearchValues {
    region: string;
    startTime: Dayjs | null;
    endTime: Dayjs | null;
    serverType: string;
    updateCategory: string;
}

interface ChangelogSearchFormProps {
    onSearch: (values: ChangelogSearchValues) => void;
    onReset?: () => void;
}

const ChangelogSearchForm: React.FC<ChangelogSearchFormProps> = ({ onSearch, onReset }) => {
    const [region, setRegion] = useState<string>('');
    const [serverType, setServerType] = useState<string>('');
    const [updateCategory, setUpdateCategory] = useState<string>('');
    const [startTime, setStartTime] = useState<Dayjs | null>(null);
    const [endTime, setEndTime] = useState<Dayjs | null>(null);

    const handleSearchClick = (): void => {
        onSearch({ region, startTime, endTime, serverType, updateCategory });
    };

    const handleResetClick = (): void => {
        setRegion(''); setServerType(''); setUpdateCategory(''); setStartTime(null); setEndTime(null);
        if (onReset) onReset();
    };

    return (
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
                <TextField fullWidth margin="normal" label="地区" variant="outlined" value={region} onChange={(e) => setRegion(e.target.value)} />
                <TextField fullWidth margin="normal" label="服务器类型" variant="outlined" value={serverType} onChange={(e) => setServerType(e.target.value)} />
                <TextField fullWidth margin="normal" label="更新类别" variant="outlined" value={updateCategory} onChange={(e) => setUpdateCategory(e.target.value)} />

                {/* 【修改】移除 LocalizationProvider 包裹 */}
                <DatePicker label="起始时间" value={startTime} onChange={(newValue) => setStartTime(newValue)} format="YYYY-MM-DD" slotProps={{ textField: { fullWidth: true, margin: 'normal' } }} />
                <DatePicker label="截止时间" value={endTime} onChange={(newValue) => setEndTime(newValue)} format="YYYY-MM-DD" slotProps={{ textField: { fullWidth: true, margin: 'normal' } }} />
            </Box>
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexShrink: 0 }}>
                {onReset && (
                    <Button variant="outlined" onClick={handleResetClick} fullWidth sx={{ height: 48, borderRadius: 99, borderColor: 'neutral.main', color: 'neutral.main', '&:hover': { bgcolor: 'custom.hoverOpacity', borderColor: 'neutral.main' } }}>
                        重置
                    </Button>
                )}
                <Button variant="contained" onClick={handleSearchClick} fullWidth sx={{ height: 48, borderRadius: 99, bgcolor: 'neutral.main', color: 'neutral.contrastText', boxShadow: 'none', '&:hover': { bgcolor: 'neutral.dark', boxShadow: 'none' } }}>
                    搜索
                </Button>
            </Stack>
        </Stack>
    );
};

export default ChangelogSearchForm;