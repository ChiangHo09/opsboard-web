/**
 * ================================================================================
 * 文件名称: ChangelogSearchForm.tsx
 * 文件说明:
 *     此文件定义了更新日志搜索表单组件（ChangelogSearchForm）。
 *     这是一个用于查询和过滤更新日志条目的可复用表单组件。
 *     它封装了所有必需的UI输入字段（地区、时间范围、服务器类型、更新类别）、
 *     内部状态管理以及操作按钮（重置/搜索），
 *     并通过 onSearch prop 将最终的搜索条件对象向上提交给使用它的父页面组件。
 *
 * 本次修改内容:
 * - 【核心改动】移除时间范围选择器（DateRangePicker），替换为两个独立的日期选择器（DatePicker），
 *   分别用于“起始时间”和“截止时间”的单独选择。
 * - 更新了表单的内部状态管理，现在直接使用 `startTime` 和 `endTime` 两个独立的 Dayjs | null 状态。
 * - 调整了数据提交的接口 `ChangelogSearchValues` 的时间字段传递方式，直接传递 `startTime` 和 `endTime`。
 * - 修改了表单的渲染逻辑，以包含两个 `DatePicker` 组件。
 * - 确保了所有相关的模块导入（如 DateRangePicker, DateRange）被移除，并添加了 DatePicker 的导入。
 * - 按钮颜色和样式保持与之前一致的深灰色主题。
 * - 所有的 TypeScript 兼容性修复和 ESLint 忽略注释均已保留并适配新的结构。
 * ================================================================================
 */
import React, { useState } from 'react'; // 导入 React 库和 useState Hook，用于组件的构建和状态管理
import { Box, TextField, Button, Stack } from '@mui/material'; // 从 Material-UI 导入核心组件：Box（布局容器）、TextField（文本输入框）、Button（按钮）、Stack（灵活布局容器）

// 确保所有日期选择器相关的导入都来自 @mui/x-date-pickers (免费版)
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // 导入 LocalizationProvider，用于为日期选择器提供本地化支持和日期适配器
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // 导入 AdapterDayjs，用于将 Day.js 作为日期处理库集成到 MUI 日期选择器中

// 【新增】导入单独的日期选择器组件 DatePicker
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // 导入 DatePicker 组件，用于选择单个日期

// 【移除】不再需要 DateRangePicker 和 DateRange 相关的导入
// import { DateRangePicker } from '@mui/x-date-pickers/DateRangePicker';
// import { DateRangePickerSlotsComponentsProps } from '@mui/x-date-pickers/DateRangePicker';
// import { DateRange } from '@mui/x-date-pickers/models';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Dayjs } from 'dayjs'; // 导入 Day.js 库及其 Dayjs 类型。虽然 dayjs 实例可能不直接使用，但其类型和 AdapterDayjs 依赖它，因此需导入并使用 ESLint 忽略注释避免警告


// 定义此表单将向外提交的数据结构，提供类型安全
export interface ChangelogSearchValues {
    region: string; // 地区字段，类型为字符串
    startTime: Dayjs | null; // 起始时间字段，使用 Dayjs 类型，可为 null
    endTime: Dayjs | null; // 截止时间字段，使用 Dayjs 类型，可为 null
    serverType: string; // 服务器类型字段，类型为字符串
    updateCategory: string; // 更新类别字段，类型为字符串
}

// 定义组件的 Props 接口，明确与父组件的契约
interface ChangelogSearchFormProps {
    onSearch: (values: ChangelogSearchValues) => void; // onSearch 回调函数，当点击搜索按钮时调用，并将 ChangelogSearchValues 对象作为参数传递给父组件
    onReset?: () => void; // onReset 回调函数，可选，当点击重置按钮时调用，允许父组件执行额外的重置逻辑
}

const ChangelogSearchForm: React.FC<ChangelogSearchFormProps> = ({ onSearch, onReset }) => {
    // 1. 表单自己管理自己的内部状态
    const [region, setRegion] = useState<string>(''); // 使用 useState Hook 定义并初始化地区状态变量，默认为空字符串
    const [serverType, setServerType] = useState<string>(''); // 使用 useState Hook 定义并初始化服务器类型状态变量，默认为空字符串
    const [updateCategory, setUpdateCategory] = useState<string>(''); // 使用 useState Hook 定义并初始化更新类别状态变量，默认为空字符串
    // 【修改】拆分为两个独立的日期状态，初始为 null 表示未选择日期
    const [startTime, setStartTime] = useState<Dayjs | null>(null); // 使用 useState Hook 定义并初始化起始时间状态变量，默认为 null
    const [endTime, setEndTime] = useState<Dayjs | null>(null);     // 使用 useState Hook 定义并初始化截止时间状态变量，默认为 null

    /**
     * 处理搜索按钮点击事件的函数。
     * 收集所有当前表单字段的值，并作为 ChangelogSearchValues 对象传递给父组件的 onSearch 回调。
     */
    const handleSearchClick = (): void => {
        // 收集所有搜索条件并传递给父组件的 onSearch 回调
        onSearch({
            region,       // 地区值
            startTime,    // 起始时间值
            endTime,      // 截止时间值
            serverType,   // 服务器类型值
            updateCategory// 更新类别值
        });
    };

    /**
     * 处理重置按钮点击事件的函数。
     * 将所有表单字段的状态重置为初始值，并调用父组件提供的 onReset 回调（如果存在）。
     */
    const handleResetClick = (): void => {
        // 重置所有表单字段的状态
        setRegion('');       // 将地区状态重置为空字符串
        setServerType('');   // 将服务器类型状态重置为空字符串
        setUpdateCategory(''); // 将更新类别状态重置为空字符串
        setStartTime(null);  // 重置起始时间状态为 null
        setEndTime(null);    // 重置截止时间状态为 null
        if (onReset) {       // 检查父组件是否提供了 onReset 回调函数
            onReset();       // 如果提供了，则调用它
        }
    };

    // 为 TextField 定义统一的样式对象，用于控制聚焦时的轮廓线和标签颜色
    const textFieldSx = {
        // 样式规则：当 TextField 根元素处于聚焦状态时，其内部的 MuiOutlinedInput-notchedOutline 元素（轮廓线）的边框颜色
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#424242', // 设置轮廓颜色为深灰色
        },
        // 样式规则：当 TextField 的标签（MuiInputLabel-root）处于聚焦状态时，其文本颜色
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#424242', // 设置标签颜色为深灰色
        },
    } as const; // 使用 'as const' 断言，确保对象是只读的，提高类型安全性

    return (
        // 使用 Stack 布局组件，它是一个灵活的容器，将表单内容和操作按钮垂直分开，并确保其高度占满父容器
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 表单字段区域，设置 flexGrow: 1 使其占据可用空间，允许垂直滚动，并添加内边距和负外边距以处理滚动条 */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
                <TextField
                    fullWidth // 使文本输入框宽度占满父容器
                    margin="normal" // 应用标准的正常外边距
                    label="地区" // 设置输入框的标签文本
                    variant="outlined" // 使用带有外边框的变体样式
                    value={region} // 绑定地区状态变量作为输入框的值
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegion(e.target.value)} // 监听输入框内容变化事件，更新地区状态
                    sx={textFieldSx} // 应用自定义的聚焦样式
                />
                <TextField
                    fullWidth // 使文本输入框宽度占满父容器
                    margin="normal" // 应用标准的正常外边距
                    label="服务器类型" // 设置输入框的标签文本
                    variant="outlined" // 使用带有外边框的变体样式
                    value={serverType} // 绑定服务器类型状态变量作为输入框的值
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setServerType(e.target.value)} // 监听输入框内容变化事件，更新服务器类型状态
                    sx={textFieldSx} // 应用自定义的聚焦样式
                />
                <TextField
                    fullWidth // 使文本输入框宽度占满父容器
                    margin="normal" // 应用标准的正常外边距
                    label="更新类别" // 设置输入框的标签文本
                    variant="outlined" // 使用带有外边框的变体样式
                    value={updateCategory} // 绑定更新类别状态变量作为输入框的值
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateCategory(e.target.value)} // 监听输入框内容变化事件，更新更新类别状态
                    sx={textFieldSx} // 应用自定义的聚焦样式
                />

                {/* 【修改】起始时间选择器 */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* 使用 LocalizationProvider 包裹 DatePicker，为其提供 Day.js 日期适配器 */}
                    <DatePicker
                        label="起始时间" // 设置日期选择器的标签文本
                        value={startTime} // 绑定起始时间状态变量作为选择器的值
                        // 当起始时间改变时更新状态
                        onChange={(newValue: Dayjs | null) => setStartTime(newValue)} // 监听日期变化事件，更新起始时间状态
                        // 使用 slotProps 属性来自定义 DatePicker 内部渲染的 TextField 组件
                        slotProps={{
                            // 将自定义样式应用到内部的 TextField
                            textField: { fullWidth: true, margin: 'normal', sx: textFieldSx } // 使内部 TextField 宽度占满、应用标准外边距和自定义聚焦样式
                        }}
                    />
                    {/* 【新增】截止时间选择器 */}
                    <DatePicker
                        label="截止时间" // 设置日期选择器的标签文本
                        value={endTime} // 绑定截止时间状态变量作为选择器的值
                        // 当截止时间改变时更新状态
                        onChange={(newValue: Dayjs | null) => setEndTime(newValue)} // 监听日期变化事件，更新截止时间状态
                        // 使用 slotProps 属性来自定义 DatePicker 内部渲染的 TextField 组件
                        slotProps={{
                            // 将自定义样式应用到内部的 TextField
                            textField: { fullWidth: true, margin: 'normal', sx: textFieldSx } // 使内部 TextField 宽度占满、应用标准外边距和自定义聚焦样式
                        }}
                    />
                </LocalizationProvider>
            </Box>
            {/* 操作按钮区域，固定在底部，不随内容滚动。使用 Stack 布局按钮，水平居中对齐，flexShrink: 0 防止被挤压 */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexShrink: 0 }}>
                {onReset && ( // 只有当父组件提供了 onReset prop 时才渲染重置按钮
                    <Button
                        variant="outlined" // 按钮使用带边框的样式
                        onClick={handleResetClick} // 绑定重置按钮的点击事件
                        fullWidth // 使按钮宽度占满父容器
                        sx={{
                            height: 48, // 设置按钮高度
                            borderRadius: 99, // 设置大圆角，使其看起来像药丸形状
                            borderColor: '#424242', // 恢复为深灰色轮廓边框颜色
                            color: '#424242', // 设置文字颜色为深灰色
                            '&:hover': { // 定义悬停时的样式
                                bgcolor: 'rgba(66, 66, 66, 0.04)', // 悬停时的背景色，轻微透明的深灰色
                                borderColor: '#424242', // 悬停时轮廓颜色保持不变
                            }
                        }}
                    >
                        重置
                    </Button>
                )}
                <Button
                    variant="contained" // 按钮使用填充背景的样式
                    onClick={handleSearchClick} // 绑定搜索按钮的点击事件
                    fullWidth // 使按钮宽度占满父容器
                    sx={{
                        height: 48, // 设置按钮高度
                        borderRadius: 99, // 设置大圆角
                        bgcolor: '#424242', // 恢复为深灰色背景颜色
                        color: '#fff', // 设置文字颜色为白色
                        boxShadow: 'none', // 移除按钮阴影
                        '&:hover': { // 定义悬停时的样式
                            bgcolor: '#333333', // 悬停时背景色变为更深的灰色
                            boxShadow: 'none', // 悬停时也无阴影
                        }
                    }}
                >
                    搜索
                </Button>
            </Stack>
        </Stack>
    );
};

export default ChangelogSearchForm; // 导出 ChangelogSearchForm 组件，使其可以在其他文件中导入和使用