/**
 * 文件名: src/pages/Servers.tsx
 * ----------------------------------------------------------------------------
 * 功能：展示“服务器信息”列表，并提供搜索与分页
 *
 * 【最新版修复要点】
 * 1. border-collapse 改为 'separate' —— 解决 Chrome/Edge/Safari 在 collapse
 *    模式下不渲染 position: sticky 的历史兼容性 Bug。
 * 2. 表头 <TableCell> 全部 top: 0 + zIndex 110；第一列表头 zIndex 120 +
 *    left: 0；内容第一列 zIndex 100 + left: 0，实现“纵向固定表头 + 横向固定首列”。
 * 3. 仍采用 Flex 垂直布局：标题区(固定) + 表格容器(可滚) + 分页器(固定)。
 * ----------------------------------------------------------------------------
 */

import React, { useEffect, useCallback, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import ServerSearchForm, { type ServerSearchValues } from '../components/forms/ServerSearchForm';

/* -------------------------------------------------------------------------- */
/* 1. 数据模型与模拟数据                                                       */
/* -------------------------------------------------------------------------- */

/** 用于 TypeScript 类型检查：单条服务器记录的数据结构 */
interface ServerData {
    id: string;                 // 唯一 ID，可用 UUID / 自增主键
    customerName: string;       // 客户名称
    serverName: string;         // 服务器主机名
    ipAddress: string;          // IPv4/IPv6 地址
    roleName: string;           // 角色：应用 / 数据库
    usageSpecificNotes?: string;// 使用备注(可选)
    deploymentType?: string;    // 部署类型：单机版 / 集群版(可选)
    customerNotes?: string;     // 客户备注(可选)
}

/** 帮助函数：快速构造一条伪数据，省去手动写对象的繁琐 */
const createServerData = (
    id: string,
    customerName: string,
    serverName: string,
    ipAddress: string,
    roleName: string,
    usageSpecificNotes?: string,
    deploymentType?: string,
    customerNotes?: string,
): ServerData => ({
    id,
    customerName,
    serverName,
    ipAddress,
    roleName,
    usageSpecificNotes,
    deploymentType,
    customerNotes,
});

/** 模拟后端返回的大量数据 —— 方便测试滚动/分页/sticky 效果 */
const mockServerData: ServerData[] = [
    createServerData('srv001', '客户a', 'APP-SERVER-A', '192.168.1.10', '应用'),
    createServerData(
        'srv002',
        '客户a',
        'DB-SERVER-SHARED-AB',
        '192.168.1.20',
        '数据库',
        '客户a和b使用同一台数据库服务器',
    ),
    /* ……中间原始 012~014 省略，保持与旧版一致…… */
    // 批量生成测试用条目，确保出现滚动条
    ...Array.from({ length: 100 }).map((_, i) =>
        createServerData(
            `test${i + 1}`,
            `测试客户${i + 1}`,
            `TestServer${i + 1}`,
            `10.0.0.${i + 1}`,
            i % 2 === 0 ? '应用' : '数据库',
            `这是一条测试备注 ${i + 1}`,
            i % 3 === 0 ? '测试版' : undefined,
        ),
    ),
];

/* -------------------------------------------------------------------------- */
/* 2. 主组件                                                                  */
/* -------------------------------------------------------------------------- */

const Servers: React.FC = () => {
    /* ----- 2.1 布局上下文：侧边抽屉 ----- */
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayout();

    /* ----- 2.2 分页状态 ----- */
    const [page, setPage] = useState(0);      // 当前页码(从 0 开始)
    const [rowsPerPage, setRowsPerPage] = useState(10); // 每页展示行数

    /** 切换页码时触发 */
    const handleChangePage = useCallback((_event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    /** 修改“每页行数”后重置到第一页 */
    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    /** 当前页需要渲染的数据子集 */
    const paginatedServerData = mockServerData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    /* ----- 2.3 搜索抽屉回调 ----- */
    const handleSearch = useCallback(
        (values: ServerSearchValues) => {
            console.log('收到搜索条件:', values);
            alert(`搜索: ${JSON.stringify(values)}`);
            togglePanel(); // 关闭抽屉
        },
        [togglePanel],
    );

    const handleReset = useCallback(() => {
        alert('重置搜索表单');
        setPage(0);
        setRowsPerPage(10);
    }, []);

    /* ----- 2.4 组件挂载/卸载的副作用 ----- */
    useEffect(() => {
        // 抽屉内容
        setPanelContent(<ServerSearchForm onSearch={handleSearch} onReset={handleReset} />);
        setPanelTitle('服务器搜索');
        setPanelWidth(360);
        setIsPanelRelevant(true);

        // 卸载时清理
        return () => {
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360);
            setIsPanelRelevant(false);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);

    /* ---------------------------------------------------------------------- */
    /* 3. JSX 结构：标题区 + 表格区 + 分页区                                    */
    /* ---------------------------------------------------------------------- */
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',        // 启用 Flex 容器
                flexDirection: 'column',// 上下排布
            }}
        >
            {/* 3.1 顶部标题区 —— 固定高度，显示页面标题与“搜索”按钮 */}
            <Box
                sx={{
                    width: { xs: '90%', md: '80%' },
                    maxWidth: 1280,
                    mx: 'auto',
                    py: 4,
                    flexShrink: 0,        // 不参与弹性伸缩
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ color: 'primary.main', fontSize: '2rem' }}>
                        服务器信息
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<SearchIcon />}
                        onClick={togglePanel}
                        sx={{
                            height: 42,
                            borderRadius: '50px',
                            bgcolor: 'app.button.background',
                            color: 'neutral.main',
                            boxShadow: 'none',
                            textTransform: 'none',
                            fontSize: 15,
                            fontWeight: 500,
                            px: 3,
                            '&:hover': { bgcolor: 'app.button.hover', boxShadow: 'none' },
                        }}
                    >
                        <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                            搜索
                        </Typography>
                    </Button>
                </Box>
            </Box>

            {/* 3.2 表格容器 —— flexGrow:1 占满剩余高度，内部滚动 */}
            <TableContainer
                sx={{
                    width: { xs: '90%', md: '80%' },
                    maxWidth: 1280,
                    mx: 'auto',
                    flexGrow: 1,           // 关键：让容器有具体高度，sticky 才能工作
                    overflow: 'auto',      // 出现滚动条
                    bgcolor: 'background.paper',
                }}
            >
                {/* ---------- 表格主体 ---------- */}
                <Table
                    stickyHeader
                    aria-label="服务器信息表"
                    /* ★★★ 关键：border-collapse 必须是 separate 才能正确 sticky ★★★ */
                    sx={{
                        borderCollapse: 'separate', // 修复 collapse 导致的 sticky 失效
                        tableLayout: 'auto',        // 由内容自动决定列宽
                        minWidth: 950,              // 给一些列留足空间，方便水平滚
                    }}
                >
                    {/* --- 3.2.1 表头 --- */}
                    <TableHead>
                        <TableRow>
                            {/* 表头 - 第一列(客户名称) - 同时横纵固定 */}
                            <TableCell
                                sx={{
                                    minWidth: 120,
                                    position: 'sticky',
                                    left: 0,
                                    top: 0,
                                    zIndex: 120,            // 最高层级(覆盖其它单元格)
                                    bgcolor: 'background.paper',
                                    fontWeight: 700,
                                }}
                            >
                                客户名称
                            </TableCell>

                            {/* 以下表头只需要纵向固定(top:0) */}
                            {[
                                { label: '服务器名称', minWidth: 150 },
                                { label: 'IP 地址', minWidth: 120 },
                                { label: '角色', minWidth: 100 },
                                { label: '部署类型 / 客户备注', minWidth: 180 },
                                { label: '使用备注', minWidth: 250 },
                            ].map(({ label, minWidth }) => (
                                <TableCell
                                    key={label}
                                    sx={{
                                        minWidth,
                                        position: 'sticky',
                                        top: 0,
                                        zIndex: 110,          // 次高层级
                                        bgcolor: 'background.paper',
                                        fontWeight: 700,
                                    }}
                                >
                                    {label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    {/* --- 3.2.2 表体 --- */}
                    <TableBody>
                        {paginatedServerData.length === 0 ? (
                            /* 空数据占位行 */
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    暂无服务器数据
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedServerData.map((row) => (
                                <TableRow hover key={row.id}>
                                    {/* 内容区 - 第一列(客户名称) - 横向固定 */}
                                    <TableCell
                                        sx={{
                                            position: 'sticky',
                                            left: 0,
                                            zIndex: 100,          // 略低于表头
                                            bgcolor: 'background.paper',
                                            borderRight: (theme) => `1px solid ${theme.palette.divider}`, // 分隔线(可选)
                                        }}
                                    >
                                        {row.customerName}
                                    </TableCell>

                                    {/* 其余普通列 */}
                                    <TableCell>{row.serverName}</TableCell>
                                    <TableCell>{row.ipAddress}</TableCell>
                                    <TableCell>{row.roleName}</TableCell>
                                    <TableCell>
                                        {row.deploymentType ? `[${row.deploymentType}]` : ''}
                                        {row.customerNotes ? ` ${row.customerNotes}` : ''}
                                        {!row.deploymentType && !row.customerNotes ? '-' : ''}
                                    </TableCell>
                                    <TableCell>{row.usageSpecificNotes || '-'}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 3.3 底部分页器 —— 固定高度 */}
            <TablePagination
                sx={{
                    width: { xs: '90%', md: '80%' },
                    maxWidth: 1280,
                    mx: 'auto',
                    flexShrink: 0, // 不参与伸缩
                    bgcolor: 'background.paper',
                    borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={mockServerData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="每页行数:"
                labelDisplayedRows={({ from, to, count }) =>
                    `显示 ${from}-${to} 条, 共 ${count !== -1 ? count : `超过 ${to} 条`}`
                }
            />
        </Box>
    );
};

export default Servers;
