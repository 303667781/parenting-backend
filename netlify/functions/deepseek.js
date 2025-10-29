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
      
      // 场景提示词
      const scenePrompts = {
        homework: "你是亲子沟通专家，擅长作业辅导场景。请提供专业、实用的沟通建议。",
        emotion: "你是亲子沟通专家，擅长情绪管理场景。请帮助家长理解孩子情绪。",
        discipline: "你是亲子沟通专家，擅长行为规范场景。请帮助设定合理界限。",
        screen: "你是亲子沟通专家，擅长屏幕时间管理场景。请帮助平衡数字生活。",
        friend: "你是亲子沟通专家，擅长朋友关系场景。请帮助处理同伴关系。",
        school: "你是亲子沟通专家，擅长学校生活场景。请帮助应对学业压力。"
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
