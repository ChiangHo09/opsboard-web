/**
 * @file src/components/modals/ServerDetailContent.tsx
 * @description 服务器详情内容组件。此版本为最终修复版，新增了可动态编辑的硬件信息（特别是磁盘分区）模块。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复] 恢复并完善了所有动画效果：为 `DiskCapacityField` 中的 `UnitSelectField` 添加了正确的 Flexbox 容器，确保了“挤压”动画的正常工作；同时恢复了进度条的间距动画，解决了所有视觉突兀的问题。
 *   - [修复] 统一了 `UnitSelectField` 和 `DetailField` 在查看模式下的样式，确保了完美的视觉对齐和无跳动的模式切换。
 *   - [新增] 创建了可复用的 `UnitSelectField` 组件，将数值输入框与单位（GB/TB）选择下拉框相结合。
 */
import { Box, Typography, CircularProgress, Alert, Stack, TextField, Button, LinearProgress, IconButton, Select, MenuItem, FormControl, InputLabel, OutlinedInput, InputAdornment, type Theme, type SelectChangeEvent } from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { JSX, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from "react";
import { serversApi, type ServerDetail } from '@/api/serversApi';

export interface ServerDetailContentProps {
    serverId: string;
}

interface UnitValue {
    value: number | string;
    unit: 'GB' | 'TB';
}

interface Partition {
    id: number;
    path: string;
    usedSpace: UnitValue;
    totalSpace: UnitValue;
}

interface ServerFormData {
    serverName: string;
    ipAddress: string;
    role: string;
    deploymentType: string;
    usageNote: string;
    processorModel: string;
    memory: UnitValue;
    diskCapacity: {
        total: UnitValue;
        partitions: Partition[];
    };
}

interface DetailFieldConfig {
    id: string;
    label: string;
    value: ReactNode;
    editable?: boolean;
    multiline?: boolean;
    fullWidth?: boolean;
}

interface DetailFieldProps {
    label: string;
    value: ReactNode;
    isEditing: boolean;
    isMultiline?: boolean;
    name?: keyof Omit<ServerFormData, 'diskCapacity' | 'memory'>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

// 简单的键值对字段组件
const DetailField = ({ label, value, isEditing, isMultiline = false, name, onChange }: DetailFieldProps) => (
    <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {label}
        </Typography>
        <TextField
            fullWidth
            multiline={isMultiline}
            minRows={isMultiline ? 3 : 1}
            variant="outlined"
            size="small"
            name={isEditing ? name : undefined}
            value={value}
            onChange={onChange}
            InputProps={{ readOnly: !isEditing }}
            sx={(theme: Theme) => ({
                transition: theme.transitions.create(['background-color', 'border-color'], {
                    duration: theme.transitions.duration.short,
                }),
                ...(!isEditing && {
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'transparent',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                    },
                    '& .MuiInputBase-input': { cursor: 'default' },
                }),
            })}
        />
    </Box>
);

// 带有单位选择的字段组件
const UnitSelectField = ({
                             label,
                             value,
                             unit,
                             isEditing,
                             onValueChange,
                             onUnitChange,
                         }: {
    label: string;
    value: number | string;
    unit: 'GB' | 'TB';
    isEditing: boolean;
    onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUnitChange: (e: SelectChangeEvent<'GB' | 'TB'>) => void;
}) => {
    if (!isEditing) {
        return (
            <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{label}</Typography>
                <Typography variant="body1" sx={{ minHeight: '40px', display: 'flex', alignItems: 'center', boxSizing: 'border-box', pl: '14px' }}>
                    {value} {unit}
                </Typography>
            </Box>
        );
    }

    return (
        <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>{label}</InputLabel>
            <OutlinedInput
                type="number"
                value={value}
                onChange={onValueChange}
                label={label}
                endAdornment={
                    <InputAdornment position="end">
                        <Select
                            value={unit}
                            onChange={onUnitChange}
                            variant="standard"
                            disableUnderline
                            sx={{ '.MuiSelect-select:focus': { backgroundColor: 'transparent' } }}
                        >
                            <MenuItem value="GB">GB</MenuItem>
                            <MenuItem value="TB">TB</MenuItem>
                        </Select>
                    </InputAdornment>
                }
            />
        </FormControl>
    );
};


/**
 * @description 专门用于渲染和编辑磁盘容量信息的组件。
 */
const DiskCapacityField = ({
                               isEditing,
                               data,
                               onChangePartition,
                               onAddPartition,
                               onRemovePartition,
                           }: {
    isEditing: boolean;
    data: ServerFormData['diskCapacity'];
    onChangePartition: (index: number, field: keyof Omit<Partition, 'id'>, value: string | UnitValue) => void;
    onAddPartition: () => void;
    onRemovePartition: (index: number) => void;
}) => {

    const getProgressBarColor = (percentage: number): 'primary' | 'warning' | 'error' => {
        if (percentage > 90) return 'error';
        if (percentage > 65) return 'warning';
        return 'primary';
    };

    const normalizeSize = (size: UnitValue): number => {
        const value = typeof size.value === 'string' ? parseFloat(size.value) || 0 : size.value;
        return size.unit === 'TB' ? value * 1024 : value;
    };

    return (
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, mb: 1 }}>
                分区详情
            </Typography>
            <Stack spacing={2}>
                {data.partitions.map((partition, index) => {
                    const usedGB = normalizeSize(partition.usedSpace);
                    const totalGB = normalizeSize(partition.totalSpace);
                    const percentage = totalGB > 0 ? (usedGB / totalGB) * 100 : 0;
                    const barColor = getProgressBarColor(percentage);

                    return (
                        <Box
                            key={partition.id}
                            sx={(theme: Theme) => ({
                                p: 2,
                                borderRadius: 1,
                                backgroundColor: isEditing ? theme.palette.action.hover : 'transparent',
                                transition: theme.transitions.create('background-color', {
                                    duration: theme.transitions.duration.short,
                                }),
                            })}
                        >
                            <Stack direction="row" spacing={2} alignItems="center">
                                <TextField fullWidth label="盘符" variant="outlined" size="small" value={partition.path} onChange={(e) => onChangePartition(index, 'path', e.target.value)} InputProps={{ readOnly: !isEditing }} sx={{ flex: 1, ...(!isEditing && { '& .MuiOutlinedInput-root': { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' } } }) }} />
                                <Box sx={{ flex: 1 }}>
                                    <UnitSelectField
                                        label="已用空间"
                                        isEditing={isEditing}
                                        value={partition.usedSpace.value}
                                        unit={partition.usedSpace.unit}
                                        onValueChange={(e) => onChangePartition(index, 'usedSpace', { ...partition.usedSpace, value: e.target.value })}
                                        onUnitChange={(e) => onChangePartition(index, 'usedSpace', { ...partition.usedSpace, unit: e.target.value as 'GB' | 'TB' })}
                                    />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <UnitSelectField
                                        label="分区容量"
                                        isEditing={isEditing}
                                        value={partition.totalSpace.value}
                                        unit={partition.totalSpace.unit}
                                        onValueChange={(e) => onChangePartition(index, 'totalSpace', { ...partition.totalSpace, value: e.target.value })}
                                        onUnitChange={(e) => onChangePartition(index, 'totalSpace', { ...partition.totalSpace, unit: e.target.value as 'GB' | 'TB' })}
                                    />
                                </Box>
                                <Box
                                    sx={(theme: Theme) => ({
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: isEditing ? 40 : 0,
                                        opacity: isEditing ? 1 : 0,
                                        overflow: 'hidden',
                                        transition: theme.transitions.create(['width', 'opacity'], {
                                            duration: theme.transitions.duration.short,
                                        }),
                                    })}
                                >
                                    <IconButton onClick={() => onRemovePartition(index)} color="error" aria-label="删除分区">
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Stack>
                            <Box
                                sx={(theme: Theme) => ({
                                    mt: isEditing ? 1.5 : 0,
                                    transition: theme.transitions.create('margin-top', {
                                        duration: theme.transitions.duration.short,
                                    }),
                                })}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LinearProgress variant="determinate" value={percentage} color={barColor} sx={{ flexGrow: 1, height: 8, borderRadius: 4 }} />
                                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap', color: 'text.secondary' }}>
                                        {`${partition.usedSpace.value} ${partition.usedSpace.unit} / ${partition.totalSpace.value} ${partition.totalSpace.unit}`}
                                    </Typography>
                                </Stack>
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
            {isEditing && (
                <Button startIcon={<AddIcon />} onClick={onAddPartition} sx={{ mt: 2 }}>
                    添加分区
                </Button>
            )}
        </Box>
    );
};


const ServerDetailContent = ({ serverId }: ServerDetailContentProps): JSX.Element => {
    const { data, isLoading, isError, error } = useQuery<ServerDetail, Error>({
        queryKey: ['server', serverId],
        queryFn: () => serversApi.fetchById(serverId),
        enabled: !!serverId,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ServerFormData | null>(null);

    const generateInitialFormData = (sourceData: ServerDetail): ServerFormData => ({
        serverName: sourceData.serverName,
        ipAddress: sourceData.ipAddress,
        role: sourceData.role?.String ?? '',
        deploymentType: sourceData.deploymentType?.String ?? '',
        usageNote: sourceData.usageNote?.String ?? '',
        processorModel: 'Intel(R) Xeon(R) Gold 6248R @ 3.00GHz',
        memory: { value: 256, unit: 'GB' },
        diskCapacity: {
            total: { value: 2, unit: 'TB' },
            partitions: [
                { id: 1, path: '/dev/sda1', usedSpace: { value: 130, unit: 'GB' }, totalSpace: { value: 200, unit: 'GB' } },
                { id: 2, path: '/dev/sdb1', usedSpace: { value: 1.7, unit: 'TB' }, totalSpace: { value: 1.8, unit: 'TB' } },
            ],
        },
    });

    useEffect(() => {
        if (data) {
            setFormData(generateInitialFormData(data));
        }
    }, [data]);

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleUnitValueChange = (field: 'memory', subField: 'value' | 'unit', value: string | number) => {
        setFormData(prev => {
            if (!prev) return null;
            return { ...prev, [field]: { ...prev[field], [subField]: value } };
        });
    };

    const handleDiskTotalChange = (subField: 'value' | 'unit', value: string | number) => {
        setFormData(prev => {
            if (!prev) return null;
            const newTotal = { ...prev.diskCapacity.total, [subField]: value };
            return { ...prev, diskCapacity: { ...prev.diskCapacity, total: newTotal } };
        });
    };

    const handleSave = () => {
        console.log('Saving data:', formData);
        alert('保存逻辑待实现！数据已打印到控制台。');
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (data) {
            setFormData(generateInitialFormData(data));
        }
    };

    const handleChangePartition = (index: number, field: keyof Omit<Partition, 'id'>, value: string | UnitValue) => {
        setFormData(prev => {
            if (!prev) return null;
            const newPartitions = [...prev.diskCapacity.partitions];
            newPartitions[index] = { ...newPartitions[index], [field]: value };
            return { ...prev, diskCapacity: { ...prev.diskCapacity, partitions: newPartitions } };
        });
    };

    const handleAddPartition = () => {
        setFormData(prev => {
            if (!prev) return null;
            const newPartition: Partition = {
                id: Date.now(),
                path: '',
                usedSpace: { value: '', unit: 'GB' },
                totalSpace: { value: '', unit: 'GB' },
            };
            return { ...prev, diskCapacity: { ...prev.diskCapacity, partitions: [...prev.diskCapacity.partitions, newPartition] } };
        });
    };

    const handleRemovePartition = (indexToRemove: number) => {
        setFormData(prev => {
            if (!prev) return null;
            const newPartitions = prev.diskCapacity.partitions.filter((_, index) => index !== indexToRemove);
            return { ...prev, diskCapacity: { ...prev.diskCapacity, partitions: newPartitions } };
        });
    };


    if (isLoading) {
        return <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
    }
    if (isError) {
        const errorMessage = error instanceof Error ? error.message : '加载失败，请稍后重试';
        return <Box sx={{ p: 3, height: '100%' }}><Alert severity="error">加载服务器详情失败: {errorMessage}</Alert></Box>;
    }
    if (!data || !formData) {
        return <Box sx={{ p: 3, height: '100%' }}><Alert severity="info">未找到服务器数据。</Alert></Box>;
    }

    const detailGroups: { title: string; fields: DetailFieldConfig[] }[] = [
        {
            title: '基础信息',
            fields: [
                { id: 'serverName', label: "服务器名称", value: data.serverName },
                { id: 'ipAddress', label: "IP 地址", value: data.ipAddress },
                { id: 'customerName', label: "所属客户", value: data.customerName, editable: false },
            ]
        },
        {
            title: '配置与备注',
            fields: [
                { id: 'role', label: "服务器角色", value: data.role?.String ?? '' },
                { id: 'deploymentType', label: "部署类型", value: data.deploymentType?.String ?? '' },
                { id: 'usageNote', label: "使用备注", value: data.usageNote?.String ?? '', multiline: true, fullWidth: true },
            ]
        },
    ];

    return (
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <DnsIcon color="action" sx={{ fontSize: '1.5rem' }} />
                <Typography variant="h6" component="h2" sx={{ fontWeight: 500 }}>
                    {isEditing ? `编辑: ${data.serverName}` : data.serverName}
                </Typography>
            </Stack>

            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {detailGroups.map((group, index) => (
                    <Box key={group.title} sx={{ mt: index > 0 ? 3 : 0, overflowX: 'hidden' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                            {group.title}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                            {group.fields.map((field) => {
                                const isEditable = field.editable !== false;
                                const displayValue = (formData && field.id in formData)
                                    ? formData[field.id as keyof Omit<ServerFormData, 'diskCapacity' | 'memory'>]
                                    : field.value;

                                const width = field.fullWidth ? '100%' : { xs: '100%', md: '50%' };

                                return (
                                    <Box key={field.id} sx={{ width: width, px: 1.5, mb: 3 }}>
                                        <DetailField
                                            label={field.label}
                                            value={displayValue}
                                            isEditing={isEditing && isEditable}
                                            isMultiline={field.multiline}
                                            name={field.id as keyof Omit<ServerFormData, 'diskCapacity' | 'memory'>}
                                            onChange={handleFormChange}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                ))}
                {/* 硬件信息单独处理 */}
                <Box sx={{ mt: 3, overflowX: 'hidden' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                        硬件信息
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                        <Box sx={{ width: { xs: '100%', md: '33.333%' }, px: 1.5, mb: 3 }}>
                            <DetailField label="处理器型号" value={formData.processorModel} isEditing={isEditing} name="processorModel" onChange={handleFormChange} />
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: '33.333%' }, px: 1.5, mb: 3 }}>
                            <UnitSelectField
                                label="内存"
                                isEditing={isEditing}
                                value={formData.memory.value}
                                unit={formData.memory.unit}
                                onValueChange={(e) => handleUnitValueChange('memory', 'value', e.target.value)}
                                onUnitChange={(e) => handleUnitValueChange('memory', 'unit', e.target.value as 'GB' | 'TB')}
                            />
                        </Box>
                        <Box sx={{ width: { xs: '100%', md: '33.333%' }, px: 1.5, mb: 3 }}>
                            <UnitSelectField
                                label="总容量"
                                isEditing={isEditing}
                                value={formData.diskCapacity.total.value}
                                unit={formData.diskCapacity.total.unit}
                                onValueChange={(e) => handleDiskTotalChange('value', e.target.value)}
                                onUnitChange={(e) => handleDiskTotalChange('unit', e.target.value as 'GB' | 'TB')}
                            />
                        </Box>
                        <Box sx={{ width: '100%', px: 1.5, mb: 3 }}>
                            <DiskCapacityField
                                isEditing={isEditing}
                                data={formData.diskCapacity}
                                onChangePartition={handleChangePartition}
                                onAddPartition={handleAddPartition}
                                onRemovePartition={handleRemovePartition}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4, flexShrink: 0 }}>
                {!isEditing ? (
                    <Button variant="contained" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
                        编辑
                    </Button>
                ) : (
                    <>
                        <Button variant="outlined" color="secondary" startIcon={<CancelIcon />} onClick={handleCancel}>
                            取消
                        </Button>
                        <Button variant="contained" color="primary" startIcon={<SaveIcon />} onClick={handleSave}>
                            保存
                        </Button>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default ServerDetailContent;