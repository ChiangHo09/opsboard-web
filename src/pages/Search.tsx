/**
 * 文件名: src/pages/Search.tsx
 *
 * 文件功能描述:
 * 此文件定义了应用的“全局搜索”页面。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {type JSX, useEffect} from 'react';
import {Box, Typography} from '@mui/material';
import {useLayoutDispatch} from '@/contexts/LayoutContext.tsx';
import PageLayout from '@/layouts/PageLayout';

const Search = (): JSX.Element => {
    const {closePanel} = useLayoutDispatch();

    useEffect(() => {
        closePanel();
    }, [closePanel]);

    return (
        <PageLayout>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4}}>
                <Typography variant="h5" sx={{color: 'primary.main', fontSize: '2rem'}}>
                    全局搜索 (Search)
                </Typography>
            </Box>
            <Typography sx={{mt: 2}}>这里实现搜索框与结果…</Typography>
        </PageLayout>
    );
};

export default Search;