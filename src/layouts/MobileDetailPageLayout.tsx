/**
 * 文件名: src/layouts/MobileDetailPageLayout.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个【可复用的】移动端详情页面布局组件。它封装了所有移动端详情页共享的
 * UI 结构和业务逻辑，包括全屏布局、带关闭按钮的标题栏、以及从移动端到桌面端的自动重定向功能。
 *
 * 本次修改内容:
 * - 【ESLint 修复】遵循了 `no-explicit-any` 规则，将泛型约束中的 `any` 类型替换为更安全的 `unknown`。
 * - **问题根源**:
 *   代码中使用了 `Record<string, any>`，这违反了 ESLint 对显式使用 `any` 类型的禁令。
 * - **解决方案**:
 *   1.  将泛型约束 `T extends Record<string, any>` 修改为 `T extends Record<string, unknown>`。
 *   2.  这向 TypeScript 和 ESLint 表明，我们接受一个“值类型未知”的对象，而不是一个“放弃所有类型检查”的对象，这是一种更安全的做法。
 * - **最终效果**:
 *   代码现在完全符合严格的 ESLint 规则，消除了所有警告，同时保持了代码的类型安全和灵活性。
 */
import { Suspense, useEffect, type LazyExoticComponent, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useLayoutState } from '../contexts/LayoutContext.tsx';

// 【核心修复】将泛型约束中的 any 替换为 unknown
interface MobileDetailPageLayoutProps<T extends Record<string, unknown>> {
    title: string;
    backPath: string;
    paramName: keyof T & string;
    DetailContentComponent: LazyExoticComponent<FC<T>>;
}

// 【核心修复】将泛型约束中的 any 替换为 unknown
const MobileDetailPageLayout = <T extends Record<string, unknown>>({
                                                                       title,
                                                                       backPath,
                                                                       paramName,
                                                                       DetailContentComponent,
                                                                   }: MobileDetailPageLayoutProps<T>) => {
    const navigate = useNavigate();
    const params = useParams();
    const { isMobile } = useLayoutState();

    const id = params[paramName];

    useEffect(() => {
        if (id && !isMobile) {
            navigate(`${backPath}/${id}`, { replace: true });
        }
    }, [isMobile, id, navigate, backPath]);

    if (!id) {
        return null;
    }

    const contentProps = { [paramName]: id } as T;

    return (
        <Box sx={{ boxSizing: 'border-box', height: '100%', display: 'flex', flexDirection: 'column', p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0 }}>
                <Typography variant="h6">{title}</Typography>
                <IconButton
                    onClick={() => navigate(backPath)}
                    aria-label="关闭"
                    sx={{ mr: -1.5 }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Suspense fallback={
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CircularProgress />
                    </Box>
                }>
                    <DetailContentComponent {...contentProps} />
                </Suspense>
            </Box>
        </Box>
    );
};

export default MobileDetailPageLayout;