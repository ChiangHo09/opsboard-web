/**
 * @file src/components/modals/ServerDetailContent.tsx
 * @description 服务器详情内容组件，采用统一布局实现展示与编辑模式的无缝切换。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [UI/UX修复]：解决了在“展示”和“编辑”模式切换时，因组件高度不一致导致的文本垂直位置跳动问题。
 *   - [根本原因]：`Typography` 组件的默认高度与 `TextField` (size="small") 的标准高度（40px）不同，导致视觉错位。
 *   - [解决方案]：为“展示”模式下的 `Typography` 组件应用了特定的 `sx` 样式，设置其 `minHeight` 为 `40px` 并使用 Flexbox 将文本垂直居中。这确保了它占据的空间与 `TextField` 完全相同，从而实现了平滑无跳动的模式切换。
 */
import { Box, Typography, Grid, CircularProgress, Alert, Stack, TextField, Button } from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import type { JSX, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from "react";
import { serversApi, type ServerDetail } from '@/api/serversApi';
import { formatDateTime } from '@/utils/formatters';

export interface ServerDetailContentProps {
    serverId: string;
}

interface ServerFormData {
    serverName: string;
    ipAddress: string;
    role: string;
    deploymentType: string;
    customerNote: string;
    usageNote: string;
}

/**
 * 内部辅助组件，用于渲染单个字段（标签+内容/输入框）
 * 封装了展示和编辑两种模式下的不同表现
 */
interface DetailFieldProps {
    label: string;
    value: ReactNode;
    isEditing: boolean;
    name?: keyof ServerFormData;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DetailField = ({ label, value, isEditing, name, onChange }: DetailFieldProps) => (
    <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            {label}
        </Typography>
        {isEditing && name && onChange ? (
            <TextField
                fullWidth
                variant="outlined"
                size="small"
                name={name}
                value={value}
                onChange={onChange}
            />
        ) : (
            // [核心修复] 强制 Typography 与 TextField 高度一致并垂直居中
            <Typography
                variant="body1"
                sx={{
                    wordBreak: 'break-word',
                    minHeight: '40px', // 匹配 size="small" 的 TextField 高度
                    display: 'flex',
                    alignItems: 'center', // 垂直居中
                }}
            >
                {value}
            </Typography>
        )}
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
                customerNote: data.customerNote?.String ?? '',
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
                customerNote: data.customerNote?.String ?? '',
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

    const detailGroups = [
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
                { id: 'role', label: "服务器角色", value: data.role?.String ?? '-' },
                { id: 'deploymentType', label: "部署类型", value: data.deploymentType?.String ?? '-' },
                { id: 'customerNote', label: "客户备注", value: data.customerNote?.String ?? '-' },
                { id: 'usageNote', label: "使用备注", value: data.usageNote?.String ?? '-' },
            ]
        },
        {
            title: '时间戳',
            fields: [
                { id: 'createdAt', label: "创建时间", value: formatDateTime(data.createdAt), editable: false },
                { id: 'updatedAt', label: "最后更新", value: formatDateTime(data.updatedAt), editable: false },
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
                    <Box key={group.title} sx={{ mt: index > 0 ? 3 : 0 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2 }}>
                            {group.title}
                        </Typography>
                        <Grid container spacing={3}>
                            {group.fields.map((field) => {
                                const isEditable = field.editable !== false;
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={field.id}>
                                        <DetailField
                                            label={field.label}
                                            value={isEditing && isEditable && formData ? formData[field.id as keyof ServerFormData] : field.value}
                                            isEditing={isEditing && isEditable}
                                            name={field.id as keyof ServerFormData}
                                            onChange={handleFormChange}
                                        />
                                    </Grid>
                                )
                            })}
                        </Grid>
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