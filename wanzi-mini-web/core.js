// ============================================================
// 丸子の小家 · 网页版复刻 - 全局数据层 + 图标系统
// 原版：wanzi-mini 微信小程序（完完全全复刻）
// ============================================================
(function () {
  'use strict';

  // ===== 图标系统（内联 SVG，与小程序版一致） =====
  const ICON_CACHE = {};
  function icon(name) {
    if (ICON_CACHE[name]) return ICON_CACHE[name];
    // 从 icons/ 目录加载 SVG 文件（同目录部署）
    ICON_CACHE[name] = 'icons/' + name + '.svg';
    return ICON_CACHE[name];
  }

  // ===== 数据层（localStorage 替代 wx.setStorageSync） =====
  const LS_KEY = '***';
  const WEEK_CN = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  const DEFAULT_CARES = [
    { id: 'care_water', name: '喝水 8 杯', icon: 'drop' },
    { id: 'care_sunscreen', name: '涂防晒', icon: 'sun' },
    { id: 'care_skincare', name: '护肤步骤', icon: 'flower' },
    { id: 'care_exercise', name: '运动 30 分钟', icon: 'target' },
    { id: 'care_sleep', name: '11 点前睡', icon: 'moon' },
  ];
  const HEALTH_TAGS = ['头痛', '头晕', '胃痛', '胃胀', '感冒', '鼻塞', '喉咙痛', '肩颈痛', '腰痛', '失眠', '长痘', '痛经', '心慌', '乏力'];

  function defaultStore() {
    return {
      v: 2, deskName: '丸子の小家', navNames: {}, checkins: [], updatedAt: 0,
      reminderList: '丸子计划',
      plans: {},
      beauty: { goal: null, cares: DEFAULT_CARES.map(c => ({ ...c })), weights: [], daily: {}, period: { logs: [] }, height: null, waterGoal: 8 },
      food: {},
      knowledge: [],
      status: {},
      projects: [], travel: [], tips: [], yearly: [],
      assets: { accounts: [{ id: 'acc_cash', name: '现金', kind: 'cash', balance: 0 }], txs: [] },
      cloud: { url: '', key: '', on: false, last: 0 },
      ai: { key: '', model: 'deepseek-chat', dailyOn: true },
      quotes: {}, pomodoro: {}, countdowns: [], budget: { amount: 0 }, healthProfile: [],
      chartPref: { sleepRange: 14, sleepType: 'bar', energyRange: 14, energyType: 'line' },
      insights: {},
      theme: 'sakura'
    };
  }

  function migrate(s) {
    const base = defaultStore();
    s = Object.assign(base, s || {});
    if (!s.beauty || !Array.isArray(s.beauty.cares)) {
      const old = s.beauty || {};
      s.beauty = { goal: null, cares: DEFAULT_CARES.map(c => ({ ...c })), weights: old.weights || [], daily: old.daily || {}, period: { logs: [] } };
    }
    if (!s.beauty.period) s.beauty.period = { logs: [] };
    if (s.beauty.goal === undefined) s.beauty.goal = null;
    if (!s.assets || !s.assets.accounts || !s.assets.accounts.length) s.assets = { accounts: [{ id: 'acc_cash', name: '现金', kind: 'cash', balance: 0 }], txs: [] };
    if (!s.cloud) s.cloud = { url: '', key: '', on: false, last: 0 };
    if (!s.ai) s.ai = { key: '', model: 'deepseek-chat', dailyOn: true };
    if (!s.countdowns) s.countdowns = [];
    if (!s.budget) s.budget = { amount: 0 };
    if (!s.healthProfile) s.healthProfile = [];
    if (!s.chartPref) s.chartPref = { sleepRange: 14, sleepType: 'bar', energyRange: 14, energyType: 'line' };
    if (s.beauty.height === undefined) s.beauty.height = null;
    if (!s.beauty.waterGoal) s.beauty.waterGoal = 8;
    s.v = 2;
    return s;
  }

  let store = null;
  function loadStore() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      store = migrate(raw ? JSON.parse(raw) : defaultStore());
    } catch (e) {
      store = migrate(defaultStore());
    }
    localStorage.setItem(LS_KEY, JSON.stringify(store));
    return store;
  }
  function save() {
    if (!store) return;
    store.updatedAt = Date.now();
    localStorage.setItem(LS_KEY, JSON.stringify(store));
  }
  function getStore() { return store; }

  // ===== 工具函数 =====
  function pad2(n) { return String(n).padStart(2, '0'); }
  function dstr(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function todayStr() { return dstr(new Date()); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // ===== Toast =====
  function toast(msg) {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('show'), 2000);
  }

  function confirm(title, content, onOk) {
    const box = document.getElementById('modalConfirm');
    if (!box) { if (window.confirm(content)) onOk(); return; }
    box.querySelector('.mc-title').textContent = title;
    box.querySelector('.mc-content').textContent = content;
    box.classList.add('show');
    const ok = box.querySelector('.mc-ok');
    const cancel = box.querySelector('.mc-cancel');
    const close = () => box.classList.remove('show');
    ok.onclick = () => { close(); onOk(); };
    cancel.onclick = close;
    box.addEventListener('click', e => { if (e.target === box) close(); });
  }

  // ===== AI 调用（火山引擎接入点） =====
  async function aiAsk(prompt, system) {
    const s = store;
    if (!s.ai || !s.ai.key) throw new Error('请先在设置里填入 API Key');
    const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + s.ai.key },
      body: JSON.stringify({
        model: s.ai.model || 'ep-20260826192546-9p6vt',
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
        thinking: { type: 'disabled' }
      })
    });
    const data = await res.json();
    if (res.ok && data.choices && data.choices[0]) {
      return data.choices[0].message.content.trim();
    }
    throw new Error((data.error && data.error.message) || ('AI 返回异常 ' + res.status));
  }

  // ===== 主题 =====
  function applyTheme(name) {
    if (!['sakura', 'mint', 'lavender'].includes(name)) name = 'sakura';
    document.body.dataset.theme = name;
    store.theme = name;
    save();
  }

  // ===== 导出全局 =====
  window.HomeApp = {
    icon, loadStore, save, getStore, pad2, dstr, todayStr, esc, toast, confirm, aiAsk,
    applyTheme, DEFAULT_CARES, HEALTH_TAGS, WEEK_CN, LS_KEY
  };
})();
