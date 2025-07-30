/**
 * 文件名: src/components/forms/TemplateSearchForm.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个【模板搜索表单】组件（TemplateSearchForm）。它是一个独立的、
 * 可复用的UI组件，其核心职责包括：
 * - 1. 为模板搜索功能提供用户输入界面（示例字段1，示例字段2）。
 * - 2. 使用 React state 独立管理表单内部的输入值。
 * - 3. 在用户点击“搜索”按钮时，通过 `onSearch` 回调函数将收集到的表单数据向父组件传递。
 * - 4. 提供一个可选的“重置”功能，通过 `onReset` 回调通知父组件，并清空所有输入字段。
 *
 * 本次修改内容:
 * - 【注释完善】为文件、接口、组件、状态、函数和每一个重要属性添加了极其详尽的注释，
 *   以达到模板代码的教学和参考标准。
 */

// 从 'react' 库导入核心功能：
// - useState: 用于在组件中管理局部状态（如输入框的值）。
// - FC (FunctionComponent): 用于为函数式组件提供 TypeScript 类型定义，确保 props 的类型安全。
import {useState, type FC} from 'react';

// 从 Material-UI (MUI) 库导入所有需要的UI组件，用于构建表单的视觉结构。
import {Box, TextField, Button, Stack, Typography} from '@mui/material';

/**
 * @interface TemplateSearchValues
 * @description 定义了此搜索表单将通过 onSearch 回调传出的数据结构。
 *              这确保了父组件能以类型安全的方式接收表单数据。
 */
export interface TemplateSearchValues {
    /**
     * @property {string} fieldName1 - 第一个搜索字段的值。
     */
    fieldName1: string;
    /**
     * @property {string} fieldName2 - 第二个搜索字段的值。
     */
    fieldName2: string;
}

/**
 * @interface TemplateSearchFormProps
 * @description 定义了 TemplateSearchForm 组件所接收的 props 的类型。
 */
interface TemplateSearchFormProps {
    /**
     * @property {(values: TemplateSearchValues) => void} onSearch - 一个必需的回调函数。
     *           当用户点击“搜索”按钮时，此函数将被调用，并传入包含所有表单字段当前值的对象。
     */
    onSearch: (values: TemplateSearchValues) => void;
    /**
     * @property {() => void} [onReset] - 一个可选的回调函数。
     *         如果提供了此函数，组件将渲染一个“重置”按钮。当用户点击该按钮时，
     *         此函数将被调用，同时表单字段也会被清空。
     */
    onReset?: () => void;
}

// 定义 TemplateSearchForm 组件。
const TemplateSearchForm: FC<TemplateSearchFormProps> = ({onSearch, onReset}) => {
    // --- 1. STATE MANAGEMENT ---
    // 使用 useState Hook 为表单的每个输入字段创建和管理其局部状态。

    /**
     * @state {string} fieldName1 - 用于存储“示例字段 1”输入框的当前值。
     * @setter setFieldName1 - 用于更新 fieldName1 状态的函数。
     */
    const [fieldName1, setFieldName1] = useState('');

    /**
     * @state {string} fieldName2 - 用于存储“示例字段 2”输入框的当前值。
     * @setter setFieldName2 - 用于更新 fieldName2 状态的函数。
     */
    const [fieldName2, setFieldName2] = useState('');


    // --- 2. EVENT HANDLERS ---

    /**
     * @function handleSearchClick
     * @description 处理“搜索”按钮的点击事件。
     *              它会收集所有当前的状态值，并调用 onSearch prop 将它们传递出去。
     */
    const handleSearchClick = () => {
        // 调用从 props 传入的 onSearch 函数，并传递一个包含所有字段当前值的对象。
        onSearch({
            fieldName1: fieldName1,
            fieldName2: fieldName2
        });
    };

    /**
     * @function handleResetClick
     * @description 处理“重置”按钮的点击事件。
     *              它会清空所有输入字段的状态，并调用可选的 onReset prop。
     */
    const handleResetClick = () => {
        // 将所有 state 重置为空字符串，清空输入框。
        setFieldName1('');
        setFieldName2('');
        // 检查 onReset prop 是否存在，如果存在，则调用它。
        if (onReset) {
            onReset();
        }
    };

    // --- 3. JSX RENDER ---
    return (
        // 使用 Stack 组件作为表单的根容器，它是一个一维布局组件，可以方便地控制子元素间距。
        <Stack spacing={2} sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            {/* 这个 Box 是可滚动的内容区域，flexGrow: 1 确保它会占据所有可用垂直空间。 */}
            <Box sx={{flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1}}>
                {/* “示例字段 1”的输入框 */}
                <TextField
                    fullWidth         // fullWidth: 使输入框占据父容器的全部宽度。
                    margin="normal"   // margin="normal": 添加标准的垂直外边距，以与其他字段分隔。
                    label="示例字段 1" // label: 输入框的标签，对用户可见。
                    variant="outlined"// variant="outlined": 使用MUI的轮廓样式。
                    value={fieldName1}// value: 将输入框的值与 `fieldName1` state 绑定，实现受控组件。
                    onChange={(e) => setFieldName1(e.target.value)} // onChange: 当用户输入时，更新 `fieldName1` state。
                />

                {/* “示例字段 2”的输入框 */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="示例字段 2"
                    variant="outlined"
                    value={fieldName2}
                    onChange={(e) => setFieldName2(e.target.value)}
                />
            </Box>

            {/* 底部操作按钮区域，flexShrink: 0 防止此区域在空间不足时被压缩。 */}
            <Stack direction="row" spacing={2} sx={{justifyContent: 'center', flexShrink: 0}}>
                {/* 条件渲染：仅当 onReset prop 存在时才渲染“重置”按钮。 */}
                {onReset && (
                    <Button
                        variant="outlined" // variant="outlined": 使用轮廓样式的按钮。
                        onClick={handleResetClick} // onClick: 绑定重置事件处理器。
                        fullWidth // fullWidth: 使按钮占据其容器的全部可用宽度。
                        sx={{
                            height: 48,
                            borderRadius: 99, // 使用一个很大的值来创建胶囊形状。
                            borderColor: 'neutral.main', // 边框颜色引用自主题，确保一致性。
                            color: 'neutral.main',       // 文本颜色引用自主题。
                            '&:hover': {
                                bgcolor: 'custom.hoverOpacity', // 悬停背景色引用自主题。
                                borderColor: 'neutral.main',    // 悬停时保持边框颜色不变。
                            }
                        }}
                    >
                        <Typography component="span" sx={{transform: 'translateY(1px)', fontWeight: 500}}>
                            重置
                        </Typography>
                    </Button>
                )}
                {/* “搜索”按钮 */}
                <Button
                    variant="contained" // variant="contained": 使用实心样式的按钮，表示主操作。
                    onClick={handleSearchClick} // onClick: 绑定搜索事件处理器。
                    fullWidth
                    sx={{
                        height: 48,
                        borderRadius: 99,
                        bgcolor: 'neutral.main',        // 背景色引用自主题。
                        color: 'neutral.contrastText',  // 文本颜色使用对比色，确保可读性。
                        boxShadow: 'none',              // 移除默认阴影。
                        '&:hover': {
                            bgcolor: 'neutral.dark',    // 悬停时使用更深的颜色。
                            boxShadow: 'none',
                        }
                    }}
                >
                    <Typography component="span" sx={{transform: 'translateY(1px)', fontWeight: 500}}>
                        搜索
                    </Typography>
                </Button>
            </Stack>
        </Stack>
    );
};

// 默认导出该组件，以便在其他文件中导入和使用。
export default TemplateSearchForm;