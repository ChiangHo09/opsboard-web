/**
 * @file src/components/modals/ServerDetailContent.tsx
 * @description 服务器详情内容组件。此版本为最终修复版，通过使用 <Box>+Flexbox 替代 <Grid>，并修正布局溢出问题，彻底解决了所有已知问题。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复] 为每个详情分组的容器（`<Box key={group.title}>`）添加了 `overflowX: 'hidden'` 样式。此修改用于吸收由 Flexbox 负边距技巧产生的额外宽度，彻底解决了横向滚动条的问题。
 *   - [架构优化] 保持使用 `<Box display="flex">` 替代 `<Grid container>` 的方案，以规避在某些环境下由 `<Grid>` 组件引发的 `TS2769` 类型推断错误。
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
            minRows={isMultiline ? 2 : 1}
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

                                const width = field.fullWidth ? '100%' : { xs: '100%', md: '50%' };

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