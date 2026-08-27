// ============================================================
// 丸子の工作宝宝 - 工作台外壳（导航 / 拖拽排序 / 折叠 / 面板切换）
// 独立文件便于维护：发品看 publish.js，查询宝宝看 query.js
// ============================================================
(function () {
  'use strict';

  const NAV_KEY = 'wz_nav_order_v1';
  const FOLD_KEY = 'wz_query_fold_v1';

  let draggedItem = null;

  // ===== 面板切换 =====
  function showPanel(name) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + name);
    if (panel) panel.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const nav = document.querySelector('.nav-item[data-panel="' + name + '"]');
    if (nav) nav.classList.add('active');
    // 报价宝宝：隐藏面板里的 iframe 切到可见后需要强制重载才会渲染
    if (name === 'price') {
      const f = document.getElementById('priceFrame');
      if (f) {
        const src = f.getAttribute('data-src') || f.src;
        // 移除再重建，强制浏览器渲染
        const wrap = f.parentNode;
        const fresh = document.createElement('iframe');
        fresh.id = 'priceFrame';
        fresh.className = 'price-frame';
        fresh.title = '报价宝宝';
        fresh.setAttribute('data-src', src);
        fresh.src = src;
        wrap.replaceChild(fresh, f);
      }
    }
  }

  // ===== 查询宝宝：点击导航 = 全部收起/展开（目录模式） =====
  function toggleAllQueryBlocks() {
    const blocks = document.querySelectorAll('.q-block');
    if (!blocks.length) return;
    const anyOpen = Array.from(blocks).some(b => !b.classList.contains('folded'));
    // 有展开的 → 全部收起；全部收起 → 全部展开
    blocks.forEach(b => b.classList.toggle('folded', anyOpen));
    saveFold();
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = anyOpen ? '📂 查询宝宝已收起，点击再次展开' : '📖 查询宝宝已全部展开';
      toast.classList.add('show');
      clearTimeout(toast._t);
      toast._t = setTimeout(() => toast.classList.remove('show'), 1500);
    }
  }

  // 导航点击：查询宝宝已激活时再点 = 全部收起/展开；否则正常切换
  function onNavClick(item) {
    const name = item.dataset.panel;
    if (name === 'query' && document.getElementById('panel-query').classList.contains('active')) {
      toggleAllQueryBlocks();
      return;
    }
    showPanel(name);
  }

  // ===== 拖拽排序 =====
  function saveOrder() {
    const order = Array.from(document.querySelectorAll('.nav-item')).map(n => n.dataset.panel);
    try { localStorage.setItem(NAV_KEY, JSON.stringify(order)); } catch (e) {}
  }
  function loadOrder() {
    try {
      const saved = JSON.parse(localStorage.getItem(NAV_KEY) || '[]');
      if (!Array.isArray(saved) || saved.length < 2) return;
      const sidebar = document.querySelector('.sidebar');
      const items = {};
      document.querySelectorAll('.nav-item').forEach(n => items[n.dataset.panel] = n);
      let last = null;
      saved.forEach(name => {
        const el = items[name];
        if (!el) return;
        sidebar.insertBefore(el, last ? last.nextSibling : sidebar.firstChild);
        last = el;
      });
    } catch (e) {}
  }

  function initDrag() {
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.external) return;
      item.setAttribute('draggable', 'true');
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', item.dataset.panel); } catch (err) {}
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('drop-before', 'drop-after'));
        draggedItem = null;
        saveOrder();
      });
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === item) return;
        e.dataTransfer.dropEffect = 'move';
        const rect = item.getBoundingClientRect();
        const before = (e.clientY - rect.top) < rect.height / 2;
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('drop-before', 'drop-after'));
        item.classList.add(before ? 'drop-before' : 'drop-after');
      });
      item.addEventListener('dragleave', () => {
        item.classList.remove('drop-before', 'drop-after');
      });
      item.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!draggedItem || draggedItem === item) return;
        const rect = item.getBoundingClientRect();
        const before = (e.clientY - rect.top) < rect.height / 2;
        const sidebar = item.parentNode;
        if (before) sidebar.insertBefore(draggedItem, item);
        else sidebar.insertBefore(draggedItem, item.nextSibling);
        item.classList.remove('drop-before', 'drop-after');
        saveOrder();
      });
    });
  }

  // ===== 查询宝宝：版块单独折叠（标题行点击） =====
  function saveFold() {
    const folded = Array.from(document.querySelectorAll('.q-block.folded')).map(b => b.dataset.id).filter(Boolean);
    try { localStorage.setItem(FOLD_KEY, JSON.stringify(folded)); } catch (e) {}
  }
  function initFold() {
    document.querySelectorAll('.q-block .q-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const block = toggle.closest('.q-block');
        if (!block) return;
        block.classList.toggle('folded');
        saveFold();
      });
    });
    // 恢复单个版块折叠状态（默认全部展开）
    try {
      const saved = JSON.parse(localStorage.getItem(FOLD_KEY) || '[]');
      document.querySelectorAll('.q-block').forEach(block => {
        const id = block.dataset.id;
        if (id && saved.indexOf(id) !== -1) block.classList.add('folded');
      });
    } catch (e) {}
  }

  function updateWsTime() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const el = document.getElementById('wsTime');
    if (el) el.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadOrder();
    initDrag();
    initFold();
    initTheme();
    initPlan();
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.external) return;
      item.addEventListener('click', () => onNavClick(item));
    });
  });

  updateWsTime();
  setInterval(updateWsTime, 1000);

  // ===== 主题切换（樱花/薄荷/薰衣草） =====
  const THEME_KEY = '***';
  function initTheme() {
    // 恢复已存主题
    let saved = 'sakura';
    try { saved = localStorage.getItem(THEME_KEY) || 'sakura'; } catch (e) {}
    applyTheme(saved);
    // 绑定点击
    const sw = document.getElementById('themeSwitch');
    if (sw) {
      sw.querySelectorAll('.theme-dot').forEach(dot => {
        dot.addEventListener('click', () => applyTheme(dot.dataset.theme));
      });
    }
  }
  function applyTheme(name) {
    if (!['sakura', 'mint', 'lavender'].includes(name)) name = 'sakura';
    document.body.dataset.theme = name;
    try { localStorage.setItem(THEME_KEY, name); } catch (e) {}
    const sw = document.getElementById('themeSwitch');
    if (sw) {
      sw.querySelectorAll('.theme-dot').forEach(dot => {
        dot.classList.toggle('active', dot.dataset.theme === name);
      });
    }
  }

  // ===== 计划宝宝 =====
  const PLAN_KEY = '***';
  const PLAN_FILTERS = { all: '全部', active: '未完成', done: '已完成' };
  let planDate = todayStr();
  let planFilter = 'all';

  function todayStr() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function addDays(dateStr, n) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d + n);
    return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
  }
  function fmtDateLabel(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const today = todayStr();
    if (dateStr === today) return '今天 · ' + m + '月' + d + '日';
    if (dateStr === addDays(today, 1)) return '明天 · ' + m + '月' + d + '日';
    if (dateStr === addDays(today, -1)) return '昨天 · ' + m + '月' + d + '日';
    return y + '年' + m + '月' + d + '日';
  }
  function getPlans(dateStr) {
    try { return JSON.parse(localStorage.getItem(PLAN_KEY + ':' + dateStr) || '[]'); } catch (e) { return []; }
  }
  function savePlans(dateStr, plans) {
    try { localStorage.setItem(PLAN_KEY + ':' + dateStr, JSON.stringify(plans)); } catch (e) {}
  }

  function initPlan() {
    const input = document.getElementById('planInput');
    const addBtn = document.getElementById('planAddBtn');
    const prevBtn = document.getElementById('planPrev');
    const nextBtn = document.getElementById('planNext');
    const todayBtn = document.getElementById('planToday');
    if (!input || !addBtn) return;
    const doAdd = () => {
      const text = input.value.trim();
      if (!text) { toast('写下要做的事～'); return; }
      const plans = getPlans(planDate);
      plans.push({ id: Date.now(), text, done: false, time: '' });
      savePlans(planDate, plans);
      input.value = '';
      renderPlan();
    };
    addBtn.addEventListener('click', doAdd);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doAdd(); });
    prevBtn.addEventListener('click', () => { planDate = addDays(planDate, -1); renderPlan(); });
    nextBtn.addEventListener('click', () => { planDate = addDays(planDate, 1); renderPlan(); });
    todayBtn.addEventListener('click', () => { planDate = todayStr(); renderPlan(); });
    document.querySelectorAll('.plan-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        planFilter = btn.dataset.filter;
        document.querySelectorAll('.plan-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
        renderPlan();
      });
    });
    renderPlan();
  }

  function renderPlan() {
    const label = document.getElementById('planDateLabel');
    if (label) label.textContent = fmtDateLabel(planDate);
    const all = getPlans(planDate);
    const done = all.filter(p => p.done).length;
    const wrap = document.getElementById('planProgressWrap');
    if (wrap) wrap.style.display = all.length ? 'flex' : 'none';
    const fill = document.getElementById('planProgressFill');
    if (fill) fill.style.width = all.length ? Math.round(done / all.length * 100) + '%' : '0%';
    const ptext = document.getElementById('planProgressText');
    if (ptext) ptext.textContent = done + '/' + all.length;

    const list = all.filter(p => planFilter === 'all' ? true : planFilter === 'done' ? p.done : !p.done);
    const listEl = document.getElementById('planList');
    const emptyEl = document.getElementById('planEmpty');
    if (!listEl) return;
    if (!list.length) {
      listEl.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
      return;
    }
    if (emptyEl) emptyEl.style.display = 'none';
    listEl.innerHTML = list.map(p => {
      const t = p.time ? '<span class="plan-time">🕐 ' + esc(p.time) + '</span>' : '';
      return '<div class="plan-item ' + (p.done ? 'done' : '') + '" data-id="' + p.id + '">' +
        '<div class="plan-check" data-act="toggle">' + (p.done ? '✓' : '') + '</div>' +
        '<div class="plan-text">' + esc(p.text) + '</div>' + t +
        '<button class="plan-del" data-act="del">✕</button>' +
        '</div>';
    }).join('');
    listEl.querySelectorAll('.plan-item').forEach(item => {
      const id = Number(item.dataset.id);
      item.querySelector('[data-act="toggle"]').addEventListener('click', () => {
        const plans = getPlans(planDate);
        const p = plans.find(x => x.id === id);
        if (p) { p.done = !p.done; savePlans(planDate, plans); renderPlan(); }
      });
      item.querySelector('[data-act="del"]').addEventListener('click', () => {
        const plans = getPlans(planDate).filter(x => x.id !== id);
        savePlans(planDate, plans); renderPlan();
      });
    });
  }
})();
