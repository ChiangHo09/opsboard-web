/**
 * 文件功能：
 * 此文件定义了更新日志的搜索表单组件（ChangelogSearchForm）。
 * 它包含了针对更新日志的特定搜索字段：地区（省、市、区）、服务器名称和更新时间。
 * 特别地，它集成了 MUI X 的 DatePicker 组件来实现日期选择功能。
 *
 * 本次修改：
 * - 修正了上一版本中引入的所有 TypeScript 类型错误。
 * - 【最终问题修复】移除所有局部焦点样式 `sx`：
 *   为了彻底解决“更新时间文本框获得输入焦点时的颜色不一致”的问题，并将所有焦点样式控制集中到 `theme.ts` 文件，
 *   此文件中的 `commonTextFieldFocusSx` 和 `commonInputLabelFocusSx` 定义及其在所有 `TextField` 和 `DatePicker`
 *   `slotProps` 中的应用已被完全移除。现在所有这些焦点样式将由全局主题来统一管理，使得组件代码更简洁、更可维护。
 * - 修正了 `useState` 的拼写错误，确保 `updateTime` 状态被正确初始化。
 * - 【问题修复】修改日期格式：在 `DatePicker` 组件上添加 `format="YYYY/MM/DD"` 属性，
 *   确保日期在文本框中以“年/月/日”的格式显示。
 */

// 导入 React 核心功能
import { useState, type FC } from 'react'; // 导入 useState Hook 用于管理组件内部状态；导入 FC（FunctionComponent）类型用于函数组件定义。
// 导入 MUI 核心组件
import { Box, TextField, Button, Stack, Typography } from '@mui/material'; // 导入 Box, TextField, Button, Stack, Typography 等 MUI 组件。
// 导入 MUI X 日期选择器相关组件
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // 导入 DatePicker 组件用于日期选择。
// 导入 dayjs 类型，用于状态管理
import type { Dayjs } from 'dayjs'; // 导入 Dayjs 类型，用于 DatePicker 返回值的类型定义。

// 定义此表单将向外提交的数据结构接口
export interface ChangelogSearchValues {
    province: string; // 省份字段的字符串类型。
    city: string;     // 城市字段的字符串类型。
    district: string; // 区域字段的字符串类型。
    server: string;   // 服务器名称字段的字符串类型。
    updateTime: Dayjs | null; // 更新时间字段，可以是 Dayjs 对象或 null。
}

// 定义组件的 Props 接口
interface ChangelogSearchFormProps {
    onSearch: (values: ChangelogSearchValues) => void; // 搜索回调函数，接收 ChangelogSearchValues 类型参数。
    onReset?: () => void; // 重置回调函数，可选。
}

/**
 * ChangelogSearchForm 组件:
 * 渲染一个包含多个输入字段和操作按钮的搜索表单。
 *
 * @param {ChangelogSearchFormProps} props - 组件属性。
 * @returns {JSX.Element} 渲染的搜索表单。
 */
const ChangelogSearchForm: FC<ChangelogSearchFormProps> = ({ onSearch, onReset }) => {
    // 为每个表单字段创建内部状态，并初始化为空字符串或 null。
    const [province, setProvince] = useState('');   // 省份输入框的状态及其更新函数。
    const [city, setCity] = useState('');         // 城市输入框的状态及其更新函数。
    const [district, setDistrict] = useState(''); // 区域输入框的状态及其更新函数。
    const [server, setServer] = useState('');     // 服务器输入框的状态及其更新函数。
    // 修复点：修正了 useState 的语法错误，确保 updateTime 状态被正确初始化为 Dayjs | null 类型。
    const [updateTime, setUpdateTime] = useState<Dayjs | null>(null); // 更新时间选择器的状态及其更新函数。

    /**
     * 处理搜索按钮点击事件。
     * 收集当前所有表单字段的值，并调用传入的 onSearch 回调函数。
     */
    const handleSearchClick = () => {
        onSearch({ province, city, district, server, updateTime }); // 将表单值作为对象传递给 onSearch 回调。
    };

    /**
     * 处理重置按钮点击事件。
     * 将所有表单字段的状态重置回其初始值，并调用传入的 onReset 回调函数（如果存在）。
     */
    const handleResetClick = () => {
        setProvince('');   // 重置省份状态。
        setCity('');         // 重置城市状态。
        setDistrict('');     // 重置区域状态。
        setServer('');       // 重置服务器状态。
        setUpdateTime(null); // 重置更新时间状态为 null。
        if (onReset) {       // 如果 onReset 回调存在。
            onReset();       // 调用 onReset 回调。
        }
    };

    // 【最终问题修复】移除所有局部焦点样式定义和应用。
    // 之前定义的 commonTextFieldFocusSx 和 commonInputLabelFocusSx 已被移除。
    // 现在，所有 TextField 和 DatePicker 的焦点样式将完全由 theme.ts 中的全局 styleOverrides 管理。

    return (
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 表单字段区域: 占据可用空间并允许内容垂直滚动 */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}> {/* flexGrow: 1 使得该区域占据剩余空间；overflowY: 'auto' 允许内容滚动；pr/mr 解决滚动条对内容区域的影响。 */}
                {/* 省份输入框 */}
                <TextField
                    fullWidth // 宽度占满父容器。
                    margin="normal" // 默认的外边距。
                    label="省" // 标签文本。
                    value={province} // 绑定省份状态。
                    onChange={(e) => setProvince(e.target.value)} // 当输入改变时更新省份状态。
                    // 移除了 InputProps.sx 和 InputLabelProps.sx，样式将由 theme.ts 全局控制。
                />
                {/* 城市输入框 */}
                <TextField
                    fullWidth // 宽度占满父容器。
                    margin="normal" // 默认的外边距。
                    label="市" // 标签文本。
                    value={city} // 绑定城市状态。
                    onChange={(e) => setCity(e.target.value)} // 当输入改变时更新城市状态。
                    // 移除了 InputProps.sx 和 InputLabelProps.sx。
                />
                {/* 区输入框 */}
                <TextField
                    fullWidth // 宽度占满父容器。
                    margin="normal" // 默认的外边距。
                    label="区" // 标签文本。
                    value={district} // 绑定区域状态。
                    onChange={(e) => setDistrict(e.target.value)} // 当输入改变时更新区域状态。
                    // 移除了 InputProps.sx 和 InputLabelProps.sx。
                />
                {/* 服务器输入框 */}
                <TextField
                    fullWidth // 宽度占满父容器。
                    margin="normal" // 默认的外边距。
                    label="服务器" // 标签文本。
                    value={server} // 绑定服务器状态。
                    onChange={(e) => setServer(e.target.value)} // 当输入改变时更新服务器状态。
                    // 移除了 InputProps.sx 和 InputLabelProps.sx。
                />
                {/* 更新时间日期选择器 */}
                <DatePicker
                    label="更新时间" // 标签文本。
                    value={updateTime} // 绑定更新时间状态。
                    onChange={(newValue) => setUpdateTime(newValue)} // 当日期改变时更新更新时间状态。
                    format="YYYY/MM/DD" // 【问题修复】设置日期显示格式为年/月/日。
                    slotProps={{ // 用于自定义内部组件的 props。
                        textField: { // 针对 DatePicker 内部的 TextField 组件。
                            fullWidth: true, // 内部 TextField 宽度占满。
                            margin: 'normal', // 内部 TextField 默认外边距。
                            // 移除了 InputProps.sx 和 InputLabelProps.sx，样式将由 theme.ts 全局控制。
                        },
                    }}
                />
            </Box>
            {/* 操作按钮区域: 固定在底部，不随内容滚动 */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexShrink: 0 }}> {/* 水平排列按钮，间距为 2，flexShrink: 0 防止按钮区域收缩。 */}
                {onReset && ( // 如果 onReset 回调存在，则渲染重置按钮。
                    <Button
                        variant="outlined" onClick={handleResetClick} fullWidth // 轮廓按钮，点击调用重置函数，宽度占满。
                        sx={{ // 自定义按钮样式。
                            height: 48, // 固定高度。
                            borderRadius: 99, // 极大的圆角，使按钮呈药丸状。
                            borderColor: '#424242', // 边框颜色。
                            color: '#424242', // 文本颜色。
                            '&:hover': { // 鼠标悬停时的样式。
                                bgcolor: 'rgba(66, 66, 66, 0.04)', // 略微的背景色。
                                borderColor: '#424242' // 保持边框颜色。
                            }
                        }}
                    >
                        <Typography component="span" sx={{ transform: 'translateY(1px)', fontWeight: 500 }}>重置</Typography> {/* 文本内容，略微下移，字体加粗。 */}
                    </Button>
                )}
                <Button
                    variant="contained" onClick={handleSearchClick} fullWidth // 填充按钮，点击调用搜索函数，宽度占满。
                    sx={{ // 自定义按钮样式。
                        height: 48, // 固定高度。
                        borderRadius: 99, // 极大的圆角。
                        bgcolor: '#424242', // 背景颜色。
                        color: '#fff', // 文本颜色。
                        boxShadow: 'none', // 移除阴影。
                        '&:hover': { // 鼠标悬停时的样式。
                            bgcolor: '#333333', // 更深的背景色。
                            boxShadow: 'none' // 保持无阴影。
                        }
                    }}
                >
                    <Typography component="span" sx={{ transform: 'translateY(1px)', fontWeight: 500 }}>搜索</Typography> {/* 文本内容，略微下移，字体加粗。 */}
                </Button>
            </Stack>
        </Stack>
    );
};

export default ChangelogSearchForm; // 导出 ChangelogSearchForm 组件。