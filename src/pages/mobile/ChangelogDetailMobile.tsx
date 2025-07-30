/**
 * 文件名: src/pages/mobile/ChangelogDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件现在是更新日志模块移动端详情页的【配置文件】。
 * 它通过调用通用的 MobileDetailPageLayout 组件来渲染页面。
 *
 * 本次修改内容:
 * - 【代码清理】移除了用于测试局部错误边界而硬编码的 `throw new Error()` 语句。
 * - **最终效果**: 此组件现在可以正常渲染，不再主动触发错误。
 */
import React, {lazy} from 'react';
import MobileDetailPageLayout from '@/layouts/MobileDetailPageLayout';
import {type ChangelogDetailContentProps} from '@/components/modals/ChangelogDetailContent';

const ChangelogDetailContent = lazy(() => import('@/components/modals/ChangelogDetailContent.tsx'));

const ChangelogDetailMobile: React.FC = () => {
    // 【核心修改】移除用于测试的错误抛出逻辑

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