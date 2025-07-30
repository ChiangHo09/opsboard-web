/**
 * 文件名: src/components/forms/__tests__/TemplateSearchForm.test.tsx
 *
 * 文件功能描述:
 * 此文件是 TemplateSearchForm 组件的集成测试集。
 *
 * 本次修改内容:
 * - 【测试类型终极修复】在文件顶部直接导入 `@testing-library/jest-dom`。
 * - **原因**: 当全局 TypeScript 配置无法让编辑器正确识别 jest-dom 的
 *   自定义断言（如 .toBeInTheDocument）时，直接在测试文件中导入可以
 *   强制 TypeScript 加载其类型定义，从而解决 TS2339 错误。
 */

import React from 'react';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// 【核心修复】直接在此处导入，为当前文件提供类型定义
import '@testing-library/jest-dom';
import TemplateSearchForm from '../TemplateSearchForm';
import {ThemeProvider} from '@mui/material/styles';
import theme from '@/theme'; // 修正了导入路径，移除 .ts 后缀

// 由于我们的组件依赖于MUI主题，创建一个辅助函数来包裹被测试的组件
const renderWithTheme = (ui: React.ReactElement) => {
    return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('TemplateSearchForm', () => {
    // 测试用例 1: 验证组件是否能被正确渲染
    it('should render all form fields and buttons correctly', () => {
        renderWithTheme(<TemplateSearchForm onSearch={() => {
        }} onReset={() => {
        }}/>);

        // 使用 getByLabelText 查找输入框，这是推荐的、面向可访问性的查询方式
        expect(screen.getByLabelText('示例字段 1')).toBeInTheDocument();
        expect(screen.getByLabelText('示例字段 2')).toBeInTheDocument();

        // 使用 getByRole 查找按钮，name 是其可访问的名称
        expect(screen.getByRole('button', {name: /重置/i})).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /搜索/i})).toBeInTheDocument();
    });

    // 测试用例 2: 验证用户输入和表单提交
    it('should call onSearch with the correct values when user types and submits', async () => {
        const user = userEvent.setup(); // 设置 userEvent
        const mockOnSearch = jest.fn(); // 创建一个模拟的 onSearch 函数

        renderWithTheme(<TemplateSearchForm onSearch={mockOnSearch}/>);

        // 1. 查找元素
        const input1 = screen.getByLabelText('示例字段 1');
        const input2 = screen.getByLabelText('示例字段 2');
        const searchButton = screen.getByRole('button', {name: /搜索/i});

        // 2. 模拟用户交互
        await user.type(input1, 'Hello');
        await user.type(input2, 'World');
        await user.click(searchButton);

        // 3. 断言
        // 检查 onSearch 函数是否被调用了一次
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        // 检查 onSearch 函数被调用时，传入的参数是否正确
        expect(mockOnSearch).toHaveBeenCalledWith({
            fieldName1: 'Hello',
            fieldName2: 'World',
        });
    });

    // 测试用例 3: 验证重置功能
    it('should clear fields and call onReset when reset button is clicked', async () => {
        const user = userEvent.setup();
        const mockOnReset = jest.fn();

        renderWithTheme(<TemplateSearchForm onSearch={() => {
        }} onReset={mockOnReset}/>);

        const input1 = screen.getByLabelText('示例字段 1');
        const resetButton = screen.getByRole('button', {name: /重置/i});

        // 先输入一些内容
        await user.type(input1, 'Some text');
        // 确认输入成功
        expect(input1).toHaveValue('Some text');

        // 点击重置按钮
        await user.click(resetButton);

        // 断言：输入框应该被清空
        expect(input1).toHaveValue('');
        // 断言：onReset 回调函数应该被调用
        expect(mockOnReset).toHaveBeenCalledTimes(1);
    });
});