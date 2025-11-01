// Netlify函数 - 完整版（包含DeepSeek AI）
exports.handler = async (event, context) => {
  console.log('=== Netlify函数被调用 ===', event.httpMethod);
  
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // 处理OPTIONS预检请求
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  
  // 处理GET请求
  if (event.httpMethod === 'GET') {
    const response = {
      status: 'success',
      message: '🎉 Netlify后端服务正常运行！',
      timestamp: new Date().toISOString(),
      platform: 'Netlify',
      hasAI: true
    };
    
    return { statusCode: 200, headers, body: JSON.stringify(response) };
  }
  
  // 处理POST请求
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}');
      const { message = '', scene = 'general' } = body;
      
// 免费版和付费版的提示词系统
const scenePrompts = {
  // 免费版提示词 - 原则性指导，限制输出
  free: {
    homework: `你是亲子沟通专家，请提供作业辅导的3个核心原则。
【回复要求】
1. 只给出3个基本原则框架
2. 每个原则不超过2句话
3. 不要提供具体话术例句
4. 保持理论性指导
5. 总回复长度不超过150字
6. 在回复末尾提示"升级会员获得详细话术"`,

    emotion: `你是亲子沟通专家，请提供情绪管理的核心原则。
【回复要求】
1. 只给出3个关键原则
2. 不要提供具体对话示例
3. 保持概括性指导
4. 每个原则简要说明
5. 总回复长度不超过150字
6. 在回复末尾提示"升级会员获得详细话术"`,

    discipline: `你是亲子沟通专家，请提供行为规范的指导原则。
【回复要求】
1. 只给出3个基本原则
2. 避免具体话术示例
3. 保持理论指导性
4. 总回复长度不超过150字
5. 在回复末尾提示"升级会员获得详细话术"`,

    screen: `你是亲子沟通专家，请提供屏幕时间管理的原则。
【回复要求】
1. 只给出3个核心原则
2. 不要具体操作步骤
3. 保持概括性建议
4. 总回复长度不超过150字
5. 在回复末尾提示"升级会员获得详细话术"`,

    friend: `你是亲子沟通专家，请提供朋友关系处理的原则。
【回复要求】
1. 只给出3个指导原则
2. 避免具体对话示例
3. 保持理论性建议
4. 总回复长度不超过150字
5. 在回复末尾提示"升级会员获得详细话术"`,

    school: `你是亲子沟通专家，请提供学校生活适应的原则。
【回复要求】
1. 只给出3个核心原则
2. 不要具体话术示例
3. 保持概括性指导
4. 总回复长度不超过150字
5. 在回复末尾提示"升级会员获得详细话术"`
  },

  // 付费版提示词 - 详细具体话术
  premium: {
    homework: `你是拥有20年经验的儿童教育专家，请提供具体可操作的沟通话术。
【回复要求】
1. 提供8-12句立即能用的具体话术
2. 包含开场白、过程中、结束时的完整对话
3. 针对不同孩子反应给出3种应对方案
4. 提供实际生活中的2个场景示例
5. 包含情绪管理和激励的具体方法
6. 回复要详细、实用、可操作`,

    emotion: `你是资深儿童心理咨询师，请提供详细的情绪管理话术。
【回复要求】
1. 提供10-15句具体话术
2. 包含情绪识别、接纳、调节的完整流程
3. 针对5种常见情绪给出差异化应对
4. 提供3个实际对话示例
5. 包含预防情绪爆发的具体策略
6. 回复要温暖、专业、实用`,

    discipline: `你是家庭教育指导师，请提供行为规范的具体话术。
【回复要求】
1. 提供8-10句设定界限的清晰话术
2. 包含规则执行的具体步骤
3. 针对3种常见行为问题给出解决方案
4. 提供奖励和惩罚的平衡方法
5. 包含培养责任感的具体技巧
6. 回复要具体、可执行`,

    screen: `你是数字时代育儿专家，请提供屏幕时间管理的具体方案。
【回复要求】
1. 提供10-12句具体沟通话术
2. 包含合理约定屏幕时间的3种方案
3. 提供5种替代电子产品的有趣活动
4. 包含处理孩子反抗的沟通技巧
5. 提供培养自控力的具体方法
6. 回复要详细、实用`,

    friend: `你是儿童社交发展指导师，请提供同伴关系处理的具体指导。
【回复要求】
1. 提供10-15句解决同伴冲突的沟通话术
2. 包含培养社交技能的5种具体方法
3. 提供处理被排斥或霸凌的3种对策
4. 包含帮助内向孩子交朋友的实用技巧
5. 提供3个实际校园场景的应对方案
6. 回复要温暖而有效`,

    school: `你是学校教育顾问，请提供校园生活适应的具体指导。
【回复要求】
1. 提供8-12句应对学业压力的具体话术
2. 包含处理师生关系的5种沟通技巧
3. 提供提高学习兴趣的3种方法
4. 包含校园问题解决的实用策略
5. 提供应对考试的2种心理调节方法
6. 回复要理解和支持`
  }
};
      
      // 根据用户类型选择提示词
const userType = body.userType || 'free'; // 默认为免费用户
const systemPrompt = scenePrompts[userType] && scenePrompts[userType][scene] 
  ? scenePrompts[userType][scene] 
  : scenePrompts.free[scene] || "你是亲子沟通专家，请提供专业建议。";

// 设置不同的token限制
const maxTokens = userType === 'premium' ? 2000 : 800;
      
      // 获取API密钥
      const apiKey = process.env.DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        return {
          statusCode: 500,
          headers,
body: JSON.stringify({
  model: "deepseek-chat",
  messages: [
    {
      role: "system",
      content: systemPrompt
    },
    {
      role: "user",
      content: message
    }
  ],
  temperature: 0.7,
  max_tokens: maxTokens  // 使用动态token限制
})
        };
      }
      
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
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 800
        })
      });
      
      if (!deepseekResponse.ok) {
        throw new Error(`DeepSeek API错误: ${deepseekResponse.status}`);
      }
      
      const data = await deepseekResponse.json();
      
      if (data.choices && data.choices.length > 0) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            reply: data.choices[0].message.content
          })
        };
      } else {
        throw new Error('AI返回数据异常');
      }
      
    } catch (error) {
      console.error('处理错误:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: '服务暂时不可用: ' + error.message
        })
      };
    }
  }
  
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: '方法不允许' })
  };
};
