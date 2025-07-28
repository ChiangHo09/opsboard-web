/**
 * 文件名：TemplateSearchForm.tsx
 * 描述：此文件定义了一个【模板搜索表单】组件（TemplateSearchForm）。
 *
 * 本次修改：
 * - 【核心简化】移除了本地的 `textFieldSx` 样式对象。因为相关的焦点样式（边框和标签颜色）现在已通过 `theme.ts` 在全局统一配置，不再需要局部覆盖。
 * - 【颜色常量化】更新了底部操作按钮的样式，使其颜色值从硬编码改为引用自全局主题（`theme.palette`），以实现颜色的统一管理。
 */
import {useState, type FC} from 'react';
import {Box, TextField, Button, Stack, Typography} from '@mui/material';

export interface TemplateSearchValues {
    fieldName1: string;
    fieldName2: string;
}

interface TemplateSearchFormProps {
    onSearch: (values: TemplateSearchValues) => void;
    onReset?: () => void;
}

const TemplateSearchForm: FC<TemplateSearchFormProps> = ({onSearch, onReset}) => {
    const [fieldName1, setFieldName1] = useState('');
    const [fieldName2, setFieldName2] = useState('');

    const handleSearchClick = () => {
        onSearch({
            fieldName1: fieldName1,
            fieldName2: fieldName2
        });
    };

    const handleResetClick = () => {
        setFieldName1('');
        setFieldName2('');
        if (onReset) {
            onReset();
        }
    };

    // 【移除】不再需要本地的 textFieldSx，样式已在 theme.ts 中全局定义

    return (
        <Stack spacing={2} sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <Box sx={{flexGrow: 1, overflowY: 'auto', pr: 1, mr: -1}}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="示例字段 1"
                    variant="outlined"
                    value={fieldName1}
                    onChange={(e) => setFieldName1(e.target.value)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="示例字段 2"
                    variant="outlined"
                    value={fieldName2}
                    onChange={(e) => setFieldName2(e.target.value)}
                />
            </Box>

            <Stack direction="row" spacing={2} sx={{justifyContent: 'center', flexShrink: 0}}>
                {onReset && (
                    <Button
                        variant="outlined"
                        onClick={handleResetClick}
                        fullWidth
                        sx={{
                            height: 48,
                            borderRadius: 99,
                            borderColor: 'neutral.main', // 使用主题颜色
                            color: 'neutral.main',       // 使用主题颜色
                            '&:hover': {
                                bgcolor: 'custom.hoverOpacity', // 使用主题颜色
                                borderColor: 'neutral.main',    // 使用主题颜色
                            }
                        }}
                    >
                        <Typography component="span" sx={{transform: 'translateY(1px)', fontWeight: 500}}>
                            重置
                        </Typography>
                    </Button>
                )}
                <Button
                    variant="contained"
                    onClick={handleSearchClick}
                    fullWidth
                    sx={{
                        height: 48,
                        borderRadius: 99,
                        bgcolor: 'neutral.main',        // 使用主题颜色
                        color: 'neutral.contrastText',  // 使用主题颜色
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: 'neutral.dark',    // 使用主题颜色
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

export default TemplateSearchForm;