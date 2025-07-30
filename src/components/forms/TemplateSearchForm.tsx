/**
 * 文件名: src/components/forms/TemplateSearchForm.tsx
 *
 * 文件功能描述:
 * 此文件定义了一个【模板搜索表单】组件（TemplateSearchForm）。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {useState, type JSX} from 'react';
import {Box, TextField, Button, Stack, Typography} from '@mui/material';

export interface TemplateSearchValues {
    fieldName1: string;
    fieldName2: string;
}

interface TemplateSearchFormProps {
    onSearch: (values: TemplateSearchValues) => void;
    onReset?: () => void;
}

// 【核心修改】移除 React.FC，使用现代写法
const TemplateSearchForm = ({onSearch, onReset}: TemplateSearchFormProps): JSX.Element => {
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
                            borderColor: 'neutral.main',
                            color: 'neutral.main',
                            '&:hover': {
                                bgcolor: 'custom.hoverOpacity',
                                borderColor: 'neutral.main',
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
                        bgcolor: 'neutral.main',
                        color: 'neutral.contrastText',
                        boxShadow: 'none',
                        '&:hover': {
                            bgcolor: 'neutral.dark',
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