/**
 * 文件名: src/pages/mobile/TemplateDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件是模板模块移动端详情页的【配置文件】。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {lazy, type JSX} from 'react';
import MobileDetailPageLayout from '@/layouts/MobileDetailPageLayout';
import {type TemplateModalContentProps} from '@/components/modals/TemplateModalContent';

const TemplateModalContent = lazy(() => import('@/components/modals/TemplateModalContent.tsx'));

// 【核心修改】移除 React.FC，添加 : JSX.Element 返回值类型
const TemplateDetailMobile = (): JSX.Element => {
    return (
        <MobileDetailPageLayout<TemplateModalContentProps>
            title="模板详情"
            backPath="/app/template-page"
            paramName="itemId"
            DetailContentComponent={TemplateModalContent}
        />
    );
};

export default TemplateDetailMobile;