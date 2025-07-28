/**
 * 文件名: src/components/forms/TicketSearchForm.tsx
 *
 * 文件功能描述:
 * 此文件定义了【工单搜索表单】组件（TicketSearchForm）。它提供了用于筛选工单列表的UI元素，
 * 包括区域、客户名称以及状态和类别的下拉选择框。
 *
 * 本次修改内容:
 * - 【全新文件】基于 TemplateSearchForm.tsx 模板创建。
 * - **功能实现**:
 *   1.  **状态管理**: 为区域、客户名称、状态和类别四个字段创建了独立的 `useState`。
 *   2.  **下拉框 (Select)**: 使用 Material-UI 的 `TextField` 组件，并设置 `select` 属性，结合 `MenuItem` 来实现“状态”和“类别”的下拉选择功能。
 *   3.  **数据传递**: `onSearch` 回调函数现在会收集所有四个字段的值并传递给父组件。
 *   4.  **重置功能**: `handleResetClick` 函数会清空所有输入字段的状态。
 */

// 从 'react' 库导入核心功能：
// - useState: 用于在组件中管理局部状态。
// - FC (FunctionComponent): 用于为函数式组件提供 TypeScript 类型定义。
import { useState, type FC } from 'react';

// 从 Material-UI 库导入 UI 组件：
// - Box, TextField, Button, Stack, Typography: 用于构建表单布局和元素。
// - MenuItem: 用于定义下拉选择框中的选项。
import { Box, TextField, Button, Stack, Typography, MenuItem } from '@mui/material';

// 定义此表单组件将回传给父组件的数据结构接口。
export interface TicketSearchValues {
    region: string;
    customerName: string;
    status: string;
    category: string;
}

// 定义此组件接收的 props 的接口。
interface TicketSearchFormProps {
    // onSearch: 一个回调函数，当用户点击“搜索”按钮时触发，并携带表单的当前值。
    onSearch: (values: TicketSearchValues) => void;
    // onReset: 一个可选的回调函数，当用户点击“重置”按钮时触发。
    onReset?: () => void;
}

// 定义 TicketSearchForm 组件。
const TicketSearchForm: FC<TicketSearchFormProps> = ({ onSearch, onReset }) => {
    // --- 1. STATE MANAGEMENT ---
    // 为表单的每个字段创建独立的 state。
    const [region, setRegion] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [status, setStatus] = useState(''); // 状态下拉框的 state
    const [category, setCategory] = useState(''); // 类别下拉框的 state

    // --- 2. EVENT HANDLERS ---
    // 处理“搜索”按钮的点击事件。
    const handleSearchClick = () => {
        // 调用从 props 传入的 onSearch 函数，并传递一个包含所有字段当前值的对象。
        onSearch({
            region,
            customerName,
            status,
            category
        });
    };

    // 处理“重置”按钮的点击事件。
    const handleResetClick = () => {
        // 将所有 state 重置为空字符串。
        setRegion('');
        setCustomerName('');
        setStatus('');
        setCategory('');
        // 如果 onReset prop 存在，则调用它。
        if (onReset) {
            onReset();
        }
    };

    // --- 3. JSX RENDER ---
    return (
        // 使用 Stack 组件作为表单的根容器，方便地控制子元素间距和布局。
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 这个 Box 是可滚动的内容区域 */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
                {/* 区域输入框 */}
                <TextField
                    fullWidth         // fullWidth: 使输入框占据父容器的全部宽度。
                    margin="normal"   // margin="normal": 添加标准的垂直外边距。
                    label="区域"      // label: 输入框的标签。
                    variant="outlined"// variant="outlined": 使用轮廓样式。
                    value={region}    // value: 将输入框的值与 `region` state 绑定。
                    onChange={(e) => setRegion(e.target.value)} // onChange: 当值改变时，更新 `region` state。
                />

                {/* 客户名称输入框 */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="客户名称"
                    variant="outlined"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />

                {/* 状态下拉选择框 */}
                <TextField
                    fullWidth
                    select            // select: 将 TextField 转换为一个下拉选择框。
                    margin="normal"
                    label="状态"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    {/* 定义下拉选项 */}
                    <MenuItem value="挂起">挂起</MenuItem>
                    <MenuItem value="就绪">就绪</MenuItem>
                </TextField>

                {/* 类别下拉选择框 */}
                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="类别"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {/* 定义下拉选项 */}
                    <MenuItem value="更新">更新</MenuItem>
                    <MenuItem value="备份">备份</MenuItem>
                    <MenuItem value="巡检">巡检</MenuItem>
                </TextField>
            </Box>

            {/* 底部操作按钮区域 */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexShrink: 0 }}>
                {/* 仅当 onReset prop 存在时才渲染“重置”按钮 */}
                {onReset && (
                    <Button
                        variant="outlined"
                        onClick={handleResetClick}
                        fullWidth
                        sx={{
                            height: 48,
                            borderRadius: 99,
                            borderColor: 'neutral.main',
                            color: 'neutral.main',
                            '&:hover': {
                                bgcolor: 'custom.hoverOpacity',
                                borderColor: 'neutral.main',
                            }
                        }}
                    >
                        <Typography component="span" sx={{ transform: 'translateY(1px)', fontWeight: 500 }}>
                            重置
                        </Typography>
                    </Button>
                )}
                {/* “搜索”按钮 */}
                <Button
                    variant="contained"
                    onClick={handleSearchClick}
                    fullWidth
                    sx={{
                        height: 48,
                        borderRadius: 99,
                        bgcolor: 'neutral.main',
                        color: 'neutral.contrastText',
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: 'neutral.dark',
                            boxShadow: 'none',
                        }
                    }}
                >
                    <Typography component="span" sx={{ transform: 'translateY(1px)', fontWeight: 500 }}>
                        搜索
                    </Typography>
                </Button>
            </Stack>
        </Stack>
    );
};

// 默认导出该组件。
export default TicketSearchForm;