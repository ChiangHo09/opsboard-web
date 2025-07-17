/**
 * 文件名：theme.ts
 * 描述：
 *     此文件负责创建和配置整个应用的 Material-UI 主题。
 *     它现在是项目中所有共享颜色常量的唯一来源（Single Source of Truth），
 *     通过扩展MUI的调色板（palette）来实现。
 *
 * 本次修改：
 * - 【新增注释】为 `palette` 调色板中的每一个颜色部分都添加了详细的注释，清晰地说明了该颜色在 UI 中的具体用途。
 */
import { createTheme } from '@mui/material/styles'
import { red, brown } from '@mui/material/colors'
import { zhCN } from '@mui/material/locale';

import type { ComponentsOverrides } from '@mui/material/styles';
import type { CSSObject } from '@mui/material/styles';
import type { Theme as MuiTheme, PaletteColor, PaletteColorOptions } from '@mui/material/styles';


// --- 1. 模块增强 (Module Augmentation) ---
declare module '@mui/material/styles' {
    interface Palette {
        neutral: PaletteColor;
        app: {
            background: string;
            hover: string;
            button: {
                background: string;
                hover: string;
            };
        };
        custom: {
            hoverOpacity: string;
        };
    }
    interface PaletteOptions {
        neutral?: PaletteColorOptions;
        app?: {
            background?: string;
            hover?: string;
            button?: {
                background?: string;
                hover?: string;
            };
        };
        custom?: {
            hoverOpacity?: string;
        };
    }

    interface Components {
        MuiPickersOutlinedInput?: {
            styleOverrides?: ComponentsOverrides<MuiTheme>['MuiOutlinedInput'];
        };
        MuiPickersInputBase?: {
            styleOverrides?: {
                root?: CSSObject | ((props: {
                    ownerState: { focused: boolean; error: boolean; };
                    theme: MuiTheme
                }) => CSSObject);
            };
        };
        MuiPickersPopper?: {
            styleOverrides?: {
                paper?: CSSObject | ((props: { theme: MuiTheme }) => CSSObject);
            };
        };
    }
}

// --- 2. 定义调色板 ---
const palette = {
    mode: 'light' as const,

    // 核心品牌颜色
    primary: { main: brown[500] },      // 主要品牌色。用于页面标题、主按钮、链接等强调元素。
    secondary: { main: '#ff6d00' },     // 次要品牌色。用于次要操作或突出显示的元素。
    error: { main: red.A400 },          // 错误状态颜色。用于表单验证、错误提示等。

    // 中性色调（灰色系）
    neutral: {
        main: '#424242',                // 主要中性色。用于大多数常规文本、图标、输入框边框等。
        light: '#F0F4F9',               // 浅中性色。（当前保留，但主要由 app.background 替代）
        dark: '#333333',                // 深中性色。用于深色按钮（如搜索表单中的“搜索”按钮）的悬停状态。
        contrastText: '#ffffff',        // 在 `main` (#424242) 颜色上的对比文字颜色（白色）。
    },

    // 应用级通用颜色（跟随主题变化）
    app: {
        background: brown[50],          // 应用主背景色。用于侧边栏和主工作区的“边框”背景。
        hover: brown[100],              // 在主背景上的悬停色。
        // 应用内的次要按钮颜色
        button: {
            background: brown[100],     // 次要按钮背景色。用于页面右上角的“搜索”按钮和仪表盘快捷按钮。
            hover: brown[200],          // 次要按钮的悬停背景色。
        }
    },

    // 自定义/特殊颜色
    custom: {
        hoverOpacity: 'rgba(66, 66, 66, 0.04)', // 用于 Outlined 按钮的透明悬停背景色。
    }
}

// --- 3. 定义排版、形状和间距 ---
const typography = {
    fontFamily: `'Roboto','Noto Sans SC','PingFang SC',sans-serif`
}

const shape = {
    borderRadius: 8
}

const spacing = 4

// --- 4. 创建主题实例 ---
const theme = createTheme({
    palette,
    typography,
    shape,
    spacing,
    components: {
        MuiOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.neutral.main,
                        borderWidth: '1px'
                    },
                    '&.Mui-focused': {
                        boxShadow: 'none',
                        outline: 'none'
                    }
                })
            }
        },
        MuiPickersOutlinedInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&.Mui-focused.MuiPickersOutlinedInput-root .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.neutral.main,
                        borderWidth: '1px'
                    },
                    '&.Mui-focused': {
                        boxShadow: 'none',
                        outline: 'none'
                    }
                })
            }
        },
        MuiPickersInputBase: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: `${theme.palette.neutral.main} !important`
                    },
                    '&.Mui-focused': {
                        boxShadow: 'none !important',
                        outline: 'none !important'
                    }
                })
            }
        },
        MuiPickersPopper: {
            styleOverrides: {
                paper: ({ theme }) => ({
                    '& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: `${theme.palette.neutral.main} !important`
                    }
                })
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&.Mui-focused': {
                        color: theme.palette.neutral.main
                    }
                })
            }
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: ({ theme }) => ({
                    borderRadius: theme.shape.borderRadius,
                    textTransform: 'none',
                    fontWeight: 500
                })
            }
        },
        MuiPaper: {
            styleOverrides: {
                rounded: { borderRadius: shape.borderRadius }
            }
        }
    }
}, zhCN);

export default theme;

// --- 5. 模块增强 (用于自定义排版变体) ---
import '@mui/material/styles'
declare module '@mui/material/styles' {
    interface TypographyVariants {
        headlineMedium: React.CSSProperties;
        titleLarge: React.CSSProperties;
        titleMedium: React.CSSProperties;
    }
    interface TypographyVariantsOptions {
        headlineMedium?: React.CSSProperties;
        titleLarge?: React.CSSProperties;
        titleMedium?: React.CSSProperties;
    }
}
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        headlineMedium: true;
        titleLarge: true;
        titleMedium: true;
    }
}