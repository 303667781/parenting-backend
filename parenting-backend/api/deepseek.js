// 修复版后端代码 - 确保能立即响应
module.exports = (req, res) => {
  console.log('🚀 收到请求:', req.method, new Date().toISOString());
  
  // 立即设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 立即处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    console.log('✅ 返回OPTIONS响应');
    return res.status(200).end();
  }
  
  // 处理GET请求 - 立即返回
  if (req.method === 'GET') {
    console.log('✅ 返回GET响应');
    return res.status(200).json({ 
      status: 'success', 
      message: '后端服务正常',
      timestamp: new Date().toISOString(),
      version: 'v4-修复版'
    });
  }
  
  // 处理POST请求
  if (req.method === 'POST') {
    console.log('📨 处理POST请求');
    
    try {
      let body = {};
      
      // 安全地解析请求体
      if (req.body) {
        body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      }
      
      const { message = '', scene = 'general' } = body;
      
      console.log('📝 收到数据:', { 
        message: message.substring(0, 30) + '...', 
        scene 
      });
      
      // 立即返回成功响应
      const responseData = {
        success: true,
        reply: `🎉 恭喜！后端连接成功！\n\n您的消息："${message}"\n场景：${scene}\n\n这是来自新域名 parenting-backend-one.vercel.app 的响应！`,
        debug: {
          timestamp: new Date().toISOString(),
          messageLength: message.length,
          scene: scene,
          backend: 'parenting-backend-one.vercel.app'
        }
      };
      
      console.log('✅ 返回POST响应');
      return res.status(200).json(responseData);
      
    } catch (error) {
      console.error('❌ POST处理错误:', error);
      return res.status(500).json({
        success: false,
        error: '请求解析失败: ' + error.message
      });
    }
  }
  
  // 其他HTTP方法
  res.status(405).json({ error: '方法不允许: ' + req.method });
};
