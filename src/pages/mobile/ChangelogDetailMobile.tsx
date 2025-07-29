/**
 * 文件名: src/pages/mobile/ChangelogDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件现在是更新日志模块移动端详情页的【配置文件】。
 * 它通过调用通用的 MobileDetailPageLayout 组件来渲染页面。
 *
 * 本次修改内容:
 * - 【代码重构】使用通用的 MobileDetailPageLayout 替换了所有重复的 JSX 和逻辑。
 */
import React, { lazy } from 'react';
import MobileDetailPageLayout from '../../layouts/MobileDetailPageLayout';

const ChangelogDetailContent = lazy(() => import('../../components/modals/ChangelogDetailContent.tsx'));

const ChangelogDetailMobile: React.FC = () => {
    return (
        <MobileDetailPageLayout
            title="日志详情"
            backPath="/app/changelog"
            paramName="logId"
            DetailContentComponent={ChangelogDetailContent}
        />
    );
};

export default ChangelogDetailMobile;