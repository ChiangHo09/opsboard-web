/**
 * @file src/theme.ts
 * @description 此文件负责创建和配置整个应用的 Material-UI 主题。它定义了全局的调色板、排版、间距、形状以及组件级别的默认属性和样式覆盖，是构建一致性用户界面的核心。
 * @modification 本次提交旨在统一全局 Tooltip 样式并修复其架构问题。
 *   - [架构重构]：修改了 `MuiTooltip` 的 `styleOverrides`。移除了之前仅对 `.tooltip-sidenav` 类生效的限定，将样式直接应用到 `tooltip` 插槽的根部。
 *   - [根本原因]：之前的样式依赖于一个需要手动添加的 CSS 类，导致样式定义分散，实现不一致。
 *   - [解决方案]：通过为 `tooltip` 插槽提供一个全局默认样式，我们确保了应用中所有 `<Tooltip>` 组件在视觉上的一致性。新的 `borderRadius` 被设置为 `4px`，以实现统一的“圆角矩形”外观。
 */

// 从 @mui/material/styles 导入 createTheme 函数，这是创建和合并主题对象的核心工具。
import {createTheme} from '@mui/material/styles';
// 从 @mui/material/colors 导入预定义的颜色对象，此处为红色，用于定义错误状态的颜色。
import {red} from '@mui/material/colors';
// 从 @mui/material/locale 导入中文语言包，用于将 MUI 组件的内置文本（如分页、日期选择器）本地化为中文。
import {zhCN} from '@mui/material/locale';

// 从 @mui/material/styles 导入多个类型定义，用于在模块增强中提供精确的类型支持，确保类型安全。
import type {ComponentsOverrides} from '@mui/material/styles'; // 用于定义组件样式覆盖的类型。
import type {CSSObject} from '@mui/material/styles'; // 用于定义 CSS 样式对象的类型。
import type {Theme as MuiTheme, PaletteColor, PaletteColorOptions} from '@mui/material/styles'; // 导入基础主题、调色板颜色及其选项的类型。

/* =================================================================================================
 * 1. 模块增强 (Module Augmentation)
 * -------------------------------------------------------------------------------------------------
 * 通过 TypeScript 的 "declare module" 语法，我们可以扩展 Material-UI 的原始主题类型定义。
 * 这使得我们能够添加自定义的颜色、组件变体等，并在整个应用中获得完整的 TypeScript 类型提示和安全检查。
 * ================================================================================================= */
declare module '@mui/material/styles' {
    // 增强 Palette 接口，为其添加自定义的颜色类别。
    interface Palette {
        // 'neutral' 颜色类别，用于定义中性色调，如常规文本、边框和背景。
        neutral: PaletteColor;
        // 'app' 颜色类别，用于定义应用特有的、非标准组件的颜色，如全局背景、自定义按钮等。
        app: { background: string; hover: string; button: { background: string; hover: string; }; };
        // 'custom' 类别，用于存放不属于标准调色板的特定样式值。
        custom: { hoverOpacity: string; };
    }

    // 对应增强 PaletteOptions 接口，允许在 createTheme 的 palette 配置中传入我们自定义的颜色选项。
    interface PaletteOptions {
        neutral?: PaletteColorOptions;
        app?: { background?: string; hover?: string; button?: { background?: string; hover?: string; }; };
        custom?: { hoverOpacity?: string; };
    }

    // 增强 Components 接口，为自定义或非标准的组件配置添加类型定义，此处主要用于日期选择器。
    interface Components {
        // 为 MUI X Date Picker 的 OutlinedInput 组件提供类型定义，使其可以接受与标准 MuiOutlinedInput 相同的样式覆盖。
        MuiPickersOutlinedInput?: { styleOverrides?: ComponentsOverrides<MuiTheme>['MuiOutlinedInput']; };
        // 为 MUI X Date Picker 的 InputBase 组件提供类型定义。
        MuiPickersInputBase?: {
            styleOverrides?: {
                // 定义 root 样式槽的类型，允许根据组件状态（如 focused, error）和主题动态计算样式。
                root?: CSSObject | ((props: {
                    ownerState: { focused: boolean; error: boolean };
                    theme: MuiTheme
                }) => CSSObject);
            };
        };
        // 为 MUI X Date Picker 的弹出层（Popper）提供类型定义。
        MuiPickersPopper?: { styleOverrides?: { paper?: CSSObject | ((props: { theme: MuiTheme }) => CSSObject); }; };
        // 为桌面版 DatePicker 组件提供类型定义，以设置其默认属性。
        MuiDatePicker?: {
            defaultProps?: {
                slotProps?: { calendarHeader?: { format?: string }; toolbar?: { toolbarFormat?: string }; };
            };
        };
        // 为移动版 DatePicker 组件提供类型定义，以设置其默认属性。
        MuiMobileDatePicker?: {
            defaultProps?: {
                slotProps?: { calendarHeader?: { format?: string }; toolbar?: { toolbarFormat?: string }; };
            };
        };
    }
}

/* =================================================================================================
 * 2. 调色板 (Palette)
 * -------------------------------------------------------------------------------------------------
 * 定义应用的基础颜色方案。
 * ================================================================================================= */
const palette = {
    mode: 'light' as const, // 设置主题模式为'亮色'。'as const' 用于将类型收窄为字面量 'light'，增强类型安全。
    primary: {main: '#1976d2'}, // 定义主色，通常用于关键操作按钮、链接和高亮元素。
    secondary: {main: '#ff6d00'}, // 定义次要颜色，用于次级按钮或需要区分的元素。
    error: {main: red.A400}, // 定义错误状态颜色，使用预设的红色。
    // 定义自定义的 'neutral' 调色板，用于非彩色、信息性的 UI 元素。
    neutral: {
        main: '#424242',         // 主要中性色，用于正文文本。
        light: '#F0F4F9',        // 浅中性色，用于背景或分隔。
        dark: '#333333',         // 深中性色，用于需要更强对比度的文本。
        contrastText: '#ffffff', // 在使用 main 色作为背景时，应使用的对比文本颜色（通常是白色或黑色）。
    },
    // 定义自定义的 'app' 调色板，用于应用级别的特定 UI 元素。
    app: {
        background: '#F0F4F9', // 应用主背景色。
        hover: '#E1E5E9',      // 全局悬浮状态颜色。
        button: {
            background: '#F0F4F9', // 自定义按钮的背景色。
            hover: '#E1E5E9'       // 自定义按钮的悬浮背景色。
        }
    },
    // 定义自定义的 'custom' 调色板。
    custom: {
        // 定义一个半透明的悬浮效果颜色，用于需要轻微视觉反馈的场合。
        hoverOpacity: 'rgba(66, 66, 66, 0.04)',
    },
};

/* =================================================================================================
 * 3. 基础配置 (Typography / Shape / Spacing)
 * -------------------------------------------------------------------------------------------------
 * 定义应用视觉风格的基础。
 * ================================================================================================= */
// 定义全局字体栈，优先使用英文字体 Roboto，然后依次降级到中文字体，确保跨平台的中英文显示效果。
const typography = {fontFamily: `'Roboto','Noto Sans SC','PingFang SC',sans-serif`};
// 定义全局组件的圆角基准值，所有组件的圆角都应基于此值，以保持视觉统一。
const shape = {borderRadius: 8};
// 定义全局间距单位。MUI 的 `theme.spacing(x)` 方法将返回 `4 * x` px。
const spacing = 4;

/* =================================================================================================
 * 4. 创建并配置主题实例 (createTheme)
 * -------------------------------------------------------------------------------------------------
 * 将上述所有配置合并，并添加组件级别的样式覆盖和默认属性。
 * ================================================================================================= */
const theme = createTheme(
    // 第一个参数：基础主题配置对象。
    {
        palette,    // 应用上面定义的调色板。
        typography, // 应用上面定义的排版。
        shape,      // 应用上面定义的形状。
        spacing,    // 应用上面定义的间距。

        // `components` 对象用于覆盖或扩展 MUI 内置组件的默认样式和属性。
        components: {
            // [最终修复] 覆盖 MuiButtonGroup 的默认样式
            MuiButtonGroup: {
                styleOverrides: {
                    // 'grouped' 是专门用于定位组内按钮的样式插槽 (slot)。
                    // 这种方法比使用复杂的后代选择器更健壮、更符合 MUI 的设计理念。
                    grouped: ({ownerState}) => ({
                        // 我们只关心 'contained' 变体的按钮组
                        ...(ownerState.variant === 'contained' && {
                            // 目标为组内的按钮，除了最后一个
                            '&:not(:last-of-type)': {
                                // 关键修复：MUI 对 'contained' 按钮组的分割线应用了非常高优先级的样式。
                                // 通过直接覆盖 'grouped' 插槽的 borderRightColor，我们可以精确地将其设置为透明，
                                // 从而从根本上解决问题，而无需使用 '!important'。
                                borderRightColor: 'transparent',
                            },
                        })
                    }),
                },
            },
            // 覆盖 MuiOutlinedInput (轮廓输入框) 的样式。
            MuiOutlinedInput: {
                styleOverrides: {
                    // `root` 指的是组件的最外层元素。
                    root: ({theme}) => ({ // 接收 theme 对象以访问调色板等。
                        // 当输入框处于聚焦状态时 (`&.Mui-focused`)，修改其轮廓 (`.MuiOutlinedInput-notchedOutline`) 的样式。
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.neutral.main, // 边框颜色使用中性主色。
                            borderWidth: '1px' // 确保边框宽度为 1px。
                        },
                        // 移除聚焦时的默认 box-shadow 和 outline，以实现更简洁的视觉效果。
                        '&.Mui-focused': {boxShadow: 'none', outline: 'none'}
                    })
                }
            },
            // 为日期选择器的输入框提供类似的样式覆盖。
            MuiPickersOutlinedInput: {
                styleOverrides: {
                    root: ({theme}) => ({
                        '&.Mui-focused.MuiPickersOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.neutral.main,
                            borderWidth: '1px'
                        },
                        '&.Mui-focused': {boxShadow: 'none', outline: 'none'}
                    })
                }
            },
            // 为日期选择器的 InputBase 提供更强的样式覆盖，使用 !important 确保生效。
            MuiPickersInputBase: {
                styleOverrides: {
                    root: ({theme}) => ({
                        '&.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline': {borderColor: `${theme.palette.neutral.main} !important`},
                        '&.Mui-focused': {boxShadow: 'none !important', outline: 'none !important'}
                    })
                }
            },
            // 覆盖日期选择器弹出层内部输入框的聚焦样式。
            MuiPickersPopper: {styleOverrides: {paper: ({theme}) => ({'& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {borderColor: `${theme.palette.neutral.main} !important`}})}},
            // 覆盖 MuiInputLabel (输入框标签) 的样式。
            MuiInputLabel: {styleOverrides: {root: ({theme}) => ({'&.Mui-focused': {color: theme.palette.neutral.main}})}},
            // 覆盖 MuiButton (按钮) 的样式。
            MuiButton: {
                defaultProps: {
                    disableElevation: true // 默认禁用按钮的海拔（阴影），实现扁平化风格。
                },
                styleOverrides: {
                    root: ({theme}) => ({
                        borderRadius: theme.shape.borderRadius, // 所有按钮的圆角都遵循全局定义。
                        textTransform: 'none', // 禁用文本大写转换，使按钮文本按原样显示。
                        fontWeight: 500 // 设置默认字重。
                    })
                }
            },
            // 覆盖 MuiPaper (纸张/容器) 的样式。
            MuiPaper: {styleOverrides: {rounded: {borderRadius: shape.borderRadius}}}, // 确保所有 Paper 组件的圆角与全局定义一致。
            // 为桌面版日期选择器设置默认属性。
            MuiDatePicker: {
                defaultProps: {
                    slotProps: {
                        calendarHeader: {format: 'YYYY年MM月'}, // 将日历头部的格式本地化为中文。
                        toolbar: {toolbarFormat: 'MM月DD日'} // 将工具栏的日期格式本地化为中文。
                    }
                }
            },
            // 为移动版日期选择器设置相同的本地化格式。
            MuiMobileDatePicker: {
                defaultProps: {
                    slotProps: {
                        calendarHeader: {format: 'YYYY年MM月'},
                        toolbar: {toolbarFormat: 'MM月DD日'}
                    }
                }
            },
            // 覆盖 MuiTooltip (悬浮提示) 的样式。
            MuiTooltip: {
                styleOverrides: {
                    // `tooltip` 指的是弹出的提示框本身。
                    // 【核心修改】移除 .tooltip-sidenav 类选择器，将样式直接应用到所有 Tooltip 组件。
                    tooltip: ({theme}) => ({
                        backgroundColor: palette.app.background,
                        color: palette.neutral.main,
                        // 设置为明确的“圆角矩形”样式
                        borderRadius: Number(shape.borderRadius) / 2, // 4px
                        border: `1px solid ${theme.palette.divider}`,
                        padding: '4px 9px',
                        fontSize: '13px',
                        fontWeight: 500,
                    }),
                },
            },
        },
    },
    // 第二个参数：传入本地化配置对象，将组件内置文本翻译为中文。
    zhCN,
);

// 将最终生成的主题对象作为模块的默认导出，以便在应用的根部通过 ThemeProvider 注入。
export default theme;

/* =================================================================================================
 * 5. Typography 变体扩展 (Typography Variants Extension)
 * -------------------------------------------------------------------------------------------------
 * 为 Typography 组件添加自定义的变体，以满足设计系统中超出默认 h1-h6, body1-2 等的排版需求。
 * ================================================================================================= */
// 再次导入 @mui/material/styles 以进行模块增强。
import '@mui/material/styles';

declare module '@mui/material/styles' {
    // 增强 TypographyVariants 接口，添加新的变体名称。
    interface TypographyVariants {
        headlineMedium: React.CSSProperties;
        titleLarge: React.CSSProperties;
        titleMedium: React.CSSProperties;
    }

    // 对应增强 TypographyVariantsOptions 接口，允许在主题的 typography 配置中定义这些新变体的样式。
    interface TypographyVariantsOptions {
        headlineMedium?: React.CSSProperties;
        titleLarge?: React.CSSProperties;
        titleMedium?: React.CSSProperties;
    }
}
// 增强 @mui/material/Typography 模块。
declare module '@mui/material/Typography' {
    // 增强 TypographyPropsVariantOverrides 接口，将新变体名称添加到 Typography 组件的 variant prop 的可用值列表中。
    // 设置为 true 表示启用该变体。
    interface TypographyPropsVariantOverrides {
        headlineMedium: true;
        titleLarge: true;
        titleMedium: true;
    }
}