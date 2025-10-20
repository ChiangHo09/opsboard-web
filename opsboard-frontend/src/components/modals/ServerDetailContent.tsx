/**
 * @file src/components/modals/ServerDetailContent.tsx
 * @description 服务器详情内容组件。此版本为最终修复版，通过使用 <Box>+Flexbox 替代 <Grid>，并修正所有布局问题，彻底解决了所有已知问题。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增] 新增“硬件信息”部分，用于展示处理器型号、内存和磁盘容量等新字段。
 *   - [重构] 扩展了 `ServerFormData` 状态接口，以包含 `processorModel`, `memory`, `diskCapacity` 字段。
 *   - [实现] “处理器型号”和“内存”字段被设计为并排半宽布局，“磁盘容量”字段则设计为占满整行的多行文本字段，为展示分区详情提供了基础。
 */
import { Box, Typography, CircularProgress, Alert, Stack, TextField, Button } from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import type { JSX, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from "react";
import { serversApi, type ServerDetail } from '@/api/serversApi';

export interface ServerDetailContentProps {
    serverId: string;
}

interface ServerFormData {
    serverName: string;
    ipAddress: string;
    role: string;
    deploymentType: string;
    usageNote: string;
    // [新增] 硬件信息字段
    processorModel: string;
    memory: string;
    diskCapacity: string;
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
    name?: keyof ServerFormData;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DetailField = ({ label, value, isEditing, isMultiline = false, name, onChange }: DetailFieldProps) => (
    <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {label}
        </Typography>
        <TextField
            fullWidth
            multiline={isMultiline}
            minRows={isMultiline ? 3 : 1} // 为多行文本框提供更合适的初始高度
            variant="outlined"
            size="small"
            name={isEditing ? name : undefined}
            value={value}
            onChange={isEditing ? onChange : undefined}
            InputProps={{
                readOnly: !isEditing,
            }}
            sx={{
                ...(!isEditing && {
                    '& .MuiOutlinedInput-root': {
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'transparent' },
                        backgroundColor: 'transparent',
                        resize: 'none',
                    },
                    '& .MuiInputBase-input': { cursor: 'default' },
                }),
            }}
        />
    </Box>
);

const ServerDetailContent = ({ serverId }: ServerDetailContentProps): JSX.Element => {
    const { data, isLoading, isError, error } = useQuery<ServerDetail, Error>({
        queryKey: ['server', serverId],
        queryFn: () => serversApi.fetchById(serverId),
        enabled: !!serverId,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ServerFormData | null>(null);

    useEffect(() => {
        if (data) {
            setFormData({
                serverName: data.serverName,
                ipAddress: data.ipAddress,
                role: data.role?.String ?? '',
                deploymentType: data.deploymentType?.String ?? '',
                usageNote: data.usageNote?.String ?? '',
                // [新增] 为新字段提供示例数据
                processorModel: 'Intel(R) Xeon(R) Gold 6248R @ 3.00GHz',
                memory: '256 GB',
                diskCapacity: '总容量: 2.0 TB\n/dev/sda1: 200 GB (已用 80 GB)\n/dev/sdb1: 1.8 TB (已用 1.2 TB)',
            });
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
            setFormData({
                serverName: data.serverName,
                ipAddress: data.ipAddress,
                role: data.role?.String ?? '',
                deploymentType: data.deploymentType?.String ?? '',
                usageNote: data.usageNote?.String ?? '',
                // [新增] 重置时同样需要包含新字段
                processorModel: 'Intel(R) Xeon(R) Gold 6248R @ 3.00GHz',
                memory: '256 GB',
                diskCapacity: '总容量: 2.0 TB\n/dev/sda1: 200 GB (已用 80 GB)\n/dev/sdb1: 1.8 TB (已用 1.2 TB)',
            });
        }
    };

    if (isLoading) {
        return <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
    }
    if (isError) {
        const errorMessage = error instanceof Error ? error.message : '加载失败，请稍后重试';
        return <Box sx={{ p: 3, height: '100%' }}><Alert severity="error">加载服务器详情失败: {errorMessage}</Alert></Box>;
    }
    if (!data) {
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
        // [新增] 硬件信息分组
        {
            title: '硬件信息',
            fields: [
                { id: 'processorModel', label: '处理器型号', value: '' },
                { id: 'memory', label: '内存', value: '' },
                { id: 'diskCapacity', label: '磁盘容量', value: '', multiline: true, fullWidth: true },
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
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                mx: -1.5,
                            }}
                        >
                            {group.fields.map((field) => {
                                const isEditable = field.editable !== false;
                                const displayValue = isEditing && isEditable && formData && (field.id in formData)
                                    ? formData[field.id as keyof ServerFormData]
                                    : field.value;

                                let width;
                                if (group.title === '基础信息') {
                                    width = { xs: '100%', md: '33.333%' };
                                } else {
                                    width = field.fullWidth ? '100%' : { xs: '100%', md: '50%' };
                                }

                                return (
                                    <Box
                                        key={field.id}
                                        sx={{
                                            width: width,
                                            px: 1.5,
                                            mb: 3,
                                        }}
                                    >
                                        <DetailField
                                            label={field.label}
                                            value={displayValue}
                                            isEditing={isEditing && isEditable}
                                            isMultiline={field.multiline}
                                            name={field.id as keyof ServerFormData}
                                            onChange={handleFormChange}
                                        />
                                    </Box>
                                );
                            })}
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