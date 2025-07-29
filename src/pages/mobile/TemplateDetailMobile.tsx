/**
 * 文件名: src/pages/mobile/TemplateDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件是模板模块移动端详情页的【配置文件】。它的唯一职责是通过调用通用的 `MobileDetailPageLayout`
 * 组件来渲染页面，并为其提供模板模块专属的配置。
 *
 * 本次修改内容:
 * - 【最终确认】此文件已使用了正确的 `paramName: "itemId"`，与路由配置和内容组件的 props 完全匹配，无需进一步修改。
 */
import React, {lazy} from 'react';
import MobileDetailPageLayout from '@/layouts/MobileDetailPageLayout';
import {type TemplateModalContentProps} from '@/components/modals/TemplateModalContent';

const TemplateModalContent = lazy(() => import('@/components/modals/TemplateModalContent.tsx'));

const TemplateDetailMobile: React.FC = () => {
    return (
        <MobileDetailPageLayout<TemplateModalContentProps>
            title="模板详情"
            backPath="/app/template-page"
            paramName="itemId" // 这个值现在与 TemplateModalContentProps 中的键名完全匹配
            DetailContentComponent={TemplateModalContent}
        />
    );
};

export default TemplateDetailMobile;