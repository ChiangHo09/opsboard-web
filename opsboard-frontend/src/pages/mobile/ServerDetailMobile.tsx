/**
 * 文件名: src/pages/mobile/ServerDetailMobile.tsx
 *
 * 文件功能描述:
 * 此文件是服务器模块移动端详情页的【配置文件】。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 `: JSX.Element` 返回值类型。
 */
import {lazy, type JSX} from 'react';
import MobileDetailPageLayout from '@/layouts/MobileDetailPageLayout';
import {type ServerDetailContentProps} from '@/components/modals/ServerDetailContent';

const ServerDetailContent = lazy(() => import('@/components/modals/ServerDetailContent.tsx'));

// 【核心修改】移除 React.FC，添加 : JSX.Element 返回值类型
const ServerDetailMobile = (): JSX.Element => {
    return (
        <MobileDetailPageLayout<ServerDetailContentProps>
            title="服务器详情"
            backPath="/app/servers"
            paramName="serverId"
            DetailContentComponent={ServerDetailContent}
        />
    );
};

export default ServerDetailMobile;