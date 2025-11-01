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
// 专业版提示词系统 - 20年育儿专家角度
const scenePrompts = {
    // 完整专业回复 - 20年专家角度
    full: {
        homework: `你是拥有20年经验的儿童教育专家，专精作业辅导和学习习惯培养。
请以资深专家的身份，从以下维度提供专业建议：

【具体话术指导】
提供8-12句立即能用的沟通话术，涵盖：
1. 作业开始前的激励话术
2. 遇到困难时的鼓励话术  
3. 分心时的引导话术
4. 完成后的肯定话术

【场景应对方案】
针对不同情况提供具体应对：
• 孩子抗拒写作业时
• 作业难度过大时
• 注意力不集中时
• 完成质量不高时

【专业技巧分享】
基于20年经验分享：
1. 时间管理的实用方法
2. 学习兴趣的培养策略
3. 自主学习的引导技巧

请用温暖而专业的态度，给出具体可操作的建议。`,

        emotion: `你是拥有20年经验的儿童心理咨询师，专精儿童情绪管理。
请以资深专家的身份，从以下维度提供专业建议：

【情绪识别与接纳】
提供具体话术帮助家长：
1. 准确识别孩子情绪的表述
2. 情绪接纳和理解的沟通方式
3. 情绪命名的技巧

【情绪调节指导】
针对不同情绪提供：
1. 愤怒情绪的安抚话术
2. 悲伤情绪的安慰话术  
3. 焦虑情绪的缓解话术
4. 挫折情绪的鼓励话术

【情绪教育策略】
基于20年经验分享：
1. 情绪表达能力的培养
2. 情绪自我调节的训练
3. 情绪智力的发展方法

请用共情而专业的态度，给出具体可操作的建议。`,

        discipline: `你是拥有20年经验的家庭教育指导师，专精儿童行为规范培养。
请以资深专家的身份，从以下维度提供专业建议：

【界限设定话术】
提供具体话术帮助家长：
1. 规则制定的沟通方式
2. 界限维护的坚定话术
3. 后果说明的恰当表述

【行为引导策略】
针对不同行为问题：
1. 顶嘴反抗的应对话术
2. 不守规则的引导话术
3. 责任培养的激励话术

【管教平衡技巧】
基于20年经验分享：
1. 惩罚与教育的平衡点
2. 自主性与规矩的结合
3. 长期习惯的培养方法

请用坚定而温暖的态度，给出具体可操作的建议。`,

        screen: `你是拥有20年经验的数字教育专家，专精儿童屏幕时间管理。
请以资深专家的身份，从以下维度提供专业建议：

【时间约定话术】
提供具体话术帮助家长：
1. 屏幕时间约定的沟通
2. 使用规则制定的表述
3. 违约处理的恰当方式

【替代活动建议】
提供丰富的替代选择：
1. 户外活动的引导话术
2. 亲子游戏的邀请话术
3. 兴趣培养的激励话术

【数字素养教育】
基于20年经验分享：
1. 健康使用习惯的培养
2. 网络安全的教导方法
3. 信息筛选的指导技巧

请用理解而坚定的态度，给出具体可操作的建议。`,

        friend: `你是拥有20年经验的儿童社交发展专家，专精同伴关系处理。
请以资深专家的身份，从以下维度提供专业建议：

【冲突解决话术】
提供具体话术帮助家长：
1. 同伴矛盾的调解话术
2. 被排斥时的安慰话术
3. 分享合作的引导话术

【社交技能培养】
针对不同社交情境：
1. 交友技巧的教导话术
2. 同理心培养的沟通
3. 团队合作的引导话术

【情感支持策略】
基于20年经验分享：
1. 社交焦虑的缓解方法
2. 自信建立的鼓励话术
3. 人际关系指导技巧

请用温暖而专业的态度，给出具体可操作的建议。`,

        school: `你是拥有20年经验的学校教育顾问，专精校园生活适应。
请以资深专家的身份，从以下维度提供专业建议：

【学业压力管理】
提供具体话术帮助家长：
1. 学习压力的缓解话术
2. 考试焦虑的安慰话术
3. 成绩波动的引导话术

【师生关系处理】
针对校园人际关系：
1. 与老师沟通的技巧话术
2. 同学相处的指导话术
3. 校园适应的支持话术

【学习动力培养】
基于20年经验分享：
1. 学习兴趣的激发方法
2. 目标设定的引导技巧
3. 自主学习培养策略

请用支持而专业的态度，给出具体可操作的建议。`
    },

    // 原则性指导 - 简要版
    basic: {
        homework: `作为亲子沟通专家，我为您提供作业辅导的3个核心原则：
1. 建立固定的作业时间和环境
2. 分解任务，及时给予正面反馈  
3. 关注过程而非结果，培养学习兴趣

如需详细话术和具体场景应对，请升级会员获得完整指导。`,

        emotion: `作为亲子沟通专家，我为您提供情绪管理的3个核心原则：
1. 接纳并命名孩子的情绪
2. 提供安全的情绪表达空间
3. 教导适当的情绪调节方法

如需详细话术和具体场景应对，请升级会员获得完整指导。`,

        discipline: `作为亲子沟通专家，我为您提供行为规范的3个核心原则：
1. 设定清晰一致的规则界限
2. 用积极语言引导正确行为
3. 给予适当的选择权和自主空间

如需详细话术和具体场景应对，请升级会员获得完整指导。`,

        screen: `作为亲子沟通专家，我为您提供屏幕时间管理的3个核心原则：
1. 约定明确的屏幕使用时间
2. 提供丰富的替代活动选择
3. 以身作则，建立家庭数字规范

如需详细话术和具体场景应对，请升级会员获得完整指导。`,

        friend: `作为亲子沟通专家，我为您提供朋友关系处理的3个核心原则：
1. 教导基本的社交礼仪和技巧
2. 帮助理解他人感受和观点
3. 提供解决冲突的指导框架

如需详细话术和具体场景应对，请升级会员获得完整指导。`,

        school: `作为亲子沟通专家，我为您提供学校生活适应的3个核心原则：
1. 建立规律的作息和学习习惯
2. 保持与老师的积极沟通
3. 提供情感支持和压力管理

如需详细话术和具体场景应对，请升级会员获得完整指导。`
    }
};
      
      // 根据用户类型选择提示词
const userType = body.userType || 'free'; // 默认为免费用户
// 根据用户类型和场景使用情况选择提示词
const userType = body.userType || 'free';
const scene = body.scene;
const requireFullReply = body.requireFullReply || false;

// 判断是否为付费用户
const isPaidUser = userType === 'premium';

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
const maxTokens = (isPaidUser || requireFullReply) ? 2000 : 500;

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
          max_tokens: maxTokens
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
