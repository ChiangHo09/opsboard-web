/**
 * 文件名: src/pages/mobile/TicketDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件现在是工单模块移动端详情页的【配置文件】。
 * 它通过调用通用的 MobileDetailPageLayout 组件来渲染页面。
 *
 * 本次修改内容:
 * - 【TypeScript 类型修复】在调用通用布局组件时，显式地传递了泛型参数。
 * - **问题根源**:
 *   TypeScript 无法自动推断出 `MobileDetailPageLayout` 所需的泛型 `T` 的具体类型。
 * - **解决方案**:
 *   1.  导入了 `TicketDetailContent` 组件所需的 `TicketDetailContentProps` 类型。
 *   2.  在调用 `<MobileDetailPageLayout>` 时，像这样提供了明确的类型参数：`<MobileDetailPageLayout<TicketDetailContentProps> ... />`。
 * - **最终效果**:
 *   通过为泛型组件提供明确的类型，我们解决了所有类型不匹配的错误，实现了完全的类型安全。
 */
import React, {lazy} from 'react';
import MobileDetailPageLayout from '@/layouts/MobileDetailPageLayout';
// 【核心修复】导入详情内容组件的 props 类型
import {type TicketDetailContentProps} from '@/components/modals/TicketDetailContent';

const TicketDetailContent = lazy(() => import('@/components/modals/TicketDetailContent.tsx'));

const TicketDetailMobile: React.FC = () => {
    return (
        // 【核心修复】显式地为泛型组件传递 props 类型
        <MobileDetailPageLayout<TicketDetailContentProps>
            title="工单详情"
            backPath="/app/tickets"
            paramName="ticketId"
            DetailContentComponent={TicketDetailContent}
        />
    );
};

export default TicketDetailMobile;