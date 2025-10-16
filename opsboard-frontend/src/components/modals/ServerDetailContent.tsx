/**
 * @file src/components/modals/ServerDetailContent.tsx
 * @description 服务器详情内容组件，修复TypeScript类型错误
 */
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import type { JSX, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { serversApi, type ServerDetail } from '@/api/serversApi';
import { formatDateTime } from '@/utils/formatters';
import React from "react";

export interface ServerDetailContentProps {
    serverId: string;
}

const ServerDetailContent = ({ serverId }: ServerDetailContentProps): JSX.Element => {
    const { data, isLoading, isError, error } = useQuery<ServerDetail, Error>({
        queryKey: ['server', serverId],
        queryFn: () => serversApi.fetchById(serverId),
        enabled: !!serverId,
    });

    if (isLoading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        const errorMessage = error instanceof Error ? error.message : '加载失败，请稍后重试';
        return (
            <Box sx={{ p: 4, height: '100%' }}>
                <Alert severity="error">
                    加载服务器详情失败: {errorMessage}
                </Alert>
            </Box>
        );
    }

    if (!data) {
        return (
            <Box sx={{ p: 4, height: '100%' }}>
                <Alert severity="info">未找到服务器数据。</Alert>
            </Box>
        );
    }

    const details: { label: string; value: ReactNode }[] = [
        { label: "服务器名称", value: data.serverName },
        { label: "IP 地址", value: data.ipAddress },
        { label: "所属客户", value: data.customerName },
        { label: "服务器角色", value: data.role && data.role.Valid ? data.role.String : '-' },
        { label: "部署类型", value: data.deploymentType && data.deploymentType.Valid ? data.deploymentType.String : '-' },
        { label: "客户备注", value: data.customerNote && data.customerNote.Valid ? data.customerNote.String : '-' },
        { label: "使用备注", value: data.usageNote && data.usageNote.Valid ? data.usageNote.String : '-' },
        { label: "创建时间", value: formatDateTime(data.createdAt) },
        { label: "最后更新", value: formatDateTime(data.updatedAt) },
    ];

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                服务器详情: {data.serverName}
            </Typography>
            <Grid container spacing={2}>
                {/* 使用map + Fragment替代flatMap，减少类型推断复杂度 */}
                {details.map((item) => (
                    <React.Fragment key={item.label}>
                        <Grid component="div" item xs={12} sm={4}>
                            <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                {item.label}
                            </Typography>
                        </Grid>
                        <Grid component="div" item xs={12} sm={8}>
                            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                {item.value}
                            </Typography>
                        </Grid>
                    </React.Fragment>
                ))}
            </Grid>
        </Box>
    );
};

export default ServerDetailContent;
