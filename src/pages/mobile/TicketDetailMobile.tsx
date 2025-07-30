/**
 * 文件名: src/pages/mobile/TicketDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件是工单模块移动端详情页的【配置文件】。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {lazy, type JSX} from 'react';
import MobileDetailPageLayout from '@/layouts/MobileDetailPageLayout';
import {type TicketDetailContentProps} from '@/components/modals/TicketDetailContent';

const TicketDetailContent = lazy(() => import('@/components/modals/TicketDetailContent.tsx'));

// 【核心修改】移除 React.FC，添加 : JSX.Element 返回值类型
const TicketDetailMobile = (): JSX.Element => {
    return (
        <MobileDetailPageLayout<TicketDetailContentProps>
            title="工单详情"
            backPath="/app/tickets"
            paramName="ticketId"
            DetailContentComponent={TicketDetailContent}
        />
    );
};

export default TicketDetailMobile;