/**
 * 文件名: src/layouts/MobileDetailPageLayout.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个【可复用的】移动端详情页面布局组件。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC` 的使用，采用了现代的函数组件定义方式。
 *   对于泛型组件，这种写法更加自然和清晰，并显式注解了 `: JSX.Element | null` 返回值类型。
 * - 【类型修正】由于此组件在特定条件下可能返回 `null`，将返回值类型从 `: JSX.Element`
 *   修正为 `: JSX.Element | null`，以实现更精确的类型覆盖。
 */
import {Suspense, useEffect, type JSX, type LazyExoticComponent, type ReactElement} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Box, Typography, IconButton, CircularProgress} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useLayoutState} from '@/contexts/LayoutContext.tsx';
import {mobileOverlayVariants} from '@/utils/animations';
import {motion} from 'framer-motion';

const MotionBox = motion(Box);

// 【核心修改】LazyExoticComponent 的泛型参数不再需要是 FC，可以是更通用的类型
interface MobileDetailPageLayoutProps<T extends object> {
    title: string;
    backPath: string;
    paramName: keyof T & string;
    DetailContentComponent: LazyExoticComponent<(props: T) => ReactElement>;
}

// 【核心修改】移除 React.FC，使用现代泛型组件写法，并修正返回值类型
const MobileDetailPageLayout = <T extends object>({
                                                      title,
                                                      backPath,
                                                      paramName,
                                                      DetailContentComponent,
                                                  }: MobileDetailPageLayoutProps<T>): JSX.Element | null => {
    const navigate = useNavigate();
    const params = useParams();
    const {isMobile} = useLayoutState();

    const id = params[paramName];

    useEffect(() => {
        if (id && !isMobile) {
            navigate(`${backPath}/${id}`, {replace: true});
        }
    }, [isMobile, id, navigate, backPath]);

    // 【类型修正】如果 id 不存在，组件不渲染任何东西，返回 null
    if (!id) {
        return null;
    }

    const contentProps = {[paramName]: id} as T;

    return (
        <MotionBox
            sx={{boxSizing: 'border-box', height: '100%', display: 'flex', flexDirection: 'column', p: 3}}
            variants={mobileOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexShrink: 0}}>
                <Typography variant="h6">{title}</Typography>
                <IconButton
                    onClick={() => navigate(backPath)}
                    aria-label="关闭"
                    sx={{mr: -1.5}}
                >
                    <CloseIcon/>
                </IconButton>
            </Box>

            <Box sx={{flexGrow: 1, overflow: 'hidden'}}>
                <Suspense fallback={
                    <Box sx={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <CircularProgress/>
                    </Box>
                }>
                    <DetailContentComponent {...contentProps} />
                </Suspense>
            </Box>
        </MotionBox>
    );
};

export default MobileDetailPageLayout;