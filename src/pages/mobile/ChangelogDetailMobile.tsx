/**
 * 文件名: src/pages/mobile/ChangelogDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件是更新日志模块移动端详情页的【配置文件】。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {lazy, type JSX} from 'react';
import MobileDetailPageLayout from '@/layouts/MobileDetailPageLayout';
import {type ChangelogDetailContentProps} from '@/components/modals/ChangelogDetailContent';

const ChangelogDetailContent = lazy(() => import('@/components/modals/ChangelogDetailContent.tsx'));

// 【核心修改】移除 React.FC，添加 : JSX.Element 返回值类型
const ChangelogDetailMobile = (): JSX.Element => {
    return (
        <MobileDetailPageLayout<ChangelogDetailContentProps>
            title="日志详情"
            backPath="/app/changelog"
            paramName="logId"
            DetailContentComponent={ChangelogDetailContent}
        />
    );
};

export default ChangelogDetailMobile;