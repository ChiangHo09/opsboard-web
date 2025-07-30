/**
 * 文件名: src/pages/TemplatePage.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个功能完备的【模板页面】，旨在成为创建新页面的“终极模板”。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {useEffect, useCallback, useState, lazy, Suspense, type JSX} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Box, Typography, Button, Table, TableBody, TableCell,
    TableHead, TableRow, ButtonBase, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useLayoutDispatch, useLayoutState} from '@/contexts/LayoutContext.tsx';
import {useNotification} from '@/contexts/NotificationContext.tsx';
import PageLayout from '@/layouts/PageLayout.tsx';
import DataTable from '@/components/ui/DataTable.tsx';
import TooltipCell from '@/components/ui/TooltipCell.tsx';
import {type TemplateSearchValues} from '@/components/forms/TemplateSearchForm.tsx';
import {handleAsyncError} from '@/utils/errorHandler.ts';

const TemplateSearchForm = lazy(() => import('@/components/forms/TemplateSearchForm.tsx'));
const TemplateModalContent = lazy(() => import('@/components/modals/TemplateModalContent.tsx'));

interface TemplateRow {
    id: string;
    name: string;
    category: 'A' | 'B' | 'C';
    description: string;
}

const createData = (id: string, name: string, category: TemplateRow['category'], description: string): TemplateRow => ({
    id, name, category, description,
});

const LONG_TEXT = '这是一个非常长的描述，用于演示当文本内容超出单元格宽度时，TooltipCell 组件是如何自动截断文本并提供悬停提示的。';

const templateRows: TemplateRow[] = [
    createData('item-001', '模板项目 Alpha', 'A', '这是 Alpha 项目的简短描述。'),
    createData('item-002', '模板项目 Beta', 'B', LONG_TEXT),
    createData('item-003', '模板项目 Gamma', 'C', '这是 Gamma 项目的简短描述。'),
    ...Array.from({length: 20}).map((_, i) =>
        createData(`item-${i + 4}`, `模板项目 ${i + 4}`, ['A', 'B', 'C'][i % 3] as TemplateRow['category'], `这是第 ${i + 4} 条项目的描述。`)
    ),
];

const TemplatePage = (): JSX.Element => {
    const {isMobile, isPanelOpen} = useLayoutState();
    const {
        togglePanel, setPanelContent, setPanelTitle, setPanelWidth,
        setIsModalOpen, setModalConfig,
    } = useLayoutDispatch();
    const showNotification = useNotification();
    const navigate = useNavigate();
    const {itemId} = useParams<{ itemId: string }>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isPanelContentSet, setIsPanelContentSet] = useState(false);

    const handleSearch = useCallback((values: TemplateSearchValues) => {
        try {
            alert(`搜索: ${JSON.stringify(values)}`);
            togglePanel();
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [togglePanel, showNotification]);

    const handleReset = useCallback(() => {
        try {
            alert('表单已重置');
        } catch (e) {
            handleAsyncError(e, showNotification);
        }
    }, [showNotification]);

    const handleTogglePanel = () => {
        if (!isPanelContentSet) {
            setIsPanelContentSet(true);
        }
        togglePanel();
    };

    useEffect(() => {
        if (isPanelOpen) {
            setIsPanelContentSet(true);
        }
    }, [isPanelOpen]);

    useEffect(() => {
        const itemExists = itemId && templateRows.some(row => row.id === itemId);

        if (itemExists && !isMobile) {
            setIsModalOpen(true);
            setModalConfig({
                content: (
                    <Suspense fallback={<Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}><CircularProgress/></Box>}>
                        <TemplateModalContent itemId={itemId}/>
                    </Suspense>
                ),
                onClose: () => navigate('/app/template-page', {replace: true}),
            });
        } else {
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }
    }, [itemId, isMobile, navigate, setIsModalOpen, setModalConfig]);

    useEffect(() => {
        if (itemId && isMobile) {
            navigate(`/app/template-page/mobile/${itemId}`, {replace: true});
        }
    }, [itemId, isMobile, navigate]);

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
                    <TemplateSearchForm onSearch={handleSearch} onReset={handleReset}/>
                </Suspense>
            );
            setPanelTitle('模板搜索');
            setPanelWidth(360);
        }, 0);
        return () => {
            clearTimeout(timerId);
            setPanelContent(null);
            setPanelTitle('');
        };
    }, [isPanelContentSet, setPanelContent, setPanelTitle, setPanelWidth, handleSearch, handleReset]);

    const pageRows = templateRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <PageLayout sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0}}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>模板页面</Typography>
                <Button variant="contained" size="large" startIcon={<SearchIcon/>} onClick={handleTogglePanel} sx={{
                    height: 42,
                    borderRadius: '50px',
                    textTransform: 'none',
                    px: 3,
                    bgcolor: 'app.button.background',
                    color: 'neutral.main',
                    '&:hover': {bgcolor: 'app.button.hover'}
                }}>
                    <Typography component="span" sx={{transform: 'translateY(1px)'}}>搜索</Typography>
                </Button>
            </Box>

            <Box sx={{flexGrow: 1, overflow: 'hidden'}}>
                <DataTable
                    rowsPerPageOptions={[10, 25, 50]}
                    count={templateRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    onRowsPerPageChange={event => {
                        setRowsPerPage(+event.target.value);
                        setPage(0);
                    }}
                    labelRowsPerPage="每页行数:"
                    labelDisplayedRows={({from, to, count}) => `显示 ${from}-${to} 条, 共 ${count} 条`}
                >
                    <Table stickyHeader aria-label="模板数据表"
                           sx={{borderCollapse: 'separate', tableLayout: 'fixed', width: '100%', minWidth: 650}}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{
                                    width: '25%',
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 120,
                                    bgcolor: 'background.paper',
                                    fontWeight: 700
                                }}>项目名称</TableCell>
                                <TableCell sx={{width: '15%', fontWeight: 700}}>类别</TableCell>
                                <TableCell sx={{width: '60%', fontWeight: 700}}>描述</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pageRows.map(row => (
                                <ButtonBase
                                    key={row.id}
                                    component={TableRow}
                                    onClick={() => navigate(`/app/template-page/${row.id}`, {replace: true})}
                                    sx={{display: 'table-row', width: '100%', position: 'relative'}}
                                >
                                    <TooltipCell sx={{
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 100,
                                        bgcolor: 'background.paper',
                                        'tr:hover &': {bgcolor: 'action.hover'}
                                    }}>
                                        {row.name}
                                    </TooltipCell>
                                    <TableCell sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>
                                        {row.category}
                                    </TableCell>
                                    <TooltipCell sx={{'tr:hover &': {bgcolor: 'action.hover'}}}>
                                        {row.description}
                                    </TooltipCell>
                                </ButtonBase>
                            ))}
                        </TableBody>
                    </Table>
                </DataTable>
            </Box>
        </PageLayout>
    );
};

export default TemplatePage;