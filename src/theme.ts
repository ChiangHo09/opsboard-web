/**
 * 文件名: src/theme.ts
 *
 * 本次修改内容:
 * - 【样式统一】确认 `MuiTooltip` 的 `tooltip-sidenav` 全局样式定义正确。
 * - 此样式使用 `theme.palette.app.background` 作为背景色，`theme.palette.neutral.main` 作为文本颜色，
 *   并包含了正确的边框、圆角、内边距和字体样式，以匹配 SideNav 的原始设计。
 *
 * 文件功能描述:
 * 此文件负责创建和配置整个应用的 Material-UI 主题。
 */

import {createTheme} from '@mui/material/styles';
import {red} from '@mui/material/colors';
import {zhCN} from '@mui/material/locale';

import type {ComponentsOverrides} from '@mui/material/styles';
import type {CSSObject} from '@mui/material/styles';
import type {Theme as MuiTheme, PaletteColor, PaletteColorOptions} from '@mui/material/styles';

/* 1. 模块增强 */
declare module '@mui/material/styles' {
    interface Palette {
        neutral: PaletteColor;
        app: { background: string; hover: string; button: { background: string; hover: string; }; };
        custom: { hoverOpacity: string; };
    }

    interface PaletteOptions {
        neutral?: PaletteColorOptions;
        app?: { background?: string; hover?: string; button?: { background?: string; hover?: string; }; };
        custom?: { hoverOpacity?: string; };
    }

    interface Components {
        MuiPickersOutlinedInput?: { styleOverrides?: ComponentsOverrides<MuiTheme>['MuiOutlinedInput']; };
        MuiPickersInputBase?: {
            styleOverrides?: {
                root?: CSSObject | ((props: {
                    ownerState: { focused: boolean; error: boolean };
                    theme: MuiTheme
                }) => CSSObject);
            };
        };
        MuiPickersPopper?: { styleOverrides?: { paper?: CSSObject | ((props: { theme: MuiTheme }) => CSSObject); }; };
        MuiDatePicker?: {
            defaultProps?: {
                slotProps?: { calendarHeader?: { format?: string }; toolbar?: { toolbarFormat?: string }; };
            };
        };
        MuiMobileDatePicker?: {
            defaultProps?: {
                slotProps?: { calendarHeader?: { format?: string }; toolbar?: { toolbarFormat?: string }; };
            };
        };
    }
}

/* 2. 调色板 */
const palette = {
    mode: 'light' as const,
    primary: {main: '#1976d2'},
    secondary: {main: '#ff6d00'},
    error: {main: red.A400},
    neutral: {main: '#424242', light: '#F0F4F9', dark: '#333333', contrastText: '#ffffff'},
    app: {background: '#F0F4F9', hover: '#E1E5E9', button: {background: '#F0F4F9', hover: '#E1E5E9'}},
    custom: {hoverOpacity: 'rgba(66, 66, 66, 0.04)'},
};

/* 3. 排版 / 形状 / 间距 */
const typography = {fontFamily: `'Roboto','Noto Sans SC','PingFang SC',sans-serif`};
const shape = {borderRadius: 8};
const spacing = 4;

/* 4. 创建主题实例 */
const theme = createTheme(
    {
        palette,
        typography,
        shape,
        spacing,
        components: {
            MuiOutlinedInput: {
                styleOverrides: {
                    root: ({theme}) => ({
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.neutral.main,
                            borderWidth: '1px'
                        }, '&.Mui-focused': {boxShadow: 'none', outline: 'none'}
                    })
                }
            },
            MuiPickersOutlinedInput: {
                styleOverrides: {
                    root: ({theme}) => ({
                        '&.Mui-focused.MuiPickersOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                            borderColor: theme.palette.neutral.main,
                            borderWidth: '1px'
                        }, '&.Mui-focused': {boxShadow: 'none', outline: 'none'}
                    })
                }
            },
            MuiPickersInputBase: {
                styleOverrides: {
                    root: ({theme}) => ({
                        '&.Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline': {borderColor: `${theme.palette.neutral.main} !important`},
                        '&.Mui-focused': {boxShadow: 'none !important', outline: 'none !important'}
                    })
                }
            },
            MuiPickersPopper: {styleOverrides: {paper: ({theme}) => ({'& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {borderColor: `${theme.palette.neutral.main} !important`}})}},
            MuiInputLabel: {styleOverrides: {root: ({theme}) => ({'&.Mui-focused': {color: theme.palette.neutral.main}})}},
            MuiButton: {
                defaultProps: {disableElevation: true},
                styleOverrides: {
                    root: ({theme}) => ({
                        borderRadius: theme.shape.borderRadius,
                        textTransform: 'none',
                        fontWeight: 500
                    })
                }
            },
            MuiPaper: {styleOverrides: {rounded: {borderRadius: shape.borderRadius}}},
            MuiDatePicker: {
                defaultProps: {
                    slotProps: {
                        calendarHeader: {format: 'YYYY年MM月'},
                        toolbar: {toolbarFormat: 'MM月DD日'}
                    }
                }
            },
            MuiMobileDatePicker: {
                defaultProps: {
                    slotProps: {
                        calendarHeader: {format: 'YYYY年MM月'},
                        toolbar: {toolbarFormat: 'MM月DD日'}
                    }
                }
            },
            MuiTooltip: {
                styleOverrides: {
                    tooltip: ({theme}) => ({
                        '&.tooltip-sidenav': {
                            backgroundColor: palette.app.background,
                            color: palette.neutral.main,
                            borderRadius: shape.borderRadius * 0.75,
                            border: `1px solid ${theme.palette.divider}`,
                            padding: '4px 9px',
                            fontSize: '13px',
                            fontWeight: 500,
                        },
                    }),
                },
            },
        },
    },
    zhCN,
);

export default theme;

/* 5. Typography 变体扩展 */
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