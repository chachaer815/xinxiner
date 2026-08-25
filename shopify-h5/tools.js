// ===== 丸子の工具宝宝 · 工具箱模块 =====

// ===== Supabase 配置（CozyCc 同款）=====
const SUPABASE_URL = 'https://omhtrpqdxdwbmwfdkgeg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9taHRycHFkeGR3Ym13ZmRraGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDYyNDU1OTEsImV4cCI6MjAyMTgyMTU5MX0.zKfH-nBY9OXz2Yj6QBrNfN_7e9N5iYYUcg9V-hJ2LMs';
const SB_HEADERS = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };

// ===== 时区城市数据 =====
const tzCities = [
  {name:'北京',zone:'Asia/Shanghai',diff:8},{name:'上海',zone:'Asia/Shanghai',diff:8},{name:'广州',zone:'Asia/Shanghai',diff:8},{name:'深圳',zone:'Asia/Shanghai',diff:8},{name:'杭州',zone:'Asia/Shanghai',diff:8},{name:'成都',zone:'Asia/Shanghai',diff:8},{name:'重庆',zone:'Asia/Shanghai',diff:8},{name:'武汉',zone:'Asia/Shanghai',diff:8},{name:'西安',zone:'Asia/Shanghai',diff:8},{name:'苏州',zone:'Asia/Shanghai',diff:8},{name:'南京',zone:'Asia/Shanghai',diff:8},{name:'天津',zone:'Asia/Shanghai',diff:8},{name:'长沙',zone:'Asia/Shanghai',diff:8},{name:'郑州',zone:'Asia/Shanghai',diff:8},{name:'沈阳',zone:'Asia/Shanghai',diff:8},{name:'青岛',zone:'Asia/Shanghai',diff:8},{name:'济南',zone:'Asia/Shanghai',diff:8},{name:'大连',zone:'Asia/Shanghai',diff:8},{name:'厦门',zone:'Asia/Shanghai',diff:8},{name:'福州',zone:'Asia/Shanghai',diff:8},{name:'东莞',zone:'Asia/Shanghai',diff:8},{name:'佛山',zone:'Asia/Shanghai',diff:8},{name:'宁波',zone:'Asia/Shanghai',diff:8},{name:'无锡',zone:'Asia/Shanghai',diff:8},{name:'合肥',zone:'Asia/Shanghai',diff:8},{name:'昆明',zone:'Asia/Shanghai',diff:8},{name:'哈尔滨',zone:'Asia/Shanghai',diff:8},{name:'长春',zone:'Asia/Shanghai',diff:8},{name:'石家庄',zone:'Asia/Shanghai',diff:8},{name:'南昌',zone:'Asia/Shanghai',diff:8},{name:'贵阳',zone:'Asia/Shanghai',diff:8},{name:'太原',zone:'Asia/Shanghai',diff:8},{name:'兰州',zone:'Asia/Shanghai',diff:8},{name:'乌鲁木齐',zone:'Asia/Shanghai',diff:8},{name:'呼和浩特',zone:'Asia/Shanghai',diff:8},{name:'海口',zone:'Asia/Shanghai',diff:8},{name:'三亚',zone:'Asia/Shanghai',diff:8},{name:'拉萨',zone:'Asia/Shanghai',diff:8},{name:'香港',zone:'Asia/Hong_Kong',diff:8},{name:'澳门',zone:'Asia/Macau',diff:8},{name:'台北',zone:'Asia/Taipei',diff:8},{name:'高雄',zone:'Asia/Taipei',diff:8},{name:'东京',zone:'Asia/Tokyo',diff:9},{name:'大阪',zone:'Asia/Tokyo',diff:9},{name:'首尔',zone:'Asia/Seoul',diff:9},{name:'釜山',zone:'Asia/Seoul',diff:9},{name:'新加坡',zone:'Asia/Singapore',diff:8},{name:'吉隆坡',zone:'Asia/Kuala_Lumpur',diff:8},{name:'曼谷',zone:'Asia/Bangkok',diff:7},{name:'清迈',zone:'Asia/Bangkok',diff:7},{name:'河内',zone:'Asia/Ho_Chi_Minh',diff:7},{name:'胡志明市',zone:'Asia/Ho_Chi_Minh',diff:7},{name:'雅加达',zone:'Asia/Jakarta',diff:7},{name:'巴厘岛',zone:'Asia/Makassar',diff:8},{name:'马尼拉',zone:'Asia/Manila',diff:8},{name:'金边',zone:'Asia/Phnom_Penh',diff:7},{name:'新德里',zone:'Asia/Kolkata',diff:5.5},{name:'孟买',zone:'Asia/Kolkata',diff:5.5},{name:'班加罗尔',zone:'Asia/Kolkata',diff:5.5},{name:'钦奈',zone:'Asia/Kolkata',diff:5.5},{name:'加尔各答',zone:'Asia/Kolkata',diff:5.5},{name:'海得拉巴',zone:'Asia/Kolkata',diff:5.5},{name:'孟买',zone:'Asia/Kolkata',diff:5.5},{name:'科伦坡',zone:'Asia/Colombo',diff:5.5},{name:'迪拜',zone:'Asia/Dubai',diff:4},{name:'阿布扎比',zone:'Asia/Dubai',diff:4},{name:'利雅得',zone:'Asia/Riyadh',diff:3},{name:'多哈',zone:'Asia/Qatar',diff:3},{name:'伊斯坦布尔',zone:'Europe/Istanbul',diff:3},{name:'安卡拉',zone:'Europe/Istanbul',diff:3},{name:'开罗',zone:'Africa/Cairo',diff:2},{name:'开普敦',zone:'Africa/Johannesburg',diff:2},{name:'约翰内斯堡',zone:'Africa/Johannesburg',diff:2},{name:'拉各斯',zone:'Africa/Lagos',diff:1},{name:'内罗毕',zone:'Africa/Nairobi',diff:3},{name:'莫斯科',zone:'Europe/Moscow',diff:3},{name:'圣彼得堡',zone:'Europe/Moscow',diff:3},{name:'基辅',zone:'Europe/Kiev',diff:2},{name:'华沙',zone:'Europe/Warsaw',diff:2},{name:'柏林',zone:'Europe/Berlin',diff:2},{name:'法兰克福',zone:'Europe/Berlin',diff:2},{name:'慕尼黑',zone:'Europe/Berlin',diff:2},{name:'汉堡',zone:'Europe/Berlin',diff:2},{name:'巴黎',zone:'Europe/Paris',diff:2},{name:'里昂',zone:'Europe/Paris',diff:2},{name:'马赛',zone:'Europe/Paris',diff:2},{name:'阿姆斯特丹',zone:'Europe/Amsterdam',diff:2},{name:'布鲁塞尔',zone:'Europe/Brussels',diff:2},{name:'日内瓦',zone:'Europe/Zurich',diff:2},{name:'苏黎世',zone:'Europe/Zurich',diff:2},{name:'维也纳',zone:'Europe/Vienna',diff:2},{name:'罗马',zone:'Europe/Rome',diff:2},{name:'米兰',zone:'Europe/Rome',diff:2},{name:'佛罗伦萨',zone:'Europe/Rome',diff:2},{name:'威尼斯',zone:'Europe/Rome',diff:2},{name:'马德里',zone:'Europe/Madrid',diff:2},{name:'巴塞罗那',zone:'Europe/Madrid',diff:2},{name:'里斯本',zone:'Europe/Lisbon',diff:1},{name:'伦敦',zone:'Europe/London',diff:0},{name:'曼彻斯特',zone:'Europe/London',diff:0},{name:'爱丁堡',zone:'Europe/London',diff:0},{name:'都柏林',zone:'Europe/Dublin',diff:0},{name:'纽约',zone:'America/New_York',diff:-5},{name:'洛杉矶',zone:'America/Los_Angeles',diff:-8},{name:'旧金山',zone:'America/Los_Angeles',diff:-8},{name:'硅谷',zone:'America/Los_Angeles',diff:-8},{name:'西雅图',zone:'America/Los_Angeles',diff:-8},{name:'波特兰',zone:'America/Los_Angeles',diff:-8},{name:'圣地亚哥',zone:'America/Los_Angeles',diff:-8},{name:'拉斯维加斯',zone:'America/Los_Angeles',diff:-8},{name:'凤凰城',zone:'America/Phoenix',diff:-7},{name:'丹佛',zone:'America/Denver',diff:-7},{name:'芝加哥',zone:'America/Chicago',diff:-6},{name:'休斯顿',zone:'America/Chicago',diff:-6},{name:'迈阿密',zone:'America/New_York',diff:-5},{name:'波士顿',zone:'America/New_York',diff:-5},{name:'费城',zone:'America/New_York',diff:-5},{name:'华盛顿',zone:'America/New_York',diff:-5},{name:'底特律',zone:'America/Detroit',diff:-5},{name:'亚特兰大',zone:'America/New_York',diff:-5},{name:'多伦多',zone:'America/Toronto',diff:-5},{name:'温哥华',zone:'America/Vancouver',diff:-8},{name:'蒙特利尔',zone:'America/Toronto',diff:-5},{name:'渥太华',zone:'America/Toronto',diff:-5},{name:'卡尔加里',zone:'America/Edmonton',diff:-7},{name:'墨西哥城',zone:'America/Mexico_City',diff:-6},{name:'坎昆',zone:'America/Cancun',diff:-5},{name:'圣保罗',zone:'America/Sao_Paulo',diff:-3},{name:'里约热内卢',zone:'America/Sao_Paulo',diff:-3},{name:'布宜诺斯艾利斯',zone:'America/Argentina/Buenos_Aires',diff:-3},{name:'利马',zone:'America/Lima',diff:-5},{name:'圣地亚哥',zone:'America/Santiago',diff:-4},{name:'波哥大',zone:'America/Bogota',diff:-5},{name:'悉尼',zone:'Australia/Sydney',diff:10},{name:'墨尔本',zone:'Australia/Melbourne',diff:10},{name:'布里斯班',zone:'Australia/Brisbane',diff:10},{name:'珀斯',zone:'Australia/Perth',diff:8},{name:'奥克兰',zone:'Pacific/Auckland',diff:12},{name:'惠灵顿',zone:'Pacific/Auckland',diff:12},{name:'檀香山',zone:'Pacific/Honolulu',diff:-10},{name:'关岛',zone:'Pacific/Guam',diff:10},{name:'迪戈加西亚',zone:'Indian/Diego_Garcia',diff:6},
];

// ===== 快递公司映射 =====
const expCompanyMap = {
  '顺丰':'shunfeng','申通':'shentong','圆通':'yuantong','中通':'zhongtong',
  '韵达':'yunda','EMS':'ems','邮政':'youzheng','京东':'jingdong','极兔':'jtexpress',
  '德邦':'debangwuliu','中铁':'ztky','天地华宇':'tiandihuayu','安能':'anneng',
  '百世':'baishi','天天':'tiantian','优速':'yousu','龙邦':'longban',
  '速尔':'suer','快捷':'kuaijie','信丰':'xinfeng','宅急送':'zhaijisong',
};
const expCompanyNames = Object.keys(expCompanyMap);
const intlUrls = {'DHL':'https://www.dhl.com/','UPS':'https://www.ups.com/','FedEx':'https://www.fedex.com/','USPS':'https://www.usps.com/','TNT':'https://www.tnt.com/','EMS国际':'https://www.ems.com.cn/'};
const intlNames = Object.keys(intlUrls);

// ===== 汇率缓存 =====
let _rateCache = null;
let _rateCacheTime = 0;
const RATE_CACHE_MS = 10 * 60 * 1000; // 10分钟

// ===== 文件工具状态 =====
const FT = {
  activeTab: 'img2pdf',
  imgFiles: [],
  pdfFiles: [],
  passcode: '',
  passcodeCreated: null,
};

// ===== 工具箱 Tab 切换 =====
function showToolPanel(panelId) {
  document.querySelectorAll('.tool-panel').forEach(el => el.style.display = 'none');
  const panel = document.getElementById(panelId);
  if (panel) panel.style.display = 'block';
}

window.openTool = function(tool) {
  // 切换到工具箱页面
  const toolsPage = document.getElementById('toolsPage');
  const publishPage = document.getElementById('publishPage');
  if (toolsPage) toolsPage.classList.add('active');
  if (publishPage) publishPage.classList.remove('active');

  // 隐藏所有工具面板
  document.querySelectorAll('.tool-panel').forEach(el => el.style.display = 'none');

  // 显示对应面板
  const panelMap = {
    'search': 'panel-search',
    'exchange': 'panel-exchange',
    'timezone': 'panel-timezone',
    'express': 'panel-express',
    'pack': 'panel-pack',
    'link': 'panel-link',
    'file': 'panel-file',
  };
  const panelId = panelMap[tool];
  if (panelId) {
    const panel = document.getElementById(panelId);
    if (panel) panel.style.display = 'block';
  }

  // 初始化各工具
  if (tool === 'exchange') initExchange();
  if (tool === 'timezone') initTimezone();
  if (tool === 'file') initFileTools();

  tResize();
}

window.openSearchTool = function() { openTool('search'); };
window.openExchangeTool = function() { openTool('exchange'); };
window.openTimezoneTool = function() { openTool('timezone'); };
window.openExpressTool = function() { openTool('express'); };
window.openPackTool = function() { openTool('pack'); };
window.openLinkTool = function() { openTool('link'); };
window.openFileTool = function() { openTool('file'); };

// ===== 返回发品页面 =====
window.showPublishPage = function() {
  const toolsPage = document.getElementById('toolsPage');
  const publishPage = document.getElementById('publishPage');
  if (toolsPage) toolsPage.classList.remove('active');
  if (publishPage) publishPage.classList.add('active');
};

// ===== iOS 键盘修复 =====
function tResize() {
  setTimeout(() => {
    if (visualViewport) {
      const v = visualViewport;
      document.body.style.setProperty('--kb-h', v.height + 'px');
      document.body.style.paddingBottom = Math.max(v.height - 48, 0) + 'px';
    }
  }, 150);
}
window.addEventListener('resize', tResize);
if (visualViewport) visualViewport.addEventListener('resize', tResize);
document.addEventListener('focusin', e => { if (e.target.matches('input,textarea,select')) setTimeout(tResize, 100); });
document.addEventListener('focusout', e => { if (e.target.matches('input,textarea,select')) setTimeout(tResize, 300); });

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// ===== 1. 参数查询 =====
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

window.doSearch = async function() {
  const q = document.getElementById('sq')?.value?.trim() || '';
  if (!q) { toolsToast('请输入型号'); return; }
  const terms = q.split(/[\s,，,]+/).filter(t => t.length > 0);
  if (terms.length === 0) return;

  const resEl = document.getElementById('sres');
  if (resEl) {
    resEl.innerHTML = '<div class="loading">🔍 搜索中…</div>';
    resEl.style.display = 'block';
  }

  try {
    const codes = terms.map(t => t.trim().toUpperCase());
    const { data, error } = await fetchSupabaseRpc('search_products', { pcodes: codes, pmax: 20 });
    if (error) throw error;
    renderSearchResults(data || [], terms);
  } catch (e) {
    if (resEl) resEl.innerHTML = `<div class="no-results">搜索失败：${esc(String(e?.message || e))}</div>`;
  }
};

async function fetchSupabaseRpc(fn, params) {
  const url = `${SUPABASE_URL}/rest/v1/rpc/${fn}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: SB_HEADERS,
    body: JSON.stringify(params),
  });
  if (!res.ok) return { data: null, error: new Error('HTTP ' + res.status) };
  const text = await res.text();
  try {
    const j = JSON.parse(text);
    return { data: j, error: null };
  } catch {
    return { data: null, error: new Error('解析失败') };
  }
}

function renderSearchResults(items, terms) {
  const resEl = document.getElementById('sres');
  if (!resEl) return;

  if (!items || items.length === 0) {
    resEl.innerHTML = `<div class="no-results">未找到匹配的产品 ✨<br><button class="cbtn" onclick="openAddModal('${esc(terms[0])}')" style="margin-top:12px;">➕ 添加这个产品</button></div>`;
    return;
  }

  // 高亮函数
  function hl(text, terms) {
    if (!text) return '';
    let result = esc(String(text));
    for (const t of terms) {
      if (!t) continue;
      const re = new RegExp(escRegex(t), 'gi');
      result = result.replace(re, m => `<mark>${m}</mark>`);
    }
    return result;
  }

  const unique = items.filter((v, i, a) => a.findIndex(x => x.code === v.code) === i);
  resEl.innerHTML = `<div class="count">找到 ${unique.length} 条结果</div><div class="results">` +
    unique.map(item => {
      const paramsRaw = item.params || '';
      const paramLines = paramsRaw.split('|').filter(p => p.trim());
      const paramsHtml = paramLines.length > 0
        ? `<div class="params-box"><div class="params-header"><span class="params-title">📋 规格参数</span><button class="cbtn" onclick="copyParams(this, ${esc(JSON.stringify(paramLines))})">复制</button></div><div class="params-list">${paramLines.map(p => `<p>${esc(p)}</p>`).join('')}</div></div>`
        : '';

      const size = [item.length, item.width, item.height].filter(v => v).join(' × ') || '';
      const weight = item.weight || '';

      return `<div class="result-item">
        <h3>${hl(item.code, terms)}</h3>
        <div class="info">
          ${item.brand ? `<div class="info-item"><span class="label">品牌</span><span class="value">${hl(item.brand, terms)}</span></div>` : ''}
          ${item.name ? `<div class="info-item"><span class="label">品名</span><span class="value">${hl(item.name, terms)}</span></div>` : ''}
          ${size ? `<div class="info-item"><span class="label">尺寸</span><span class="value">${size} cm</span></div>` : ''}
          ${weight ? `<div class="info-item"><span class="label">重量</span><span class="value">${weight} kg</span></div>` : ''}
        </div>
        ${paramsHtml}
        ${(size || weight) ? `<button class="cbtn" style="margin-top:10px;" onclick="fillPack('${esc(size)}','${esc(weight)}')">📐 填入包装预估</button>` : ''}
      </div>`;
    }).join('') + '</div>';
}

function escRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

window.copyParams = function(btn, lines) {
  const text = Array.isArray(lines) ? lines.join('\n') : lines;
  copyText(text, btn);
};

window.copyParamsFromResult = function(btn, paramsRaw) {
  const lines = String(paramsRaw || '').split('|').filter(p => p.trim());
  copyText(lines.join('\n'), btn);
};

window.openAddModal = function(model) {
  const modal = document.getElementById('addModal');
  if (!modal) return;
  document.getElementById('addModel').value = model || '';
  document.getElementById('addSize').value = '';
  document.getElementById('addWeight').value = '';
  document.getElementById('addDesc').value = '';
  document.getElementById('addSuccess').style.display = 'none';
  document.getElementById('addForm').style.display = 'block';
  modal.classList.add('show');
};

window.closeAddModal = function() {
  const modal = document.getElementById('addModal');
  if (modal) modal.classList.remove('show');
};

window.submitAddProduct = async function() {
  const model = document.getElementById('addModel')?.value?.trim();
  const size = document.getElementById('addSize')?.value?.trim();
  const weight = document.getElementById('addWeight')?.value?.trim();
  const desc = document.getElementById('addDesc')?.value?.trim();
  if (!model) { toolsToast('型号不能为空'); return; }

  let length = '', width = '', height = '';
  if (size) {
    const parts = size.replace('×', 'x').split(/[xX×]/).map(s => s.trim());
    length = parts[0] || ''; width = parts[1] || ''; height = parts[2] || '';
  }

  const payload = {
    code: model.toUpperCase(),
    name: desc,
    brand: '',
    size_l: length,
    size_w: width,
    size_h: height,
    weight: weight,
    params: '',
  };

  try {
    const { error } = await fetchSupabasePost('products_new', payload);
    if (error) throw error;
    document.getElementById('addForm').style.display = 'none';
    document.getElementById('addSuccess').style.display = 'block';
    document.getElementById('addSuccessModel').textContent = model;
    setTimeout(closeAddModal, 2000);
  } catch (e) {
    toolsToast('添加失败：' + (e?.message || String(e)));
  }
};

async function fetchSupabasePost(table, payload) {
  const url = `${SUPABASE_URL}/rest/v1/${table}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { ...SB_HEADERS, 'Prefer': 'return=minimal' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { error: new Error(`HTTP ${res.status}: ${text}`) };
  }
  return { error: null };
}

window.fillPack = function(size, weight) {
  showToolPanel('panel-pack');
  const sizeEl = document.getElementById('packSize');
  const weightEl = document.getElementById('packWeight');
  if (sizeEl && size) sizeEl.value = size;
  if (weightEl && weight) weightEl.value = weight;
};

function toolsToast(msg, ms) {
  const t = document.getElementById('toolsToast') || createToolsToast();
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), ms || 1800);
}

function createToolsToast() {
  const t = document.createElement('div');
  t.id = 'toolsToast';
  t.className = 'toast';
  document.body.appendChild(t);
  return t;
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// ===== 2. 汇率换算 =====
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

const EX_CURRENCIES = ['CNY','USD','EUR','GBP','JPY','AUD','CAD','CHF','HKD','SGD','KRW','TWD','THB','INR','RUB'];
const EX_LABELS = {CNY:'人民币',USD:'美元',EUR:'欧元',GBP:'英镑',JPY:'日元',AUD:'澳元',CAD:'加元',CHF:'瑞士法郎',HKD:'港币',SGD:'新加坡元',KRW:'韩元',TWD:'台币',THB:'泰铢',INR:'印度卢比',RUB:'卢布'};

async function initExchange() {
  const sel1 = document.getElementById('exFrom');
  const sel2 = document.getElementById('exTo');
  if (sel1) sel1.value = 'USD';
  if (sel2) sel2.value = 'CNY';
  doExchange();
}

window.doExchange = async function() {
  const amt = parseFloat(document.getElementById('exAmt')?.value) || 0;
  const from = document.getElementById('exFrom')?.value || 'USD';
  const to = document.getElementById('exTo')?.value || 'CNY';
  const rateEl = document.getElementById('exRate');
  const resultEl = document.getElementById('exResult');

  if (amt === 0) {
    if (resultEl) resultEl.textContent = '0.00';
    return;
  }

  if (rateEl) rateEl.textContent = '正在获取汇率…';

  const rate = await getRate(from, to);
  if (rate === null) {
    if (rateEl) rateEl.textContent = '获取失败，请稍后重试';
    if (resultEl) resultEl.textContent = '—';
    return;
  }

  const converted = amt * rate;
  const decimals = from === 'JPY' || to === 'JPY' ? 2 : 4;
  if (resultEl) resultEl.textContent = converted.toFixed(decimals).replace(/\.?0+$/, '');
  if (rateEl) rateEl.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
};

window.swapExchange = function() {
  const f = document.getElementById('exFrom');
  const t = document.getElementById('exTo');
  if (!f || !t) return;
  const tmp = f.value;
  f.value = t.value;
  t.value = tmp;
  doExchange();
};

async function getRate(from, to) {
  if (from === to) return 1;

  // 优先用缓存
  if (_rateCache && Date.now() - _rateCacheTime < RATE_CACHE_MS && _rateCache.base === from) {
    return _rateCache.rates[to] || null;
  }

  // 尝试 huilv.cc JSONP
  try {
    const r = await fetch(`https://api.huilv.cc/api/v1/latest?from=${from}&to=${to}&amount=1`);
    if (r.ok) {
      const j = await r.json();
      if (j?.result?.[to]) {
        const rate = parseFloat(j.result[to]);
        if (rate > 0) {
          _rateCache = { base: from, rates: j.result, ts: Date.now() };
          _rateCacheTime = Date.now();
          return rate;
        }
      }
    }
  } catch {}

  // 兜底 exchangerate-api
  try {
    const r = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    if (r.ok) {
      const j = await r.json();
      if (j?.rates?.[to]) {
        const rate = parseFloat(j.rates[to]);
        if (rate > 0) return rate;
      }
    }
  } catch {}

  // 兜底 Frankfurter
  try {
    const r = await fetch(`https://api.frankfurter.app/latest?from=${from}&to=${to}`);
    if (r.ok) {
      const j = await r.json();
      if (j?.rates?.[to]) return parseFloat(j.rates[to]);
    }
  } catch {}

  return null;
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// ===== 3. 时差查询 =====
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

let _localTzDiff = 8; // 默认中国

function initTimezone() {
  // 检测本地时区
  const offset = new Date().getTimezoneOffset();
  _localTzDiff = -offset / 60;
  renderTimezoneCards();
  const tzInput = document.getElementById('tzInput');
  if (tzInput) tzInput.value = '';
  const tzResult = document.getElementById('tzResult');
  if (tzResult) tzResult.innerHTML = '';
}

function renderTimezoneCards() {
  const now = new Date();
  // 显示北京时间 + 伦敦 + 纽约
  const cards = [
    {name: '北京时间', zone: 'Asia/Shanghai'},
    {name: '伦敦', zone: 'Europe/London'},
    {name: '纽约', zone: 'America/New_York'},
  ];
  const cardsEl = document.getElementById('tzCards');
  if (!cardsEl) return;
  cardsEl.innerHTML = cards.map(c => {
    const time = new Date(now.toLocaleString('en-US', {timeZone: c.zone}));
    const t = formatTime(time);
    const d = formatDate(time);
    const localDiff = _localTzDiff - 8; // 相对北京时间
    const diffClass = localDiff === 0 ? 'same' : localDiff > 0 ? 'ahead' : 'behind';
    const diffText = localDiff === 0 ? '=' : localDiff > 0 ? `+${localDiff}h` : `${localDiff}h`;
    return `<div class="tz-card"><div class="tz-city">${c.name}</div><div class="tz-time">${t}</div><div class="tz-date">${d}</div><div class="tz-diff ${diffClass}">${diffText}</div></div>`;
  }).join('');
}

window.searchTimezone = function(val) {
  const suggest = document.getElementById('tzSuggest');
  if (!suggest) return;
  if (!val || val.length < 1) { suggest.classList.remove('active'); return; }

  const q = val.toLowerCase();
  const matches = tzCities.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.zone.toLowerCase().includes(q) ||
    String(c.diff).includes(q)
  ).slice(0, 8);

  if (matches.length === 0) { suggest.classList.remove('active'); return; }

  const now = new Date();
  const localNow = new Date();
  suggest.innerHTML = matches.map(c => {
    const cityTime = new Date(now.toLocaleString('en-US', {timeZone: c.zone}));
    const t = formatTime(cityTime);
    const d = formatDate(cityTime);
    const diff = c.diff - _localTzDiff;
    const diffStr = diff === 0 ? 'same' : diff > 0 ? `ahead` : `behind`;
    return `<div class="tz-suggest-item" onclick="selectTimezone('${esc(c.name)}','${c.zone}',${c.diff})">
      <div><div class="tz-name">${esc(c.name)}</div><div class="tz-info">${esc(c.zone)}</div></div>
      <div style="text-align:right"><div class="tz-time" style="font-size:16px">${t}</div><div class="tz-vs"><span class="tz-diff tz-diff-${diffStr}">${diff > 0 ? '+' : ''}${diff}h</span></div></div>
    </div>`;
  }).join('');
  suggest.classList.add('active');
};

window.selectTimezone = function(name, zone, diff) {
  const suggest = document.getElementById('tzSuggest');
  if (suggest) suggest.classList.remove('active');
  const input = document.getElementById('tzInput');
  if (input) input.value = name;

  const now = new Date();
  const cityTime = new Date(now.toLocaleString('en-US', {timeZone: zone}));
  const localDiff = diff - _localTzDiff;
  const diffClass = localDiff === 0 ? 'same' : localDiff > 0 ? 'ahead' : 'behind';
  const diffText = localDiff === 0 ? '与本地相同' : localDiff > 0 ? `比本地快 ${localDiff} 小时` : `比本地慢 ${Math.abs(localDiff)} 小时`;

  const resultEl = document.getElementById('tzResult');
  if (resultEl) {
    resultEl.innerHTML = `<div class="tz-result-wrap"><div style="text-align:center;margin-bottom:10px;"><div style="font-size:24px;font-weight:700;color:var(--ink)">${formatTime(cityTime)}</div><div style="font-size:13px;color:var(--soft)">${formatDate(cityTime)}</div></div><div style="text-align:center;"><span class="tz-diff tz-diff-${diffClass}">${diffText}</span></div></div>`;
  }
};

window.blurTzSuggest = function() {
  setTimeout(() => { const s = document.getElementById('tzSuggest'); if (s) s.classList.remove('active'); }, 200);
};

function formatTime(d) {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}
function formatDate(d) {
  return `${d.getMonth()+1}月${d.getDate()}日`;
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// ===== 4. 快递查询 =====
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

window.doExpress = function() {
  const num = document.getElementById('exNo')?.value?.trim() || '';
  const co = document.getElementById('exCo')?.value || 'auto';
  if (!num) { toolsToast('请输入运单号'); return; }

  // 判断是国内还是国际
  const allIntl = [...intlNames.map(n => n.toLowerCase()), 'dhl','ups','fedex','usps','tnt'];
  const isIntl = allIntl.some(n => num.toLowerCase().startsWith(n)) || !/^\d+$/.test(num.slice(0, 10));

  if (isIntl) {
    // 国际跳转
    const intlUrl = detectIntlUrl(num);
    if (intlUrl) {
      window.open(intlUrl, '_blank');
    } else {
      window.open('https://www.17track.net/', '_blank');
    }
    return;
  }

  // 国内跳转快递100
  const coName = co === 'auto' ? '' : (expCompanyMap[co] || co);
  const url = `https://www.kuaidi100.com/channel/${coName}/${num}.shtml`;
  window.open(url, '_blank');
};

function detectIntlUrl(num) {
  const n = num.toLowerCase();
  if (n.startsWith('1z')) return intlUrls['UPS'];
  if (n.startsWith('tnt')) return intlUrls['TNT'];
  if (/^\d{10,}$/.test(n)) return intlUrls['FedEx'];
  if (n.startsWith('usps')) return intlUrls['USPS'];
  if (n.startsWith('dhl')) return intlUrls['DHL'];
  return null;
}

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// ===== 5. AI 包装预估 =====
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

window.doPack = async function() {
  const size = document.getElementById('packSize')?.value?.trim() || '';
  const weight = document.getElementById('packWeight')?.value?.trim() || '';
  const resultEl = document.getElementById('packResult');
  if (!size && !weight) { toolsToast('请输入尺寸或重量'); return; }
  if (resultEl) resultEl.innerHTML = '<div class="loading">🤖 AI 计算中…</div>';

  const content = `产品尺寸：${size || '未知'}\n产品重量：${weight || '未知'}`;
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/packaging-ai`, {
      method: 'POST',
      headers: SB_HEADERS,
      body: JSON.stringify({ content }),
    });
    const j = await res.json().catch(() => null);
    if (resultEl) resultEl.innerHTML = `<div style="background:#fff;border-radius:12px;padding:14px;border:2px solid var(--line);font-size:14px;line-height:1.8;white-space:pre-wrap;">${esc(j?.choices?.[0]?.message?.content || j?.text || j?.result || '计算完成，请查看结果。')}</div>`;
  } catch (e) {
    if (resultEl) resultEl.innerHTML = `<div class="no-results">计算失败：${esc(String(e?.message || e))}</div>`;
  }
};

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// ===== 6. 链接抓取 =====
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

const LF_CACHE = {};

window.doLinkFetch = async function() {
  const shopUrl = document.getElementById('lfUrl')?.value?.trim() || '';
  const modelsRaw = document.getElementById('lfModels')?.value?.trim() || '';
  const resultEl = document.getElementById('lfResult');
  const infoEl = document.getElementById('lfInfo');

  if (!shopUrl) { toolsToast('请输入店铺链接'); return; }
  if (!modelsRaw) { toolsToast('请输入型号'); return; }

  const models = modelsRaw.split(/\n/).map(m => m.trim()).filter(Boolean);
  if (!models.length) return;

  if (resultEl) resultEl.innerHTML = '<div class="loading">🔍 抓取店铺产品中…</div>';
  if (infoEl) infoEl.textContent = '';

  try {
    const { shopDomain, baseUrl, products, totalFetched } = await fetchShopProducts(shopUrl);
    if (resultEl) {
      const rows = models.map((model, i) => {
        const hits = products.filter(p => p.title.toLowerCase().includes(model.toLowerCase()));
        if (hits.length === 0) {
          return `<tr class="notfound"><td>${i+1}</td><td>${esc(model)}</td><td>❌ 未收录</td><td>—</td><td>—</td></tr>`;
        }
        return hits.map(h => {
          const handle = h.handle || '';
          const href = baseUrl ? `${baseUrl}/products/${handle}` : '#';
          return `<tr><td>${i+1}</td><td>${esc(model)}</td><td>${esc(h.title)}</td><td><a href="${esc(href)}" target="_blank">查看</a></td><td><button class="cbtn" style="padding:2px 8px;font-size:11px" onclick="copyText('${esc(href)}',this)">复制链接</button></td></tr>`;
        }).join('');
      }).join('');

      resultEl.innerHTML = `<div class="lf-table-wrap"><table class="lf-table"><thead><tr><th>#</th><th>型号</th><th>匹配到</th><th>链接</th><th>操作</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    }
    if (infoEl) infoEl.textContent = `已收录 ${totalFetched} 个产品，搜索 ${models.length} 个型号`;
  } catch (e) {
    if (resultEl) resultEl.innerHTML = `<div class="no-results">抓取失败：${esc(String(e?.message || e))}</div>`;
  }
};

async function fetchShopProducts(shopUrl) {
  const url = new URL(shopUrl);
  const shopDomain = url.hostname;
  const baseUrl = `${url.protocol}//${shopDomain}`;
  let products = [];
  let page = 1;
  const limit = 250;

  while (true) {
    const cacheKey = `${shopDomain}_${page}`;
    if (LF_CACHE[cacheKey]) {
      products = products.concat(LF_CACHE[cacheKey]);
    } else {
      const apiUrl = `${baseUrl}/products.json?limit=${limit}&page=${page}`;
      const res = await fetch(apiUrl);
      if (!res.ok) break;
      const j = await res.json();
      const newProds = j.products || [];
      LF_CACHE[cacheKey] = newProds;
      products = products.concat(newProds);
      if (newProds.length < limit) break;
    }
    page++;
    if (page > 20) break; // 最多5000个
  }

  return { shopDomain, baseUrl, products, totalFetched: products.length };
}

window.clearLinkFetch = function() {
  const keys = Object.keys(LF_CACHE);
  keys.forEach(k => delete LF_CACHE[k]);
  toolsToast('缓存已清空');
  const lfUrl = document.getElementById('lfUrl');
  const lfModels = document.getElementById('lfModels');
  const lfResult = document.getElementById('lfResult');
  const lfInfo = document.getElementById('lfInfo');
  if (lfUrl) lfUrl.value = '';
  if (lfModels) lfModels.value = '';
  if (lfResult) lfResult.innerHTML = '';
  if (lfInfo) lfInfo.textContent = '';
};

window.copyLfTable = function() {
  const table = document.querySelector('#lfResult .lf-table');
  if (!table) return;
  const rows = Array.from(table.querySelectorAll('tr'));
  const text = rows.map(row => {
    return Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim()).join('\t');
  }).join('\n');
  copyText(text, null);
};

// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====
// ===== 7. 文件工具 =====
// ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== ===== =====

function initFileTools() {
  renderFtTab('img2pdf');
}

window.renderFtTab = function(tab) {
  FT.activeTab = tab;
  document.querySelectorAll('.ft-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`.ft-tab[data-tab="${tab}"]`);
  if (activeTab) activeTab.classList.add('active');

  const panels = ['ftp-img2pdf','ftp-pdf2img','ftp-pdfmerge','ftp-filexf','ftp-passcode'];
  panels.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === `ftp-${tab}` ? 'block' : 'none';
  });

  // 清空状态
  if (tab !== 'passcode') {
    FT.imgFiles = [];
    FT.pdfFiles = [];
    renderFtFiles();
  }
};

// ===== 文件选择 =====
window.ftSelectFiles = function(type) {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  const accept = type === 'img' ? 'image/*' : '.pdf';
  input.accept = accept;
  input.onchange = () => {
    const files = Array.from(input.files || []);
    if (!files.length) return;
    if (type === 'img') {
      FT.imgFiles = FT.imgFiles.concat(files);
    } else {
      FT.pdfFiles = FT.pdfFiles.concat(files);
    }
    renderFtFiles();
  };
  input.click();
};

function renderFtFiles() {
  // 图片预览
  const previewEl = document.getElementById('ftImgPreview');
  if (previewEl) {
    previewEl.innerHTML = FT.imgFiles.map((f, i) => `<div class="ft-img-thumb-wrap"><img class="ft-img-thumb" src="${URL.createObjectURL(f)}" alt="${esc(f.name)}"><div class="ft-img-del" onclick="ftDelImg(${i})">✕</div></div>`).join('');
  }

  // PDF列表
  const pdfEl = document.getElementById('ftPdfList');
  if (pdfEl) {
    pdfEl.innerHTML = FT.pdfFiles.map((f, i) => `<div class="ft-file-item"><div class="ft-file-item-name">${esc(f.name)}</div><div class="ft-file-item-size">${formatSize(f.size)}</div><div class="ft-img-del" onclick="ftDelPdf(${i})">✕</div></div>`).join('');
  }
}

window.ftDelImg = function(i) { FT.imgFiles.splice(i, 1); renderFtFiles(); };
window.ftDelPdf = function(i) { FT.pdfFiles.splice(i, 1); renderFtFiles(); };

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ===== 图片转 PDF =====
window.convertImg2Pdf = async function() {
  if (FT.imgFiles.length === 0) { toolsToast('请先选择图片'); return; }

  const quality = parseInt(document.getElementById('imgQuality')?.value || '85');
  const orientation = document.getElementById('imgOrient')?.value || 'portrait';
  const size = orientation === 'portrait' ? [595, 842] : [842, 595];

  toolsToast('正在生成 PDF…');

  try {
    const { default: jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.es.min.js');
    const pdf = new jsPDF({ orientation, unit: 'pt', format: 'a4' });

    for (let i = 0; i < FT.imgFiles.length; i++) {
      if (i > 0) pdf.addPage();
      const file = FT.imgFiles[i];
      const imgData = await fileToDataUrl(file);
      const info = getImgDimensions(imgData);
      const fit = fitSize(info.w, info.h, size[0] - 40, size[1] - 40);
      pdf.addImage(imgData, 'JPEG', (size[0] - fit.w) / 2, (size[1] - fit.h) / 2, fit.w, fit.h);
    }

    pdf.save('images.pdf');
    toolsToast('PDF 生成成功 ✓');
  } catch (e) {
    toolsToast('生成失败：' + (e?.message || String(e)));
  }
};

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImgDimensions(dataUrl) {
  const img = new Image();
  img.src = dataUrl;
  return { w: img.naturalWidth || 800, h: img.naturalHeight || 600 };
}

function fitSize(w, h, maxW, maxH) {
  let ratio = Math.min(maxW / w, maxH / h);
  return { w: w * ratio, h: h * ratio };
}

// ===== PDF 转图片 =====
window.convertPdf2Img = async function() {
  if (FT.pdfFiles.length === 0) { toolsToast('请先选择 PDF'); return; }
  toolsToast('正在转换…（请稍候）');
  try {
    const { default: pdfjsLib } = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.mjs';

    let count = 0;
    for (const pdfFile of FT.pdfFiles) {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      for (let i = 1; i <= Math.min(pdf.numPages, 5); i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        const link = document.createElement('a');
        link.download = `${pdfFile.name}_page${i}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        count++;
      }
    }
    toolsToast(`已导出 ${count} 张图片 ✓`);
  } catch (e) {
    toolsToast('转换失败：' + (e?.message || String(e)));
  }
};

// ===== PDF 合并 =====
window.mergePdf = async function() {
  if (FT.pdfFiles.length < 2) { toolsToast('请至少选择 2 个 PDF'); return; }
  toolsToast('正在合并…');
  try {
    const { default: jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.es.min.js');
    const merged = new jsPDF();

    for (const pdfFile of FT.pdfFiles) {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const { default: pdfjsLib } = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.mjs';
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
        if (i > 1) merged.addPage();
        merged.addImage(canvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, viewport.width / 2, viewport.height / 2);
      }
    }
    merged.save('merged.pdf');
    toolsToast('PDF 合并成功 ✓');
  } catch (e) {
    toolsToast('合并失败：' + (e?.message || String(e)));
  }
};

// ===== 文件格式转换 =====
// Web转PDF使用浏览器自带打印
window.wordToPdf = function() {
  toolsToast('提示：将 Word 内容复制到 txt 标签页，使用「打印为PDF」功能');
  const el = document.getElementById('ftp-filexf');
  if (el) {
    el.innerHTML += `<div style="margin-top:10px;text-align:center"><a href="javascript:window.print()" class="btn btn-primary">🖨️ 打印为 PDF</a></div>`;
  }
};

window.pptToPdf = function() { toolsToast('提示：请在 PowerPoint 中使用「文件→另存为→PDF」'); };
window.txtToPdf = async function() {
  const content = document.getElementById('txtContent')?.value || '';
  if (!content) { toolsToast('请先输入文字'); return; }
  try {
    const { default: jsPDF } = await import('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.es.min.js');
    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(content, 180);
    pdf.text(lines, 14, 20);
    pdf.save('document.pdf');
    toolsToast('PDF 生成成功 ✓');
  } catch (e) { toolsToast('失败：' + (e?.message || String(e))); }
};

// ===== 跨设备传文件 =====
// 生成取件码
window.generatePasscode = async function() {
  if (FT.imgFiles.length === 0 && FT.pdfFiles.length === 0) { toolsToast('请先选择文件'); return; }
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiry = Date.now() + 24 * 3600 * 1000;
  const files = [...FT.imgFiles, ...FT.pdfFiles];
  // 简单演示：用 Base64 上传（实际需要服务端，这里只是UI演示）
  const fileInfo = await Promise.all(files.map(async f => ({
    name: f.name,
    size: f.size,
    type: f.type,
    url: await fileToDataUrl(f),
  })));
  localStorage.setItem('ft_passcode_' + code, JSON.stringify({ files: fileInfo, expiry, used: false }));
  FT.passcode = code;
  FT.passcodeCreated = expiry;
  renderPasscode(code);
  toolsToast('取件码已生成 ✓');
};

window.renderPasscode = function(code) {
  const box = document.getElementById('passcodeBox');
  if (!box) return;
  box.style.display = 'block';
  document.getElementById('passcodeValue').textContent = code;
  document.getElementById('passcodeHint').textContent = '24小时内有效';
  new Promise(resolve => {
    const QREl = document.getElementById('passcodeQR');
    if (QREl && !QREl.hasChildNodes()) {
      QREl.textContent = '📱 二维码';
    }
    resolve();
  });
};

window.copyPasscode = function() {
  if (FT.passcode) copyText(FT.passcode, null);
};

window.fetchByPasscode = async function() {
  const code = document.getElementById('fetchCodeInput')?.value?.trim();
  if (!code) { toolsToast('请输入取件码'); return; }
  const stored = localStorage.getItem('ft_passcode_' + code);
  if (!stored) { toolsToast('取件码无效或已过期'); return; }
  const data = JSON.parse(stored);
  if (Date.now() > data.expiry) { toolsToast('取件码已过期'); return; }
  // 下载文件
  for (const f of data.files) {
    const a = document.createElement('a');
    a.href = f.url;
    a.download = f.name;
    a.click();
  }
  toolsToast(`已下载 ${data.files.length} 个文件`);
};

// ===== 通用复制 =====
window.copyText = async function(text, btn) {
  if (!text) return;
  text = String(text);
  try {
    if (navigator.clipboard?.writeText && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.cssText = 'position:fixed;top:-9999px;opacity:0';
      document.body.appendChild(ta); ta.focus(); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '已复制!';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1500);
    } else {
      toolsToast('已复制到剪贴板 ✓');
    }
  } catch {
    toolsToast('复制失败');
  }
};

// Alias for compatibility
const copyText = window.copyText;
