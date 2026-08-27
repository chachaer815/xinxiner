// ============================================================
// 变瘦变美 · 网页版（极简版：体重记录 + AI 分析）
// 数据：localStorage wz_beauty_v1 + 云同步 wz-sync（Supabase）
// ============================================================
(function () {
  'use strict';

  const LS_KEY = 'wz_beauty_v1';
  const SB_URL = 'https://omhtrpqdxdwbmwfdkgeg.supabase.co';
  const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9taHRycHFkeGR3Ym13ZmRrZ2VnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NTM4MTIsImV4cCI6MjA5NTQyOTgxMn0.N0jQCl0YoTH21nnrrVpn1nDRPVd4PPb5N9beRCTUx9s';

  let beauty = load();
  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
      return {
        weights: Array.isArray(raw.weights) ? raw.weights : [],
        goal: (raw.goal !== undefined && raw.goal !== null) ? Number(raw.goal) : null,
        height: (raw.height !== undefined && raw.height !== null) ? Number(raw.height) : null
      };
    } catch (e) { return { weights: [], goal: null, height: null }; }
  }
  function persist() {
    beauty.updatedAt = Date.now();
    localStorage.setItem(LS_KEY, JSON.stringify(beauty));
    scheduleCloudPush();
  }

  // ===== 云同步（Supabase wz-sync）=====
  function getUid() {
    let uid = localStorage.getItem(LS_KEY + ':uid');
    if (!uid) {
      uid = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      localStorage.setItem(LS_KEY + ':uid', uid);
    }
    return uid;
  }
  let pushTimer = null;
  function scheduleCloudPush() {
    clearTimeout(pushTimer);
    pushTimer = setTimeout(cloudPush, 3000);
  }
  async function cloudPush() {
    try {
      const res = await fetch(SB_URL + '/functions/v1/wz-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SB_ANON, 'apikey': SB_ANON },
        body: JSON.stringify({ action: 'set', uid: getUid(), scope: 'beauty', data: beauty })
      });
      return (await res.json()).code === 0;
    } catch (e) { console.warn('云端推送失败', e); return false; }
  }
  async function cloudPull() {
    try {
      const res = await fetch(SB_URL + '/functions/v1/wz-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SB_ANON, 'apikey': SB_ANON },
        body: JSON.stringify({ action: 'get', uid: getUid(), scope: 'beauty' })
      });
      const r = await res.json();
      if (r.code === 0 && r.data && Array.isArray(r.data.weights)) {
        if (!beauty.updatedAt || (r.data.updatedAt || 0) > beauty.updatedAt) {
          beauty = { weights: r.data.weights, updatedAt: r.data.updatedAt };
          localStorage.setItem(LS_KEY, JSON.stringify(beauty));
          return true;
        }
      }
      return false;
    } catch (e) { console.warn('云端拉取失败', e); return false; }
  }

  // ===== AI（云端代理 wz-sync · 前端零密钥）=====
  async function aiChat(prompt, system) {
    const res = await fetch(SB_URL + '/functions/v1/wz-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SB_ANON, 'apikey': SB_ANON },
      body: JSON.stringify({ action: 'ai', prompt, system })
    });
    const data = await res.json();
    if (res.ok && data.code === 0 && data.reply) return data.reply;
    throw new Error(data.msg || ('AI 返回异常 ' + res.status));
  }

  // ===== 工具 =====
  function pad2(n) { return String(n).padStart(2, '0'); }
  function dstr(d) { return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function toast(msg) {
    const t = document.getElementById('toast');
    if (t) { t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2000); }
  }
  function confirmModal(title, content, onOk) {
    if (window.confirm(title + '\n' + content)) onOk();
  }

  const ST = { weightInput: '' };

  // ===== 渲染 =====
  function render() {
    const body = document.getElementById('panel-beauty');
    if (!body) return;
    const root = body.querySelector('.home-page-root') || body;
    const weights = (beauty.weights || []).slice().sort((a, b) => a.date.localeCompare(b.date));
    const chart = lineChartSvg(weights.slice(-14), '#ff9ec4');
    let stats = '';
    if (weights.length >= 2) {
      const avg = weights.reduce((s, w) => s + w.value, 0) / weights.length;
      stats = '<div class="b-stats">' +
        '<div class="b-stat"><div class="v">' + Math.min(...weights.map(w => w.value)).toFixed(1) + '</div><div class="k">最低 kg</div></div>' +
        '<div class="b-stat"><div class="v">' + avg.toFixed(1) + '</div><div class="k">平均 kg</div></div>' +
        '<div class="b-stat"><div class="v">' + weights.length + '</div><div class="k">记录次数</div></div></div>';
    }
    // BMI 计算
    const goal = beauty.goal;
    const height = beauty.height;
    const goalSet = goal !== null && goal !== undefined;
    let bmiText = '—';
    if (height && weights.length) {
      const lastW = weights[weights.length - 1];
      if (lastW && lastW.value) bmiText = (lastW.value / ((height / 100) * (height / 100))).toFixed(1);
    }
    const todayW = weights.find(w => w.date === dstr(new Date()));
    const todayWeightText = todayW ? Number(todayW.value).toFixed(1) : '—';
    const goalText = (goal !== null && goal !== undefined) ? Number(goal).toFixed(1) : '—';

    root.innerHTML =
      '<div class="card b-card">' +
      '  <div class="b-card-title"><img class="b-ct-icon" src="assets/wm-target.svg"><text>目标体重</text></div>' +
      '  <div class="b-row b-gap">' +
      '    <div class="stat-mini b-flex"><div class="v">' + esc(goalText) + '</div><div class="k">目标 (kg)</div></div>' +
      '    <div class="stat-mini b-flex"><div class="v">' + esc(todayWeightText) + '</div><div class="k">今日体重 (kg)</div></div>' +
      '    <div class="stat-mini b-flex"><div class="v">' + esc(bmiText) + '</div><div class="k">BMI</div></div>' +
      '  </div>' +
      '  <div class="b-row" style="margin-top:12px">' +
      '    <div class="b-btn-sm b-primary" data-act="setGoal"><text>' + (goal !== null ? '修改目标' : '设定目标') + '</text></div>' +
      (height ? '' : '<div class="b-btn-sm b-sky" data-act="setHeight"><text>输入身高</text></div>') +
      '    <div class="b-btn-sm b-ghost" data-act="aiAdvice"><text>✨ AI 建议</text></div>' +
      '  </div>' +
      '  <div id="aiAdviceBox" class="ai-result" style="display:none"></div>' +
      '</div>' +
      '<div class="card b-card">' +
      '  <div class="b-card-title"><img class="b-ct-icon" src="assets/wm-scale.svg"><text>体重记录</text></div>' +
      '  <div class="b-row b-mb">' +
      '    <input class="inp b-flex" type="number" step="0.1" placeholder="输入体重 (kg)" id="weightInput" value="' + esc(ST.weightInput) + '">' +
      '    <div class="b-btn-sm b-primary" data-act="recordWeight">记一笔</div>' +
      '  </div>' +
      chart + stats +

      '  <div class="b-item-list" style="margin-top:10px">' +
      (weights.length ?
        weights.slice().reverse().map(w =>
          '<div class="b-item"><text class="b-txt">' + esc(w.date) + '</text>' +
          '<text class="b-tag">' + w.value.toFixed(1) + ' kg</text>' +
          '<div class="b-icon-btn" data-act="delWeight" data-date="' + w.date + '"><img class="b-icon-img" src="assets/wm-trash.svg"></div></div>').join('')
        : '<div class="b-empty"><img class="b-empty-img" src="assets/wm-scale.svg"><text>还没有体重记录</text></div>') +
      '  </div>' +
      '</div>';
    bind(root);
  }

  function lineChartSvg(data, color) {
    if (!data || data.length < 2) return '<div class="b-hint" style="text-align:center;padding:10px;">记录 2 次以上显示趋势图</div>';
    const W = 320, H = 140, P = 24;
    const vals = data.map(d => d.value);
    const min = Math.min(...vals) - 0.5, max = Math.max(...vals) + 0.5;
    const span = (max - min) || 1;
    const pts = data.map((d, i) => [
      P + (i / (data.length - 1)) * (W - P * 2),
      H - P - ((d.value - min) / span) * (H - P * 2)
    ]);
    const path = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const grid = [0, 0.5, 1].map(r => '<line x1="' + P + '" y1="' + (P + r * (H - P * 2)).toFixed(1) + '" x2="' + (W - P) + '" y2="' + (P + r * (H - P * 2)).toFixed(1) + '" stroke="#eee6da" stroke-width="1" stroke-dasharray="3 3"/>').join('');
    const dots = pts.map(p => '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3" fill="#fff" stroke="' + color + '" stroke-width="2"/>').join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;background:#fffdf8;border:1px dashed #eee6da;border-radius:12px;">' + grid +
      '<path d="' + path + '" fill="none" stroke="' + color + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' + dots + '</svg>';
  }

  function bind(root) {
    root.querySelectorAll('[data-act]').forEach(node => {
      node.addEventListener('click', e => {
        const act = node.dataset.act;
        if (act === 'recordWeight') return ACTIONS.recordWeight();
        if (act === 'delWeight') return ACTIONS.delWeight(node.dataset.date);
      });
    });
    const inp = root.querySelector('#weightInput');
    if (inp) {
      inp.addEventListener('input', () => { ST.weightInput = inp.value; });
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') ACTIONS.recordWeight(); });
    }
  }

  const ACTIONS = {
    setGoal() {
      const v = window.prompt('设定目标体重 (kg)：', beauty.goal ? String(beauty.goal) : '');
      if (v === null) return;
      const n = parseFloat(v);
      if (isNaN(n) || n <= 0) { toast('请输入有效数字'); return; }
      beauty.goal = Math.round(n * 10) / 10;
      persist(); render();
      toast('目标已更新');
    },
    setHeight() {
      const v = window.prompt('输入身高 (cm)：', beauty.height ? String(beauty.height) : '');
      if (v === null) return;
      const n = parseFloat(v);
      if (isNaN(n) || n <= 0) { toast('请输入有效数字'); return; }
      beauty.height = Math.round(n);
      persist(); render();
      toast('身高已保存');
    },
    async aiAdvice() {
      const box = document.getElementById('aiAdviceBox');
      if (!box) return;
      if (box.style.display !== 'none') { box.style.display = 'none'; return; }
      box.style.display = 'block';
      box.innerHTML = '<span class="ai-spin"></span> AI 正在分析…';
      const weights = (beauty.weights || []).slice(-14);
      if (!weights.length) { box.innerHTML = '先记一笔体重，AI 就能给你建议啦'; return; }
      const list = weights.map(w => w.date.slice(5) + ' ' + w.value + 'kg').join('、');
      const latest = weights[weights.length - 1];
      const first = weights[0];
      const diff = (latest.value - first.value).toFixed(1);
      const parts = ['最近体重记录：' + list, '最新体重 ' + latest.value + 'kg（这段时间' + (diff > 0 ? '涨了' : diff < 0 ? '降了' : '持平') + ' ' + Math.abs(diff) + 'kg）'];
      if (beauty.goal) parts.push('我的目标 ' + beauty.goal + 'kg（还差 ' + Math.max(0, latest.value - beauty.goal).toFixed(1) + 'kg）');
      if (beauty.height) parts.push('身高 ' + beauty.height + 'cm');
      try {
        const reply = await aiChat(
          parts.join('；') + '。请结合我的目标和体重变化，给我 80 字内建议：一句趋势点评 + 1-2 条具体行动。闺蜜语气。',
          '你是温柔的闺蜜健康教练，语气可爱不说教，只说重点。'
        );
        box.innerHTML = reply.replace(/\n/g, '<br>');
      } catch (e) {
        box.innerHTML = 'AI 暂时连不上：' + esc(e.message);
      }
    },
    recordWeight() {
      const v = parseFloat(ST.weightInput);
      if (isNaN(v) || v <= 0) { toast('请输入有效的体重'); return; }
      const ds = dstr(new Date());
      const idx = (beauty.weights || []).findIndex(w => w.date === ds);
      if (idx >= 0) beauty.weights[idx].value = Math.round(v * 10) / 10;
      else beauty.weights.push({ date: ds, value: Math.round(v * 10) / 10 });
      ST.weightInput = '';
      persist(); render();
      toast('体重已记录');
    },
    delWeight(date) {
      confirmModal('删除记录', '确定删除 ' + date + ' 的体重记录吗？', () => {
        beauty.weights = (beauty.weights || []).filter(w => w.date !== date);
        persist(); render();
        toast('已删除');
      });
    },
  };

  // ===== 启动 =====
  (async () => {
    const pulled = await cloudPull();
    render();
    if (pulled) toast('已从云端恢复数据');
  })();

  window.BeautyPage = { render };
})();
