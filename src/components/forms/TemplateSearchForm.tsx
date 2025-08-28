/**
 * @file src/components/forms/TemplateSearchForm.tsx
 * @description
 * 此文件定义了一个【模板搜索表单】组件（TemplateSearchForm）。它是一个独立的、
 * 可复用的UI组件，其核心职责包括：
 * - 1. **提供用户输入界面**: 为模板搜索功能提供用户输入界面，包含多个文本输入框和选择框。
 * - 2. **集中式状态管理**: 使用单个 `useState` Hook 管理所有表单字段的内部状态，减少状态更新次数。
 * - 3. **记忆化事件处理器**: 使用 `useCallback` 记忆化 `onChange`、`onSearchClick` 和 `onResetClick` 等事件处理函数，确保函数引用稳定，从而允许子组件（如 Material-UI 的 `TextField` 和 `Select`）进行更有效的渲染优化。
 * - 4. **按需传递数据**: 在用户点击“搜索”按钮时，通过 `onSearch` 回调函数将收集到的表单数据（类型安全）向父组件传递。
 * - 5. **提供重置功能**: 提供一个可选的“重置”功能，通过 `onReset` 回调通知父组件，并清空所有输入字段。
 * - 6. **性能优化**: 通过 `React.memo` 包裹组件，结合记忆化的事件处理器和集中式状态管理，显著减少组件在父组件重新渲染或自身状态更新时的不必要渲染。
 *
 * @modification
 *   - [性能优化]：使用 `React.memo` 包裹 `TemplateSearchForm` 组件，以减少不必要的重新渲染。
 *   - [性能优化]：将所有独立的 `useState` 钩子合并为一个单一的 `useState` 对象，管理所有表单字段值，减少状态更新次数。
 *   - [性能优化]：为每个输入字段的 `onChange` 处理函数创建记忆化的 `useCallback` 钩子，确保函数引用稳定，从而允许子组件进行更有效的渲染优化。
 *   - [Bug修复]：更新 `handleChange` 函数签名，使其兼容 `TextField` 和 `Select` 组件的 `onChange` 事件类型，解决 `TS2322` 错误。
 *   - [Bug修复]：修复 `TS6133: 'child' is declared but its value is never read.` 警告。将 `handleChange` 函数签名中的未使用参数 `child` 更名为 `_child`，以明确表示其为有意未使用的参数。
 *   - [组件写法现代化]：移除了 `React.FC`，采用了现代的函数组件定义方式，并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 *   - [注释完善]：为文件、接口、组件、状态、函数和每一个重要属性添加了极其详尽的注释。
 */

// 从 'react' 库导入核心功能：
// - useState: 用于在组件中管理局部状态（如输入框的值）。
// - JSX: 用于类型注解，明确组件的返回值是 JSX 元素。
// - memo: 用于记忆化组件，避免在 props 不变时重新渲染。
// - useCallback: 用于记忆化回调函数，避免在组件重新渲染时重新创建函数引用。
// - ChangeEvent: 用于类型注解，表示 DOM 元素的 change 事件。
import {useState, type JSX, memo, useCallback, type ChangeEvent} from 'react';

// 从 Material-UI (MUI) 库导入所有需要的UI组件，用于构建表单的视觉结构。
// - Box: 一个通用的 div 包装器，用于布局和样式。
// - TextField: 文本输入框组件。
// - Button: 按钮组件。
// - Stack: 一个一维布局组件，用于控制子元素间距。
// - Typography: 用于显示文本，并应用 Material Design 的排版样式。
// - MenuItem: Select 组件中的选项。
// - SelectChangeEvent: Material-UI Select 组件的 onChange 事件类型。
import {Box, TextField, Button, Stack, Typography, MenuItem, type SelectChangeEvent} from '@mui/material';

/**
 * @interface TemplateSearchValues
 * @description 定义了此搜索表单将通过 `onSearch` 回调传出的数据结构。
 *              这确保了父组件能以类型安全的方式接收表单数据。
 */
export interface TemplateSearchValues {
    /**
     * @property {string} fieldName1 - 第一个搜索字段的当前值。
     */
    fieldName1: string;
    /**
     * @property {string} fieldName2 - 第二个搜索字段的当前值。
     */
    fieldName2: string;
    /**
     * @property {string} status - 状态选择字段的当前值。
     */
    status: string;
    /**
     * @property {string} category - 类别选择字段的当前值。
     */
    category: string;
}

/**
 * @interface TemplateSearchFormProps
 * @description 定义了 TemplateSearchForm 组件所接收的 props 的类型。
 */
interface TemplateSearchFormProps {
    /**
     * @property {(values: TemplateSearchValues) => void} onSearch - 一个必需的回调函数。
     *           当用户点击“搜索”按钮时，此函数将被调用，并传入包含所有表单字段当前值的对象。
     * @param {TemplateSearchValues} values - 包含所有表单字段当前值的对象。
     * @returns {void}
     */
    onSearch: (values: TemplateSearchValues) => void;
    /**
     * @property {() => void} [onReset] - 一个可选的回调函数。
     *           如果提供了此函数，组件将渲染一个“重置”按钮。当用户点击该按钮时，
     *           此函数将被调用，同时表单字段也会被清空。
     * @returns {void}
     */
    onReset?: () => void;
}

// 定义一个联合类型，用于处理 TextField 和 Select 的 onChange 事件。
// 兼容 HTML 输入元素（input, textarea）的 ChangeEvent 和 Material-UI Select 的 ChangeEvent。
type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>;

/**
 * @component TemplateSearchForm
 * @description 一个功能齐全、性能优化的搜索表单组件。
 *              它使用 `React.memo` 进行记忆化，并通过集中式状态管理和记忆化的事件处理器来减少不必要的渲染。
 * @param {TemplateSearchFormProps} props - 组件的 props。
 * @param {function(TemplateSearchValues): void} props.onSearch - 搜索按钮点击时的回调函数。
 * @param {function(): void} [props.onReset] - 重置按钮点击时的可选回调函数。
 * @returns {JSX.Element} - 渲染出的表单组件。
 */
const TemplateSearchForm = memo(({onSearch, onReset}: TemplateSearchFormProps): JSX.Element => {
    // --- 1. STATE MANAGEMENT ---
    // useState Hook: 用于管理表单的整体状态。
    // 将所有表单字段的状态合并到一个对象中，减少状态更新的次数。
    /**
     * @state {TemplateSearchValues} formValues - 用于存储所有表单字段的当前值。
     * @setter setFormValues - 用于更新 `formValues` 状态的函数。
     */
    const [formValues, setFormValues] = useState<TemplateSearchValues>({
        fieldName1: '', // 初始值为空字符串。
        fieldName2: '', // 初始值为空字符串。
        status: '',     // 初始值为空字符串。
        category: ''    // 初始值为空字符串。
    });


    // --- 2. EVENT HANDLERS ---
    // useCallback Hook: 用于记忆化事件处理函数，确保在组件重新渲染时，这些函数的引用保持稳定。
    // 这对于配合 `React.memo` 优化子组件的渲染至关重要。

    /**
     * @function handleChange
     * @description 通用的输入字段 `onChange` 事件处理器。
     *              它根据输入元素的 `name` 属性更新 `formValues` 状态中对应的字段。
     * @param {FormChangeEvent} e - 触发事件的 ChangeEvent 对象。
     * @param {React.ReactNode} [_child] - Material-UI Select 组件 `onChange` 事件的第二个参数，此处未使用，故用 `_` 规避警告。
     * @returns {void}
     */
    const handleChange = useCallback((e: FormChangeEvent, _child?: React.ReactNode): void => {
        // 安全地获取 `e.target.name` 和 `e.target.value`。
        // `SelectChangeEvent` 的 `target.name` 可能是可选的，因此使用 `|| ''` 提供默认值。
        const name: string = (e.target as { name?: string }).name || '';
        const value: string | number | boolean = e.target.value; // `e.target.value` 的类型是 `string | number | boolean`

        // 只有当 `name` 存在时才更新状态，避免不必要的错误。
        if (name) {
            // 使用函数式更新 `setFormValues`，确保基于最新的状态进行更新。
            setFormValues((prev: TemplateSearchValues) => ({
                ...prev, // 展开之前的状态，保留未改变的字段。
                [name]: value // 更新对应 `name` 的字段为新值。
            }));
        }
    }, []); // 依赖项为空数组，表示此函数在组件的整个生命周期中只创建一次。

    /**
     * @function handleSearchClick
     * @description 处理“搜索”按钮的点击事件。
     *              它会收集所有当前 `formValues`，并调用 `onSearch` prop 将它们传递出去。
     * @returns {void}
     */
    const handleSearchClick = useCallback((): void => {
        // 调用从 props 传入的 `onSearch` 函数，并传递当前 `formValues` 的副本。
        onSearch(formValues);
    }, [onSearch, formValues]); // 依赖项：`onSearch` 和 `formValues`。当这些依赖变化时，函数才会重新创建。

    /**
     * @function handleResetClick
     * @description 处理“重置”按钮的点击事件。
     *              它会清空所有输入字段的状态，并调用可选的 `onReset` prop。
     * @returns {void}
     */
    const handleResetClick = useCallback((): void => {
        // 将所有 `formValues` 重置为初始的空值，清空输入框。
        setFormValues({
            fieldName1: '',
            fieldName2: '',
            status: '',
            category: ''
        });
        // 检查 `onReset` prop 是否存在，如果存在，则调用它。
        if (onReset) {
            onReset();
        }
    }, [onReset]); // 依赖项：`onReset`。

    // --- 3. JSX RENDER ---
    return (
        // Stack 组件: 作为表单的根容器，提供垂直方向的布局和子元素间距。
        // @prop {number} spacing - 子元素之间的间距，单位为主题的 `spacing` 单位。
        // @prop {object} sx - Material-UI 的样式 prop，用于自定义样式。
        <Stack spacing={2} sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            {/* Box 组件: 可滚动的内容区域，flexGrow: 1 确保它会占据所有可用垂直空间。 */}
            <Box sx={{flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1}}>
                {/* “示例字段 1”的文本输入框 */}
                <TextField
                    fullWidth         // prop: 使输入框占据父容器的全部宽度。
                    margin="normal"   // prop: 添加标准的垂直外边距，以与其他字段分隔。
                    label="示例字段 1" // prop: 输入框的标签，对用户可见。
                    variant="outlined"// prop: 使用 Material-UI 的轮廓样式。
                    name="fieldName1" // prop: 关键！用于 `handleChange` 函数识别是哪个字段。
                    value={formValues.fieldName1} // prop: 将输入框的值与 `formValues.fieldName1` state 绑定，实现受控组件。
                    onChange={handleChange} // prop: 当用户输入时，调用记忆化的 `handleChange` 函数。
                />

                {/* “示例字段 2”的文本输入框 */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="示例字段 2"
                    variant="outlined"
                    name="fieldName2" // prop: 关键！用于 `handleChange` 函数识别是哪个字段。
                    value={formValues.fieldName2}
                    onChange={handleChange}
                />

                {/* “状态”选择框 (Select) */}
                <TextField
                    fullWidth
                    select // prop: 将 TextField 渲染为 Select 组件。
                    margin="normal"
                    label="状态"
                    name="status" // prop: 关键！用于 `handleChange` 函数识别是哪个字段。
                    value={formValues.status}
                    onChange={handleChange} // prop: 调用记忆化的 `handleChange` 函数。
                >
                    {/* MenuItem: Select 组件的选项。 */}
                    <MenuItem value="挂起">挂起</MenuItem>
                    <MenuItem value="就绪">就绪</MenuItem>
                </TextField>

                {/* “类别”选择框 (Select) */}
                <TextField
                    fullWidth
                    select // prop: 将 TextField 渲染为 Select 组件。
                    margin="normal"
                    label="类别"
                    name="category" // prop: 关键！用于 `handleChange` 函数识别是哪个字段。
                    value={formValues.category}
                    onChange={handleChange} // prop: 调用记忆化的 `handleChange` 函数。
                >
                    <MenuItem value="更新">更新</MenuItem>
                    <MenuItem value="备份">备份</MenuItem>
                    <MenuItem value="巡检">巡检</MenuItem>
                </TextField>
            </Box>

            {/* 底部操作按钮区域，flexShrink: 0 防止此区域在空间不足时被压缩。 */}
            <Stack direction="row" spacing={2} sx={{justifyContent: 'center', flexShrink: 0}}>
                {/* 条件渲染：仅当 `onReset` prop 存在时才渲染“重置”按钮。 */}
                {onReset && (
                    <Button
                        variant="outlined" // prop: 使用轮廓样式的按钮。
                        onClick={handleResetClick} // prop: 绑定记忆化的重置事件处理器。
                        fullWidth // prop: 使按钮占据其容器的全部可用宽度。
                        sx={{
                            height: 48, // 高度。
                            borderRadius: 99, // 使用一个很大的值来创建胶囊形状。
                            borderColor: 'neutral.main', // 边框颜色引用自主题，确保一致性。
                            color: 'neutral.main',       // 文本颜色引用自主题。
                            '&:hover': {
                                bgcolor: 'custom.hoverOpacity', // 悬停背景色引用自主题。
                                borderColor: 'neutral.main',    // 悬停时保持边框颜色不变。
                            }
                        }}
                    >
                        {/* Typography: 用于显示按钮文本，并应用样式。 */}
                        <Typography component="span" sx={{transform: 'translateY(1px)', fontWeight: 500}}>
                            重置
                        </Typography>
                    </Button>
                )}
                {/* “搜索”按钮 */}
                <Button
                    variant="contained" // prop: 使用实心样式的按钮，表示主操作。
                    onClick={handleSearchClick} // prop: 绑定记忆化的搜索事件处理器。
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
                    {/* Typography: 用于显示按钮文本，并应用样式。 */}
                    <Typography component="span" sx={{transform: 'translateY(1px)', fontWeight: 500}}>
                        搜索
                    </Typography>
                </Button>
            </Stack>
        </Stack>
    );
});

// 默认导出该组件，以便在其他文件中导入和使用。
export default TemplateSearchForm;