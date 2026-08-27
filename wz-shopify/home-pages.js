// ============================================================
// 丸子の小家 · 工作台集成模块（home-pages.js）
// 完完全全复刻 wanzi-mini 的 6 个页面，渲染进工作台面板
// ============================================================
(function () {
  'use strict';
  const A = window.HomeApp;
  const S = () => A.getStore();
  const $ = id => document.getElementById(id);
  const h = A.esc;
  let curContainer = null;
  let curPage = 'index';
  const PAGES = {};
  const PAGE_ACTIONS = {};

  // ===== 工具函数 =====
  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function fmtDate(ds) {
    const d = new Date(ds + 'T00:00:00');
    return A.pad2(d.getMonth() + 1) + '月' + A.pad2(d.getDate()) + '日';
  }
  function fmtLabel(ds) {
    const t = A.todayStr();
    if (ds === t) return '今天 ' + fmtDate(ds);
    const y = new Date(); y.setDate(y.getDate() - 1);
    const tm = new Date(); tm.setDate(tm.getDate() + 1);
    if (ds === A.dstr(y)) return '昨天 ' + fmtDate(ds);
    if (ds === A.dstr(tm)) return '明天 ' + fmtDate(ds);
    return ds.slice(0, 4) + '年' + fmtDate(ds);
  }
  function vibrate() { try { navigator.vibrate && navigator.vibrate(15); } catch (e) {} }

  function renderPage(page) {
    curPage = page;
    const body = curContainer || document.getElementById('pageBody');
    if (!body) return;
    const fn = PAGES[page] || PAGES.index;
    body.innerHTML = fn();
    bindPage(page);
    const sc = body.closest('.main') || document.querySelector('.main');
    if (sc) sc.scrollTop = 0;
  }
  function bindPage(page) {
    const b = curContainer || document.getElementById('pageBody');
    if (!b) return;
    b.querySelectorAll('[data-act]').forEach(node => {
      node.addEventListener('click', e => {
        const act = node.dataset.act;
        const id = node.dataset.id;
        const val = node.dataset.val;
        if (PAGE_ACTIONS[act]) PAGE_ACTIONS[act](id, val, node, e);
      });
    });
    b.querySelectorAll('input[data-bind]').forEach(inp => {
      inp.addEventListener('input', () => { PAGE_STATE[inp.dataset.bind] = inp.value; });
    });
  }

// ============================================================
  // 首页 index
  // ============================================================
  PAGES.index = function () {
    const s = S();
    const today = A.todayStr();
    const checkinDone = (s.checkins || []).includes(today);
    const plans = (s.plans && s.plans[today]) || [];
    const doneCount = plans.filter(p => p.done).length;
    const now = new Date();
    return '' +
      '<div class="home-top">' +
      '  <div class="card clock-card" style="text-align:center;">' +
      '    <div class="clock-time" id="homeClock">' + A.pad2(now.getHours()) + ':' + A.pad2(now.getMinutes()) + ':' + A.pad2(now.getSeconds()) + '</div>' +
      '    <div class="clock-date">' + A.WEEK_CN[now.getDay()] + ' · ' + today + '</div>' +
      '  </div>' +
      '  <div class="card checkin-card" style="text-align:center;">' +
      '    <div class="checkin-btn ' + (checkinDone ? 'done' : '') + '" data-act="doCheckin">' +
      '      <span>' + (checkinDone ? '今日已打卡' : '今日打卡') + '</span>' +
      '    </div>' +
      '    <div class="checkin-info">累计 <b>' + (s.checkins || []).length + '</b> 天 · 连续 <b>' + streakDays(s.checkins || []) + '</b> 天</div>' +
      '  </div>' +
      '</div>' +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-plan.svg"><text>今日计划</text>' +
      '    <div class="ct-right"><span class="badge">' + doneCount + '/' + plans.length + '</span></div></div>' +
      (plans.length ? plans.slice(0, 5).map(p =>
        '<div class="item ' + (p.done ? 'done' : '') + '"><div class="chk" data-act="homeToggle" data-id="' + p.id + '">' + (p.done ? '<img class="chk-img" src="assets/wm-check.svg">' : '') + '</div><text class="txt">' + h(p.text) + '</text></div>'
      ).join('') : '<div class="empty"><img class="empty-img" src="assets/wm-plan.svg"><text>今天还没有计划～</text></div>') +
      '  <div class="btn sm ghost row-btn" style="margin-top:16px" data-act="goPage" data-val="plan">查看计划 →</div>' +
      '</div>' +
      '<div class="grid-2">' +
      quickCard('beauty', '变瘦变美', 'beauty') +
      quickCard('travel', '我的旅行', 'travel') +
      quickCard('asset', '我的资产', 'asset') +
      quickCard('status', '我的情况', 'status') +
      quickCard('yearly', '年度计划', 'yearly') +
      quickCard('insights', 'AI 看板', 'chart') +
      '</div>';
  };
  function quickCard(page, name, icon) {
    return '<div class="quick-card" data-act="goPage" data-val="' + page + '">' +
      '<img class="qc-icon" src="icons/' + icon + '.svg"><text>' + name + '</text></div>';
  }
  function streakDays(checkins) {
    let streak = 0;
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const ds = A.dstr(d);
      if (checkins.includes(ds)) streak++;
      else if (i > 0) break;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }
  PAGE_ACTIONS.doCheckin = function () {
    const s = S();
    const today = A.todayStr();
    if (!s.checkins) s.checkins = [];
    if (!s.checkins.includes(today)) {
      s.checkins.push(today);
      A.save();
      A.toast('打卡成功！');
    } else {
      A.toast('今天已经打过卡啦');
    }
    renderPage('index');
  };
  PAGE_ACTIONS.homeToggle = function (id) {
    const s = S();
    const today = A.todayStr();
    const plans = (s.plans && s.plans[today]) || [];
    const p = plans.find(x => x.id === id);
    if (p) { p.done = !p.done; A.save(); renderPage('index'); }
  };

  // ============================================================
  // 每日计划 plan（复刻 plan 页：日期/添加/番茄钟/列表/AI拆任务）
  // ============================================================
  const PAGE_STATE = {
    viewDate: 0, planText: '', planTime: '', aiLoading: false, aiResult: '', showMore: false,
    newCare: '', weightInput: '', tab: 'care', goalInput: '', heightInput: '', waterGoal: '',
    newPlace: '', newNote: '',
    newGoal: '', catIdx: 0, newCountdown: '',
    selMood: '', selHealth: [], customTag: '', whisper: '', profileName: '', profileMed: '', profileNote: '', showMoreProfile: false,
    statusTab: 'day',
    showAdd: false, newAccName: '', newAccKind: 'cash', txType: 'out', txAcc: '', txAmount: '', txCat: '', txNote: '', txDate: '', showMoreTx: false, newCat: '',
    aiKey: '', aiModel: ''
  };
  const PLAN_STATE = PAGE_STATE;
  const BEAUTY_STATE = PAGE_STATE;
  const TRAVEL_STATE = PAGE_STATE;
  const YEARLY_STATE = PAGE_STATE;
  const STATUS_STATE = PAGE_STATE;
  const ASSET_STATE = PAGE_STATE;

  PAGES.plan = function () {
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + PLAN_STATE.viewDate);
    const ds = A.dstr(d);
    const plans = (s.plans && s.plans[ds]) || [];
    const doneCount = plans.filter(p => p.done).length;
    const pct = plans.length ? Math.round(doneCount / plans.length * 100) : 0;
    const limit = PLAN_STATE.showMore ? plans.length : 8;
    const display = plans.slice(0, limit);
    return '' +
      '<div class="page-title">' +
      '  <img class="pt-icon" src="assets/wm-plan.svg">' +
      '  <div class="pt-text"><div class="pt-h2">每日计划</div><div class="pt-desc">写下要做的事，一件件完成</div></div>' +
      '</div>' +
      '<div class="date-switch">' +
      '  <div class="ds-btn" data-act="dayPrev">&lt;</div>' +
      '  <div class="ds-label">' + fmtLabel(ds) + '</div>' +
      '  <div class="ds-btn" data-act="dayNext">&gt;</div>' +
      '  <div class="ds-btn" style="width:auto;padding:0 20px;font-size:13px;" data-act="dayToday">今天</div>' +
      '</div>' +
      // 添加计划
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-plan.svg"><text>添加计划</text></div>' +
      '  <div class="row"><input class="inp flex-1" placeholder="写下要做的事…" data-bind="planText" value="' + h(PLAN_STATE.planText) + '" maxlength="80"></div>' +
      '  <div class="row" style="margin-top:12px">' +
      '    <div class="btn sm sky" data-act="pickTime">' + (PLAN_STATE.planTime || '设置时间') + '</div>' +
      '    <div class="btn sm primary" data-act="addPlan"><img class="btn-icon" src="assets/wm-plus.svg"><text>添加</text></div>' +
      '    <div class="btn sm lav" data-act="splitPlan"><img class="btn-icon" src="assets/wm-sparkle.svg"><text>拆任务</text></div>' +
      '  </div>' +
      (PLAN_STATE.aiLoading ? '<div class="hint"><span class="ai-spin"></span> AI 正在拆解…</div>' : '') +
      (PLAN_STATE.aiResult ? '<div class="ai-result">' + h(PLAN_STATE.aiResult) + '</div><div class="row"><div class="btn sm mint" data-act="applySplit">应用这些任务</div><div class="btn sm ghost" data-act="clearAi">清空</div></div>' : '') +
      '</div>' +
      // 番茄钟
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-tomato.svg"><text>番茄钟</text>' +
      '    <div class="ct-right"><text class="pomo-mode">' + pomoLabel() + '</text></div></div>' +
      (pomoRunning() ?
        '<div class="pomo-big">' + pomoDisplay() + '</div>' +
        '<div class="row justify-center"><div class="btn primary" data-act="pomoToggle">' + (pomoRunning() ? '暂停' : '开始') + '</div><div class="btn ghost" data-act="pomoReset">重置</div></div>'
        : '<div class="hint text-center">专注 25 分钟 · 休息 5 分钟</div><div class="row justify-center"><div class="btn primary" data-act="pomoStart">开始专注</div></div>') +
      '</div>' +
      // 计划列表
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-list.svg"><text>计划列表</text>' +
      '    <div class="ct-right">' + (plans.length ? '<div class="btn sm ghost" data-act="clearDone">清除已完成</div>' : '') + '</div></div>' +
      (plans.length === 0 ? '<div class="empty"><img class="empty-img" src="assets/wm-plan.svg"><text>还没有计划，快添加一个吧</text></div>' :
        '<div class="item-list">' + display.map(p =>
          '<div class="item ' + (p.done ? 'done' : '') + '">' +
          '<div class="chk" data-act="toggleDone" data-id="' + p.id + '">' + (p.done ? '<img class="chk-img" src="assets/wm-check.svg">' : '') + '</div>' +
          '<text class="txt">' + h(p.text) + '</text>' +
          (p.time ? '<text class="time-tag">' + h(p.time) + '</text>' : '') +
          '<div class="icon-btn" data-act="delPlan" data-id="' + p.id + '"><img class="icon-btn-img" src="assets/wm-trash.svg"></div>' +
          '</div>').join('') + '</div>') +
      (plans.length > 8 ? '<div class="btn sm ghost" style="margin-top:16px" data-act="toggleMore">' + (PLAN_STATE.showMore ? '收起' : '展开更多') + '</div>' : '') +
      '</div>';
  };

  // 番茄钟状态
  let pomo = { running: false, mode: 'focus', seconds: 0, timer: null };
  function pomoRunning() { return pomo.running; }
  function pomoLabel() { return pomo.mode === 'focus' ? '专注' : '休息'; }
  function pomoDisplay() {
    if (!pomo.running && pomo.seconds === 0) return '25:00';
    const m = Math.floor(pomo.seconds / 60), s = pomo.seconds % 60;
    return A.pad2(m) + ':' + A.pad2(s);
  }
  function pomoStart() {
    pomo.running = true; pomo.mode = 'focus'; pomo.seconds = 25 * 60;
    pomoTick();
  }
  function pomoTick() {
    if (pomo.timer) clearInterval(pomo.timer);
    pomo.timer = setInterval(() => {
      pomo.seconds--;
      if (pomo.seconds <= 0) {
        clearInterval(pomo.timer); pomo.timer = null;
        if (pomo.mode === 'focus') {
          pomo.running = true; pomo.mode = 'break'; pomo.seconds = 5 * 60;
          A.toast('专注结束，休息 5 分钟~');
        } else {
          pomo.running = false; pomo.mode = 'focus'; pomo.seconds = 0;
          A.toast('休息结束！');
        }
      }
      if (curPage === 'plan') renderPage('plan');
    }, 1000);
  }

  // 计划页动作
  PAGE_ACTIONS.dayPrev = function () { PLAN_STATE.viewDate--; renderPage('plan'); };
  PAGE_ACTIONS.dayNext = function () { PLAN_STATE.viewDate++; renderPage('plan'); };
  PAGE_ACTIONS.dayToday = function () { PLAN_STATE.viewDate = 0; renderPage('plan'); };
  PAGE_ACTIONS.addPlan = function () {
    const text = PLAN_STATE.planText.trim();
    if (!text) { A.toast('写下要做的事～'); return; }
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + PLAN_STATE.viewDate);
    const ds = A.dstr(d);
    if (!s.plans) s.plans = {};
    if (!s.plans[ds]) s.plans[ds] = [];
    s.plans[ds].push({ id: 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), text, time: PLAN_STATE.planTime, done: false });
    A.save();
    PLAN_STATE.planText = ''; PLAN_STATE.planTime = '';
    renderPage('plan');
    A.toast('已添加');
  };
  PAGE_ACTIONS.pickTime = function () {
    const t = window.prompt('设置时间（如 14:30）：', PLAN_STATE.planTime || '');
    if (t !== null) { PLAN_STATE.planTime = t.trim(); renderPage('plan'); }
  };
  PAGE_ACTIONS.toggleDone = function (id) {
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + PLAN_STATE.viewDate);
    const ds = A.dstr(d);
    const plans = (s.plans && s.plans[ds]) || [];
    const p = plans.find(x => x.id === id);
    if (p) { p.done = !p.done; A.save(); renderPage('plan'); }
  };
  PAGE_ACTIONS.delPlan = function (id) {
    A.confirm('删除计划', '确定删除这条计划吗？', () => {
      const s = S();
      const d = new Date(); d.setDate(d.getDate() + PLAN_STATE.viewDate);
      const ds = A.dstr(d);
      s.plans[ds] = (s.plans[ds] || []).filter(x => x.id !== id);
      A.save(); renderPage('plan');
    });
  };
  PAGE_ACTIONS.clearDone = function () {
    A.confirm('清除已完成', '确定清除所有已完成的任务吗？', () => {
      const s = S();
      const d = new Date(); d.setDate(d.getDate() + PLAN_STATE.viewDate);
      const ds = A.dstr(d);
      s.plans[ds] = (s.plans[ds] || []).filter(x => !x.done);
      A.save(); renderPage('plan');
    });
  };
  PAGE_ACTIONS.toggleMore = function () { PLAN_STATE.showMore = !PLAN_STATE.showMore; renderPage('plan'); };
  PAGE_ACTIONS.pomoStart = function () { pomoStart(); renderPage('plan'); };
  PAGE_ACTIONS.pomoToggle = function () {
    if (pomo.running) { clearInterval(pomo.timer); pomo.timer = null; pomo.running = false; }
    else { pomo.running = true; pomoTick(); }
    renderPage('plan');
  };
  PAGE_ACTIONS.pomoReset = function () { clearInterval(pomo.timer); pomo.timer = null; pomo.running = false; pomo.mode = 'focus'; pomo.seconds = 0; renderPage('plan'); };
  PAGE_ACTIONS.splitPlan = async function () {
    const text = PLAN_STATE.planText.trim();
    if (!text) { A.toast('请先输入计划内容'); return; }
    PLAN_STATE.aiLoading = true; PLAN_STATE.aiResult = '';
    renderPage('plan');
    try {
      const reply = await A.aiAsk('请把下面这个任务拆成 3~6 个具体的小步骤，每行一条，用编号 1. 2. 3. 开头，不要多余解释。\n\n任务：' + text,
        '你是一个效率助手，擅长拆解任务。只输出编号列表，不要多余解释。');
      PLAN_STATE.aiLoading = false; PLAN_STATE.aiResult = reply;
      renderPage('plan');
    } catch (e) {
      PLAN_STATE.aiLoading = false;
      A.toast('AI 调用失败：' + e.message);
      renderPage('plan');
    }
  };
  PAGE_ACTIONS.applySplit = function () {
    const lines = PLAN_STATE.aiResult.split('\n').filter(l => /^\d+\./.test(l.trim()));
    if (!lines.length) { A.toast('没有可应用的任务'); return; }
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + PLAN_STATE.viewDate);
    const ds = A.dstr(d);
    if (!s.plans) s.plans = {};
    if (!s.plans[ds]) s.plans[ds] = [];
    lines.forEach(l => {
      const t = l.replace(/^\d+\.\s*/, '').trim();
      if (t) s.plans[ds].push({ id: 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), text: t, time: '', done: false });
    });
    A.save(); PLAN_STATE.aiResult = '';
    renderPage('plan');
    A.toast('已添加 ' + lines.length + ' 条子任务');
  };
  PAGE_ACTIONS.clearAi = function () { PLAN_STATE.aiResult = ''; renderPage('plan'); };

  // ============================================================
  // 变瘦变美 beauty（复刻：目标/体重/喝水/经期/护理）
  // ============================================================
    const CARE_ICONS = { care_water: 'drop', care_sunscreen: 'sun', care_skincare: 'flower', care_exercise: 'target', care_sleep: 'moon' };

  PAGES.beauty = function () {
    const s = S();
    const b = s.beauty || {};
    const d = new Date(); d.setDate(d.getDate() + BEAUTY_STATE.viewDate);
    const ds = A.dstr(d);
    const daily = (b.daily && b.daily[ds]) || {};
    const cares = b.cares || [];
    const weights = (b.weights || []).slice().sort((x, y) => y.d.localeCompare(x.d));
    const bmiText = calcBmi(b);
    const tabs = [['care', '护理'], ['weight', '体重'], ['water', '喝水'], ['period', '经期']];
    return '' +
      '<div class="page-title">' +
      '  <img class="pt-icon" src="assets/wm-beauty.svg">' +
      '  <div class="pt-text"><div class="pt-h2">变瘦变美</div><div class="pt-desc">' + (b.goal ? '目标：' + h(b.goal) : '给自己定个小目标') + '</div></div>' +
      '</div>' +
      '<div class="tab-bar">' + tabs.map(t =>
        '<div class="tab ' + (BEAUTY_STATE.tab === t[0] ? 'active' : '') + '" data-act="beautyTab" data-val="' + t[0] + '">' + t[1] + '</div>').join('') + '</div>' +
      (BEAUTY_STATE.tab === 'care' ? beautyCareHtml(b, cares, daily, ds) :
       BEAUTY_STATE.tab === 'weight' ? beautyWeightHtml(b, weights) :
       BEAUTY_STATE.tab === 'water' ? beautyWaterHtml(b, daily, ds) :
       beautyPeriodHtml(b)) +
      '<div class="hint" style="margin-top:8px">' + (bmiText ? 'BMI：' + bmiText : '') + '</div>';
  };
  function calcBmi(b) {
    if (!b.height || !b.weights || !b.weights.length) return '';
    const hgt = parseFloat(b.height);
    const w = b.weights[b.weights.length - 1];
    if (!hgt || !w || !w.value) return '';
    const m = hgt / 100;
    const bmi = parseFloat(w.value) / (m * m);
    return bmi.toFixed(1);
  }
  function beautyCareHtml(b, cares, daily, ds) {
    return '<div class="card">' +
      '<div class="card-title"><img class="ct-icon" src="assets/wm-flower.svg"><text>每日护理</text>' +
      '<div class="ct-right"><div class="btn sm sky" data-act="beautyGoal">' + (b.goal ? '改目标' : '定目标') + '</div></div></div>' +
      '<div class="item-list">' + cares.map(c =>
        '<div class="item ' + (daily[c.id] ? 'done' : '') + '">' +
        '<div class="chk" data-act="toggleCare" data-id="' + c.id + '">' + (daily[c.id] ? '<img class="chk-img" src="assets/wm-check.svg">' : '') + '</div>' +
        '<img class="item-icon" src="assets/wm-' + (CARE_ICONS[c.id] || 'flower') + '.svg">' +
        '<text class="txt">' + h(c.name) + '</text>' +
        '</div>').join('') + '</div>' +
      '<div class="row" style="margin-top:12px"><input class="inp flex-1" placeholder="自定义护理项" data-bind="newCare"><div class="btn sm primary" data-act="addCare">添加</div></div>' +
      '</div>';
  }
  function beautyWeightHtml(b, weights) {
    return '<div class="card">' +
      '<div class="card-title"><img class="ct-icon" src="assets/wm-scale.svg"><text>体重记录</text></div>' +
      '<div class="row"><input class="inp flex-1" type="number" placeholder="今日体重（kg）" data-bind="weightInput"><div class="btn sm primary" data-act="recordWeight">记录</div></div>' +
      (weights.length ? '<div class="item-list" style="margin-top:12px">' + weights.slice(0, 14).map(w =>
        '<div class="item"><text class="txt">' + w.d + '</text><text class="time-tag">' + w.value + ' kg</text></div>').join('') + '</div>' : '') +
      '</div>';
  }
  function beautyWaterHtml(b, daily, ds) {
    const goal = b.waterGoal || 8;
    const cups = daily.water || 0;
    return '<div class="card">' +
      '<div class="card-title"><img class="ct-icon" src="assets/wm-drop.svg"><text>喝水 ' + cups + '/' + goal + ' 杯</text></div>' +
      '<div class="water-wrap">' + Array.from({ length: goal }, (_, i) =>
        '<div class="water-cup ' + (i < cups ? 'full' : '') + '" data-act="waterCup" data-val="' + (i + 1) + '">💧</div>').join('') + '</div>' +
      '<div class="row"><div class="btn sm sky" data-act="waterGoalSet">设置目标</div><div class="btn sm ghost" data-act="waterReset">清零</div></div>' +
      '</div>';
  }
  function beautyPeriodHtml(b) {
    const logs = (b.period && b.period.logs) || [];
    const last = logs.length ? logs[logs.length - 1] : null;
    return '<div class="card">' +
      '<div class="card-title"><img class="ct-icon" src="assets/wm-calendar.svg"><text>经期记录</text>' +
      '<div class="ct-right"><div class="btn sm primary" data-act="recordPeriod">记录</div></div></div>' +
      (last ? '<div class="hint">最近：' + last.d + (last.note ? '（' + h(last.note) + '）' : '') + '</div>' : '<div class="hint">还没有记录</div>') +
      (logs.length ? '<div class="item-list" style="margin-top:12px">' + logs.slice().reverse().slice(0, 6).map(l =>
        '<div class="item"><text class="txt">' + l.d + '</text>' + (l.note ? '<text class="time-tag">' + h(l.note) + '</text>' : '') + '</div>').join('') + '</div>' : '') +
      '</div>';
  }
  PAGE_ACTIONS.beautyTab = function (id, val) { BEAUTY_STATE.tab = val; renderPage('beauty'); };
  PAGE_ACTIONS.beautyGoal = function () {
    const s = S();
    const g = window.prompt('设定目标（如：减到 55kg）', s.beauty.goal || '');
    if (g !== null) { s.beauty.goal = g.trim(); A.save(); renderPage('beauty'); }
  };
  PAGE_ACTIONS.addCare = function () {
    const s = S();
    const name = BEAUTY_STATE.newCare.trim();
    if (!name) { A.toast('输入护理项名称'); return; }
    s.beauty.cares.push({ id: 'care_' + Date.now(), name, icon: 'flower' });
    A.save(); BEAUTY_STATE.newCare = '';
    renderPage('beauty');
  };
  PAGE_ACTIONS.toggleCare = function (id) {
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + BEAUTY_STATE.viewDate);
    const ds = A.dstr(d);
    if (!s.beauty.daily) s.beauty.daily = {};
    if (!s.beauty.daily[ds]) s.beauty.daily[ds] = {};
    s.beauty.daily[ds][id] = !s.beauty.daily[ds][id];
    A.save(); renderPage('beauty');
  };
  PAGE_ACTIONS.recordWeight = function () {
    const s = S();
    const v = parseFloat(BEAUTY_STATE.weightInput);
    if (!v) { A.toast('输入有效体重'); return; }
    if (!s.beauty.weights) s.beauty.weights = [];
    s.beauty.weights.push({ d: A.todayStr(), value: v });
    A.save(); BEAUTY_STATE.weightInput = '';
    renderPage('beauty');
    A.toast('已记录');
  };
  PAGE_ACTIONS.waterCup = function (id, val) {
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + BEAUTY_STATE.viewDate);
    const ds = A.dstr(d);
    if (!s.beauty.daily) s.beauty.daily = {};
    if (!s.beauty.daily[ds]) s.beauty.daily[ds] = {};
    s.beauty.daily[ds].water = parseInt(val);
    A.save(); renderPage('beauty');
  };
  PAGE_ACTIONS.waterGoalSet = function () {
    const s = S();
    const g = window.prompt('每日喝水目标（杯）：', String(s.beauty.waterGoal || 8));
    if (g !== null && parseInt(g) > 0) { s.beauty.waterGoal = parseInt(g); A.save(); renderPage('beauty'); }
  };
  PAGE_ACTIONS.waterReset = function () {
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + BEAUTY_STATE.viewDate);
    const ds = A.dstr(d);
    if (s.beauty.daily && s.beauty.daily[ds]) s.beauty.daily[ds].water = 0;
    A.save(); renderPage('beauty');
  };
  PAGE_ACTIONS.recordPeriod = function () {
    const s = S();
    const d = window.prompt('日期（YYYY-MM-DD）：', A.todayStr());
    if (!d) return;
    const note = window.prompt('备注（可选）：', '') || '';
    if (!s.beauty.period) s.beauty.period = { logs: [] };
    s.beauty.period.logs.push({ d, note });
    A.save(); renderPage('beauty');
    A.toast('已记录');
  };

  // ============================================================
  // 我的旅行 travel（复刻：添加/状态切换/删除）
  // ============================================================
    const TRAVEL_STATUS = { wish: '想去', plan: '计划中', done: '已打卡' };
  const NEXT_TRAVEL = { wish: 'plan', plan: 'done', done: 'wish' };

  PAGES.travel = function () {
    const s = S();
    const travels = s.travel || [];
    return '' +
      '<div class="page-title">' +
      '  <img class="pt-icon" src="assets/wm-travel.svg">' +
      '  <div class="pt-text"><div class="pt-h2">我的旅行</div><div class="pt-desc">想去的地方，一起出发吧</div></div>' +
      '</div>' +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-plus.svg"><text>加入旅行清单</text></div>' +
      '  <input class="inp mb-sm" placeholder="目的地（如：京都、冰岛）" data-bind="newPlace" value="' + h(TRAVEL_STATE.newPlace) + '">' +
      '  <input class="inp mb-sm" placeholder="备注（如：樱花季去）" data-bind="newNote" value="' + h(TRAVEL_STATE.newNote) + '">' +
      '  <div class="row"><div class="btn primary" data-act="addTravel"><img class="btn-icon" src="assets/wm-flag.svg"><text>加入清单</text></div></div>' +
      '</div>' +
      '<div class="hint mb-md">点状态徽章切换：想去 → 计划中 → 已打卡</div>' +
      (travels.length ? '<div class="grid-2">' + travels.map(t =>
        '<div class="travel-card"><div class="tc-body"><text class="tc-place">' + h(t.place) + '</text>' +
        (t.note ? '<text class="tc-note">' + h(t.note) + '</text>' : '') + '</div>' +
        '<div class="tc-foot"><div class="badge s' + (t.status === 'wish' ? 0 : t.status === 'plan' ? 1 : 2) + '" data-act="travelStatus" data-id="' + t.id + '">' + TRAVEL_STATUS[t.status] + '</div>' +
        '<div class="icon-btn" data-act="delTravel" data-id="' + t.id + '"><img class="icon-btn-img" src="assets/wm-trash.svg"></div></div></div>').join('') + '</div>'
        : '<div class="empty"><img class="empty-img" src="assets/wm-travel.svg"><text>还没有旅行计划，快添加一个吧～</text></div>');
  };
  PAGE_ACTIONS.addTravel = function () {
    const s = S();
    const place = TRAVEL_STATE.newPlace.trim();
    if (!place) { A.toast('请输入目的地'); return; }
    if (!s.travel) s.travel = [];
    s.travel.push({ id: 't_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6), place, note: TRAVEL_STATE.newNote.trim(), status: 'wish' });
    A.save(); TRAVEL_STATE.newPlace = ''; TRAVEL_STATE.newNote = '';
    renderPage('travel'); A.toast('已加入旅行清单');
  };
  PAGE_ACTIONS.travelStatus = function (id) {
    const s = S();
    const item = (s.travel || []).find(t => t.id === id);
    if (!item) return;
    item.status = NEXT_TRAVEL[item.status];
    A.save(); vibrate(); renderPage('travel');
    A.toast('状态已更新：' + TRAVEL_STATUS[item.status]);
  };
  PAGE_ACTIONS.delTravel = function (id) {
    A.confirm('确认删除', '确定要删除这个旅行计划吗？', () => {
      const s = S();
      s.travel = (s.travel || []).filter(t => t.id !== id);
      A.save(); renderPage('travel'); A.toast('已删除');
    });
  };

  // ============================================================
  // 年度计划 yearly（复刻：进度/立Flag/倒计时）
  // ============================================================
    const YEARLY_CATS = ['成长', '健康', '财富', '旅行', '工作', '生活'];

  PAGES.yearly = function () {
    const s = S();
    const yearlies = s.yearly || [];
    const doneCount = yearlies.filter(y => y.done).length;
    const progress = yearlies.length ? Math.round(doneCount / yearlies.length * 100) : 0;
    const countdowns = s.countdowns || [];
    const year = new Date().getFullYear();
    return '' +
      '<div class="page-title">' +
      '  <img class="pt-icon" src="assets/wm-yearly.svg">' +
      '  <div class="pt-text"><div class="pt-h2">年度计划</div><div class="pt-desc">' + year + ' 年 · 立个 Flag 冲鸭</div></div>' +
      '</div>' +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-target.svg"><text>完成进度</text>' +
      '    <div class="ct-right hint">' + doneCount + ' / ' + yearlies.length + '</div></div>' +
      '  <div class="progress-wrap"><div class="progress-track"><div class="progress-fill" style="width:' + progress + '%"></div></div>' +
      '  <text class="progress-text">' + progress + '%</text></div>' +
      '</div>' +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-flag.svg"><text>立下 Flag</text></div>' +
      '  <input class="inp mb-sm" placeholder="目标（如：读 12 本书）" data-bind="newGoal" value="' + h(YEARLY_STATE.newGoal) + '">' +
      '  <div class="row"><div class="btn sm sky" data-act="yearlyCat">' + YEARLY_CATS[YEARLY_STATE.catIdx] + '</div>' +
      '  <div class="btn primary" data-act="addYearly"><img class="btn-icon" src="assets/wm-check.svg"><text>立下 Flag</text></div></div>' +
      '</div>' +
      (yearlies.length ? '<div class="card">' +
        '<div class="card-title"><img class="ct-icon" src="assets/wm-list.svg"><text>我的 Flag</text></div>' +
        '<div class="item-list">' + yearlies.map(y =>
          '<div class="item ' + (y.done ? 'done' : '') + '">' +
          '<div class="chk" data-act="toggleYearly" data-id="' + y.id + '">' + (y.done ? '<img class="chk-img" src="assets/wm-check.svg">' : '') + '</div>' +
          '<text class="txt">' + h(y.goal) + '</text>' +
          (y.cat ? '<text class="time-tag">' + h(y.cat) + '</text>' : '') +
          '<div class="icon-btn" data-act="delYearly" data-id="' + y.id + '"><img class="icon-btn-img" src="assets/wm-trash.svg"></div>' +
          '</div>').join('') + '</div></div>' : '') +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-calendar.svg"><text>倒计时</text></div>' +
      '  <div class="row"><input class="inp flex-1" placeholder="重要日子（如：2026-12-31）" data-bind="newCountdown"><div class="btn sm primary" data-act="addCountdown">添加</div></div>' +
      (countdowns.length ? '<div class="item-list" style="margin-top:12px">' + countdowns.map(c =>
        '<div class="item"><text class="txt">' + h(c.name) + '</text><text class="time-tag">' + countdownText(c.date) + '</text>' +
        '<div class="icon-btn" data-act="delCountdown" data-id="' + c.id + '"><img class="icon-btn-img" src="assets/wm-trash.svg"></div></div>').join('') + '</div>' : '') +
      '</div>';
  };
  function countdownText(dateStr) {
    const target = new Date(dateStr + 'T00:00:00');
    const now = new Date();
    const days = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (days > 0) return '还有 ' + days + ' 天';
    if (days === 0) return '就是今天！';
    return '已过 ' + Math.abs(days) + ' 天';
  }
  PAGE_ACTIONS.yearlyCat = function () {
    YEARLY_STATE.catIdx = (YEARLY_STATE.catIdx + 1) % YEARLY_CATS.length;
    renderPage('yearly');
  };
  PAGE_ACTIONS.addYearly = function () {
    const s = S();
    const goal = YEARLY_STATE.newGoal.trim();
    if (!goal) { A.toast('输入目标'); return; }
    if (!s.yearly) s.yearly = [];
    s.yearly.push({ id: 'y_' + Date.now(), goal, cat: YEARLY_CATS[YEARLY_STATE.catIdx], done: false });
    A.save(); YEARLY_STATE.newGoal = '';
    renderPage('yearly'); A.toast('Flag 立好了！');
  };
  PAGE_ACTIONS.toggleYearly = function (id) {
    const s = S();
    const y = (s.yearly || []).find(x => x.id === id);
    if (y) { y.done = !y.done; A.save(); renderPage('yearly'); }
  };
  PAGE_ACTIONS.delYearly = function (id) {
    A.confirm('删除 Flag', '确定删除这个目标吗？', () => {
      const s = S();
      s.yearly = (s.yearly || []).filter(x => x.id !== id);
      A.save(); renderPage('yearly');
    });
  };
  PAGE_ACTIONS.addCountdown = function () {
    const s = S();
    const date = YEARLY_STATE.newCountdown.trim();
    if (!date) { A.toast('输入日期'); return; }
    if (!s.countdowns) s.countdowns = [];
    s.countdowns.push({ id: 'c_' + Date.now(), name: date, date });
    A.save(); YEARLY_STATE.newCountdown = '';
    renderPage('yearly'); A.toast('已添加倒计时');
  };
  PAGE_ACTIONS.delCountdown = function (id) {
    const s = S();
    s.countdowns = (s.countdowns || []).filter(c => c.id !== id);
    A.save(); renderPage('yearly');
  };

  // ============================================================
  // 我的情况 status（复刻：状态/情绪/健康记录/档案/悄悄话）
  // ============================================================
    const MOODS = ['😊', '😐', '😢', '😡', '🥱', '🤩'];
  const STATUS_TABS = [['day', '今日状态'], ['health', '健康记录'], ['profile', '健康档案'], ['whisper', '悄悄话']];

  PAGES.status = function () {
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + STATUS_STATE.viewDate);
    const ds = A.dstr(d);
    const st = (s.status && s.status[ds]) || {};
    const mood = st.mood || '';
    const health = st.health || [];
    const profile = s.healthProfile || [];
    return '' +
      '<div class="page-title">' +
      '  <img class="pt-icon" src="assets/wm-status.svg">' +
      '  <div class="pt-text"><div class="pt-h2">我的情况</div><div class="pt-desc">记录每一天的状态</div></div>' +
      '</div>' +
      '<div class="date-switch">' +
      '  <div class="ds-btn" data-act="statusPrev">&lt;</div>' +
      '  <div class="ds-label">' + fmtLabel(ds) + '</div>' +
      '  <div class="ds-btn" data-act="statusNext">&gt;</div>' +
      '  <div class="ds-btn" style="width:auto;padding:0 20px;font-size:13px;" data-act="statusToday">今天</div>' +
      '</div>' +
      '<div class="tab-bar">' + STATUS_TABS.map(t =>
        '<div class="tab ' + (STATUS_STATE.tab === t[0] ? 'active' : '') + '" data-act="statusTab" data-val="' + t[0] + '">' + t[1] + '</div>').join('') + '</div>' +
      (STATUS_STATE.tab === 'day' ?
        '<div class="card"><div class="card-title"><img class="ct-icon" src="assets/wm-heart.svg"><text>今天心情</text></div>' +
        '<div class="mood-row">' + MOODS.map(m =>
          '<div class="mood ' + (mood === m ? 'active' : '') + '" data-act="setMood" data-val="' + m + '">' + m + '</div>').join('') + '</div></div>' +
        '<div class="card"><div class="card-title"><img class="ct-icon" src="assets/wm-list.svg"><text>身体感受</text></div>' +
        '<div class="tag-wrap">' + A.HEALTH_TAGS.map(t =>
          '<div class="tag ' + (health.includes(t) ? 'on' : '') + '" data-act="toggleHealth" data-val="' + t + '">' + t + '</div>').join('') + '</div>' +
        '<div class="row" style="margin-top:12px"><input class="inp flex-1" placeholder="自定义症状" data-bind="customTag"><div class="btn sm primary" data-act="addCustomTag">添加</div></div></div>'
        : STATUS_STATE.tab === 'health' ? statusHealthHtml(s, ds)
        : STATUS_STATE.tab === 'profile' ? statusProfileHtml(profile)
        : statusWhisperHtml(s, ds));
  };
  function statusHealthHtml(s, ds) {
    const days = [];
    const d = new Date();
    for (let i = 6; i >= 0; i--) { const x = new Date(d); x.setDate(x.getDate() - i); days.push(A.dstr(x)); }
    return '<div class="card"><div class="card-title"><img class="ct-icon" src="assets/wm-chart.svg"><text>近 7 天健康</text></div>' +
      '<div class="item-list">' + days.map(ds2 => {
        const st = (s.status && s.status[ds2]) || {};
        const mood = st.mood || '—';
        const health = st.health || [];
        return '<div class="item"><text class="txt">' + fmtDate(ds2) + '</text><text class="time-tag">' + mood + (health.length ? ' · ' + health.join(',') : '') + '</text></div>';
      }).join('') + '</div></div>';
  }
  function statusProfileHtml(profile) {
    return '<div class="card"><div class="card-title"><img class="ct-icon" src="assets/wm-status.svg"><text>健康档案</text>' +
      '<div class="ct-right"><div class="btn sm primary" data-act="addProfile">添加</div></div></div>' +
      (profile.length ? '<div class="item-list">' + profile.map(p =>
        '<div class="item"><text class="txt">' + h(p.name) + '</text>' +
        (p.med ? '<text class="time-tag">' + h(p.med) + '</text>' : '') +
        '<div class="icon-btn" data-act="delProfile" data-id="' + p.id + '"><img class="icon-btn-img" src="assets/wm-trash.svg"></div></div>').join('') + '</div>'
        : '<div class="empty"><img class="empty-img" src="assets/wm-status.svg"><text>还没有档案</text></div>') +
      '</div>' +
      '<div class="card"><div class="card-title"><img class="ct-icon" src="assets/wm-plus.svg"><text>添加档案</text></div>' +
      '<input class="inp mb-sm" placeholder="姓名/称呼" data-bind="profileName">' +
      '<input class="inp mb-sm" placeholder="病史/用药" data-bind="profileMed">' +
      '<input class="inp mb-sm" placeholder="备注" data-bind="profileNote">' +
      '<div class="btn primary" data-act="saveProfile">保存档案</div></div>';
  }
  function statusWhisperHtml(s, ds) {
    const whisper = (s.status && s.status[ds] && s.status[ds].whisper) || '';
    return '<div class="card"><div class="card-title"><img class="ct-icon" src="assets/wm-heart.svg"><text>悄悄话</text></div>' +
      '<textarea class="inp" placeholder="写点心里话…" data-bind="whisper" style="min-height:120px">' + h(whisper) + '</textarea>' +
      '<div class="btn primary" style="margin-top:12px" data-act="saveWhisper">保存悄悄话</div></div>';
  }
  PAGE_ACTIONS.statusPrev = function () { STATUS_STATE.viewDate--; renderPage('status'); };
  PAGE_ACTIONS.statusNext = function () { STATUS_STATE.viewDate++; renderPage('status'); };
  PAGE_ACTIONS.statusToday = function () { STATUS_STATE.viewDate = 0; renderPage('status'); };
  PAGE_ACTIONS.statusTab = function (id, val) { STATUS_STATE.tab = val; renderPage('status'); };
  PAGE_ACTIONS.setMood = function (id, val) {
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + STATUS_STATE.viewDate);
    const ds = A.dstr(d);
    if (!s.status) s.status = {};
    if (!s.status[ds]) s.status[ds] = { health: [], whisper: '' };
    s.status[ds].mood = val;
    A.save(); renderPage('status');
  };
  PAGE_ACTIONS.toggleHealth = function (id, val) {
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + STATUS_STATE.viewDate);
    const ds = A.dstr(d);
    if (!s.status) s.status = {};
    if (!s.status[ds]) s.status[ds] = { health: [], whisper: '' };
    const arr = s.status[ds].health;
    const idx = arr.indexOf(val);
    if (idx >= 0) arr.splice(idx, 1); else arr.push(val);
    A.save(); renderPage('status');
  };
  PAGE_ACTIONS.addCustomTag = function () {
    const t = STATUS_STATE.customTag.trim();
    if (!t) { A.toast('输入症状'); return; }
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + STATUS_STATE.viewDate);
    const ds = A.dstr(d);
    if (!s.status) s.status = {};
    if (!s.status[ds]) s.status[ds] = { health: [], whisper: '' };
    if (!s.status[ds].health.includes(t)) s.status[ds].health.push(t);
    A.save(); STATUS_STATE.customTag = '';
    renderPage('status');
  };
  PAGE_ACTIONS.addProfile = function () { STATUS_STATE.tab = 'profile'; renderPage('status'); };
  PAGE_ACTIONS.saveProfile = function () {
    const s = S();
    const name = STATUS_STATE.profileName.trim();
    if (!name) { A.toast('输入姓名'); return; }
    if (!s.healthProfile) s.healthProfile = [];
    s.healthProfile.push({ id: 'hp_' + Date.now(), name, med: STATUS_STATE.profileMed.trim(), note: STATUS_STATE.profileNote.trim() });
    A.save();
    STATUS_STATE.profileName = ''; STATUS_STATE.profileMed = ''; STATUS_STATE.profileNote = '';
    renderPage('status'); A.toast('已保存');
  };
  PAGE_ACTIONS.delProfile = function (id) {
    A.confirm('删除档案', '确定删除这条档案吗？', () => {
      const s = S();
      s.healthProfile = (s.healthProfile || []).filter(p => p.id !== id);
      A.save(); renderPage('status');
    });
  };
  PAGE_ACTIONS.saveWhisper = function () {
    const s = S();
    const d = new Date(); d.setDate(d.getDate() + STATUS_STATE.viewDate);
    const ds = A.dstr(d);
    if (!s.status) s.status = {};
    if (!s.status[ds]) s.status[ds] = { health: [], whisper: '' };
    s.status[ds].whisper = STATUS_STATE.whisper;
    A.save(); renderPage('status'); A.toast('悄悄话已保存');
  };

  // ============================================================
  // 我的资产 asset（复刻：净资产/账户/记账/转账/分类/账单）
  // ============================================================
    const ACC_KINDS = { cash: '现金', bank: '银行卡', credit: '信用卡', huabei: '花呗' };
  const TX_CATS = ['吃饭', '交通', '购物', '房租', '工资', '理财', '其他'];

  PAGES.asset = function () {
    const s = S();
    const assets = s.assets || { accounts: [], txs: [] };
    const accounts = assets.accounts || [];
    const txs = (assets.txs || []).slice().sort((a, b) => b.d.localeCompare(a.d));
    const net = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
    const limit = ASSET_STATE.showMoreTx ? txs.length : 10;
    return '' +
      '<div class="page-title">' +
      '  <img class="pt-icon" src="assets/wm-asset.svg">' +
      '  <div class="pt-text"><div class="pt-h2">我的资产</div><div class="pt-desc">管好每一分钱</div></div>' +
      '</div>' +
      '<div class="card" style="text-align:center">' +
      '  <div class="hint">净资产</div><div class="net-value">¥' + net.toFixed(2) + '</div>' +
      '</div>' +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-wallet.svg"><text>账户</text>' +
      '    <div class="ct-right"><div class="btn sm primary" data-act="showAddAcc">添加账户</div></div></div>' +
      (accounts.length ? '<div class="item-list">' + accounts.map(a =>
        '<div class="item"><text class="txt">' + h(a.name) + '</text><text class="time-tag">' + (ACC_KINDS[a.kind] || a.kind) + '</text>' +
        '<text class="amt ' + ((a.balance || 0) >= 0 ? 'in' : 'out') + '">¥' + (a.balance || 0).toFixed(2) + '</text>' +
        '<div class="icon-btn" data-act="delAcc" data-id="' + a.id + '"><img class="icon-btn-img" src="assets/wm-trash.svg"></div></div>').join('') + '</div>'
        : '<div class="empty"><text>还没有账户</text></div>') +
      (ASSET_STATE.showAdd ?
        '<div style="margin-top:12px"><input class="inp mb-sm" placeholder="账户名（如：招行卡）" data-bind="newAccName">' +
        '<div class="row"><div class="btn sm sky" data-act="cycleAccKind">' + (ACC_KINDS[ASSET_STATE.newAccKind] || '现金') + '</div>' +
        '<div class="btn sm mint" data-act="saveAcc">保存</div><div class="btn sm ghost" data-act="cancelAcc">取消</div></div></div>' : '') +
      '</div>' +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-edit.svg"><text>记一笔</text></div>' +
      '  <div class="row"><div class="btn sm ' + (ASSET_STATE.txType === 'out' ? 'danger' : 'mint') + '" data-act="setTxType">' + (ASSET_STATE.txType === 'out' ? '支出' : '收入') + '</div>' +
      '  <select class="inp" data-bind="txAcc" style="flex:1">' + (accounts.length ? accounts.map(a => '<option value="' + a.id + '">' + h(a.name) + '</option>').join('') : '<option value="">无账户</option>') + '</select></div>' +
      '  <div class="row"><input class="inp flex-1" type="number" placeholder="金额" data-bind="txAmount">' +
      '  <select class="inp" data-bind="txCat" style="flex:1">' + TX_CATS.map(c => '<option>' + c + '</option>').join('') + '</select></div>' +
      '  <div class="row"><input class="inp flex-1" placeholder="备注" data-bind="txNote">' +
      '  <div class="btn sm primary" data-act="addTx">记一笔</div></div>' +
      '</div>' +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-list.svg"><text>最近账单</text></div>' +
      (txs.length ? '<div class="item-list">' + txs.slice(0, limit).map(t =>
        '<div class="item"><text class="txt">' + t.d + ' ' + h(t.cat || '') + (t.note ? ' ' + h(t.note) : '') + '</text>' +
        '<text class="amt ' + (t.type === 'in' ? 'in' : 'out') + '">' + (t.type === 'in' ? '+' : '-') + '¥' + Number(t.amount).toFixed(2) + '</text>' +
        '<div class="icon-btn" data-act="delTx" data-id="' + t.id + '"><img class="icon-btn-img" src="assets/wm-trash.svg"></div></div>').join('') + '</div>'
        : '<div class="empty"><text>还没有账单</text></div>') +
      (txs.length > 10 ? '<div class="btn sm ghost" style="margin-top:12px" data-act="toggleTx">' + (ASSET_STATE.showMoreTx ? '收起' : '展开更多') + '</div>' : '') +
      '</div>';
  };
  PAGE_ACTIONS.showAddAcc = function () { ASSET_STATE.showAdd = true; renderPage('asset'); };
  PAGE_ACTIONS.cancelAcc = function () { ASSET_STATE.showAdd = false; renderPage('asset'); };
  PAGE_ACTIONS.cycleAccKind = function () {
    const kinds = Object.keys(ACC_KINDS);
    ASSET_STATE.newAccKind = kinds[(kinds.indexOf(ASSET_STATE.newAccKind) + 1) % kinds.length];
    renderPage('asset');
  };
  PAGE_ACTIONS.saveAcc = function () {
    const s = S();
    const name = ASSET_STATE.newAccName.trim();
    if (!name) { A.toast('输入账户名'); return; }
    if (!s.assets) s.assets = { accounts: [], txs: [] };
    s.assets.accounts.push({ id: 'acc_' + Date.now(), name, kind: ASSET_STATE.newAccKind, balance: 0 });
    A.save(); ASSET_STATE.showAdd = false; ASSET_STATE.newAccName = '';
    renderPage('asset'); A.toast('账户已添加');
  };
  PAGE_ACTIONS.delAcc = function (id) {
    A.confirm('删除账户', '确定删除这个账户吗？', () => {
      const s = S();
      s.assets.accounts = (s.assets.accounts || []).filter(a => a.id !== id);
      A.save(); renderPage('asset');
    });
  };
  PAGE_ACTIONS.setTxType = function () { ASSET_STATE.txType = ASSET_STATE.txType === 'out' ? 'in' : 'out'; renderPage('asset'); };
  PAGE_ACTIONS.addTx = function () {
    const s = S();
    const amount = parseFloat(ASSET_STATE.txAmount);
    if (!amount || amount <= 0) { A.toast('输入有效金额'); return; }
    const accId = ASSET_STATE.txAcc || (s.assets.accounts[0] && s.assets.accounts[0].id);
    if (!accId) { A.toast('先添加账户'); return; }
    if (!s.assets) s.assets = { accounts: [], txs: [] };
    const acc = s.assets.accounts.find(a => a.id === accId);
    if (acc) acc.balance = (acc.balance || 0) + (ASSET_STATE.txType === 'in' ? amount : -amount);
    s.assets.txs.push({ id: 'tx_' + Date.now(), type: ASSET_STATE.txType, amount, cat: ASSET_STATE.txCat || '其他', note: ASSET_STATE.txNote.trim(), d: ASSET_STATE.txDate, acc: accId });
    A.save(); ASSET_STATE.txAmount = ''; ASSET_STATE.txNote = '';
    renderPage('asset'); A.toast('已记账');
  };
  PAGE_ACTIONS.delTx = function (id) {
    A.confirm('删除账单', '确定删除这笔账单吗？', () => {
      const s = S();
      const tx = (s.assets.txs || []).find(t => t.id === id);
      if (tx) {
        const acc = s.assets.accounts.find(a => a.id === tx.acc);
        if (acc) acc.balance = (acc.balance || 0) - (tx.type === 'in' ? tx.amount : -tx.amount);
        s.assets.txs = s.assets.txs.filter(t => t.id !== id);
      }
      A.save(); renderPage('asset');
    });
  };
  PAGE_ACTIONS.toggleTx = function () { ASSET_STATE.showMoreTx = !ASSET_STATE.showMoreTx; renderPage('asset'); };

  // ============================================================
  // 设置 settings（AI Key / 桌面名 / 主题）
  // ============================================================
  PAGES.settings = function () {
    const s = S();
    return '' +
      '<div class="page-title">' +
      '  <img class="pt-icon" src="assets/wm-gear.svg">' +
      '  <div class="pt-text"><div class="pt-h2">设置</div><div class="pt-desc">管理你的小家</div></div>' +
      '</div>' +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-sparkle.svg"><text>AI 助手</text></div>' +
      '  <input class="inp mb-sm" placeholder="火山引擎 API Key（ark- 开头）" data-bind="aiKey" value="' + h(s.ai && s.ai.key || '') + '">' +
      '  <input class="inp mb-sm" placeholder="模型接入点（如 ep-20260826192546-9p6vt）" data-bind="aiModel" value="' + h(s.ai && s.ai.model || 'ep-20260826192546-9p6vt') + '">' +
      '  <div class="btn primary" data-act="saveAi">保存 AI 配置</div>' +
      '  <div class="hint">用于 AI 拆任务、AI 看板等。密钥只保存在你的浏览器本地。</div>' +
      '</div>' +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-palette.svg"><text>主题</text></div>' +
      '  <div class="row">' +
      '    <div class="btn sm ' + ((s.theme || 'sakura') === 'sakura' ? 'primary' : 'ghost') + '" data-act="setTheme" data-val="sakura">樱花</div>' +
      '    <div class="btn sm ' + ((s.theme || '') === 'mint' ? 'primary' : 'ghost') + '" data-act="setTheme" data-val="mint">薄荷</div>' +
      '    <div class="btn sm ' + ((s.theme || '') === 'lavender' ? 'primary' : 'ghost') + '" data-act="setTheme" data-val="lavender">薰衣草</div>' +
      '  </div>' +
      '</div>' +
      '<div class="card">' +
      '  <div class="card-title"><img class="ct-icon" src="assets/wm-logo.svg"><text>关于</text></div>' +
      '  <div class="hint">丸子の小家 · 网页版<br>完完全全复刻自微信小程序版</div>' +
      '</div>';
  };
  PAGE_ACTIONS.saveAi = function () {
    const s = S();
    if (!s.ai) s.ai = { key: '', model: 'ep-20260826192546-9p6vt', dailyOn: true };
    s.ai.key = PAGE_STATE.aiKey || '';
    s.ai.model = PAGE_STATE.aiModel || 'ep-20260826192546-9p6vt';
    A.save();
    renderPage('settings');
    A.toast('AI 配置已保存');
  };
  PAGE_ACTIONS.setTheme = function (id, val) {
    A.applyTheme(val);
    renderPage('settings');
    A.toast('主题已切换');
  };


  // ===== 导出 =====
  window.HomePages = {
    render(page, container) { curContainer = container || null; renderPage(page); },
    get page() { return curPage; },
  };
})();
