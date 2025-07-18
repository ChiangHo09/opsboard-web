/**
 * Filename: Servers.tsx
 * Description: 此文件为“服务器信息”页面，负责展示服务器列表数据和提供搜索入口。
 *
 * 本次修改：
 * - 【问题修复】解决了 TypeScript 警告 TS6133：'event' is declared but its value is never read。
 *   - 将 `handleChangePage` 回调函数中未使用的 `event` 参数重命名为 `_event`，以明确表示该参数的存在但不被使用。
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
    Paper,
    TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useLayout } from '../contexts/LayoutContext.tsx';
import ServerSearchForm, { type ServerSearchValues } from '../components/forms/ServerSearchForm';

// 定义服务器数据接口，与数据库查询结果对应
interface ServerData {
    id: string; // 唯一标识符，可以是ServerID或复合ID
    customerName: string;
    serverName: string;
    ipAddress: string;
    roleName: string; // 应用/数据库
    usageSpecificNotes?: string; // 特定使用备注
    deploymentType?: string; // 单机版等
    customerNotes?: string; // 客户备注
}

// 模拟数据生成函数
const createServerData = (
    id: string,
    customerName: string,
    serverName: string,
    ipAddress: string,
    roleName: string,
    usageSpecificNotes?: string,
    deploymentType?: string,
    customerNotes?: string
): ServerData => {
    return { id, customerName, serverName, ipAddress, roleName, usageSpecificNotes, deploymentType, customerNotes };
};

// 模拟从数据库获取的数据（示例数据）
const mockServerData: ServerData[] = [
    createServerData('srv001', '客户a', 'APP-SERVER-A', '192.168.1.10', '应用', undefined, undefined),
    createServerData('srv002', '客户a', 'DB-SERVER-SHARED-AB', '192.168.1.20', '数据库', '客户a和b使用同一台数据库服务器', undefined),
    createServerData('srv003', '客户b', 'APP-SERVER-B', '192.168.1.11', '应用', undefined, undefined),
    createServerData('srv004', '客户b', 'DB-SERVER-SHARED-AB', '192.168.1.20', '数据库', '客户a和b使用同一台数据库服务器', undefined),
    createServerData('srv005', '客户c', 'SERVER-C', '192.168.1.30', '应用', undefined, undefined),
    createServerData('srv006', '客户c', 'SERVER-C', '192.168.1.30', '数据库', '客户c和d同时使用客户c的应用服务器作为数据库服务器', undefined),
    createServerData('srv007', '客户d', 'APP-SERVER-D', '192.168.1.31', '应用', undefined, undefined),
    createServerData('srv008', '客户d', 'SERVER-C', '192.168.1.30', '数据库', '客户c和d同时使用客户c的应用服务器作为数据库服务器', undefined),
    createServerData('srv009', '艺术研究所', 'SERVER-YISHU', '192.168.1.40', '应用', '单机版，数据库和应用在同一台服务器上', '单机版', '市属单位'),
    createServerData('srv010', '艺术研究所', 'SERVER-YISHU', '192.168.1.40', '数据库', '单机版，数据库和应用在同一台服务器上', '单机版', '市属单位'),
    createServerData('srv011', '客户e', 'APP-SERVER-E', '192.168.1.50', '应用', '客户e和f分别使用独立的应用和数据库服务器', undefined),
    createServerData('srv012', '客户f', 'DB-SERVER-F', '192.168.1.51', '数据库', '客户e和f分别使用独立的应用和数据库服务器', undefined),
    createServerData('srv013', '客户g', 'SERVER-G', '192.168.1.60', '应用', '客户g的应用和数据库是同一台服务器', undefined),
    createServerData('srv014', '客户g', 'SERVER-G', '192.168.1.60', '数据库', '客户g的应用和数据库是同一台服务器', undefined),
    // 增加更多数据以测试分页和滚动条
    ...Array.from({ length: 100 }).map((_, i) =>
        createServerData(`test${i + 1}`, `测试客户${i + 1}`, `TestServer${i + 1}`, `10.0.0.${i + 1}`, i % 2 === 0 ? '应用' : '数据库', `这是一条测试备注 ${i + 1}`, i % 3 === 0 ? '测试版' : undefined)
    )
];

const Servers: React.FC = () => {
    const { togglePanel, setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant } = useLayout();

    // 分页状态
    const [page, setPage] = useState(0); // 当前页码，从0开始
    const [rowsPerPage, setRowsPerPage] = useState(10); // 每页行数

    // 处理页码改变
    // 将 'event' 参数重命名为 '_event' 以避免 TS6133 警告
    const handleChangePage = useCallback((_event: unknown, newPage: number) => {
        setPage(newPage);
    }, []);

    // 处理每页行数改变
    const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // 改变每页行数时，重置到第一页
    }, []);

    // 根据分页状态切片显示数据
    const paginatedServerData = mockServerData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    const handleSearch = useCallback((values: ServerSearchValues) => {
        console.log('在 Servers 页面接收到搜索条件:', values);
        alert(`搜索: ${JSON.stringify(values)}`);
        togglePanel();
        // 在实际应用中，这里会触发对后端API的调用，获取新的表格数据
        // 同时，如果后端返回的是分页数据，需要更新总数、并可能重置page和rowsPerPage
    }, [togglePanel]);

    const handleReset = useCallback(() => {
        alert('重置表单');
        // 在实际应用中，这里会重置搜索条件并重新获取全部数据
        setPage(0); // 重置分页到第一页
        setRowsPerPage(10); // 重置每页行数
    }, []);

    useEffect(() => {
        setPanelContent(
            <ServerSearchForm onSearch={handleSearch} onReset={handleReset} />
        );
        setPanelTitle('服务器搜索');
        setPanelWidth(360);
        setIsPanelRelevant(true);

        return () => {
            setPanelContent(null);
            setPanelTitle('');
            setPanelWidth(360);
            setIsPanelRelevant(false);
        };
    }, [setPanelContent, setPanelTitle, setPanelWidth, setIsPanelRelevant, handleSearch, handleReset]);

    return (
        <Box sx={{ width: '100%', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{
                width: { xs: '90%', md: '80%' },
                maxWidth: 1280,
                mx: 'auto',
                py: 4,
                flexGrow: 1, // 让这个Box填充可用高度
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, mb: 4 }}>
                    <Typography
                        variant="h5"
                        sx={{ color: 'primary.main', fontSize: '2rem' }}
                    >
                        服务器信息
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<SearchIcon />}
                        onClick={togglePanel}
                        sx={{
                            height: '42px',
                            borderRadius: '50px',
                            bgcolor: 'app.button.background',
                            color: 'neutral.main',
                            boxShadow: 'none',
                            textTransform: 'none',
                            fontSize: '15px',
                            fontWeight: 500,
                            px: 3,
                            '&:hover': {
                                bgcolor: 'app.button.hover',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        <Typography component="span" sx={{ transform: 'translateY(1px)' }}>
                            搜索
                        </Typography>
                    </Button>
                </Box>

                {/* 服务器列表表格区域 */}
                <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <TableContainer sx={{ flexGrow: 1, overflowY: 'auto' }}> {/* 表格内容可滚动 */}
                        <Table stickyHeader aria-label="服务器信息表">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ minWidth: 120 }}>客户名称</TableCell>
                                    <TableCell sx={{ minWidth: 150 }}>服务器名称</TableCell>
                                    <TableCell sx={{ minWidth: 120 }}>IP 地址</TableCell>
                                    <TableCell sx={{ minWidth: 100 }}>角色</TableCell>
                                    <TableCell sx={{ minWidth: 180 }}>部署类型/客户备注</TableCell>
                                    <TableCell sx={{ minWidth: 250 }}>使用备注</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedServerData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            暂无服务器数据
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedServerData.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.customerName}</TableCell>
                                            <TableCell>{row.serverName}</TableCell>
                                            <TableCell>{row.ipAddress}</TableCell>
                                            <TableCell>{row.roleName}</TableCell>
                                            <TableCell>
                                                {row.deploymentType ? `[${row.deploymentType}]` : ''}
                                                {row.customerNotes ? ` ${row.customerNotes}` : ''}
                                                {(!row.deploymentType && !row.customerNotes) ? '-' : ''}
                                            </TableCell>
                                            <TableCell>{row.usageSpecificNotes || '-'}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* 表格分页组件 */}
                    <TablePagination
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
                </Paper>
            </Box>
        </Box>
    );
};

export default Servers;