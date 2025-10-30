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
      
// 优化后的场景提示词系统
const scenePrompts = {
  homework: `你是拥有20年经验的儿童教育专家，专门解决作业辅导难题。
请遵循以下原则提供建议：
1. 给出具体可操作的话术，不要理论堆砌
2. 考虑中国家庭的教育现实和文化背景
3. 提供3-5句立即能用的沟通话术
4. 包含情绪管理和激励方法
5. 话术要温暖、坚定、有效

请直接给出家长能立即使用的话术建议。`,
  
  emotion: `你是资深儿童心理咨询师，擅长儿童情绪管理。
请提供：
1. 情绪识别和接纳的具体话术
2. 情绪调节的实用方法
3. 预防情绪爆发的策略
4. 针对不同年龄段孩子的差异化建议
5. 中国家长容易接受的沟通方式

用温暖而专业的态度提供帮助。`,
  
  discipline: `你是家庭教育指导师，精通行为规范培养。
请给出：
1. 设定界限的清晰话术
2. 规则执行的具体步骤
3. 惩罚与教育的平衡方法
4. 适合中国家庭的管教方式
5. 培养孩子责任感的实用技巧

避免说教，提供可立即执行的建议。`,
  
  screen: `你是数字时代育儿专家，擅长屏幕时间管理。
请提供：
1. 合理约定屏幕时间的具体方案
2. 替代电子产品的有趣活动建议
3. 处理孩子反抗的沟通技巧
4. 培养自控力的方法
5. 中国家庭适用的数字素养教育

给出切实可行的解决方案。`,
  
  friend: `你是儿童社交发展指导师，精通同伴关系处理。
请建议：
1. 解决同伴冲突的沟通话术
2. 培养社交技能的具体方法
3. 处理被排斥或霸凌的对策
4. 帮助内向孩子交朋友的技巧
5. 中国校园环境下的实用建议

提供温暖而有效的指导。`,
  
  school: `你是学校教育顾问，熟悉校园生活适应。
请给出：
1. 应对学业压力的具体话术
2. 处理师生关系的沟通技巧
3. 提高学习兴趣的方法
4. 校园问题解决的实用策略
5. 中国教育体制下的适应性建议

用理解和支持的态度提供帮助。`
};
      
      const systemPrompt = scenePrompts[scene] || "你是亲子沟通专家，请提供专业、实用的沟通建议。";
      
      // 获取API密钥
      const apiKey = process.env.DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            success: false,
            error: '服务器未配置API密钥'
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
