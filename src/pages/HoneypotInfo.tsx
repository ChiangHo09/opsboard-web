/*
 *  src/pages/HoneypotInfo.tsx
 *  - 作为一个独立的组件，提供“蜜罐+时间戳”验证机制的展示内容
 */
import {Box, Typography, Divider} from '@mui/material';

// CodeBlock 辅助组件与内容紧密相关，因此定义在这里
const CodeBlock = ({children}: { children: string }) => (
    <Box component="pre" sx={{
        bgcolor: '#f5f5f5', p: 2, borderRadius: 1, overflowX: 'auto',
        fontFamily: 'monospace', fontSize: '14px', whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
    }}>
        <code>{children}</code>
    </Box>
);

// 这是我们将要导出的内容组件
export default function HoneypotInfo() {
    return (
        // 使用一个 Fragment 或 Box 来包裹所有内容
        <Box>
            <Typography variant="subtitle1" color="text.secondary" sx={{mb: 2}}>
                本备忘录用于记录“蜜罐 (Honeypot)”与“时间戳 (Timestamp)”组合验证的原理和实现方式，以防止自动化脚本攻击。
            </Typography>

            <Typography variant="h6" gutterBottom>核心原理</Typography>
            <Typography paragraph>
                通过两种对真实用户无感知的方式，来识别并过滤掉绝大多数通用的自动化机器人，而无需依赖外部验证码服务。
            </Typography>

            <Divider sx={{my: 2}}/>

            <Typography variant="h6" sx={{mt: 2}}>1. 蜜罐 (Honeypot)</Typography>
            <Typography paragraph>
                在表单中添加一个对人类不可见的输入字段。人类用户不会填写它，但自动化机器人会。后端只需检查该字段是否有值，即可判断是否为机器人。
            </Typography>
            <Typography variant="body2" sx={{mb: 1}}>前端实现 (HTML/JSX):</Typography>
            <CodeBlock>
                {`
<form action="/login" method="post">
    {/* ... 正常的用户名字段 ... */}
    {/* ... 正常的密码字段 ... */}

    {/* 蜜罐字段，使用 CSS 对用户隐藏 */}
    <div style={{ opacity:0, position:'absolute', top:'-9999px', left:'-9999px' }}>
        <label htmlFor="website">请勿填写此字段</label>
        <input 
            type="text" 
            id="website" 
            name="website" 
            tabIndex="-1" 
            autoComplete="off" 
        />
    </div>

    <button type="submit">登录</button>
</form>
`}
            </CodeBlock>

            <Divider sx={{my: 2}}/>

            <Typography variant="h6" sx={{mt: 2}}>2. 时间戳 (Timestamp)</Typography>
            <Typography paragraph>
                记录用户打开页面的时间，并在提交时与当前时间进行比较。机器人提交速度极快（毫秒级），而人类需要几秒钟。通过检查这个时间差，可以过滤掉机器人。
            </Typography>
            <Typography variant="body2" sx={{mb: 1}}>前端实现 (HTML/JSX):</Typography>
            <CodeBlock>
                {`
<form>
    {/* ... 其他字段 ... */}
    
    {/* 隐藏的时间戳字段，在页面加载时由服务器或客户端JS填充 */}
    <input 
        type="hidden" 
        name="form_load_timestamp" 
        value={Date.now()} 
    />
</form>
`}
            </CodeBlock>

            <Divider sx={{my: 2}}/>

            <Typography variant="h5" sx={{mt: 2}} fontWeight="500">后端组合验证逻辑</Typography>
            <Typography paragraph>
                在后端，我们将这两种检查结合起来，形成一个更强大的过滤器。
            </Typography>
            <Typography variant="body2" sx={{mb: 1}}>后端实现 (Node.js/Express 伪代码):</Typography>
            <CodeBlock>
                {`
app.post('/api/login', (req, res) => {
    const { website, form_load_timestamp } = req.body;

    // 1. 检查蜜罐字段是否有值
    if (website) {
        console.log('机器人行为检测: 蜜罐字段被填写。');
        return res.status(400).send('请求无效。');
    }

    // 2. 检查表单提交时间是否过快 (例如, 小于2秒)
    const submissionTime = Date.now();
    const timeDifference = submissionTime - parseInt(form_load_timestamp, 10);
    
    if (timeDifference < 2000) { // 2000 毫秒 = 2秒
        console.log(\`机器人行为检测: 表单提交过快 (\${timeDifference}ms)\`);
        return res.status(400).send('请求无效。');
    }

    // 如果通过所有检查，则继续处理登录逻辑
    console.log('验证通过，为人类用户。');
    // ... processLogin(req.body);
    res.status(200).send('登录成功！');
});
`}
            </CodeBlock>
        </Box>
    );
}