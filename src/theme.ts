/**
 * 文件名：theme.ts
 * ----------------------------------------------------------------------------
 * 功能：创建并导出全局 Material-UI 主题（Single Source of Truth）
 * 本次修改：
 *   在「模块增强」里补充 `MuiDatePicker` / `MuiMobileDatePicker` 的
 *      TypeScript 声明，解决 TS2353。
 *   在 `components` 中追加两组件的 `defaultProps.slotProps`，
 *      统一日期选择器：
 *        • 页眉格式：YYYY年MM月
 *        • 工具栏大字：MM月DD日
 * ----------------------------------------------------------------------------
 */

import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { zhCN } from '@mui/material/locale';

import type { ComponentsOverrides } from '@mui/material/styles';
import type { CSSObject } from '@mui/material/styles';
import type { Theme as MuiTheme, PaletteColor, PaletteColorOptions } from '@mui/material/styles';

/* -------------------------------------------------------------------------- */
/* 1. 模块增强（TypeScript 类型扩展）                                         */
/* -------------------------------------------------------------------------- */
declare module '@mui/material/styles' {
    /** -------- 1.1 Palette 扩展（保持原样） -------- */
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

    /** -------- 1.2 Components 扩展 --------
     *  原有的日期输入相关接口保留，并新增两个 Date-Picker 组件
     *  以让 createTheme 能识别它们的配置 */
    interface Components {
        /* --- 原有声明：保持不动 --- */
        MuiPickersOutlinedInput?: {
            styleOverrides?: ComponentsOverrides<MuiTheme>['MuiOutlinedInput'];
        };
        MuiPickersInputBase?: {
            styleOverrides?: {
                root?: CSSObject | ((props: { ownerState: { focused: boolean; error: boolean }; theme: MuiTheme }) => CSSObject);
            };
        };
        MuiPickersPopper?: {
            styleOverrides?: {
                paper?: CSSObject | ((props: { theme: MuiTheme }) => CSSObject);
            };
        };

        /* --- 新增：桌面 / 静态 Date-Picker --- */
        MuiDatePicker?: {
            defaultProps?: {
                slotProps?: {
                    calendarHeader?: { format?: string };      // 页眉格式
                    toolbar?: { toolbarFormat?: string };      // 工具栏大字
                };
            };
        };
        /* --- 新增：移动端 Date-Picker --- */
        MuiMobileDatePicker?: {
            defaultProps?: {
                slotProps?: {
                    calendarHeader?: { format?: string };
                    toolbar?: { toolbarFormat?: string };
                };
            };
        };
    }
}

/* -------------------------------------------------------------------------- */
/* 2. 调色板（保持你原有颜色配置）                                            */
/* -------------------------------------------------------------------------- */
const palette = {
    mode: 'light' as const,
    primary: { main: '#1976d2' },          // 主色：深蓝
    secondary: { main: '#ff6d00' },
    error: { main: red.A400 },

    neutral: {
        main: '#424242',
        light: '#F0F4F9',
        dark: '#333333',
        contrastText: '#ffffff',
    },

    app: {
        background: '#F0F4F9',
        hover: '#E1E5E9',
        button: {
            background: '#F0F4F9',
            hover: '#E1E5E9',
        },
    },

    custom: { hoverOpacity: 'rgba(66, 66, 66, 0.04)' },
};

/* -------------------------------------------------------------------------- */
/* 3. 排版 / 形状 / 间距（保持原样）                                          */
/* -------------------------------------------------------------------------- */
const typography = {
    fontFamily: `'Roboto','Noto Sans SC','PingFang SC',sans-serif`,
};
const shape = { borderRadius: 8 };
const spacing = 4;

/* -------------------------------------------------------------------------- */
/* 4. 创建主题实例                                                            */
/* -------------------------------------------------------------------------- */
const theme = createTheme(
    {
        palette,
        typography,
        shape,
        spacing,

        /* ---------------- 4.1 组件级样式覆写 ---------------- */
        components: {
            /* -------- 输入框 & 标签（保持原样） -------- */
            MuiOutlinedInput: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.neutral.main,
                            borderWidth: '1px',
                        },
                        '&.Mui-focused': { boxShadow: 'none', outline: 'none' },
                    }),
                },
            },
            MuiPickersOutlinedInput: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '&.Mui-focused.MuiPickersOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.neutral.main,
                            borderWidth: '1px',
                        },
                        '&.Mui-focused': { boxShadow: 'none', outline: 'none' },
                    }),
                },
            },
            MuiPickersInputBase: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '&.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline': {
                            borderColor: `${theme.palette.neutral.main} !important`,
                        },
                        '&.Mui-focused': { boxShadow: 'none !important', outline: 'none !important' },
                    }),
                },
            },
            MuiPickersPopper: {
                styleOverrides: {
                    paper: ({ theme }) => ({
                        '& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
                            borderColor: `${theme.palette.neutral.main} !important`,
                        },
                    }),
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: ({ theme }) => ({
                        '&.Mui-focused': { color: theme.palette.neutral.main },
                    }),
                },
            },
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: ({ theme }) => ({
                        borderRadius: theme.shape.borderRadius,
                        textTransform: 'none',
                        fontWeight: 500,
                    }),
                },
            },
            MuiPaper: {
                styleOverrides: { rounded: { borderRadius: shape.borderRadius } },
            },

            /* -------- 4.2 新增：日期选择器默认格式 -------- */
            MuiDatePicker: {
                defaultProps: {
                    slotProps: {
                        calendarHeader: { format: 'YYYY年MM月' }, // 页眉示例：2025年07月
                        toolbar:        { toolbarFormat: 'MM月DD日' }, // 工具栏示例：07月15日
                    },
                },
            },
            MuiMobileDatePicker: {
                defaultProps: {
                    slotProps: {
                        calendarHeader: { format: 'YYYY年MM月' },
                        toolbar:        { toolbarFormat: 'MM月DD日' },
                    },
                },
            },
        },
    },
    zhCN, // 合并官方中文本地化
);

export default theme;

/* -------------------------------------------------------------------------- */
/* 5. Typography 变体扩展（保持原样）                                        */
/* -------------------------------------------------------------------------- */
import '@mui/material/styles';
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
