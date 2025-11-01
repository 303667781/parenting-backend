// 修复版后端代码 - 无重复变量声明
// 专业版提示词系统
const scenePrompts = {
    // 完整专业回复
    full: {
        homework: `你是拥有20年经验的儿童教育专家，请提供详细具体的作业辅导话术和实用建议。`,
        emotion: `你是拥有20年经验的儿童心理咨询师，请提供详细具体的情绪管理话术和实用建议。`,
        discipline: `你是拥有20年经验的家庭教育指导师，请提供详细具体的行为规范话术和实用建议。`,
        screen: `你是拥有20年经验的数字教育专家，请提供详细具体的屏幕时间管理话术和实用建议。`,
        friend: `你是拥有20年经验的儿童社交发展专家，请提供详细具体的同伴关系话术和实用建议。`,
        school: `你是拥有20年经验的学校教育顾问，请提供详细具体的校园生活话术和实用建议。`
    },
    // 原则性指导
    basic: {
        homework: `作为亲子沟通专家，我为您提供作业辅导的3个核心原则。如需详细话术请升级会员。`,
        emotion: `作为亲子沟通专家，我为您提供情绪管理的3个核心原则。如需详细话术请升级会员。`,
        discipline: `作为亲子沟通专家，我为您提供行为规范的3个核心原则。如需详细话术请升级会员。`,
        screen: `作为亲子沟通专家，我为您提供屏幕时间管理的3个核心原则。如需详细话术请升级会员。`,
        friend: `作为亲子沟通专家，我为您提供朋友关系处理的3个核心原则。如需详细话术请升级会员。`,
        school: `作为亲子沟通专家，我为您提供学校生活适应的3个核心原则。如需详细话术请升级会员。`
    }
};

module.exports = async (req, res) => {
    console.log('=== 收到请求 ===', req.method);
    
    // 设置CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // 处理OPTIONS预检
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // 处理GET请求
    if (req.method === 'GET') {
        return res.status(200).json({
            status: 'success',
            message: '后端服务正常运行！',
            timestamp: new Date().toISOString()
        });
    }
    
    // 处理POST请求
    if (req.method === 'POST') {
        try {
            // 解析请求体
            const requestBody = req.body;
            const message = requestBody.message;
            const scene = requestBody.scene;
            const userTypeFromRequest = requestBody.userType || 'free';
            const requireFullReply = requestBody.requireFullReply || false;
            
            console.log('处理请求:', { message, scene, userTypeFromRequest, requireFullReply });
            
            // 获取API密钥
            const apiKey = process.env.DEEPSEEK_API_KEY;
            if (!apiKey) {
                return res.status(500).json({
                    success: false,
                    error: '服务器配置错误：API密钥未设置'
                });
            }
            
            // 判断是否为付费用户
            const isPaidUser = userTypeFromRequest === 'premium';
            
            // 选择提示词
            let systemPrompt;
            if (isPaidUser) {
                // 会员始终获得完整回复
                systemPrompt = scenePrompts.full[scene] || scenePrompts.full.homework;
            } else {
                // 免费用户：根据requireFullReply决定回复类型
                if (requireFullReply) {
                    systemPrompt = scenePrompts.full[scene] || scenePrompts.full.homework;
                } else {
                    systemPrompt = scenePrompts.basic[scene] || scenePrompts.basic.homework;
                }
            }
            
            // 设置不同的token限制
            const maxTokensValue = (isPaidUser || requireFullReply) ? 1500 : 500;
            
            console.log('调用DeepSeek API:', { systemPrompt: systemPrompt.substring(0, 100) + '...' });
            
            // 调用DeepSeek API
            const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: `场景：${scene}，问题：${message}`
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: maxTokensValue
                })
            });
            
            if (!deepseekResponse.ok) {
                const errorText = await deepseekResponse.text();
                console.error('DeepSeek API错误:', deepseekResponse.status, errorText);
                throw new Error(`AI服务暂时不可用: ${deepseekResponse.status}`);
            }
            
            const data = await deepseekResponse.json();
            
            if (data.choices && data.choices.length > 0) {
                console.log('AI回复成功，长度:', data.choices[0].message.content.length);
                res.status(200).json({
                    success: true,
                    reply: data.choices[0].message.content
                });
            } else {
                throw new Error('AI返回数据格式异常');
            }
            
        } catch (error) {
            console.error('处理错误:', error);
            res.status(500).json({
                success: false,
                error: '服务暂时不可用: ' + error.message
            });
        }
    }
};
