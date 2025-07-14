/**
 * 文件功能：
 * 此文件定义了一个【模板搜索表单】组件（TemplateSearchForm）。
 * 它的核心目的是作为一个高度注释、可复制的起点，用于快速创建项目内所有新的右侧栏搜索面板。
 * 它展示了构建一个独立、可复用的表单组件的最佳实践，包括：
 *   1. 独立的内部状态管理。
 *   2. 通过 props 与父组件进行清晰的、类型安全的数据通信。
 *   3. 响应式的、固定的底部操作按钮布局。
 *   4. 对每一个功能、prop 和语句都提供了极其详尽的注释，方便开发者理解和修改。
 *
 * 本次修改：
 * - 新建此模板文件。
 */

// 从 'react' 库中导入核心功能。
// - React: 这是使用 JSX 语法所必需的。
// - useState: 这是一个 React Hook，用于在函数组件中添加和管理内部状态。
// - FC (FunctionComponent): 这是一个类型，用于定义一个函数组件的类型，可以帮助我们更好地进行类型检查。
import { useState, type FC } from 'react';

// 从 '@mui/material' 库中导入所有需要用到的 UI 组件。
// - Box: 一个通用的容器组件，可以渲染为任何 HTML 元素，非常适合用于布局。
// - TextField: 标准的文本输入框组件。
// - Button: 标准的按钮组件。
// - Stack: 一个强大的布局组件，用于按垂直或水平方向排列子元素，并自动处理它们之间的间距。
// - Typography: 用于渲染文本，可以方便地应用预设的排版样式（如 h1, body1 等）。
import { Box, TextField, Button, Stack, Typography } from '@mui/material';

// --- 1. 定义数据结构接口 ---
// 定义此表单组件在“搜索”时，将要传递给父组件的数据对象的结构。
// 这是一种非常好的实践，它创建了一个明确的“契约”，确保了父子组件之间数据交换的类型安全。
// 当您复制此模板时，请将这里的字段修改为您新表单所需的实际字段。
export interface TemplateSearchValues {
    // 示例字段1：一个字符串类型的字段。
    fieldName1: string;
    // 示例字段2：另一个字符串类型的字段。
    fieldName2: string;
}

// --- 2. 定义组件的 Props 接口 ---
// 定义这个组件接收哪些 props（属性），以及这些 props 的类型。
// 这同样是与父组件之间的“契约”，明确了父组件必须（或可以选择）提供哪些数据或函数。
interface TemplateSearchFormProps {
    /**
     * onSearch 是一个回调函数，当用户点击“搜索”按钮时会被调用。
     * - @param {TemplateSearchValues} values - 这是函数接收的唯一参数，它是一个包含了所有表单字段当前值的对象，其结构由上面定义的 `TemplateSearchValues` 接口保证。
     * - @returns {void} - 这个函数不应该有任何返回值。
     */
    onSearch: (values: TemplateSearchValues) => void;

    /**
     * onReset 是一个可选的回调函数（由 `?` 标记）。当用户点击“重置”按钮时会被调用。
     * 如果父组件没有提供这个 prop，那么“重置”按钮将不会被渲染。
     * - @returns {void} - 这个函数同样不应该有任何返回值。
     */
    onReset?: () => void;
}

// --- 3. 定义组件本身 ---
// 使用 `React.FC<TemplateSearchFormProps>` 来定义组件。
// - FC 是 FunctionComponent 的缩写，它为我们的组件提供了类型检查，比如确保我们正确地使用了 props。
// - `{ onSearch, onReset }` 是通过“解构赋值”从 props 对象中直接提取出我们需要的函数，这是一种简洁的写法。
const TemplateSearchForm: FC<TemplateSearchFormProps> = ({ onSearch, onReset }) => {

    // --- 4. 内部状态管理 ---
    // 使用 `useState` Hook 来为每一个表单输入框创建和管理其内部状态。
    // `useState` 返回一个包含两个元素的数组：
    //   - 第一个元素是当前的状态值（例如 `fieldName1`）。
    //   - 第二个元素是一个函数，用于更新这个状态值（例如 `setFieldName1`）。
    // `useState('')` 中的 `''` 是这个状态的初始值（一个空字符串）。

    // 为“示例字段1”创建状态。
    const [fieldName1, setFieldName1] = useState('');
    // 为“示例字段2”创建状态。
    const [fieldName2, setFieldName2] = useState('');

    // --- 5. 事件处理函数 ---

    /**
     * 当用户点击“搜索”按钮时，此函数会被触发。
     */
    const handleSearchClick = () => {
        // 调用从父组件通过 prop 传入的 `onSearch` 函数。
        // 我们将当前所有的内部状态值组合成一个对象，这个对象的结构必须与 `TemplateSearchValues` 接口匹配。
        // 这就是将表单内部的状态“提交”给外部世界的方式。
        onSearch({
            fieldName1: fieldName1,
            fieldName2: fieldName2
        });
    };

    /**
     * 当用户点击“重置”按钮时，此函数会被触发。
     */
    const handleResetClick = () => {
        // 首先，调用各个状态的更新函数，将它们的值重置为空字符串，以清空输入框的内容。
        setFieldName1('');
        setFieldName2('');

        // 检查父组件是否传入了 `onReset` 函数。
        // 这是一个很好的防御性编程习惯，因为 `onReset` 是可选的。
        if (onReset) {
            // 如果传入了，就调用它。这允许父组件在表单重置时执行一些额外的逻辑。
            onReset();
        }
    };

    // --- 6. JSX 渲染逻辑 ---
    // 定义一个常量对象，用于存储所有文本输入框（TextField）共有的样式。
    // 这样做可以避免在每个组件上重复写相同的 sx prop，使代码更整洁、更易于维护。
    const textFieldSx = {
        // `&` 符号在 MUI 的 sx prop 中代表当前组件自身。
        // 这个选择器表示：当根元素（MuiOutlinedInput-root）被聚焦（Mui-focused）时，它内部的 notchedOutline 元素的样式。
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#424242', // 将聚焦时的轮廓颜色从默认的蓝色改为深灰色。
        },
        // 这个选择器表示：当输入框的标签（MuiInputLabel-root）被聚焦时，它的样式。
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#424242', // 将聚焦时的标签颜色从默认的蓝色改为深灰色。
        },
    } as const; // `as const` 告诉 TypeScript，这个对象是只读的，有助于类型推断。

    // `return` 语句中定义了组件最终渲染到屏幕上的 HTML 结构。
    return (
        // 使用 `<Stack>` 作为根容器，用于垂直布局表单内容和按钮。
        // - `spacing={2}`: 在其直接子元素之间添加 2 个主题单位（默认 16px）的垂直间距。
        // - `sx` prop 用于定义自定义样式。
        <Stack spacing={2} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

            {/* 这个 `<Box>` 是表单输入字段的容器。 */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1 }}>
                {/*
                  - `flexGrow: 1`: 让这个容器占据所有可用的垂直空间。
                  - `overflowY: 'auto'`: 当内容超出容器高度时，自动显示垂直滚动条。
                  - `pr: 1, mr: -1`: 一个小技巧，用于在滚动条出现时，为其留出空间，防止内容被遮挡，保持视觉上的对齐。
                */}

                {/* 示例输入框 1 */}
                <TextField
                    fullWidth // `fullWidth={true}` 的简写，让输入框占据其容器的全部宽度。
                    margin="normal" // 添加标准的垂直外边距。
                    label="示例字段 1" // 显示在输入框上方的提示文字。
                    variant="outlined" // 使用带有轮廓线的外观样式。
                    value={fieldName1} // 将输入框的值与我们上面定义的 `fieldName1` 状态“绑定”。这是受控组件的核心。
                    onChange={(e) => setFieldName1(e.target.value)} // 当用户输入时，此函数被触发。
                    //   - `e` 是事件对象。
                    //   - `e.target` 是触发事件的 DOM 元素（即 `<input>`）。
                    //   - `e.target.value` 是输入框中最新的文本内容。
                    //   - `setFieldName1(...)` 会更新状态，从而导致组件重新渲染，输入框显示新值。
                    sx={textFieldSx} // 应用我们上面定义的通用样式。
                />

                {/* 示例输入框 2 */}
                <TextField
                    fullWidth
                    margin="normal"
                    label="示例字段 2"
                    variant="outlined"
                    value={fieldName2}
                    onChange={(e) => setFieldName2(e.target.value)}
                    sx={textFieldSx}
                />
            </Box>

            {/* 这个 `<Stack>` 是底部操作按钮的容器。 */}
            <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', flexShrink: 0 }}>
                {/*
                  - `direction="row"`: 使其子元素水平排列。
                  - `spacing={2}`: 在按钮之间添加 2 个单位的水平间距。
                  - `justifyContent: 'center'`: 使按钮组水平居中。
                  - `flexShrink: 0`: 防止这个容器在空间不足时被压缩，确保按钮始终可见。
                */}

                {/* “重置”按钮。 */}
                {/* `onReset && (...)` 是一种条件渲染的简写。如果 `onReset` prop 不存在（即为 undefined），则 `&&` 右侧的所有内容都不会被渲染。 */}
                {onReset && (
                    <Button
                        variant="outlined" // “轮廓”样式，只有边框，没有背景填充。
                        onClick={handleResetClick} // 将点击事件绑定到我们的处理函数。
                        fullWidth // 让这个按钮和“搜索”按钮平分容器宽度。
                        sx={{
                            height: 48, // 自定义高度。
                            borderRadius: 99, // 一个足够大的值，使其呈现为“胶囊”形状。
                            borderColor: '#424242', // 设置边框颜色为深灰色。
                            color: '#424242', // 设置文字颜色为深灰色。
                            '&:hover': { // 定义鼠标悬停时的样式。
                                bgcolor: 'rgba(66, 66, 66, 0.04)', // 添加一个非常淡的灰色背景作为反馈。
                                borderColor: '#424242', // 保持边框颜色不变。
                            }
                        }}
                    >
                        <Typography component="span" sx={{ transform: 'translateY(1px)', fontWeight: 500 }}>
                            {/* 将文字包裹在 `Typography` 中，并应用微小的向下位移，以实现完美的视觉垂直居中。 */}
                            重置
                        </Typography>
                    </Button>
                )}

                {/* “搜索”按钮。 */}
                <Button
                    variant="contained" // “填充”样式，有背景色。
                    onClick={handleSearchClick}
                    fullWidth
                    sx={{
                        height: 48,
                        borderRadius: 99,
                        bgcolor: '#424242', // 设置背景颜色为深灰色。
                        color: '#fff', // 设置文字颜色为白色。
                        boxShadow: 'none', // 移除默认的阴影。
                        '&:hover': {
                            bgcolor: '#333333', // 鼠标悬停时，使用一个稍浅的深灰色。
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
// 使用 `export default` 将这个组件导出，以便在项目的其他地方可以通过 `import` 来使用它。
export default TemplateSearchForm;