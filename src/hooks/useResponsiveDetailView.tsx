/**
 * 文件名: src/hooks/useResponsiveDetailView.ts
 *
 * 文件功能描述:
 * 此文件定义了一个名为 `useResponsiveDetailView` 的自定义 Hook，
 * 封装了处理响应式详情视图（桌面端弹窗 vs. 移动端整页）的通用逻辑。
 *
 * 本次修改内容:
 * - 【类型定义现代化】更新了 `UseResponsiveDetailViewOptions` 接口中
 *   `DetailContentComponent` 的类型定义。
 * - **解决方案**:
 *   将 `LazyExoticComponent<FC<TProps>>` 修改为 `LazyExoticComponent<(props: TProps) => ReactElement>`。
 * - **最终效果**:
 *   此 Hook 现在接受使用现代写法（不含 `React.FC`）定义的组件作为参数，
 *   与整个项目的组件现代化方向保持了一致，提升了类型系统的连贯性。
 */
import {useEffect, Suspense, type LazyExoticComponent, type ReactElement} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useQuery, type QueryKey, type QueryFunction} from '@tanstack/react-query';
import {Box, CircularProgress} from '@mui/material';
import {useLayoutState, useLayoutDispatch} from '@/contexts/LayoutContext';

// 【核心修改】更新 DetailContentComponent 的类型，不再依赖 React.FC
interface UseResponsiveDetailViewOptions<TData extends { id: string }, TProps> {
    paramName: keyof TProps & string;
    baseRoute: string;
    queryKey: QueryKey;
    queryFn: QueryFunction<TData[]>;
    DetailContentComponent: LazyExoticComponent<(props: TProps) => ReactElement>;
}

export const useResponsiveDetailView = <TData extends { id: string }, TProps extends object>({
                                                                                                 paramName,
                                                                                                 baseRoute,
                                                                                                 queryKey,
                                                                                                 queryFn,
                                                                                                 DetailContentComponent,
                                                                                             }: UseResponsiveDetailViewOptions<TData, TProps>) => {
    const {isMobile} = useLayoutState();
    const {setIsModalOpen, setModalConfig} = useLayoutDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const entityId = params[paramName];

    const queryResult = useQuery<TData[], Error>({
        queryKey: queryKey,
        queryFn: queryFn,
    });
    const {data = []} = queryResult;

    // Effect 1: 负责控制桌面端弹窗的显示与隐藏
    useEffect(() => {
        const entityExists = entityId && data.some(item => item.id === entityId);

        if (entityExists && !isMobile) {
            setIsModalOpen(true);
            const contentProps = {[paramName]: entityId} as TProps;
            setModalConfig({
                content: (
                    <Suspense fallback={<Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}><CircularProgress/></Box>}>
                        <DetailContentComponent {...contentProps} />
                    </Suspense>
                ),
                onClose: () => navigate(baseRoute, {replace: true}),
            });
        } else {
            setIsModalOpen(false);
            setModalConfig({content: null, onClose: null});
        }
    }, [entityId, isMobile, data, navigate, baseRoute, paramName, DetailContentComponent, setIsModalOpen, setModalConfig]);

    // Effect 2: 负责处理从桌面端到移动端的视图重定向
    useEffect(() => {
        if (entityId && isMobile) {
            navigate(`${baseRoute}/mobile/${entityId}`, {replace: true});
        }
    }, [entityId, isMobile, navigate, baseRoute]);

    return queryResult;
};