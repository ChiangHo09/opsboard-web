/**
 * @file src/pages/Tickets.tsx
 * @description 此文件负责渲染“工单信息”页面，通过数据表格展示工单列表，并提供搜索功能。
 * @modification
 *   - [架构统一]：将页面布局与 `Servers.tsx` 的最佳实践完全对齐。
 *   - [UI/UX]：新增了“编辑”和“导出”按钮，并将所有操作按钮统一为胶囊风格。
 *   - [UI/UX]：实现了标题区域的 `flex-wrap` 响应式布局，确保在窄屏下按钮能自动换行。
 *   - [UI/UX]：调整了移动端视图的内边距，使其更紧凑。
 *   - [核心修复]：引入并使用了新的 `<ClickableTableRow>` 组件来渲染表格的每一行。
 *   - [解决方案]：`<ClickableTableRow>` 内部通过“第一单元格锚点”策略，完美地将布局与交互分离，既保证了 HTML 结构的有效性，又使得涟漪效果的 DOM 操作不会干扰 `table-layout: fixed` 的计算。
 *   - [效果]：页面代码简洁，交互效果完整，布局问题被根除。
 */
import {useCallback, useState, lazy, Suspense, useEffect, type JSX, type ChangeEvent} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, CircularProgress, Chip, type Theme
} from '@mui/material';
// 导入图标
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import {useNotification} from '@/contexts/NotificationContext.tsx';
import {type TicketSearchValues} from '@/components/forms/TicketSearchForm';
import {ticketsApi, type TicketRow} from '@/api';
import {useResponsiveDetailView} from '@/hooks/useResponsiveDetailView';
import {type TicketDetailContentProps} from '@/components/modals/TicketDetailContent';
import {handleAsyncError} from '@/utils/errorHandler';
import TooltipCell from '@/components/ui/TooltipCell';
import PageLayout from '@/layouts/PageLayout';
import DataTable from '@/components/ui/DataTable';
import {red} from '@mui/material/colors';
import ClickableTableRow from '@/components/ui/ClickableTableRow';

const TicketSearchForm = lazy(() => import('../components/forms/TicketSearchForm'));
const TicketDetailContent = lazy(() => import('../components/modals/TicketDetailContent'));

// 定义状态的视觉配置
const statusConfig = {
    '就绪': {
        label: '完成',
        sx: (theme: Theme) => ({
            fontWeight: 700,
            backgroundColor: theme.palette.neutral.main,
            color: theme.palette.common.white,
            '& .MuiChip-label': {
                transform: 'translateY(1px)',
            },
        }),
    },
    '挂起': {
        label: '挂起',
        sx: (theme: Theme) => ({
            fontWeight: 700,
            backgroundColor: red[200],
            color: theme.palette.common.white,
            '& .MuiChip-label': {
                transform: 'translateY(1px)',
            },
        }),
    },
    'default': {
        label: '未知',
        sx: {
            fontWeight: 700,
        },
    },
};


const Tickets = (): JSX.Element => {
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel,
        setPanelContent,
        setPanelTitle,
        setPanelWidth,
    } = useLayoutDispatch();
    const showNotification = useNotification();

    const navigate = useNavigate();
    const {ticketId} = useParams<{ ticketId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    const {data: rows = [], isLoading, isError, error} = useResponsiveDetailView<TicketRow, TicketDetailContentProps>({
        paramName: 'ticketId',
        baseRoute: '/app/tickets',
        queryKey: ['tickets'],
        queryFn: ticketsApi.fetchAll,
        DetailContentComponent: TicketDetailContent,
    });

    useEffect(() => {
        if (ticketId && rows.length > 0) {
            const itemIndex = rows.findIndex(row => row.id === ticketId);
            if (itemIndex !== -1) {
                const targetPage = Math.floor(itemIndex / rowsPerPage);
                if (page !== targetPage) {
                    setPage(targetPage);
                }
            }
        }
    }, [ticketId, rows, rowsPerPage, page]);

    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

    const onSearch = useCallback((v: TicketSearchValues) => {
        try {
            alert(`搜索: ${JSON.stringify(v)}`);
            togglePanel();
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [togglePanel, showNotification]);

    const onReset = useCallback(() => {
        alert('重置工单搜索表单');
    }, []);

    useEffect(() => {
        if (!isPanelContentSet) return;
        const timerId = setTimeout(() => {
            setPanelContent(
                <Suspense fallback={<Box sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><CircularProgress/></Box>}>
                    <TicketSearchForm onSearch={onSearch} onReset={onReset}/>
                </Suspense>
            );
            setPanelTitle('工单搜索');
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

    // 定义胶囊按钮的通用样式
    const capsuleButtonStyle = {
        height: 42,
        borderRadius: '50px',
        textTransform: 'none',
        px: 3,
        bgcolor: 'app.button.background',
        color: 'neutral.main',
        '&:hover': {bgcolor: 'app.button.hover'}
    };

    return (
        <PageLayout sx={{
            p: {xs: 1, md: 3},
        }}>
            {/* 标题及操作按钮区域 */}
            <Box sx={{
                display: 'flex',
                flexShrink: 0,
                mb: 2,
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2
            }}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>工单信息</Typography>

                {/* 操作按钮容器 */}
                <Box sx={{display: 'flex', gap: 2}}>
                    <Button variant="contained" size="large" startIcon={<DriveFileRenameOutlineIcon/>}
                            sx={capsuleButtonStyle}>
                        <Typography component="span" sx={{transform: 'translateY(1px)'}}>编辑</Typography>
                    </Button>
                    <Button variant="contained" size="large" startIcon={<ShareOutlinedIcon/>} sx={capsuleButtonStyle}>
                        <Typography component="span" sx={{transform: 'translateY(1px)'}}>导出</Typography>
                    </Button>
                    <Button variant="contained" size="large" startIcon={<SearchRoundedIcon/>}
                            onClick={handleTogglePanel} sx={capsuleButtonStyle}>
                        <Typography component="span" sx={{transform: 'translateY(1px)'}}>搜索</Typography>
                    </Button>
                </Box>
            </Box>

            <Box sx={{flexGrow: 1, overflow: 'hidden', position: 'relative'}}>
                {isLoading && (
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 10
                    }}>
                        <CircularProgress/>
                    </Box>
                )}
                {isError && (
                    <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Typography color="error">加载失败: {error.message}</Typography>
                    </Box>
                )}
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
                    labelDisplayedRows={({from, to, count}: {
                        from: number,
                        to: number,
                        count: number
                    }) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    <Table stickyHeader aria-label="工单信息表"
                           sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%'}}>
                        <TableHead>
                            <TableRow>
                                {isMobile ? (
                                    <>
                                        <TableCell sx={{width: '33.33%', fontWeight: 700}}>客户名称</TableCell>
                                        <TableCell sx={{width: '33.33%', fontWeight: 700}}>状态</TableCell>
                                        <TableCell sx={{width: '33.33%', fontWeight: 700}}>操作类别</TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell
                                            sx={{width: '10%', minWidth: '120px', fontWeight: 700}}>客户名称</TableCell>
                                        <TableCell
                                            sx={{width: '8%', minWidth: '90px', fontWeight: 700}}>状态</TableCell>
                                        <TableCell
                                            sx={{width: '10%', minWidth: '120px', fontWeight: 700}}>操作类别</TableCell>
                                        <TableCell sx={{fontWeight: 700}}>操作内容</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(r => {
                                const currentStatus = statusConfig[r.status] || statusConfig.default;
                                return (
                                    <ClickableTableRow
                                        key={r.id}
                                        selected={r.id === ticketId}
                                        onClick={() => {
                                            navigate(`/app/tickets/${r.id}`, {replace: true});
                                        }}
                                    >
                                        {isMobile ? [
                                            <TooltipCell key="customerName">{r.customerName}</TooltipCell>,
                                            <TooltipCell key="status">
                                                <Chip
                                                    label={currentStatus.label}
                                                    size="small"
                                                    sx={currentStatus.sx}
                                                />
                                            </TooltipCell>,
                                            <TooltipCell key="opType">{r.operationType}</TooltipCell>
                                        ] : [
                                            <TooltipCell key="customerName">{r.customerName}</TooltipCell>,
                                            <TooltipCell key="status">
                                                <Chip
                                                    label={currentStatus.label}
                                                    size="small"
                                                    sx={currentStatus.sx}
                                                />
                                            </TooltipCell>,
                                            <TooltipCell key="opType">{r.operationType}</TooltipCell>,
                                            <TooltipCell key="opContent">{r.operationContent}</TooltipCell>
                                        ]}
                                    </ClickableTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default Tickets;