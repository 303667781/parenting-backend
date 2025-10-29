// 超级简化版本 - 确保立即响应
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  console.log('=== 请求开始 ===', new Date().toISOString());
  
  // 立即设置响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 立即处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    console.log('立即返回OPTIONS');
    return res.status(200).end();
  }
  
  // 立即处理GET请求
  if (req.method === 'GET') {
    console.log('立即返回GET响应');
    return res.status(200).json({ 
      message: '只支持POST请求',
      status: '服务正常',
      timestamp: new Date().toISOString()
    });
  }
  
  // 对于POST请求，设置超时保护
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), 10000); // 10秒超时
  });
  
  try {
    console.log('开始处理POST请求');
    
    // 快速解析请求体
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { message, scene } = body || {};
    
    console.log('收到数据:', { message: message?.substring(0, 50), scene });
    
    // 立即返回测试响应，不调用任何外部API
    const response = {
      success: true,
      reply: `✅ 后端连接成功！收到消息："${message}"，场景：${scene}`,
      debug: {
        timestamp: new Date().toISOString(),
        messageLength: message?.length || 0,
        scene: scene,
        version: 'v2-即时响应'
      }
    };
    
    console.log('立即返回响应:', response);
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('处理错误:', error);
    
    // 确保错误也立即返回
    res.status(500).json({
      success: false,
      error: '处理失败: ' + error.message,
      timestamp: new Date().toISOString()
    });
  }
};