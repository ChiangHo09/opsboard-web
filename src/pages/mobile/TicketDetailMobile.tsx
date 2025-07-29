/**
 * 文件名: src/pages/mobile/TicketDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件现在是工单模块移动端详情页的【配置文件】。
 * 它通过调用通用的 MobileDetailPageLayout 组件来渲染页面。
 *
 * 本次修改内容:
 * - 【代码重构】使用通用的 MobileDetailPageLayout 替换了所有重复的 JSX 和逻辑。
 * - **最终效果**:
 *   此文件代码量减少了90%，职责变得非常单一：只负责为通用布局提供工单模块专属的配置。
 */
import React, { lazy } from 'react';
import MobileDetailPageLayout from '../../layouts/MobileDetailPageLayout';

// 懒加载此页面需要的内容组件
const TicketDetailContent = lazy(() => import('../../components/modals/TicketDetailContent.tsx'));

const TicketDetailMobile: React.FC = () => {
    return (
        <MobileDetailPageLayout
            title="工单详情"
            backPath="/app/tickets"
            paramName="ticketId"
            DetailContentComponent={TicketDetailContent}
        />
    );
};

export default TicketDetailMobile;