/**
 * 文件名：theme.ts
 * 描述：
 *     此文件负责创建和配置整个应用的 Material-UI 主题。
 *     它现在是项目中所有共享颜色常量的唯一来源（Single Source of Truth），
 *     通过扩展MUI的调色板（palette）来实现。
 *
 * 本次修改：
 * - 将主题的主色（`primary.main`）从亮蓝色（`#2962ff`）修改为更沉稳的深蓝色（`#1976d2`），以降低标题的亮度。
 */
import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'
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

    // 【修改】核心品牌颜色恢复为深蓝色
    primary: { main: '#1976d2' },
    secondary: { main: '#ff6d00' },
    error: { main: red.A400 },

    // 中性色调（灰色系）
    neutral: {
        main: '#424242',
        light: '#F0F4F9',
        dark: '#333333',
        contrastText: '#ffffff',
    },

    // 应用级通用颜色恢复为灰色系
    app: {
        background: '#F0F4F9',
        hover: '#E1E5E9',
        button: {
            background: '#F0F4F9',
            hover: '#E1E5E9',
        }
    },

    // 自定义/特殊颜色
    custom: {
        hoverOpacity: 'rgba(66, 66, 66, 0.04)',
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
                    '&.Mui-focused.MuiPickersOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
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