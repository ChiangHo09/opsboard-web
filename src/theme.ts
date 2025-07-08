/*****************************************************************
 *  src/theme.ts —— 修正版（已解决 components 类型报错）
 *****************************************************************/

import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

/* ① 调色板等保持不变 */
const palette = { mode: 'light' as const, primary: { main: '#2962ff' }, secondary: { main: '#ff6d00' }, error: { main: red.A400 } }
const typography = { fontFamily: `'Roboto','Noto Sans SC','PingFang SC',sans-serif` }
const shape = { borderRadius: 12 }
const spacing = 4

/* ② 直接在 createTheme 里写 components，避免独立变量类型不匹配 */
const theme = createTheme({
    palette,
    typography,
    shape,
    spacing,

    /** ---------------- MUI 组件默认样式覆盖 ---------------- */
    components: {
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
    },
})

export default theme

/* --- 以下 MD3 字体变体的 module augmentation 保持原样 --- */
import '@mui/material/styles'
declare module '@mui/material/styles' {
    interface TypographyVariants {
        headlineMedium: React.CSSProperties
        titleLarge: React.CSSProperties
        titleMedium: React.CSSProperties
    }
    interface TypographyVariantsOptions {
        headlineMedium?: React.CSSProperties
        titleLarge?: React.CSSProperties
        titleMedium?: React.CSSProperties
    }
}
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        headlineMedium: true
        titleLarge: true
        titleMedium: true
    }
}
