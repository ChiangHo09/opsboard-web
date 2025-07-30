/**
 * 文件名: src/components/forms/TicketSearchForm.tsx
 *
 * 文件功能描述:
 * 此文件定义了【工单搜索表单】组件（TicketSearchForm）。
 *
 * 本次修改内容:
 * - 【组件写法现代化】移除了 `React.FC`，采用了现代的函数组件定义方式，
 *   并显式注解了 props 类型和 `: JSX.Element` 返回值类型。
 */
import {useState, type JSX} from 'react';
import {Box, TextField, Button, Stack, Typography, MenuItem} from '@mui/material';

export interface TicketSearchValues {
    region: string;
    customerName: string;
    status: string;
    category: string;
}

interface TicketSearchFormProps {
    onSearch: (values: TicketSearchValues) => void;
    onReset?: () => void;
}

// 【核心修改】移除 React.FC，使用现代写法
const TicketSearchForm = ({onSearch, onReset}: TicketSearchFormProps): JSX.Element => {
    const [region, setRegion] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');

    const handleSearchClick = () => {
        onSearch({
            region,
            customerName,
            status,
            category
        });
    };

    const handleResetClick = () => {
        setRegion('');
        setCustomerName('');
        setStatus('');
        setCategory('');
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
                    label="区域"
                    variant="outlined"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="客户名称"
                    variant="outlined"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />

                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="状态"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <MenuItem value="挂起">挂起</MenuItem>
                    <MenuItem value="就绪">就绪</MenuItem>
                </TextField>

                <TextField
                    fullWidth
                    select
                    margin="normal"
                    label="类别"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <MenuItem value="更新">更新</MenuItem>
                    <MenuItem value="备份">备份</MenuItem>
                    <MenuItem value="巡检">巡检</MenuItem>
                </TextField>
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

export default TicketSearchForm;