/**
 * 文件功能：
 * 此文件负责创建和配置整个应用的 Material-UI 主题。
 *
 * 本次修改：
 * - 【最终问题修复】修正了 `theme.ts` 中的 TypeScript 报错 (关于 `any` 类型)：
 *   *   在 `MuiPickersInputBase` 的模块增强中，将 `root` 属性的 `ownerState` 类型从 `any` 更改为
 *       `{ focused: boolean; error: boolean; }`。这为 `ownerState` 提供了精确的类型定义，
 *       解决了 `any` 导致的 TypeScript 和 ESLint 警告，同时与实际使用的 CSS 选择器（如 `.Mui-focused` 和 `:not(.Mui-error)`）相符。
 * - 【核心样式功能保持】保留了所有针对 `MuiOutlinedInput`、`MuiPickersOutlinedInput` 和 `MuiInputLabel` 的 `styleOverrides`。
 *   这些样式规则旨在统一所有文本框（包括 `DatePicker` 内部的）在获得焦点时的边框和标签颜色为 `#424242`，并移除蓝色阴影。
 *   一旦 TypeScript 报错解决，这些样式将能正确生效，彻底解决焦点颜色不一致的问题。
 */
import { createTheme } from '@mui/material/styles' // 导入 createTheme 函数，用于创建 Material-UI 主题。
import { red } from '@mui/material/colors' // 导入 Material-UI 颜色集合中的红色，常用于错误状态的颜色定义。

// 导入 Material-UI 的中文（简体）本地化配置，用于组件（如 DatePicker）的默认文本。
import { zhCN } from '@mui/material/locale';

// 导入 ComponentsOverrides 和 CSSObject 类型，用于在模块增强和样式覆盖中提供 TypeScript 类型支持。
import type { ComponentsOverrides } from '@mui/material/styles';
import type { CSSObject } from '@mui/material/styles';
import type { Theme as MuiTheme } from '@mui/material/styles'; // 导入 Material-UI 的 Theme 类型，用于类型提示。


// 【关键修复】模块增强（Module Augmentation）：
// 扩展 Material-UI 的主题 Components 接口，以包含 Material-UI X (MUI X) 组件的样式定义。
// 这解决了 TypeScript 报错，并允许为 MuiPickersOutlinedInput 和 MuiPickersInputBase 定义样式。
declare module '@mui/material/styles' {
    interface Components { // 扩展 Material-UI 主题的 Components 接口。
        // 为 MuiPickersOutlinedInput 添加样式覆盖类型声明，复用 MuiOutlinedInput 的类型定义，因为它们具有相似的结构。
        MuiPickersOutlinedInput?: {
            styleOverrides?: ComponentsOverrides<MuiTheme>['MuiOutlinedInput'];
        };
        // 为 MuiPickersInputBase 添加样式覆盖类型声明。
        MuiPickersInputBase?: {
            styleOverrides?: {
                root?: CSSObject | ((props: {
                    // 【修复点】为 ownerState 提供精确的类型定义，解决了 `any` 报错。
                    // 包含在 CSS 选择器中会用到的关键状态：`focused` 和 `error`。
                    ownerState: { focused: boolean; error: boolean; };
                    theme: MuiTheme
                }) => CSSObject);
            };
        };
        // 为 MuiPickersPopper 添加样式覆盖类型声明。MuiPickersPopper 是 DatePicker 弹窗的根容器。
        MuiPickersPopper?: {
            styleOverrides?: {
                paper?: CSSObject | ((props: { theme: MuiTheme }) => CSSObject);
            };
        };
    }
}

// 定义调色板配置。
const palette = {
    mode: 'light' as const, // 主题模式设置为“亮色模式”。`as const` 断言确保类型是字面量 'light' 而非泛化的 `string`。
    primary: { main: '#2962ff' }, // 定义主要颜色，通常用于按钮、链接等默认强调色。值为深蓝色。
    secondary: { main: '#ff6d00' }, // 定义次要颜色，用于辅助强调或次要操作。值为橙色。
    error: { main: red.A400 } // 定义错误颜色，通常用于错误提示或警告。使用 Material-UI 提供的红色 A400 变体。
}

// 定义排版配置。
const typography = {
    // 定义全局字体栈。优先使用 Roboto（用于英文），然后是思源黑体（Noto Sans SC）和苹方（PingFang SC）作为中文回退字体，最后是无衬线字体。
    fontFamily: `'Roboto','Noto Sans SC','PingFang SC',sans-serif`
}

// 定义形状配置。
const shape = {
    borderRadius: 8 // 定义全局默认的边框圆角半径，应用于按钮、卡片等 UI 元素。单位为像素。
}

// 定义间距单位。
const spacing = 4 // 定义 Material-UI 中所有间距计算的基础单位。MUI 的所有间距（如 padding, margin）都是这个单位的倍数。

// 使用 createTheme 函数创建 Material-UI 主题实例。
const theme = createTheme({
    palette,    // 应用上面定义的调色板配置。
    typography, // 应用上面定义的排版配置。
    shape,      // 应用上面定义的形状配置。
    spacing,    // 应用上面定义的间距配置。
    components: { // 自定义 Material-UI 组件的默认属性和样式覆盖。
        // 【标准 TextField 焦点样式】MuiOutlinedInput 样式覆盖：
        // 针对所有标准 `TextField` 组件（使用 `Outlined` 变体）的焦点边框和阴影。
        MuiOutlinedInput: {
            styleOverrides: {
                root: { // 针对 `MuiOutlinedInput` 的根元素。
                    // 当根元素获得焦点时（具有 `Mui-focused` 类），修改其内部 `notchedOutline` 边框的颜色。
                    // `&` 指代 `MuiOutlinedInput-root` 自身。
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#424242', // 设置边框颜色为深灰色，不使用 `!important`。
                        borderWidth: '1px' // 确保边框宽度为 1px，避免可能因权重问题导致边框消失。
                    },
                    // 同时，确保移除任何可能存在的蓝色焦点阴影和轮廓。这些规则也直接应用于根元素在焦点时的状态。
                    '&.Mui-focused': {
                        boxShadow: 'none', // 移除焦点时的 `box-shadow`，不使用 `!important`。
                        outline: 'none'    // 移除焦点时的 `outline`，不使用 `!important`。
                    }
                }
            }
        },
        // 【DatePicker 焦点修复方案一：提升特异性组合】MuiPickersOutlinedInput 样式覆盖：
        // 专门针对 `DatePicker` 内部使用的 `MuiPickersOutlinedInput` 组件的焦点边框和阴影。
        // 这种方式通过增加选择器中的类名来提升特异性，尝试在不使用 `!important` 的情况下覆盖默认样式。
        MuiPickersOutlinedInput: {
            styleOverrides: {
                root: { // 针对 `MuiPickersOutlinedInput` 的根元素。
                    // 组合多个类名提升权重：`&` (MuiPickersOutlinedInput-root 自身) + `.Mui-focused` + `.MuiPickersOutlinedInput-root` (再次强调自身类名，提升特异性)
                    // 然后指向内部的 `.MuiPickersOutlinedInput-notchedOutline`。
                    '&.Mui-focused.MuiPickersOutlinedInput-root .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: '#424242', // 设置边框颜色为深灰色。
                        borderWidth: '1px' // 轻微增加权重，确保边框可见。
                    },
                    // 移除 DatePicker 内部 TextField 焦点时的蓝色阴影和轮廓。
                    '&.Mui-focused': {
                        boxShadow: 'none', // 移除焦点时的 `box-shadow`。
                        outline: 'none'    // 移除焦点时的 `outline`。
                    }
                }
            }
        },
        // 【DatePicker 焦点修复方案二：父容器穿透覆盖 + 最终保障】MuiPickersInputBase 样式覆盖：
        // 这是解决 `DatePicker` 焦点颜色问题的核心策略，旨在通过从 `DatePicker` 的最外层输入框容器 (`MuiPickersInputBase`)
        // 向下穿透覆盖内部 `OutlinedInput` 的样式，以获得更高的优先级。
        MuiPickersInputBase: {
            styleOverrides: {
                root: { // 针对 `MuiPickersInputBase` 的根元素。
                    // 精确复制您在浏览器开发者工具中发现的、具有最高特异性的组合选择器：
                    // `&` (MuiPickersInputBase-root 自身) + `.Mui-focused` + `:not(.Mui-error)` + 对内部 `MuiPickersOutlinedInput-notchedOutline` 的定位。
                    '&.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: '#424242 !important' // 【关键：此处使用 `!important` 作为最终保障】强制设置为深灰色，确保覆盖一切。
                    },
                    // 同时，确保移除与 `MuiPickersInputBase` 根元素相关的任何蓝色焦点阴影和轮廓。
                    // 这些规则也作用于 `MuiPickersInputBase` 的根元素在焦点状态。
                    '&.Mui-focused': {
                        boxShadow: 'none !important', // 移除焦点时的 `box-shadow`。
                        outline: 'none !important'    // 移除焦点时的 `outline`。
                    }
                }
            }
        },
        // MuiPickersPopper 样式覆盖：
        // 这是一个额外的防御性层级，用于覆盖 DatePicker 弹窗（`MuiPickersPopper-paper`）内部的元素样式。
        // 虽然上面的 `MuiPickersInputBase` 覆盖应该已经足够，但这提供了一个从更外层父容器向下覆盖的可能性。
        MuiPickersPopper: {
            styleOverrides: {
                paper: { // 针对 `MuiPickersPopper` 组件的 `paper` 槽位（通常是弹窗的 Paper 组件）。
                    // 从弹出层父容器 (`&` 指代 `MuiPickersPopper-paper`) 向下查找并覆盖内部输入框的边框。
                    // 理论上，`MuiPickersInputBase` 的覆盖更直接，但此规则作为补充。
                    '& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: '#424242 !important' // 此处 `!important` 作用于从 `MuiPickersPopper` 规则派生的样式，作为最终保障。
                    }
                }
            }
        },
        // 【标签焦点样式】MuiInputLabel 样式覆盖：
        // 统一所有 `TextField` 标签（`InputLabel`）在获得焦点时的颜色。
        MuiInputLabel: {
            styleOverrides: {
                root: { // 针对 `MuiInputLabel` 的根元素。
                    // 当标签获得焦点时（具有 `Mui-focused` 类），修改其文本颜色。
                    '&.Mui-focused': {
                        color: '#424242' // 设置标签颜色为深灰色，不使用 `!important`。
                    }
                }
            }
        },
        // 其他组件保持原样：
        // MuiButton 组件的默认属性和样式覆盖。
        MuiButton: {
            defaultProps: { disableElevation: true }, // 默认禁用 Material Design 阴影效果，使按钮更扁平。
            styleOverrides: { // 样式覆盖。
                root: ({ theme }) => ({ // 针对按钮根元素的样式。`theme` 对象可在此处访问，用于使用主题值。
                    borderRadius: theme.shape.borderRadius, // 使用主题中定义的全局圆角半径。
                    textTransform: 'none', // 禁用按钮文本的自动大写转换。
                    fontWeight: 500 // 设置按钮文本的字体粗细。
                })
            }
        },
        // MuiPaper 组件的样式覆盖（通常用于卡片、弹出框等）。
        MuiPaper: {
            styleOverrides: {
                rounded: { borderRadius: shape.borderRadius } // 确保 `rounded` 变体的 `Paper` 组件具有主题中定义的圆角。
            }
        }
    }
}, zhCN); // 应用 Material-UI 的中文本地化配置到主题。

export default theme; // 导出创建好的 Material-UI 主题实例。

// 模块增强（Module Augmentation）：扩展 Material-UI 的 TypographyVariants 接口。
// 这些声明是为了在 TypeScript 中告知，我们已经为主题添加了自定义的排版变体（如 headlineMedium, titleLarge, titleMedium, 等）。
// 它们是纯粹的 TypeScript 类型声明，不生成任何运行时代码，也不影响样式。
import '@mui/material/styles' // 导入 Material-UI 样式模块，这是进行模块增强所必需的。
declare module '@mui/material/styles' { // 声明对 `@mui/material/styles` 模块的扩展。
    interface TypographyVariants { // 扩展 `TypographyVariants` 接口，定义新的排版变体名称及其 CSS 属性类型。
        headlineMedium: React.CSSProperties; // 自定义排版变体：headlineMedium，其类型为 React 的 CSS 属性。
        titleLarge: React.CSSProperties;     // 自定义排版变体：titleLarge。
        titleMedium: React.CSSProperties;    // 自定义排版变体：titleMedium。
    }
    interface TypographyVariantsOptions { // 扩展 `TypographyVariantsOptions` 接口，定义创建主题时这些新变体的可选性。
        headlineMedium?: React.CSSProperties; // 使 headlineMedium 成为可选属性。
        titleLarge?: React.CSSProperties;     // 使 titleLarge 成为可选属性。
        titleMedium?: React.CSSProperties;    // 使 titleMedium 成为可选属性。
    }
}
declare module '@mui/material/Typography' { // 声明对 `@mui/material/Typography` 模块的扩展。
    interface TypographyPropsVariantOverrides { // 扩展 `TypographyPropsVariantOverrides` 接口，允许 `Typography` 组件的 `variant` prop 使用这些自定义变体。
        headlineMedium: true; // 声明 `headlineMedium` 可以作为 `Typography` 的 `variant` 使用。
        titleLarge: true;     // 声明 `titleLarge` 可以作为 `Typography` 的 `variant` 使用。
        titleMedium: true;    // 声明 `titleMedium` 可以作为 `Typography` 的 `variant` 使用。
    }
}