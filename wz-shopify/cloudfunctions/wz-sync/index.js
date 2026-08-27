/**
 * 丸子の工作宝宝 · 云同步 & AI 代理云函数
 * 集合：wz-data（wz- 前缀）
 * 部署：CloudBase 环境（与工作台同环境）
 */
const cloud = require('@cloudbase/node-sdk');
const app = cloud.init({ env: cloud.SYMBOL_CURRENT_ENV });
const db = app.database();

// 火山引擎 AI 配置（密钥存云函数环境变量 ARK_API_KEY）
function callAI(prompt, system) {
  return new Promise((resolve, reject) => {
    const https = require('https');
    const key = process.env.ARK_API_KEY;
    if (!key) { reject(new Error('未配置 ARK_API_KEY')); return; }
    const messages = [];
    if (system) messages.push({ role: 'system', content: system });
    messages.push({ role: 'user', content: prompt });
    const body = JSON.stringify({
      model: process.env.ARK_MODEL || 'ep-20260826192546-9p6vt',
      messages,
      temperature: 0.7,
      max_tokens: 800,
      thinking: { type: 'disabled' }
    });
    const options = {
      hostname: 'ark.cn-beijing.volces.com', port: 443, path: '/api/v3/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'Content-Length': Buffer.byteLength(body)
      },
      timeout: 45000
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        try {
          const p = JSON.parse(data);
          if (p.choices && p.choices[0] && p.choices[0].message) resolve(p.choices[0].message.content.trim());
          else reject(new Error(p.error ? p.error.message : 'AI 返回异常'));
        } catch (e) { reject(new Error('响应解析失败: ' + e.message)); }
      });
    });
    req.on('error', (e) => reject(new Error('AI 请求失败: ' + e.message)));
    req.on('timeout', () => { req.destroy(); reject(new Error('AI 请求超时')); });
    req.write(body);
    req.end();
  });
}

exports.main = async (event) => {
  const { action } = event || {};
  // uid：网页端匿名登录的 uid 或自定义用户标识（用于多设备数据隔离）
  let uid = event.uid || '';
  try {
    const ctx = cloud.getWXContext();
    if (!uid && ctx) uid = ctx.uid || ctx.OPENID || '';
  } catch (e) {}
  const docId = uid || 'main';

  try {
    // ===== get：拉取云端数据 =====
    if (action === 'get') {
      const res = await db.collection('wz-data').doc(docId).get().catch(() => ({ data: [] }));
      const rows = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);
      if (rows.length > 0 && rows[0].payload) return { code: 0, data: rows[0].payload };
      return { code: 0, data: null };
    }

    // ===== set：保存全量数据 =====
    if (action === 'set') {
      const { data } = event;
      if (!data) return { code: 400, msg: '缺少 data 参数' };
      await db.collection('wz-data').doc(docId).set({
        payload: data,
        updatedAt: Date.now()
      });
      return { code: 0, msg: 'ok', updatedAt: Date.now() };
    }

    // ===== ai：火山引擎 AI 代理 =====
    if (action === 'ai') {
      const { prompt, system } = event;
      if (!prompt) return { code: 400, msg: '缺少 prompt 参数' };
      const reply = await callAI(prompt, system || '');
      return { code: 0, reply };
    }

    return { code: 400, msg: '未知 action: ' + action };
  } catch (e) {
    console.error('wz-sync error:', e);
    return { code: 500, msg: e.message || '未知错误' };
  }
};
