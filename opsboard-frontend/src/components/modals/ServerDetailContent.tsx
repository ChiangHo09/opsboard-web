/**
 * @file src/components/modals/ServerDetailContent.tsx
 * @description 服务器详情内容组件。此版本为最终修复版，新增了可动态编辑的硬件信息（特别是磁盘分区）模块。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复] 修正了 `Partition` 接口及其所有使用处的拼写错误（`totaSpace` -> `totalSpace`），解决了因此引发的所有 TypeScript 编译错误（TS2551, TS2345, TS2561）。
 *   - [修复] 调整了“硬件信息”部分的布局逻辑，将“总容量”字段（`DiskCapacityField`）也纳入 Flexbox 容器的管理中，确保了完美的垂直对齐。
 *   - [新增] 为所有文本框和分区详情模块添加了平滑的过渡动画，优化了查看和编辑模式的切换体验。
 */
import { Box, Typography, CircularProgress, Alert, Stack, TextField, Button, LinearProgress, IconButton, type Theme } from '@mui/material';
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

/**
 * @description 定义磁盘分区的数据结构。
 * @property {number} id - 用于 React key 的唯一标识符。
 * @property {string} path - 分区路径/盘符，例如 "/dev/sda1"。
 * @property {string} usedSpace - 已用空间，例如 "80 GB"。
 * @property {string} totalSpace - 分区总容量，例如 "200 GB"。
 */
interface Partition {
    id: number;
    path: string;
    usedSpace: string;
    totalSpace: string; // [修复] 修正拼写错误
}

interface ServerFormData {
    serverName: string;
    ipAddress: string;
    role: string;
    deploymentType: string;
    usageNote: string;
    processorModel: string;
    memory: string;
    diskCapacity: {
        total: string;
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
    name?: keyof Omit<ServerFormData, 'diskCapacity'>;
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
            onChange={isEditing ? onChange : undefined}
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

/**
 * @description 专门用于渲染和编辑磁盘容量信息的组件。
 */
const DiskCapacityField = ({
                               isEditing,
                               data,
                               onChangeTotal,
                               onChangePartition,
                               onAddPartition,
                               onRemovePartition,
                           }: {
    isEditing: boolean;
    data: ServerFormData['diskCapacity'];
    onChangeTotal: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangePartition: (index: number, field: keyof Omit<Partition, 'id'>, value: string) => void;
    onAddPartition: () => void;
    onRemovePartition: (index: number) => void;
}) => {
    const readOnlySx = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'transparent',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
        },
        '& .MuiInputBase-input': { cursor: 'default' },
    };

    const getProgressBarColor = (percentage: number): 'primary' | 'warning' | 'error' => {
        if (percentage > 90) return 'error';
        if (percentage > 65) return 'warning';
        return 'primary';
    };

    return (
        <Box>
            <DetailField
                label="总容量"
                value={data.total}
                isEditing={isEditing}
                onChange={onChangeTotal}
            />

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, mb: 1 }}>
                分区详情
            </Typography>
            <Stack spacing={2}>
                {data.partitions.map((partition, index) => {
                    const used = parseFloat(partition.usedSpace) || 0;
                    const total = parseFloat(partition.totalSpace) || 1;
                    const percentage = total > 0 ? (used / total) * 100 : 0;
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
                                <TextField label="盘符" variant="outlined" size="small" value={partition.path} onChange={(e) => onChangePartition(index, 'path', e.target.value)} InputProps={{ readOnly: !isEditing }} sx={{ flex: 1, ...(!isEditing && readOnlySx) }} />
                                <TextField label="已用空间" variant="outlined" size="small" value={partition.usedSpace} onChange={(e) => onChangePartition(index, 'usedSpace', e.target.value)} InputProps={{ readOnly: !isEditing }} sx={{ flex: 1, ...(!isEditing && readOnlySx) }} />
                                <TextField label="分区容量" variant="outlined" size="small" value={partition.totalSpace} onChange={(e) => onChangePartition(index, 'totalSpace', e.target.value)} InputProps={{ readOnly: !isEditing }} sx={{ flex: 1, ...(!isEditing && readOnlySx) }} />
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
                                        {`${partition.usedSpace || 'N/A'} / ${partition.totalSpace || 'N/A'}`}
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
        memory: '256 GB',
        diskCapacity: {
            total: '2.0 TB',
            partitions: [
                { id: 1, path: '/dev/sda1', usedSpace: '130 GB', totalSpace: '200 GB' },
                { id: 2, path: '/dev/sdb1', usedSpace: '1.7 TB', totalSpace: '1.8 TB' },
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

    const handleChangeDiskTotal = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFormData(prev => {
            if (!prev) return null;
            return { ...prev, diskCapacity: { ...prev.diskCapacity, total: value } };
        });
    };

    const handleChangePartition = (index: number, field: keyof Omit<Partition, 'id'>, value: string) => {
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
                usedSpace: '',
                totalSpace: '',
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
        {
            title: '硬件信息',
            fields: [
                { id: 'processorModel', label: '处理器型号', value: '' },
                { id: 'memory', label: '内存', value: '' },
            ]
        }
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
                                    ? formData[field.id as keyof Omit<ServerFormData, 'diskCapacity'>]
                                    : field.value;

                                const width = field.fullWidth ? '100%' : { xs: '100%', md: '50%' };

                                return (
                                    <Box key={field.id} sx={{ width: width, px: 1.5, mb: 3 }}>
                                        <DetailField
                                            label={field.label}
                                            value={displayValue}
                                            isEditing={isEditing && isEditable}
                                            isMultiline={field.multiline}
                                            name={field.id as keyof Omit<ServerFormData, 'diskCapacity'>}
                                            onChange={handleFormChange}
                                        />
                                    </Box>
                                );
                            })}
                            {group.title === '硬件信息' && (
                                <Box sx={{ width: '100%', px: 1.5, mb: 3 }}>
                                    <DiskCapacityField
                                        isEditing={isEditing}
                                        data={formData.diskCapacity}
                                        onChangeTotal={handleChangeDiskTotal}
                                        onChangePartition={handleChangePartition}
                                        onAddPartition={handleAddPartition}
                                        onRemovePartition={handleRemovePartition}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>
                ))}
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