/**
 * ================================================================================
 * 文件名称: InspectionBackupSearchForm.tsx
 * 文件说明:
 *     此文件定义了“巡检备份”功能的搜索表单组件。
 *     它是一个独立的、可复用的组件，封装了巡检备份记录搜索所需的所有UI输入字段、
 *     内部状态管理以及操作按钮（重置/搜索）。
 *     它通过 onSearch prop 将最终的搜索条件对象向上提交给使用它的父页面组件。
 *
 * 本次修改内容:
 * - 新建此文件，作为“巡检备份”页面的专用搜索表单。
 * - 定义了新的搜索项：地区 (region)、起始时间 (startTime)、截止时间 (endTime)、
 *   服务器类型 (serverType)、操作类型 (operationType)。
 * - 【时间选择器】使用了两个独立的 DatePicker 组件来分别选择起始时间和截止时间。
 * - 【操作类型】使用了 Material-UI 的 Select 组件作为下拉菜单，包含“巡检”和“备份”两个固定选项。
 *   - 注意：下拉菜单选项目前是硬编码的占位符，未来可根据后端数据进行动态填充。
 * - 保持了统一的 TextField 聚焦样式和按钮样式。
 * - 所有的 TypeScript 兼容性修复和 ESLint 忽略注释均已保留并适配新的结构。
 * - 【修复】解决了 `updateCategory` 和 `setUpdateCategory` 未声明的 `TS2304` 错误，
 *   通过在组件内部添加其 `useState` 声明来解决。
 * ================================================================================
 */
import React, { useState, type FC } from 'react'; // 导入 React 库，useState Hook 用于组件状态管理，FC 用于组件类型定义
import {
    Box,        // 灵活的布局容器
    TextField,  // 文本输入框
    Button,     // 按钮
    Stack,      // 灵活布局（水平或垂直）
    InputLabel, // 表单输入标签
    MenuItem,   // Select 下拉菜单项
    FormControl, // 表单控制组件，用于组织 Select 和 InputLabel
    Select,     // 下拉选择器
    Typography  // 文本排版组件
} from '@mui/material'; // 从 Material-UI 导入核心组件

// 确保所有日期选择器相关的导入都来自 @mui/x-date-pickers (免费版)
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // 用于为日期选择器提供本地化支持和日期适配器
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // 将 Day.js 作为日期处理库集成到 MUI 日期选择器中
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // 单个日期选择器组件

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Dayjs } from 'dayjs'; // 导入 Day.js 库及其 Dayjs 类型。dayjs 实例可能不直接使用，但其类型和 AdapterDayjs 依赖它，因此需导入并使用 ESLint 忽略注释避免警告


// --- 1. 定义数据结构接口 ---
// 定义此表单组件在“搜索”时，将要传递给父组件的数据对象的结构。
export interface InspectionBackupSearchValues {
    region: string;         // 地区字段，类型为字符串
    startTime: Dayjs | null; // 起始时间字段，使用 Dayjs 类型，可为 null
    endTime: Dayjs | null;   // 截止时间字段，使用 Dayjs 类型，可为 null
    serverType: string;     // 服务器类型字段，类型为字符串
    operationType: string;  // 操作类型字段，类型为字符串（例如："inspection", "backup"）
    updateCategory: string; // 更新类别字段，类型为字符串 (根据报错，这里依然需要这个字段)
}

// --- 2. 定义组件的 Props 接口 ---
// 定义这个组件接收哪些 props（属性），以及这些 props 的类型。
interface InspectionBackupSearchFormProps {
    /**
     * onSearch 是一个回调函数，当用户点击“搜索”按钮时会被调用。
     * - @param {InspectionBackupSearchValues} values - 包含了所有表单字段当前值的对象。
     */
    onSearch: (values: InspectionBackupSearchValues) => void;

    /**
     * onReset 是一个可选的回调函数。当用户点击“重置”按钮时会被调用。
     * 如果父组件没有提供这个 prop，那么“重置”按钮将不会被渲染。
     */
    onReset?: () => void;
}

// --- 3. 定义组件本身 ---
const InspectionBackupSearchForm: FC<InspectionBackupSearchFormProps> = ({ onSearch, onReset }) => {

    // --- 4. 内部状态管理 ---
    const [region, setRegion] = useState<string>('');             // 地区状态
    const [startTime, setStartTime] = useState<Dayjs | null>(null); // 起始时间状态，初始为 null
    const [endTime, setEndTime] = useState<Dayjs | null>(null);     // 截止时间状态，初始为 null
    const [serverType, setServerType] = useState<string>('');     // 服务器类型状态
    const [operationType, setOperationType] = useState<string>(''); // 操作类型状态，初始为空字符串
    const [updateCategory, setUpdateCategory] = useState<string>(''); // 【修复】更新类别状态，解决 TS2304 错误

    // --- 5. 事件处理函数 ---

    /**
     * 当用户点击“搜索”按钮时，此函数会被触发。
     * 收集所有当前表单字段的值，并作为 `InspectionBackupSearchValues` 对象传递给父组件的 `onSearch` 回调。
     */
    const handleSearchClick = (): void => {
        onSearch({
            region,
            startTime,
            endTime,
            serverType,
            operationType,
            updateCategory // 包含更新类别
        });
    };

    /**
     * 当用户点击“重置”按钮时，此函数会被触发。
     * 将所有表单字段的状态重置为初始值，并调用父组件提供的 `onReset` 回调（如果存在）。
     */
    const handleResetClick = (): void => {
        setRegion('');          // 重置地区
        setStartTime(null);     // 重置起始时间
        setEndTime(null);       // 重置截止时间
        setServerType('');      // 重置服务器类型
        setOperationType('');   // 重置操作类型
        setUpdateCategory('');  // 【修复】重置更新类别
        if (onReset) {          // 如果提供了 onReset 回调
            onReset();          // 则调用它
        }
    };

    // --- 6. JSX 渲染逻辑辅助样式 ---
    // 为 TextField 和 DatePicker 内部的 TextField 定义统一的样式对象，用于控制聚焦时的轮廓线和标签颜色
    const textFieldSx = {
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#424242', // 聚焦时轮廓颜色为深灰色
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#424242', // 聚焦时标签颜色为深灰色
        },
    } as const; // 使用 'as const' 断言，确保对象是只读的，提高类型安全性

    // `return` 语句中定义了组件最终渲染到屏幕上的 HTML 结构。
    return (
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 表单输入字段区域 */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
                {/* 地区输入框 */}
                <TextField
                    fullWidth           // 宽度占满父容器
                    margin="normal"     // 标准垂直外边距
                    label="地区"        // 标签文本
                    variant="outlined"  // 外边框样式
                    value={region}      // 绑定地区状态
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRegion(e.target.value)} // 更新地区状态
                    sx={textFieldSx}    // 应用自定义样式
                />

                {/* 服务器类型输入框 */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="服务器类型"
                    variant="outlined"
                    value={serverType}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setServerType(e.target.value)}
                    sx={textFieldSx}
                />

                {/* 更新类别输入框 */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="更新类别"
                    variant="outlined"
                    value={updateCategory} // 绑定更新类别状态
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUpdateCategory(e.target.value)} // 更新更新类别状态
                    sx={textFieldSx}
                />

                {/* 操作类型下拉菜单 */}
                <FormControl fullWidth margin="normal" variant="outlined" sx={textFieldSx}>
                    <InputLabel id="operation-type-label">操作类型</InputLabel> {/* 下拉菜单的标签 */}
                    <Select
                        labelId="operation-type-label" // 绑定标签的 ID
                        id="operation-type-select"     // Select 组件的 ID
                        value={operationType}          // 绑定操作类型状态
                        label="操作类型"               // 用于显示在选择器中的标签（与 InputLabel 配合使用）
                        onChange={(e) => setOperationType(e.target.value as string)} // 更新操作类型状态
                    >
                        <MenuItem value=""><em>选择操作类型</em></MenuItem> {/* 默认的空选项 */}
                        <MenuItem value="inspection">
                            <Typography component="span" sx={{ transform: 'translateY(1px)' }}>巡检</Typography> {/* 巡检选项 */}
                        </MenuItem>
                        <MenuItem value="backup">
                            <Typography component="span" sx={{ transform: 'translateY(1px)' }}>备份</Typography> {/* 备份选项 */}
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* 日期选择器区域 */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* 起始时间选择器 */}
                    <DatePicker
                        label="起始时间" // 日期选择器的标签
                        value={startTime} // 绑定起始时间状态
                        onChange={(newValue: Dayjs | null) => setStartTime(newValue)} // 更新起始时间状态
                        slotProps={{
                            // 将自定义样式应用到内部的 TextField
                            textField: { fullWidth: true, margin: 'normal', sx: textFieldSx } // 使内部 TextField 宽度占满、应用标准外边距和自定义聚焦样式
                        }}
                    />
                    {/* 截止时间选择器 */}
                    <DatePicker
                        label="截止时间" // 日期选择器的标签
                        value={endTime} // 绑定截止时间状态
                        onChange={(newValue: Dayjs | null) => setEndTime(newValue)} // 更新截止时间状态
                        slotProps={{
                            // 将自定义样式应用到内部的 TextField
                            textField: { fullWidth: true, margin: 'normal', sx: textFieldSx } // 使内部 TextField 宽度占满、应用标准外边距和自定义聚焦样式
                        }}
                    />
                </LocalizationProvider>
            </Box>

            {/* 操作按钮区域 */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexShrink: 0 }}>
                {onReset && ( // 条件渲染：如果提供了 onReset prop，则显示重置按钮
                    <Button
                        variant="outlined"  // 按钮样式
                        onClick={handleResetClick} // 点击事件
                        fullWidth           // 宽度占满
                        sx={{
                            height: 48,
                            borderRadius: 99,
                            borderColor: '#424242',
                            color: '#424242',
                            '&:hover': {
                                bgcolor: 'rgba(66, 66, 66, 0.04)',
                                borderColor: '#424242',
                            }
                        }}
                    >
                        <Typography component="span" sx={{ transform: 'translateY(1px)', fontWeight: 500 }}>
                            重置
                        </Typography>
                    </Button>
                )}
                <Button
                    variant="contained" // 按钮样式
                    onClick={handleSearchClick} // 点击事件
                    fullWidth           // 宽度占满
                    sx={{
                        height: 48,
                        borderRadius: 99,
                        bgcolor: '#424242',
                        color: '#fff',
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: '#333333',
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

// --- 7. 导出组件 ---
export default InspectionBackupSearchForm;