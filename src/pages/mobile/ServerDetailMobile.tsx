/**
 * 文件名: src/pages/mobile/ServerDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件现在是服务器模块移动端详情页的【配置文件】。
 * 它通过调用通用的 MobileDetailPageLayout 组件来渲染页面。
 *
 * 本次修改内容:
 * - 【TypeScript 类型修复】在调用通用布局组件时，显式地传递了泛型参数。
 */
import React, {lazy} from 'react';
import MobileDetailPageLayout from '@/layouts/MobileDetailPageLayout';
// 【核心修复】导入详情内容组件的 props 类型
import {type ServerDetailContentProps} from '@/components/modals/ServerDetailContent';

const ServerDetailContent = lazy(() => import('@/components/modals/ServerDetailContent.tsx'));

const ServerDetailMobile: React.FC = () => {
    return (
        // 【核心修复】显式地为泛型组件传递 props 类型
        <MobileDetailPageLayout<ServerDetailContentProps>
            title="服务器详情"
            backPath="/app/servers"
            paramName="serverId"
            DetailContentComponent={ServerDetailContent}
        />
    );
};

export default ServerDetailMobile;