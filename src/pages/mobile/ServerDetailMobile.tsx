/**
 * 文件名: src/pages/mobile/ServerDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件现在是服务器模块移动端详情页的【配置文件】。
 * 它通过调用通用的 MobileDetailPageLayout 组件来渲染页面。
 *
 * 本次修改内容:
 * - 【代码重构】使用通用的 MobileDetailPageLayout 替换了所有重复的 JSX 和逻辑。
 */
import React, { lazy } from 'react';
import MobileDetailPageLayout from '../../layouts/MobileDetailPageLayout';

const ServerDetailContent = lazy(() => import('../../components/modals/ServerDetailContent.tsx'));

const ServerDetailMobile: React.FC = () => {
    return (
        <MobileDetailPageLayout
            title="服务器详情"
            backPath="/app/servers"
            paramName="serverId"
            DetailContentComponent={ServerDetailContent}
        />
    );
};

export default ServerDetailMobile;