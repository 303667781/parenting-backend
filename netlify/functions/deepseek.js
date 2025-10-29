// Netlify函数 - 绝对能工作版本
exports.handler = async (event, context) => {
  console.log('=== Netlify函数被调用 ===', event.httpMethod);
  
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  
  // 处理OPTIONS预检请求 - 立即返回
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }
  
  // 处理GET请求 - 立即返回
  if (event.httpMethod === 'GET') {
    const response = {
      status: 'success',
      message: '🎉 Netlify后端服务正常运行！',
      timestamp: new Date().toISOString(),
      platform: 'Netlify',
      region: process.env.AWS_REGION || 'unknown'
    };
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  }
  
  // 处理POST请求
  if (event.httpMethod === 'POST') {
    try {
      console.log('POST请求体:', event.body);
      
      const body = JSON.parse(event.body || '{}');
      const { message = '无消息', scene = 'general' } = body;
      
      // 立即返回成功响应
      const responseData = {
        success: true,
        reply: `✅ Netlify后端连接成功！\n\n您的消息："${message}"\n场景：${scene}\n\n这是通过Netlify部署的后端服务，国内访问更稳定！`,
        debug: {
          timestamp: new Date().toISOString(),
          platform: 'Netlify',
          messageLength: message.length,
          scene: scene,
          note: '这是测试响应，稍后配置DeepSeek API'
        }
      };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(responseData)
      };
      
    } catch (error) {
      console.error('处理错误:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          error: '处理失败: ' + error.message
        })
      };
    }
  }
  
  // 其他HTTP方法
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: '方法不允许: ' + event.httpMethod })
  };
};
