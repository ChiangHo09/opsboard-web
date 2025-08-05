/**
 * @file src/pages/Changelog.tsx
 * @description 该文件负责渲染“更新日志”页面，并提供搜索功能。
 * @modification
 *   - [Code Review]: 本次提交确认该文件已遵循“配置驱动UI”的最佳实践。表格渲染逻辑已通过列配置数组（`columns`）实现，无需进一步重构。
 *   - [Refactor]: 引入了列配置数组（`columns`）来动态渲染表格的表头和单元格。此举将表格结构定义与渲染逻辑分离，使代码更具声明性、更易于维护，并消除了移动端和桌面端视图之间的重复代码。
 *   - [架构统一]：将页面布局与 `Servers.tsx` 的最佳实践完全对齐，引入了统一的 `<ActionButtons>` 组件。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress
} from '@mui/material';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {type ChangelogSearchValues} from '@/components/forms/ChangelogSearchForm.tsx';
import {changelogsApi, type ChangelogRow} from '@/api';
import {useResponsiveDetailView} from '@/hooks/useResponsiveDetailView';
import {type ChangelogDetailContentProps} from '@/components/modals/ChangelogDetailContent';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';
import ClickableTableRow from '@/components/ui/ClickableTableRow';
import ActionButtons from '@/components/ui/ActionButtons';

const ChangelogSearchForm = lazy(() => import('@/components/forms/ChangelogSearchForm.tsx'));
const ChangelogDetailContent = lazy(() => import('@/components/modals/ChangelogDetailContent.tsx'));

// 【核心优化】为桌面端定义列配置
const desktopColumns = [
    {
        id: 'customerName',
        label: '客户名称',
        sx: {width: '12%', minWidth: '150px', fontWeight: 700},
        renderCell: (r: ChangelogRow) => <TooltipCell key="customerName">{r.customerName}</TooltipCell>
    },
    {
        id: 'updateTime',
        label: '更新时间',
        sx: {width: '15%', minWidth: '180px', fontWeight: 700},
        renderCell: (r: ChangelogRow) => <TooltipCell key="updateTime">{r.updateTime.split(' ')[0]}</TooltipCell>
    },
    {
        id: 'updateType',
        label: '更新类型',
        sx: {width: '10%', minWidth: '120px', fontWeight: 700},
        renderCell: (r: ChangelogRow) => <TooltipCell key="updateType">{r.updateType}</TooltipCell>
    },
    {
        id: 'updateContent',
        label: '更新内容',
        sx: {fontWeight: 700},
        renderCell: (r: ChangelogRow) => <TooltipCell key="updateContent">{r.updateContent}</TooltipCell>
    },
];

// 【核心优化】为移动端定义列配置
const mobileColumns = [
    {
        id: 'customerName',
        label: '客户名称',
        sx: {width: '33.33%', fontWeight: 700},
        renderCell: (r: ChangelogRow) => <TooltipCell key="customerName">{r.customerName}</TooltipCell>
    },
    {
        id: 'updateTime',
        label: '更新时间',
        sx: {width: '33.33%', fontWeight: 700},
        renderCell: (r: ChangelogRow) => <TooltipCell key="updateTime">{r.updateTime.split(' ')[0]}</TooltipCell>
    },
    {
        id: 'updateType',
        label: '更新类型',
        sx: {width: '33.33%', fontWeight: 700},
        renderCell: (r: ChangelogRow) => <TooltipCell key="updateType">{r.updateType}</TooltipCell>
    },
];

export default function Changelog(): JSX.Element {
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
    } = useLayoutDispatch();

    const navigate = useNavigate();
    const {logId} = useParams<{ logId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    const [isAdmin] = useState(true);

    const {
        data: rows = [],
        isLoading,
        isError,
        error
    } = useResponsiveDetailView<ChangelogRow, ChangelogDetailContentProps>({
        paramName: 'logId',
        baseRoute: '/app/changelog',
        queryKey: ['changelogs'],
        queryFn: changelogsApi.fetchAll,
        DetailContentComponent: ChangelogDetailContent,
    });

    useEffect(() => {
        if (logId && rows.length > 0) {
            const itemIndex = rows.findIndex(row => row.id === logId);
            if (itemIndex !== -1) {
                const targetPage = Math.floor(itemIndex / rowsPerPage);
                if (page !== targetPage) {
                    setPage(targetPage);
                }
            }
        }
    }, [logId, rows, rowsPerPage, page]);


    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

    const onSearch = useCallback((v: ChangelogSearchValues) => {
        alert(`搜索: ${JSON.stringify({
            ...v,
            startTime: v.startTime?.format('YYYY-MM-DD'),
            endTime: v.endTime?.format('YYYY-MM-DD'),
        })}`);
        togglePanel();
    }, [togglePanel]);

    const onReset = useCallback(() => alert('重置表单'), []);

    useEffect(() => {
        if (!isPanelContentSet) {
            return;
        }

        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><CircularProgress/></Box>}>
                    <ChangelogSearchForm onSearch={onSearch} onReset={onReset}/>
                </Suspense>
            );
            setPanelTitle('日志搜索');
            setPanelWidth(360);
        }, 0);

        return () => {
            clearTimeout(timerId);
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelContentSet, onSearch, onReset, setPanelContent, setPanelTitle, setPanelWidth]);

    const pageRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleTogglePanel = () => {
        if (!isPanelContentSet) {
            setIsPanelContentSet(true);
        }
        togglePanel();
    };

    // 【核心优化】根据 isMobile 状态选择要使用的列配置
    const columns = isMobile ? mobileColumns : desktopColumns;

    return (
        <PageLayout>
            <Box sx={{
                display: 'flex',
                flexShrink: 0,
                mb: 2,
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
            }}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>更新日志</Typography>
                <ActionButtons
                    showEditButton={isAdmin}
                    onSearchClick={handleTogglePanel}
                    onEditClick={() => alert('编辑按钮被点击')}
                    onExportClick={() => alert('导出按钮被点击')}
                />
            </Box>

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {isLoading && <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(255, 255, 255, 0.7)',
                    zIndex: 10
                }}><CircularProgress/></Box>}
                {isError && <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><Typography color="error">加载失败: {error?.message || '未知错误'}</Typography></Box>}
                <DataTable
                    rowsPerPageOptions={[10, 25, 50]}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, p: number) => setPage(p)}
                    onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                        setRowsPerPage(+e.target.value);
                        setPage(0);
                    }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    <Table stickyHeader aria-label="更新日志表"
                           sx={{width: '100%', borderCollapse: 'separate', tableLayout: 'fixed'}}>
                        <TableHead>
                            <TableRow>
                                {/* 【核心优化】动态渲染表头 */}
                                {columns.map(col => (
                                    <TableCell key={col.id} sx={col.sx}>{col.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(r => (
                                <ClickableTableRow
                                    key={r.id}
                                    selected={r.id === logId}
                                    onClick={() => navigate(`/app/changelog/${r.id}`, {replace: true})}
                                >
                                    {/* 【核心优化】动态渲染单元格 */}
                                    {columns.map(col => col.renderCell(r))}
                                </ClickableTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
}