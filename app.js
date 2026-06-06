// ====== ХЭШ-ФУНКЦИЯ ======
function simpleHash(str) {
  var hash = 0
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return 'h_' + Math.abs(hash).toString(36)
}

// ====== ТЕМЫ ======
var themes = {
  dark: { name: '🌙 Тёмная', bg: '#0a0a0f', card: '#151025', border: '#3a3050', accent: '#d4a574', text: '#e0d5c0', text2: '#9070a0', input: '#151025', hover: '#1a1530' },
  green: { name: '🌿 Зелёная', bg: '#0a1a0a', card: '#152515', border: '#305030', accent: '#74d474', text: '#d0e0d0', text2: '#709070', input: '#152515', hover: '#1a301a' },
  blue: { name: '🌊 Синяя', bg: '#0a0a1a', card: '#151525', border: '#303050', accent: '#7474d4', text: '#d0d0e0', text2: '#707090', input: '#151525', hover: '#1a1a30' },
  red: { name: '🔥 Красная', bg: '#1a0a0a', card: '#251515', border: '#503030', accent: '#d47474', text: '#e0d0d0', text2: '#907070', input: '#251515', hover: '#301a1a' },
  purple: { name: '💜 Фиолетовая', bg: '#100a1a', card: '#1a1525', border: '#403050', accent: '#b474d4', text: '#d0c0e0', text2: '#807090', input: '#1a1525', hover: '#251a30' },
  minecraft: { name: '⛏ Minecraft', bg: '#1a0a0a', card: '#2d1810', border: '#5c3a1e', accent: '#ffd700', text: '#f0e6d2', text2: '#a89070', input: '#2d1810', hover: '#3d1c1c' }
}

var currentTheme = localStorage.getItem('theme') || 'dark'

function applyTheme() {
  var theme = themes[currentTheme]
  var root = document.documentElement
  root.style.setProperty('--bg', theme.bg)
  root.style.setProperty('--card', theme.card)
  root.style.setProperty('--border', theme.border)
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--text', theme.text)
  root.style.setProperty('--text2', theme.text2)
  root.style.setProperty('--input', theme.input)
  root.style.setProperty('--hover', theme.hover)
  localStorage.setItem('theme', currentTheme)
  document.body.style.background = theme.bg
  
  var style = document.getElementById('theme-style')
  if (!style) { style = document.createElement('style'); style.id = 'theme-style'; document.head.appendChild(style) }
  style.textContent = `
    body::before { background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 6px), repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 6px), linear-gradient(180deg, ${theme.card} 0%, ${theme.bg} 50%, ${theme.bg} 100%) !important; }
    input, select, textarea { background: ${theme.input} !important; border-color: ${theme.border} !important; color: ${theme.text} !important; }
    .form-card, .table-container, .stat-card, .nav-bar { background: ${theme.card} !important; border-color: ${theme.border} !important; }
    button { background: ${theme.card} !important; border-color: ${theme.border} !important; color: ${theme.text2} !important; }
    button:hover { background: ${theme.hover} !important; border-color: ${theme.accent} !important; color: ${theme.accent} !important; }
    button.active { background: ${theme.hover} !important; border-color: ${theme.accent} !important; color: ${theme.accent} !important; }
    h1, h2, h3, .stat-value, th, .nav-user span:first-child, .form-card h2 { color: ${theme.accent} !important; }
    .stat-label, .form-group label, .form-links a, .subtitle, .user-mode { color: ${theme.text2} !important; }
    td, .nav-user { color: ${theme.text} !important; }
    .modal { border-color: ${theme.accent} !important; box-shadow: 0 0 30px ${theme.accent}33 !important; }
    .particle { color: ${theme.accent}66 !important; }
  `
}

// ====== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ======
var supabase = window.supabaseClient || window.supabase
var currentUser = null
var currentPage = 'login'
var currentTab = 'users'
var users = []
var roles = []
var modes = []
var allRequests = []
var userFilter = { mode: '', sort: 'priority', search: '', role: '' }

console.log('🚀 app.js загружен')

// ====== ЧАСТИЦЫ ======
function createParticles() {
  var container = document.querySelector('.particles')
  if (!container) return
  container.innerHTML = ''
  var icons = ['✦', '✧', '⛏', '⚔', '🪓', '🔮', '⭐', '💎', '🏹', '🛡']
  for (var i = 0; i < 30; i++) {
    var p = document.createElement('span')
    p.className = 'particle'
    p.textContent = icons[Math.floor(Math.random() * icons.length)]
    p.style.left = Math.random() * 100 + '%'
    p.style.fontSize = (Math.random() * 14 + 8) + 'px'
    p.style.animationDuration = (Math.random() * 15 + 10) + 's'
    p.style.animationDelay = Math.random() * 15 + 's'
    p.style.setProperty('--drift', ((Math.random() - 0.5) * 200) + 'px')
    p.style.setProperty('--spin', (Math.random() * 360) + 'deg')
    container.appendChild(p)
  }
}

// ====== ПОЛЕЗНЫЕ ФУНКЦИИ ======
function showLoading(text, callback, delay) {
  var app = document.getElementById('app')
  if (!app) return
  app.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:400px"><div style="text-align:center"><div style="font-size:48px;animation:bounce 0.6s ease infinite alternate">⛏️</div><div style="color:var(--accent);font-size:14px;margin-top:20px">' + (text || 'Загрузка...') + '</div></div></div>'
  if (callback) setTimeout(callback, delay || 1500)
}

function saveSession() { if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser)) }
function loadSession() { var s = localStorage.getItem('currentUser'); if (s) { try { currentUser = JSON.parse(s); return true } catch(e){} } return false }
function clearSession() { localStorage.removeItem('currentUser') }
function formatDate(d) { if (!d) return '-'; var dt = new Date(d); return dt.toLocaleDateString('ru-RU') + ' ' + dt.toLocaleTimeString('ru-RU', {hour:'2-digit',minute:'2-digit'}) }
function currentMonth() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) }

// ====== РЕНДЕР ======
function renderLogin() {
  return '<div class="form-card"><h2>⚡ Вход в панель</h2>' +
    '<div class="form-group"><label>Никнейм</label><input id="login-username" placeholder="Введите ник..." autocomplete="off" /></div>' +
    '<div class="form-group"><label>Пароль</label><input id="login-password" type="password" placeholder="Введите пароль..." autocomplete="off" /></div>' +
    '<div id="login-error" class="error-msg"></div>' +
    '<button onclick="handleLogin()">Войти</button>' +
    '<div class="form-links"><a onclick="navigateTo(\'register\')">Регистрация</a></div></div>'
}

function renderRegister() {
  var opts = '<option value="">Выберите режим...</option>'
  for (var i = 0; i < modes.length; i++) opts += '<option value="' + modes[i].name + '">' + modes[i].name + '</option>'
  opts += '<option value="__custom__">✏️ Свой вариант...</option>'
  return '<div class="form-card"><h2>📝 Регистрация</h2>' +
    '<div class="form-group"><label>Никнейм</label><input id="reg-username" placeholder="Введите ник..." autocomplete="off" /></div>' +
    '<div class="form-group"><label>Пароль</label><input id="reg-password" type="password" placeholder="Минимум 6 символов" autocomplete="off" /></div>' +
    '<div class="form-group"><label>Режим</label><select id="reg-mode" onchange="checkCustomMode()">' + opts + '</select><input id="reg-custom-mode" placeholder="Свой режим..." style="display:none;margin-top:10px" /></div>' +
    '<div id="reg-error" class="error-msg"></div><div id="reg-success" class="success-msg"></div>' +
    '<button onclick="handleRegister()">Зарегистрироваться</button>' +
    '<div class="form-links"><a onclick="navigateTo(\'login\')">Войти</a></div></div>'
}

function checkCustomMode() {
  var s = document.getElementById('reg-mode'); var c = document.getElementById('reg-custom-mode')
  if (s && c) c.style.display = s.value === '__custom__' ? 'block' : 'none'
}

function renderDashboard() {
  if (!currentUser) return renderLogin()
  var isAdmin = currentUser.is_super_admin || (currentUser.admin_mode && currentUser.is_approved)
  
  var themeOpts = ''
  for (var k in themes) themeOpts += '<option value="' + k + '"' + (currentTheme === k ? ' selected' : '') + '>' + themes[k].name + '</option>'
  
  var html = '<div class="nav-bar"><div class="nav-user">' +
    '<span style="color:' + (currentUser.role_color || 'var(--accent)') + ';font-size:11px">' + (currentUser.is_super_admin ? '👑 ' : '') + currentUser.username + '</span>' +
    '<span class="user-mode">' + (currentUser.mode || 'Не указан') + '</span>' +
    '<span style="color:var(--text2);font-size:9px">Баланс: ' + (currentUser.balance || 0) + '₽</span>' +
    '</div><div class="nav-actions">' +
    '<select id="theme-select" onchange="changeTheme()" style="width:auto;min-width:150px;padding:8px 12px;font-size:9px">' + themeOpts + '</select>' +
    '<button onclick="switchTab(\'profile\')">👤 Профиль</button>' +
    (isAdmin ? '<button onclick="switchTab(\'users\')">👥 Пользователи</button>' : '') +
    (isAdmin ? '<button onclick="switchTab(\'roles\')">🎨 Должности</button>' : '') +
    (isAdmin ? '<button onclick="switchTab(\'osly\')">🫏 Ослы</button>' : '') +
    (isAdmin ? '<button onclick="switchTab(\'requests\')">📋 Заявки</button>' : '') +
    '<button onclick="switchTab(\'balance\')">💰 Баланс</button>' +
    '</div></div><div id="tab-content"></div>'
  
  setTimeout(function() { if (isAdmin) switchTab('users'); else switchTab('profile') }, 0)
  return html
}

function changeTheme() { var s = document.getElementById('theme-select'); if (s) { currentTheme = s.value; applyTheme(); createParticles() } }

// ====== ВКЛАДКИ ======
function switchTab(tab) {
  currentTab = tab
  var c = document.getElementById('tab-content')
  if (!c) return
  
  if (tab === 'users') loadUsers()
  else if (tab === 'roles') loadRoles()
  else if (tab === 'profile') loadProfile()
  else if (tab === 'osly') loadOsly()
  else if (tab === 'requests') loadRequests()
  else if (tab === 'balance') loadBalance()
}

// ====== ПОЛЬЗОВАТЕЛИ ======
async function loadUsers() {
  var c = document.getElementById('tab-content')
  if (!c) return
  c.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Загрузка...</div>'
  
  var rolesRes = await supabase.from('roles').select('*').order('priority', { ascending: false })
  roles = rolesRes.data || []
  
  var q = supabase.from('users').select('*, roles(*)')
  if (!currentUser.is_super_admin && currentUser.admin_mode) q = q.eq('mode', currentUser.admin_mode)
  var res = await q
  if (res.data) {
    users = res.data
    users.sort(function(a, b) { return (b.roles ? b.roles.priority : 0) - (a.roles ? a.roles.priority : 0) })
    if (userFilter.mode) users = users.filter(function(u) { return u.mode === userFilter.mode })
    if (userFilter.role) users = users.filter(function(u) { return u.role_id === userFilter.role })
    if (userFilter.search) { var s = userFilter.search.toLowerCase(); users = users.filter(function(u) { return u.username.toLowerCase().indexOf(s) !== -1 }) }
    if (userFilter.sort === 'play_hours') users.sort(function(a, b) { return (b.play_hours||0) - (a.play_hours||0) })
    else if (userFilter.sort === 'salary') users.sort(function(a, b) { return (b.salary||0) - (a.salary||0) })
    else if (userFilter.sort === 'username') users.sort(function(a, b) { return a.username.localeCompare(b.username) })
    else if (userFilter.sort === 'balance') users.sort(function(a, b) { return (b.balance||0) - (a.balance||0) })
  }
  
  var modesList = []
  for (var i = 0; i < users.length; i++) { if (modesList.indexOf(users[i].mode) === -1 && users[i].mode) modesList.push(users[i].mode) }
  var modeOpts = '<option value="">Все режимы</option>'
  for (var j = 0; j < modesList.length; j++) modeOpts += '<option value="' + modesList[j] + '"' + (userFilter.mode === modesList[j] ? ' selected' : '') + '>' + modesList[j] + '</option>'
  
  var roleOpts = '<option value="">Все должности</option>'
  for (var k = 0; k < roles.length; k++) roleOpts += '<option value="' + roles[k].id + '"' + (userFilter.role === roles[k].id ? ' selected' : '') + '>' + roles[k].name + '</option>'
  
  var html = '<div class="table-container"><h3>📋 Пользователи (' + users.length + ')</h3>' +
    '<div style="display:flex;gap:8px;margin-bottom:15px;flex-wrap:wrap">' +
      '<input id="user-search" placeholder="🔍 Поиск..." value="' + userFilter.search + '" style="max-width:160px" oninput="updateFilter()" />' +
      '<select id="user-mode-filter" onchange="updateFilter()" style="max-width:150px;width:auto">' + modeOpts + '</select>' +
      '<select id="user-role-filter" onchange="updateFilter()" style="max-width:150px;width:auto">' + roleOpts + '</select>' +
      '<select id="user-sort" onchange="updateFilter()" style="max-width:150px;width:auto">' +
        '<option value="priority"' + (userFilter.sort === 'priority' ? ' selected' : '') + '>По приоритету</option>' +
        '<option value="play_hours"' + (userFilter.sort === 'play_hours' ? ' selected' : '') + '>По часам</option>' +
        '<option value="salary"' + (userFilter.sort === 'salary' ? ' selected' : '') + '>По зарплате</option>' +
        '<option value="balance"' + (userFilter.sort === 'balance' ? ' selected' : '') + '>По балансу</option>' +
        '<option value="username"' + (userFilter.sort === 'username' ? ' selected' : '') + '>По нику</option>' +
      '</select>' +
    '</div>' +
    '<div style="overflow-x:auto"><table><thead><tr><th>Ник</th><th>Режим</th><th>Должность</th><th>Часы</th><th>Баланс</th><th>Зарплата</th><th>Варны</th></tr></thead><tbody>'
  
  for (var l = 0; l < users.length; l++) {
    var u = users[l]
    var nc = u.roles ? u.roles.color : 'var(--accent)'
    if (u.is_super_admin) nc = '#ffd700'
    html += '<tr>' +
      '<td><a onclick="showUserProfile(\'' + u.id + '\')" style="color:' + nc + ';cursor:pointer;text-decoration:underline">' + u.username + (u.is_super_admin ? ' 👑' : '') + '</a></td>' +
      '<td>' + (u.mode || '-') + '</td>' +
      '<td style="color:' + nc + '">' + (u.roles ? u.roles.name : (u.position || '-')) + '</td>' +
      '<td>' + (u.play_hours || 0) + 'ч</td>' +
      '<td>' + (u.balance || 0) + '₽</td>' +
      '<td>' + (u.salary || 0) + '₽</td>' +
      '<td>' + (u.warns || 0) + '</td>' +
    '</tr>'
  }
  html += '</tbody></table></div></div>'
  c.innerHTML = html
}

function updateFilter() {
  var s = document.getElementById('user-search')
  var m = document.getElementById('user-mode-filter')
  var r = document.getElementById('user-role-filter')
  var sort = document.getElementById('user-sort')
  if (s) userFilter.search = s.value
  if (m) userFilter.mode = m.value
  if (r) userFilter.role = r.value
  if (sort) userFilter.sort = sort.value
  loadUsers()
}

// ====== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ======
async function showUserProfile(userId) {
  var user = null
  for (var i = 0; i < users.length; i++) { if (users[i].id === userId) { user = users[i]; break } }
  if (!user) return
  
  var c = document.getElementById('tab-content')
  if (!c) return
  c.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Загрузка...</div>'
  
  var warnsRes = await supabase.from('warns').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  var bansRes = await supabase.from('bans').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  var bonusesRes = await supabase.from('bonuses').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  var statsRes = await supabase.from('monthly_stats').select('*').eq('user_id', userId).order('month', { ascending: false }).limit(12)
  var rolesRes = await supabase.from('roles').select('*').order('priority', { ascending: false })
  
  var userWarns = warnsRes.data || []
  var userBans = bansRes.data || []
  var userBonuses = bonusesRes.data || []
  var userStats = statsRes.data || []
  var allRoles = rolesRes.data || []
  
  var roleOpts = '<option value="">Без должности</option>'
  for (var r = 0; r < allRoles.length; r++) roleOpts += '<option value="' + allRoles[r].id + '"' + (user.role_id === allRoles[r].id ? ' selected' : '') + '>' + allRoles[r].name + ' (пр.' + allRoles[r].priority + ')</option>'
  
  var nc = user.roles ? user.roles.color : 'var(--accent)'
  if (user.is_super_admin) nc = '#ffd700'
  
  var html = '<button onclick="switchTab(\'users\')" style="margin-bottom:20px">← Назад</button>' +
    '<div class="stats-grid">' +
      '<div class="stat-card"><div class="stat-value">' + (user.play_hours || 0) + 'ч</div><div class="stat-label">Часы</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + (user.balance || 0) + '₽</div><div class="stat-label">Баланс</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + (user.salary || 0) + '₽</div><div class="stat-label">Зарплата</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + (user.warns || 0) + '</div><div class="stat-label">Варны</div></div>' +
    '</div>' +
    '<div class="table-container"><h3>👤 ' + user.username + '</h3>' +
      '<div class="form-group"><label>Должность</label><select id="profile-role" onchange="updateUserRole(\'' + userId + '\')">' + roleOpts + '</select></div>' +
      '<p style="color:var(--text2);font-size:10px">Режим: <span style="color:var(--accent)">' + (user.mode || '-') + '</span></p>' +
      '<p style="color:var(--text2);font-size:10px">Выдано зарплаты: <span style="color:var(--accent)">' + (user.issued_salary || 0) + '₽</span></p>' +
      '<p style="color:var(--text2);font-size:10px">Ожидает зарплаты: <span style="color:#ffd700">' + (user.pending_salary || 0) + '₽</span></p>' +
    '</div>'
  
  if (user.id !== currentUser.id) {
    html += '<div style="display:flex;gap:10px;margin:15px 0;flex-wrap:wrap">' +
      '<button onclick="showWarnModal(\'' + userId + '\')">⚠️ Варн</button>' +
      '<button onclick="showBanModal(\'' + userId + '\')">🔒 Бан</button>' +
      '<button onclick="showBonusModal(\'' + userId + '\')">💰 Премия</button>' +
      '<button onclick="showEditHoursModal(\'' + userId + '\')">⏱ Часы</button>' +
      (!user.is_approved ? '<button onclick="approveUser(\'' + userId + '\')">✅ Одобрить</button>' : '') +
      '<button onclick="toggleBlockUser(\'' + userId + '\', ' + user.is_blocked + ')" class="danger">' + (user.is_blocked ? '🔓 Разблок' : '🔒 Блок') + '</button>' +
      '<button onclick="deleteUserAccount(\'' + userId + '\')" class="danger">🗑 Удалить</button>' +
    '</div>'
  }
  
  // Варны
  html += '<div class="table-container"><h3>⚠️ Варны (' + userWarns.length + ')</h3>'
  if (userWarns.length === 0) html += '<p style="color:var(--text2);font-size:10px">Нет</p>'
  else {
    html += '<table><thead><tr><th>Причина</th><th>Штраф</th><th>Кто</th><th>Дата</th><th>Истекает</th><th>Действия</th></tr></thead><tbody>'
    for (var w = 0; w < userWarns.length; w++) {
      html += '<tr><td>' + userWarns[w].reason + '</td><td>' + userWarns[w].fine + '₽</td><td>' + userWarns[w].created_by + '</td><td>' + formatDate(userWarns[w].created_at) + '</td><td>' + (userWarns[w].expires_at ? formatDate(userWarns[w].expires_at) : 'Навсегда') + '</td>' +
        '<td><button onclick="editWarn(\'' + userWarns[w].id + '\',\'' + userId + '\')" style="font-size:8px;padding:4px 8px">✏️</button> <button onclick="deleteWarn(\'' + userWarns[w].id + '\',\'' + userId + '\')" class="danger" style="font-size:8px;padding:4px 8px">🗑</button></td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  // Премии
  html += '<div class="table-container"><h3>💰 Премии (' + userBonuses.length + ')</h3>'
  if (userBonuses.length === 0) html += '<p style="color:var(--text2);font-size:10px">Нет</p>'
  else {
    html += '<table><thead><tr><th>Сумма</th><th>Причина</th><th>Кто</th><th>Дата</th><th>Действия</th></tr></thead><tbody>'
    for (var bn = 0; bn < userBonuses.length; bn++) {
      html += '<tr><td style="color:#74d474">+' + userBonuses[bn].amount + '₽</td><td>' + userBonuses[bn].reason + '</td><td>' + userBonuses[bn].created_by + '</td><td>' + formatDate(userBonuses[bn].created_at) + '</td>' +
        '<td><button onclick="editBonus(\'' + userBonuses[bn].id + '\',\'' + userId + '\')" style="font-size:8px;padding:4px 8px">✏️</button> <button onclick="deleteBonus(\'' + userBonuses[bn].id + '\',\'' + userId + '\')" class="danger" style="font-size:8px;padding:4px 8px">🗑</button></td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  // Статистика по месяцам
  html += '<div class="table-container"><h3>📊 Статистика</h3>'
  if (userStats.length === 0) html += '<p style="color:var(--text2);font-size:10px">Нет данных</p>'
  else {
    html += '<table><thead><tr><th>Месяц</th><th>Часы</th><th>Зарплата</th><th>Варны</th><th>Премии</th></tr></thead><tbody>'
    for (var s = 0; s < userStats.length; s++) {
      html += '<tr><td>' + userStats[s].month + '</td><td>' + (userStats[s].play_hours||0) + 'ч</td><td>' + (userStats[s].salary||0) + '₽</td><td>' + (userStats[s].warns||0) + '</td><td>' + (userStats[s].bonuses||0) + '₽</td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  c.innerHTML = html
}

async function updateUserRole(userId) {
  var sel = document.getElementById('profile-role')
  if (!sel) return
  await supabase.from('users').update({ role_id: sel.value || null }).eq('id', userId)
  showUserProfile(userId)
}

// ====== ВАРНЫ (редактирование/удаление) ======
function editWarn(warnId, userId) {
  var warn = null
  // Ищем в загруженных варнах
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>✏️ Изменить варн</h3>' +
    '<div class="form-group"><label>Причина</label><input id="edit-warn-reason" /></div>' +
    '<div class="form-group"><label>Штраф (₽)</label><input id="edit-warn-fine" type="number" /></div>' +
    '<button onclick="saveWarn(\'' + warnId + '\',\'' + userId + '\')">💾 Сохранить</button> ' +
    '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function saveWarn(warnId, userId) {
  var reason = document.getElementById('edit-warn-reason').value
  var fine = parseInt(document.getElementById('edit-warn-fine').value) || 0
  await supabase.from('warns').update({ reason: reason, fine: fine, updated_at: new Date().toISOString() }).eq('id', warnId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

async function deleteWarn(warnId, userId) {
  if (!confirm('Удалить варн?')) return
  await supabase.from('warns').delete().eq('id', warnId)
  showUserProfile(userId)
}

function editBonus(bonusId, userId) {
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>✏️ Изменить премию</h3>' +
    '<div class="form-group"><label>Сумма</label><input id="edit-bonus-amount" type="number" /></div>' +
    '<div class="form-group"><label>Причина</label><input id="edit-bonus-reason" /></div>' +
    '<button onclick="saveBonus(\'' + bonusId + '\',\'' + userId + '\')">💾 Сохранить</button> ' +
    '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function saveBonus(bonusId, userId) {
  var amt = parseInt(document.getElementById('edit-bonus-amount').value) || 0
  var reason = document.getElementById('edit-bonus-reason').value
  await supabase.from('bonuses').update({ amount: amt, reason: reason, updated_at: new Date().toISOString() }).eq('id', bonusId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

async function deleteBonus(bonusId, userId) {
  if (!confirm('Удалить премию?')) return
  await supabase.from('bonuses').delete().eq('id', bonusId)
  showUserProfile(userId)
}

// ====== МОДАЛКИ ======
function showWarnModal(userId) {
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>⚠️ Выдать варн</h3>' +
    '<div class="form-group"><label>Причина</label><input id="warn-reason" /></div>' +
    '<div class="form-group"><label>Штраф (₽)</label><input id="warn-fine" type="number" value="100" /></div>' +
    '<div class="form-group"><label>Срок (дней, 0=навсегда)</label><input id="warn-days" type="number" value="0" /></div>' +
    '<button onclick="issueWarn(\'' + userId + '\')">Выдать</button> <button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function issueWarn(userId) {
  var reason = document.getElementById('warn-reason').value
  var fine = parseInt(document.getElementById('warn-fine').value) || 0
  var days = parseInt(document.getElementById('warn-days').value) || 0
  if (!reason) return
  var exp = null
  if (days > 0) { var d = new Date(); d.setDate(d.getDate() + days); exp = d.toISOString() }
  await supabase.from('warns').insert({ user_id: userId, reason: reason, fine: fine, created_by: currentUser.username, expires_at: exp, is_active: true })
  
  var u = null
  for (var i = 0; i < users.length; i++) { if (users[i].id === userId) { u = users[i]; break } }
  if (u) {
    await supabase.from('users').update({
      warns: (u.warns || 0) + 1,
      salary: Math.max(0, (u.salary || 0) - fine),
      balance: Math.max(0, (u.balance || 0) - fine)
    }).eq('id', userId)
  }
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

function showBanModal(userId) {
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>🔒 Бан</h3>' +
    '<div class="form-group"><label>Причина</label><input id="ban-reason" /></div>' +
    '<div class="form-group"><label>Срок</label><select id="ban-duration"><option value="1h">1 час</option><option value="6h">6 часов</option><option value="1d">1 день</option><option value="3d">3 дня</option><option value="7d">7 дней</option><option value="30d">30 дней</option><option value="permanent">Навсегда</option></select></div>' +
    '<button onclick="issueBan(\'' + userId + '\')">Бан</button> <button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function issueBan(userId) {
  var reason = document.getElementById('ban-reason').value
  var dur = document.getElementById('ban-duration').value
  if (!reason) return
  var perm = dur === 'permanent'
  await supabase.from('bans').insert({ user_id: userId, reason: reason, duration: perm ? 'Навсегда' : dur, created_by: currentUser.username, is_permanent: perm })
  if (perm) await supabase.from('users').update({ is_blocked: true }).eq('id', userId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

function showBonusModal(userId) {
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>💰 Премия</h3>' +
    '<div class="form-group"><label>Сумма</label><input id="bonus-amount" type="number" value="100" /></div>' +
    '<div class="form-group"><label>Причина</label><input id="bonus-reason" /></div>' +
    '<button onclick="issueBonus(\'' + userId + '\')">Выдать</button> <button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function issueBonus(userId) {
  var amt = parseInt(document.getElementById('bonus-amount').value) || 0
  var reason = document.getElementById('bonus-reason').value
  await supabase.from('bonuses').insert({ user_id: userId, amount: amt, reason: reason, created_by: currentUser.username })
  var u = null
  for (var i = 0; i < users.length; i++) { if (users[i].id === userId) { u = users[i]; break } }
  if (u) await supabase.from('users').update({ balance: (u.balance || 0) + amt, salary: (u.salary || 0) + amt }).eq('id', userId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

function showEditHoursModal(userId) {
  var u = null
  for (var i = 0; i < users.length; i++) { if (users[i].id === userId) { u = users[i]; break } }
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>⏱ Часы</h3>' +
    '<div class="form-group"><label>Количество</label><input id="edit-hours-val" type="number" value="' + (u ? u.play_hours || 0 : 0) + '" /></div>' +
    '<button onclick="saveHours(\'' + userId + '\')">Сохранить</button> <button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function saveHours(userId) {
  var h = parseInt(document.getElementById('edit-hours-val').value) || 0
  await supabase.from('users').update({ play_hours: h }).eq('id', userId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

async function approveUser(userId) { await supabase.from('users').update({ is_approved: true }).eq('id', userId); showUserProfile(userId) }
async function toggleBlockUser(userId, blocked) { await supabase.from('users').update({ is_blocked: !blocked }).eq('id', userId); showUserProfile(userId) }

async function deleteUserAccount(userId) {
  if (!confirm('Удалить пользователя?')) return
  await supabase.from('warns').delete().eq('user_id', userId)
  await supabase.from('bans').delete().eq('user_id', userId)
  await supabase.from('bonuses').delete().eq('user_id', userId)
  await supabase.from('purchase_requests').delete().eq('user_id', userId)
  await supabase.from('salary_history').delete().eq('user_id', userId)
  await supabase.from('monthly_stats').delete().eq('user_id', userId)
  await supabase.from('users').delete().eq('id', userId)
  if (userId === currentUser.id) handleLogout(); else switchTab('users')
}

// ====== ОСЛЫ (неодобренные и забаненные) ======
async function loadOsly() {
  var c = document.getElementById('tab-content')
  if (!c) return
  
  var q = supabase.from('users').select('*, roles(*)').or('is_approved.eq.false,is_blocked.eq.true')
  if (!currentUser.is_super_admin && currentUser.admin_mode) q = q.eq('mode', currentUser.admin_mode)
  var res = await q
  var osly = res.data || []
  
  var html = '<div class="table-container"><h3>🫏 Ослы (' + osly.length + ')</h3>' +
    '<p style="color:var(--text2);font-size:10px;margin-bottom:15px">Неодобренные и заблокированные пользователи</p>'
  
  if (osly.length === 0) html += '<p style="color:var(--text2)">Все пользователи одобрены!</p>'
  else {
    html += '<table><thead><tr><th>Ник</th><th>Режим</th><th>Статус</th><th>Действия</th></tr></thead><tbody>'
    for (var i = 0; i < osly.length; i++) {
      var o = osly[i]
      var st = o.is_blocked ? '<span class="status-blocked">Заблок</span>' : '<span class="status-pending">Не одобрен</span>'
      html += '<tr>' +
        '<td>' + o.username + '</td><td>' + (o.mode || '-') + '</td><td>' + st + '</td>' +
        '<td>' +
          (!o.is_approved ? '<button onclick="approveUserFromList(\'' + o.id + '\')" style="font-size:8px;padding:4px 8px">✅</button> ' : '') +
          '<button onclick="toggleBlockFromList(\'' + o.id + '\',' + o.is_blocked + ')" class="danger" style="font-size:8px;padding:4px 8px">' + (o.is_blocked ? '🔓' : '🔒') + '</button>' +
        '</td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  c.innerHTML = html
}

async function approveUserFromList(userId) { await supabase.from('users').update({ is_approved: true }).eq('id', userId); loadOsly() }
async function toggleBlockFromList(userId, blocked) { await supabase.from('users').update({ is_blocked: !blocked }).eq('id', userId); loadOsly() }

// ====== ЗАЯВКИ ======
async function loadRequests() {
  var c = document.getElementById('tab-content')
  if (!c) return
  
  var q = supabase.from('purchase_requests').select('*').order('created_at', { ascending: false })
  if (!currentUser.is_super_admin && currentUser.admin_mode) q = q.eq('mode', currentUser.admin_mode)
  var res = await q
  allRequests = res.data || []
  
  var html = '<div class="table-container"><h3>📋 Заявки на покупки (' + allRequests.length + ')</h3>'
  
  if (allRequests.length === 0) html += '<p style="color:var(--text2)">Нет заявок</p>'
  else {
    html += '<table><thead><tr><th>Ник</th><th>Режим</th><th>Услуга</th><th>Цена</th><th>Статус</th><th>Дата</th><th>Действия</th></tr></thead><tbody>'
    for (var i = 0; i < allRequests.length; i++) {
      var req = allRequests[i]
      var statusColor = req.status === 'approved' ? '#74d474' : req.status === 'rejected' ? '#d47474' : '#ffd700'
      var statusText = req.status === 'approved' ? 'Одобрено' : req.status === 'rejected' ? 'Отклонено' : 'Ожидает'
      html += '<tr>' +
        '<td>' + req.username + '</td><td>' + req.mode + '</td><td>' + req.service + '</td><td>' + req.price + '₽</td>' +
        '<td style="color:' + statusColor + '">' + statusText + '</td><td>' + formatDate(req.created_at) + '</td>' +
        '<td>' +
          (req.status === 'pending' ? '<button onclick="processRequest(\'' + req.id + '\',\'approved\')" style="font-size:8px;padding:4px 8px">✅</button> <button onclick="processRequest(\'' + req.id + '\',\'rejected\')" class="danger" style="font-size:8px;padding:4px 8px">❌</button>' : '') +
        '</td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  c.innerHTML = html
}

async function processRequest(reqId, status) {
  var req = null
  for (var i = 0; i < allRequests.length; i++) { if (allRequests[i].id === reqId) { req = allRequests[i]; break } }
  if (!req) return
  
  await supabase.from('purchase_requests').update({ status: status, processed_at: new Date().toISOString() }).eq('id', reqId)
  
  if (status === 'rejected') {
    // Возвращаем деньги
    var userRes = await supabase.from('users').select('balance').eq('username', req.username).single()
    if (userRes.data) {
      await supabase.from('users').update({ balance: (userRes.data.balance || 0) + req.price }).eq('username', req.username)
    }
  }
  
  loadRequests()
}

// ====== БАЛАНС И ЗАЯВКИ ======
async function loadBalance() {
  var c = document.getElementById('tab-content')
  if (!c) return
  c.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text2)">Загрузка...</div>'
  
  // История покупок
  var historyRes = await supabase.from('purchase_requests').select('*').eq('username', currentUser.username).order('created_at', { ascending: false })
  var history = historyRes.data || []
  
  var html = '<div class="stats-grid">' +
    '<div class="stat-card"><div class="stat-value">' + (currentUser.balance || 0) + '₽</div><div class="stat-label">Текущий баланс</div></div>' +
    '<div class="stat-card"><div class="stat-value">' + (currentUser.salary || 0) + '₽</div><div class="stat-label">Всего зарплата</div></div>' +
    '<div class="stat-card"><div class="stat-value">' + (currentUser.pending_salary || 0) + '₽</div><div class="stat-label">Ожидает выдачи</div></div>' +
  '</div>' +
  '<div class="table-container"><h3>🛒 Приобрести услугу</h3>' +
    '<div class="form-group"><label>Ваш ник</label><input id="purchase-nick" value="' + currentUser.username + '" readonly /></div>' +
    '<div class="form-group"><label>Режим</label><select id="purchase-mode"><option value="Выживание">Выживание</option><option value="Гриферский">Гриферский</option><option value="РП-Школа">РП-Школа</option><option value="Анархия">Анархия-PE</option></select></div>' +
    '<div class="form-group"><label>Услуга</label><input id="purchase-service" placeholder="Опишите услугу..." /></div>' +
    '<div class="form-group"><label>Цена (₽)</label><input id="purchase-price" type="number" placeholder="Стоимость" /></div>' +
    '<button onclick="submitPurchase()">📤 Отправить заявку</button>' +
    '<div id="purchase-msg" style="margin-top:10px;font-size:10px"></div>' +
  '</div>' +
  '<div class="table-container"><h3>📋 История заявок (' + history.length + ')</h3>'
  
  if (history.length === 0) html += '<p style="color:var(--text2);font-size:10px">Нет заявок</p>'
  else {
    html += '<table><thead><tr><th>Услуга</th><th>Цена</th><th>Статус</th><th>Дата</th></tr></thead><tbody>'
    for (var i = 0; i < history.length; i++) {
      var h = history[i]
      var sc = h.status === 'approved' ? '#74d474' : h.status === 'rejected' ? '#d47474' : '#ffd700'
      var st = h.status === 'approved' ? 'Одобрено' : h.status === 'rejected' ? 'Отклонено' : 'Ожидает'
      html += '<tr><td>' + h.service + '</td><td>' + h.price + '₽</td><td style="color:' + sc + '">' + st + '</td><td>' + formatDate(h.created_at) + '</td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  c.innerHTML = html
}

async function submitPurchase() {
  var service = document.getElementById('purchase-service').value
  var price = parseInt(document.getElementById('purchase-price').value) || 0
  var mode = document.getElementById('purchase-mode').value
  var msg = document.getElementById('purchase-msg')
  
  if (!service || !price) { msg.style.color = '#d47474'; msg.textContent = 'Заполните все поля'; return }
  if (price > (currentUser.balance || 0)) { msg.style.color = '#d47474'; msg.textContent = 'Недостаточно средств на балансе'; return }
  
  await supabase.from('purchase_requests').insert({
    user_id: currentUser.id,
    username: currentUser.username,
    mode: mode,
    service: service,
    price: price
  })
  
  // Списываем с баланса
  await supabase.from('users').update({ balance: (currentUser.balance || 0) - price }).eq('id', currentUser.id)
  currentUser.balance = (currentUser.balance || 0) - price
  saveSession()
  
  msg.style.color = '#74d474'
  msg.textContent = '✅ Заявка отправлена! Средства зарезервированы.'
  setTimeout(function() { loadBalance() }, 1500)
}

// ====== ПРОФИЛЬ ======
async function loadProfile() {
  var c = document.getElementById('tab-content')
  if (!c) return
  
  var warnsRes = await supabase.from('warns').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
  var bonusesRes = await supabase.from('bonuses').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
  var statsRes = await supabase.from('monthly_stats').select('*').eq('user_id', currentUser.id).order('month', { ascending: false }).limit(12)
  
  var myWarns = warnsRes.data || []
  var myBonuses = bonusesRes.data || []
  var myStats = statsRes.data || []
  
  var html = '<div class="stats-grid">' +
    '<div class="stat-card"><div class="stat-value">' + (currentUser.play_hours || 0) + 'ч</div><div class="stat-label">Часы</div></div>' +
    '<div class="stat-card"><div class="stat-value">' + (currentUser.balance || 0) + '₽</div><div class="stat-label">Баланс</div></div>' +
    '<div class="stat-card"><div class="stat-value">' + (currentUser.salary || 0) + '₽</div><div class="stat-label">Зарплата</div></div>' +
    '<div class="stat-card"><div class="stat-value">' + (currentUser.warns || 0) + '</div><div class="stat-label">Варны</div></div>' +
  '</div>' +
  '<div class="table-container"><h3>👤 ' + currentUser.username + '</h3>' +
    '<p style="color:var(--text2);font-size:10px">Режим: <span style="color:var(--accent)">' + (currentUser.mode || '-') + '</span></p>' +
    '<p style="color:var(--text2);font-size:10px">Должность: <span style="color:' + (currentUser.role_color || 'var(--accent)') + '">' + (currentUser.role_name || currentUser.position || '-') + '</span></p>' +
    '<p style="color:var(--text2);font-size:10px">Выдано зарплаты: <span style="color:var(--accent)">' + (currentUser.issued_salary || 0) + '₽</span></p>' +
    '<button onclick="handleLogout()" class="danger" style="margin-top:15px">🚪 Выйти из аккаунта</button>' +
  '</div>' +
  '<div class="table-container"><h3>⚠️ Варны (' + myWarns.length + ')</h3>'
  if (myWarns.length === 0) html += '<p style="color:var(--text2);font-size:10px">Нет</p>'
  else {
    html += '<table><thead><tr><th>Причина</th><th>Штраф</th><th>Дата</th><th>Истекает</th></tr></thead><tbody>'
    for (var i = 0; i < myWarns.length; i++) html += '<tr><td>' + myWarns[i].reason + '</td><td>' + myWarns[i].fine + '₽</td><td>' + formatDate(myWarns[i].created_at) + '</td><td>' + (myWarns[i].expires_at ? formatDate(myWarns[i].expires_at) : 'Навсегда') + '</td></tr>'
    html += '</tbody></table>'
  }
  html += '</div>' +
  '<div class="table-container"><h3>💰 Премии (' + myBonuses.length + ')</h3>'
  if (myBonuses.length === 0) html += '<p style="color:var(--text2);font-size:10px">Нет</p>'
  else {
    html += '<table><thead><tr><th>Сумма</th><th>Причина</th><th>Дата</th></tr></thead><tbody>'
    for (var j = 0; j < myBonuses.length; j++) html += '<tr><td style="color:#74d474">+' + myBonuses[j].amount + '₽</td><td>' + myBonuses[j].reason + '</td><td>' + formatDate(myBonuses[j].created_at) + '</td></tr>'
    html += '</tbody></table>'
  }
  html += '</div>' +
  '<div class="table-container"><h3>📊 Статистика</h3>'
  if (myStats.length === 0) html += '<p style="color:var(--text2);font-size:10px">Нет данных</p>'
  else {
    html += '<table><thead><tr><th>Месяц</th><th>Часы</th><th>Зарплата</th><th>Варны</th><th>Премии</th></tr></thead><tbody>'
    for (var s = 0; s < myStats.length; s++) html += '<tr><td>' + myStats[s].month + '</td><td>' + (myStats[s].play_hours||0) + 'ч</td><td>' + (myStats[s].salary||0) + '₽</td><td>' + (myStats[s].warns||0) + '</td><td>' + (myStats[s].bonuses||0) + '₽</td></tr>'
    html += '</tbody></table>'
  }
  html += '</div>'
  
  c.innerHTML = html
}

// ====== РОЛИ ======
async function loadRoles() {
  var c = document.getElementById('tab-content')
  if (!c) return
  var q = supabase.from('roles').select('*').order('priority', { ascending: false })
  if (!currentUser.is_super_admin && currentUser.admin_mode) q = q.eq('mode', currentUser.admin_mode)
  var res = await q
  if (res.data) roles = res.data
  
  var html = '<div class="table-container"><h3>🎨 Должности</h3><button onclick="showCreateRole()" style="margin-bottom:15px">+ Создать</button>' +
    '<table><thead><tr><th>Название</th><th>Цвет</th><th>Приор.</th><th>Режим</th><th>Зарплата</th><th>Штраф</th><th>Действия</th></tr></thead><tbody>'
  for (var i = 0; i < roles.length; i++) {
    var r = roles[i]
    var st = r.salary_type === 'fixed' ? 'Фикс: ' + (r.salary_value||0) + '₽' : 'В час: ' + (r.salary_value||0) + '₽'
    html += '<tr><td style="color:' + r.color + '">' + r.name + '</td><td><span style="display:inline-block;width:20px;height:20px;background:' + r.color + ';border:2px solid var(--border)"></span></td><td>' + r.priority + '</td><td>' + r.mode + '</td><td>' + st + '</td><td>' + (r.warn_fine||0) + '₽</td>' +
      '<td><button onclick="editRole(\'' + r.id + '\')" style="font-size:8px;padding:4px 8px">✏️</button> <button onclick="deleteRole(\'' + r.id + '\')" class="danger" style="font-size:8px;padding:4px 8px">🗑</button></td></tr>'
  }
  html += '</tbody></table></div>'
  c.innerHTML = html
}

function showCreateRole() {
  var modes = ['Выживание','Гриферский','РП-Школа','Анархия','SKYPVP']
  var opts = ''
  for (var i = 0; i < modes.length; i++) opts += '<option value="' + modes[i] + '">' + modes[i] + '</option>'
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>🎨 Новая должность</h3>' +
    '<div class="form-group"><label>Название</label><input id="role-name" /></div>' +
    '<div class="form-group"><label>Цвет</label><input id="role-color" type="color" value="#d4a574" /></div>' +
    '<div class="form-group"><label>Приоритет</label><input id="role-priority" type="number" value="1" /></div>' +
    '<div class="form-group"><label>Режим</label><select id="role-mode">' + opts + '</select></div>' +
    '<div class="form-group"><label>Тип зарплаты</label><select id="role-salary-type"><option value="hourly">Почасовая</option><option value="fixed">Фиксированная</option></select></div>' +
    '<div class="form-group"><label>Сумма (₽)</label><input id="role-salary-value" type="number" value="0" /></div>' +
    '<div class="form-group"><label>Штраф за варн (₽)</label><input id="role-warn-fine" type="number" value="100" /></div>' +
    '<button onclick="createRole()">Создать</button> <button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function createRole() {
  var name = document.getElementById('role-name').value
  if (!name) return alert('Введите название')
  var r = await supabase.from('roles').insert({
    name: name, color: document.getElementById('role-color').value,
    priority: parseInt(document.getElementById('role-priority').value) || 0,
    mode: document.getElementById('role-mode').value,
    salary_type: document.getElementById('role-salary-type').value,
    salary_value: parseInt(document.getElementById('role-salary-value').value) || 0,
    warn_fine: parseInt(document.getElementById('role-warn-fine').value) || 0
  })
  if (r.error) alert('Ошибка: ' + r.error.message)
  else { document.querySelector('.modal-overlay').remove(); loadRoles() }
}

async function editRole(roleId) {
  var role = null
  for (var i = 0; i < roles.length; i++) { if (roles[i].id === roleId) { role = roles[i]; break } }
  if (!role) return
  var modes = ['Выживание','Гриферский','РП-Школа','Анархия','SKYPVP']
  var opts = ''
  for (var j = 0; j < modes.length; j++) opts += '<option value="' + modes[j] + '"' + (role.mode === modes[j] ? ' selected' : '') + '>' + modes[j] + '</option>'
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>✏️ Изменить</h3>' +
    '<div class="form-group"><label>Название</label><input id="edit-role-name" value="' + role.name + '" /></div>' +
    '<div class="form-group"><label>Цвет</label><input id="edit-role-color" type="color" value="' + role.color + '" /></div>' +
    '<div class="form-group"><label>Приоритет</label><input id="edit-role-priority" type="number" value="' + role.priority + '" /></div>' +
    '<div class="form-group"><label>Режим</label><select id="edit-role-mode">' + opts + '</select></div>' +
    '<div class="form-group"><label>Тип</label><select id="edit-role-salary-type"><option value="hourly"' + (role.salary_type === 'hourly' ? ' selected' : '') + '>Почасовая</option><option value="fixed"' + (role.salary_type === 'fixed' ? ' selected' : '') + '>Фиксированная</option></select></div>' +
    '<div class="form-group"><label>Сумма</label><input id="edit-role-salary-value" type="number" value="' + (role.salary_value||0) + '" /></div>' +
    '<div class="form-group"><label>Штраф</label><input id="edit-role-warn-fine" type="number" value="' + (role.warn_fine||0) + '" /></div>' +
    '<button onclick="updateRole(\'' + roleId + '\')">💾</button> <button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function updateRole(roleId) {
  await supabase.from('roles').update({
    name: document.getElementById('edit-role-name').value,
    color: document.getElementById('edit-role-color').value,
    priority: parseInt(document.getElementById('edit-role-priority').value) || 0,
    mode: document.getElementById('edit-role-mode').value,
    salary_type: document.getElementById('edit-role-salary-type').value,
    salary_value: parseInt(document.getElementById('edit-role-salary-value').value) || 0,
    warn_fine: parseInt(document.getElementById('edit-role-warn-fine').value) || 0
  }).eq('id', roleId)
  document.querySelector('.modal-overlay').remove()
  loadRoles()
}

async function deleteRole(roleId) { if (!confirm('Удалить?')) return; await supabase.from('roles').delete().eq('id', roleId); loadRoles() }

// ====== АВТОРИЗАЦИЯ ======
async function handleLogin() {
  var ue = document.getElementById('login-username'), pe = document.getElementById('login-password'), ee = document.getElementById('login-error')
  var uname = ue ? ue.value.trim() : '', pwd = pe ? pe.value : ''
  if (!uname || !pwd) { if (ee) ee.textContent = 'Заполните поля'; return }
  
  showLoading('Вход...', async function() {
    try {
      var hash = simpleHash(pwd + uname)
      var res = await supabase.from('users').select('*, roles(*)').eq('username', uname)
      if (res.error || !res.data || res.data.length === 0) { renderApp(); var e = document.getElementById('login-error'); if (e) e.textContent = 'Неверный ник или пароль'; return }
      var u = res.data[0]
      if (u.password_hash !== hash) { renderApp(); var e2 = document.getElementById('login-error'); if (e2) e2.textContent = 'Неверный пароль'; return }
      if (u.is_blocked) { renderApp(); var e3 = document.getElementById('login-error'); if (e3) e3.textContent = 'Аккаунт заблокирован'; return }
      
      currentUser = {
        id: u.id, username: u.username, mode: u.mode, position: u.position,
        role_id: u.role_id, is_approved: u.is_approved, is_blocked: u.is_blocked,
        is_super_admin: u.is_super_admin, admin_mode: u.admin_mode,
        play_hours: u.play_hours, salary: u.salary, warns: u.warns, notes: u.notes,
        balance: u.balance, issued_salary: u.issued_salary, pending_salary: u.pending_salary,
        role_name: u.roles ? u.roles.name : null, role_color: u.roles ? u.roles.color : null
      }
      saveSession(); renderApp()
    } catch (ex) { renderApp(); var e4 = document.getElementById('login-error'); if (e4) e4.textContent = 'Ошибка: ' + ex.message }
  }, 2000)
}

async function handleRegister() {
  var ue = document.getElementById('reg-username'), pe = document.getElementById('reg-password')
  var me = document.getElementById('reg-mode'), ce = document.getElementById('reg-custom-mode')
  var ee = document.getElementById('reg-error'), se = document.getElementById('reg-success')
  
  var uname = ue ? ue.value.trim() : '', pwd = pe ? pe.value : ''
  var mode = me ? me.value : ''
  if (mode === '__custom__' && ce) mode = ce.value.trim()
  
  if (ee) ee.textContent = ''; if (se) se.textContent = ''
  if (uname.length < 3) { if (ee) ee.textContent = 'Ник от 3 символов'; return }
  if (pwd.length < 6) { if (ee) ee.textContent = 'Пароль от 6 символов'; return }
  if (!mode) { if (ee) ee.textContent = 'Выберите режим'; return }
  
  try {
    var check = await supabase.from('users').select('id').eq('username', uname)
    if (check.data && check.data.length > 0) { if (ee) ee.textContent = 'Ник занят'; return }
    var hash = simpleHash(pwd + uname)
    var ins = await supabase.from('users').insert({ username: uname, password_hash: hash, mode: mode, balance: 0 })
    if (ins.error) { if (ee) ee.textContent = 'Ошибка: ' + ins.error.message; return }
    if (se) se.textContent = '✅ Успешно! Ожидайте одобрения.'
    setTimeout(function() { currentPage = 'login'; renderApp() }, 2000)
  } catch(ex) { if (ee) ee.textContent = 'Ошибка: ' + ex.message }
}

function handleLogout() { clearSession(); currentUser = null; currentPage = 'login'; renderApp() }

function renderApp() {
  var app = document.getElementById('app')
  if (!app) return
  if (!supabase) { app.innerHTML = '<div style="text-align:center;padding:100px;color:#d47474">❌ Ошибка</div>'; return }
  if (!currentUser) app.innerHTML = currentPage === 'register' ? renderRegister() : renderLogin()
  else app.innerHTML = renderDashboard()
}

function navigateTo(p) { currentPage = p; renderApp() }

// ====== ЗАПУСК ======
applyTheme(); createParticles()

if (supabase) {
  if (loadSession()) {
    supabase.from('users').select('is_blocked').eq('id', currentUser.id).single().then(function(r) {
      if (r.data && r.data.is_blocked) { clearSession(); currentUser = null }
      renderApp()
    })
  } else {
    supabase.from('modes').select('*').then(function(r) {
      modes = (r.data && r.data.length > 0) ? r.data : [
        {name:'Выживание'},{name:'Гриферский'},{name:'РП-Школа'},{name:'Анархия'},{name:'SKYPVP'},{name:'Другое'}
      ]
      renderApp()
    })
  }
}
