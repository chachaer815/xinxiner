// ============================================================
// 丸子の工作宝宝 - 工作台外壳（导航 / 拖拽排序 / 折叠 / 面板切换）
// 独立文件便于维护：发品看 publish.js，查询宝宝看 query.js
// ============================================================
(function () {
  'use strict';

  const NAV_KEY = 'wz_nav_order_v1';
  const FOLD_KEY = 'wz_query_fold_v1';

  let draggedItem = null;
  let curPanel = 'index';
  const QUOTES = [
    ['今天也要元气满满', 'Stay sweet'],
    ['慢慢来，比较快', 'Slow is smooth'],
    ['把日子过成喜欢的样子', 'Live your way'],
    ['每一步都算数', 'Every step counts'],
    ['温柔且坚定', 'Gentle & firm'],
    ['好好生活，慢慢相遇', 'Live well, love slow'],
    ['你负责努力，时间给惊喜', 'Keep going'],
    ['小小的坚持，大大的改变', 'Small steps'],
  ];
  function refreshQuote() {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const zh = document.getElementById('navQuoteZh');
    const en = document.getElementById('navQuoteEn');
    if (zh) zh.textContent = q[0];
    if (en) en.textContent = q[1];
  }

  // ===== 面板切换 =====
  // wanzi-mini 页面映射
  const HOME_PAGES = { index: 'index', beauty: 'beauty', status: 'status', asset: 'asset', travel: 'travel', yearly: 'yearly', todo: 'plan', settings: 'settings' };
  // 抽屉全菜单（业务 + 小家页面）
  const DRAWER_NAVS = [
    { id: 'index', name: '小家', icon: 'wm-logo', tab: true },
    { id: 'publish', name: '发品宝宝', icon: 'publish', tab: false },
    { id: 'todo', name: '每日计划', icon: 'wm-plan', tab: false },
    { id: 'query', name: '查询宝宝', icon: 'query', tab: false },
    { id: 'price', name: '报价宝宝', icon: 'price', tab: false },
    { id: 'beauty', name: '变瘦变美', icon: 'wm-beauty', tab: true },
    { id: 'status', name: '我的情况', icon: 'wm-status', tab: true },
    { id: 'asset', name: '我的资产', icon: 'wm-asset', tab: true },
    { id: 'travel', name: '我的旅行', icon: 'wm-travel', tab: false },
    { id: 'yearly', name: '年度计划', icon: 'wm-yearly', tab: false },
    { id: 'settings', name: '设置', icon: 'wm-gear', tab: false },
  ];
  function showPanel(name) {
    curPanel = name;
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    // 底部 tab 高亮
    const tabHit = DRAWER_NAVS.find(n => n.id === name && n.tab);
    document.querySelectorAll('.bnav-btn').forEach(b => b.classList.toggle('active', !!tabHit && b.dataset.page === name));
    const panel = document.getElementById('panel-' + name);
    if (panel) panel.classList.add('active');
    // 底部 tab 高亮（tab 页面）
    const isTabPage = DRAWER_NAVS.find(n => n.id === name && n.tab);
    document.querySelectorAll('.bnav-btn').forEach(b => b.classList.toggle('active', isTabPage && b.dataset.page === name));
    // wanzi-mini 页面：渲染进面板
    if (HOME_PAGES[name] && window.HomePages) {
      const container = panel ? panel.querySelector('.home-page-root') : null;
      if (container) window.HomePages.render(HOME_PAGES[name], container);
    }
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

  // 底部 tab 点击
  function onTabClick(page) {
    showPanel(page);
    if (page === 'price') loadPriceFrame();
  }
  // 渲染抽屉菜单
  function renderDrawer() {
    const list = document.getElementById('drawerNavList');
    if (!list) return;
    list.innerHTML = DRAWER_NAVS.map(n =>
      '<div class="drawer-nav-item ' + (curPanel === n.id ? 'active' : '') + '" data-nav="' + n.id + '">' +
      '<img class="drawer-nav-icon" src="assets/' + n.icon + '.svg">' +
      '<span class="drawer-nav-name">' + n.name + '</span>' +
      '</div>').join('');
    list.querySelectorAll('[data-nav]').forEach(item => {
      item.addEventListener('click', () => {
        closeDrawer();
        showPanel(item.dataset.nav);
        if (item.dataset.nav === 'price') loadPriceFrame();
      });
    });
  }
  function toggleDrawer() {
    renderDrawer();
    document.getElementById('drawerMask').classList.add('show');
    document.getElementById('drawer').classList.add('open');
  }
  function closeDrawer() {
    document.getElementById('drawerMask').classList.remove('show');
    document.getElementById('drawer').classList.remove('open');
  }
  function goHome() { showPanel('index'); }

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
      if (!sidebar) { try { localStorage.removeItem(NAV_KEY); } catch (e) {} return; }
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
    const navItems = document.querySelectorAll('.nav-item');
    if (!navItems.length) return;
    navItems.forEach(item => {
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
    if (window.HomeApp) window.HomeApp.loadStore();
    loadOrder();
    initDrag();
    initFold();
    initTheme();
    refreshQuote();
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.external) return;
      item.addEventListener('click', () => onNavClick(item));
    });
    // 默认渲染发品宝宝
    showPanel('publish');
    // AI 金句（有 key 时走 AI 更新当日金句）
    try { window.HomePages && window.HomePages.initQuote && window.HomePages.initQuote(); } catch (e) {}
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

  function initPlan() {}

  function renderPlan() {}

  function updateWsTime() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const el = document.getElementById('wsTime');
    if (el) el.textContent = pad(now.getHours()) + ':' + pad(now.getMinutes());
  }

  updateWsTime();
  setInterval(updateWsTime, 1000);

  // 全局 UI 入口
  window.HomeUI = {
    onCloud() { showPanel('settings'); },
    onTheme() {
      const themes = ['sakura', 'mint', 'lavender'];
      const cur = document.body.dataset.theme || 'sakura';
      const next = themes[(themes.indexOf(cur) + 1) % themes.length];
      applyTheme(next);
      toast('已切换主题');
    },
    onSettings() { showPanel('settings'); },
  };
})();

