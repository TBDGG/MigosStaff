// ====== ХЭШ ======
function simpleHash(str) {
  var hash = 0
  for (var i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return 'h_' + Math.abs(hash).toString(36)
}

// ====== ТЕМЫ ======
var themeGroups = {
  'Геймерские': ['minecraft', 'cyberpunk', 'fantasy', 'retro'],
  'Однотонные': ['dark', 'dark-blue', 'dark-green', 'dark-red', 'dark-purple', 'light', 'light-blue']
}

var themes = {
  minecraft: {
    name: '⛏ Minecraft', group: 'Геймерские', isGamer: true,
    bg: '#1a0a0a', bg2: '#241510', card: '#2d1810', card2: '#3d1c1c',
    border: '#5c3a1e', accent: '#ffd700', accent2: '#d4a574',
    text: '#f0e6d2', text2: '#a89070', input: '#2d1810', hover: '#3d1c1c',
    danger: '#503030', dangerHover: '#301515', success: '#305030', successText: '#74d474'
  },
  cyberpunk: {
    name: '🤖 Киберпанк', group: 'Геймерские', isGamer: true,
    bg: '#0a0a0f', bg2: '#0f0f1a', card: '#151525', card2: '#1a1a30',
    border: '#303050', accent: '#00ffff', accent2: '#00cccc',
    text: '#e0e0ff', text2: '#7070a0', input: '#151525', hover: '#1a1a30',
    danger: '#503030', dangerHover: '#301515', success: '#305030', successText: '#74d474'
  },
  fantasy: {
    name: '🧙 Фэнтези', group: 'Геймерские', isGamer: true,
    bg: '#0f0a14', bg2: '#1a1020', card: '#1a1525', card2: '#251a30',
    border: '#4a3060', accent: '#c084fc', accent2: '#a855f7',
    text: '#e0d5f0', text2: '#8070a0', input: '#1a1525', hover: '#251a30',
    danger: '#503030', dangerHover: '#301515', success: '#305030', successText: '#74d474'
  },
  retro: {
    name: '🕹️ Ретро', group: 'Геймерские', isGamer: true,
    bg: '#1a1a0a', bg2: '#242410', card: '#2d2d10', card2: '#3d3d1c',
    border: '#5c5c1e', accent: '#ffd700', accent2: '#ffaa00',
    text: '#f0f0d2', text2: '#909070', input: '#2d2d10', hover: '#3d3d1c',
    danger: '#503030', dangerHover: '#301515', success: '#305030', successText: '#74d474'
  },
  dark: {
    name: '🌙 Тёмная', group: 'Однотонные', isGamer: false,
    bg: '#0a0a0f', bg2: '#0a0a0f', card: '#151520', card2: '#1a1a28',
    border: '#2a2a3a', accent: '#d4a574', accent2: '#b8946c',
    text: '#d0d0d0', text2: '#808090', input: '#151520', hover: '#1a1a28',
    danger: '#402020', dangerHover: '#301515', success: '#204020', successText: '#74d474'
  },
  'dark-blue': {
    name: '💙 Тёмно-синяя', group: 'Однотонные', isGamer: false,
    bg: '#0a0f14', bg2: '#0a0f14', card: '#151a20', card2: '#1a2028',
    border: '#2a3040', accent: '#74a4d4', accent2: '#5a8ab4',
    text: '#c0d0e0', text2: '#708090', input: '#151a20', hover: '#1a2028',
    danger: '#402020', dangerHover: '#301515', success: '#204020', successText: '#74d474'
  },
  'dark-green': {
    name: '💚 Тёмно-зелёная', group: 'Однотонные', isGamer: false,
    bg: '#0a140a', bg2: '#0a140a', card: '#152015', card2: '#1a281a',
    border: '#2a402a', accent: '#74d474', accent2: '#5ab45a',
    text: '#c0e0c0', text2: '#709070', input: '#152015', hover: '#1a281a',
    danger: '#402020', dangerHover: '#301515', success: '#204020', successText: '#74d474'
  },
  'dark-red': {
    name: '❤️ Тёмно-красная', group: 'Однотонные', isGamer: false,
    bg: '#140a0a', bg2: '#140a0a', card: '#201515', card2: '#281a1a',
    border: '#402a2a', accent: '#d47474', accent2: '#b45a5a',
    text: '#e0c0c0', text2: '#907070', input: '#201515', hover: '#281a1a',
    danger: '#402020', dangerHover: '#301515', success: '#204020', successText: '#74d474'
  },
  'dark-purple': {
    name: '💜 Тёмно-фиолетовая', group: 'Однотонные', isGamer: false,
    bg: '#0f0a14', bg2: '#0f0a14', card: '#1a1520', card2: '#201a28',
    border: '#302a40', accent: '#a484d4', accent2: '#8a6ab4',
    text: '#d0c0e0', text2: '#807090', input: '#1a1520', hover: '#201a28',
    danger: '#402020', dangerHover: '#301515', success: '#204020', successText: '#74d474'
  },
  light: {
    name: '☀️ Светлая', group: 'Однотонные', isGamer: false,
    bg: '#f0f0f0', bg2: '#f0f0f0', card: '#ffffff', card2: '#f5f5f5',
    border: '#d0d0d0', accent: '#8b5a2b', accent2: '#6b4020',
    text: '#303030', text2: '#707070', input: '#ffffff', hover: '#f0f0f0',
    danger: '#ffe0e0', dangerHover: '#ffd0d0', success: '#e0ffe0', successText: '#30a030'
  },
  'light-blue': {
    name: '💡 Светло-синяя', group: 'Однотонные', isGamer: false,
    bg: '#f0f4f8', bg2: '#f0f4f8', card: '#ffffff', card2: '#f5f8fa',
    border: '#d0d8e0', accent: '#4a8ab4', accent2: '#3a6a94',
    text: '#304050', text2: '#607080', input: '#ffffff', hover: '#f0f4f8',
    danger: '#ffe0e0', dangerHover: '#ffd0d0', success: '#e0ffe0', successText: '#30a030'
  }
}

// ====== ШРИФТЫ ======
var fontGroups = {
  'Игровые': ['Press Start 2P', 'Russo One', 'Rubik Mono One'],
  'Обычные': ['Inter', 'Roboto', 'Montserrat', 'Rubik']
}

var fonts = {
  'Press Start 2P': { name: '🎮 Pixel', import: 'Press+Start+2P', family: '"Press Start 2P", cursive' },
  'Russo One': { name: '🎯 Russo', import: 'Russo+One', family: '"Russo One", sans-serif' },
  'Rubik Mono One': { name: '🧊 Rubik Mono', import: 'Rubik+Mono+One', family: '"Rubik Mono One", sans-serif' },
  'Inter': { name: '📝 Inter', import: 'Inter:wght@400;600', family: '"Inter", sans-serif' },
  'Roboto': { name: '📄 Roboto', import: 'Roboto:wght@400;700', family: '"Roboto", sans-serif' },
  'Montserrat': { name: '📋 Montserrat', import: 'Montserrat:wght@400;600', family: '"Montserrat", sans-serif' },
  'Rubik': { name: '📃 Rubik', import: 'Rubik:wght@400;600', family: '"Rubik", sans-serif' }
}

var currentTheme = localStorage.getItem('theme') || 'dark'
var currentFont = localStorage.getItem('font') || 'Press Start 2P'

function applyTheme() {
  var theme = themes[currentTheme]
  if (!theme) { currentTheme = 'dark'; theme = themes['dark'] }
  
  var root = document.documentElement
  root.style.setProperty('--bg', theme.bg)
  root.style.setProperty('--bg2', theme.bg2)
  root.style.setProperty('--card', theme.card)
  root.style.setProperty('--card2', theme.card2)
  root.style.setProperty('--border', theme.border)
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--accent2', theme.accent2)
  root.style.setProperty('--text', theme.text)
  root.style.setProperty('--text2', theme.text2)
  root.style.setProperty('--input', theme.input)
  root.style.setProperty('--hover', theme.hover)
  root.style.setProperty('--danger', theme.danger)
  root.style.setProperty('--danger-hover', theme.dangerHover)
  root.style.setProperty('--success', theme.success)
  root.style.setProperty('--success-text', theme.successText)
  
  localStorage.setItem('theme', currentTheme)
  document.body.style.background = theme.bg
  
  if (theme.isGamer) {
    document.body.classList.remove('plain-theme')
    root.style.setProperty('--particles-display', 'block')
  } else {
    document.body.classList.add('plain-theme')
    root.style.setProperty('--particles-display', 'none')
  }
}

function applyFont() {
  var font = fonts[currentFont]
  if (!font) { currentFont = 'Press Start 2P'; font = fonts['Press Start 2P'] }
  var root = document.documentElement
  var link = document.getElementById('font-link')
  root.style.setProperty('--font', font.family)
  root.style.setProperty('--font-size', currentFont.includes('Press') ? '10px' : '13px')
  root.style.setProperty('--font-size-sm', currentFont.includes('Press') ? '8px' : '11px')
  root.style.setProperty('--font-size-lg', currentFont.includes('Press') ? '14px' : '18px')
  if (link) link.href = 'https://fonts.googleapis.com/css2?family=' + font.import + '&display=swap'
  localStorage.setItem('font', currentFont)
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
  var theme = themes[currentTheme]
  if (!theme || !theme.isGamer) return
  
  var icons = ['✦', '✧', '⛏', '⚔', '🪓', '🔮', '⭐', '💎', '🏹', '🛡']
  for (var i = 0; i < 25; i++) {
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

// ====== УТИЛИТЫ ======
function showLoading(text, callback, delay) {
  var app = document.getElementById('app')
  if (!app) return
  app.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;min-height:400px"><div style="text-align:center"><div style="font-size:48px;animation:bounce 0.6s ease infinite alternate">⛏️</div><div style="color:var(--accent);font-size:var(--font-size-lg);margin-top:20px">' + (text || 'Загрузка...') + '</div></div></div>'
  if (callback) setTimeout(callback, delay || 1500)
}

function saveSession() { if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser)) }
function loadSession() { var s = localStorage.getItem('currentUser'); if (s) { try { currentUser = JSON.parse(s); return true } catch(e){} } return false }
function clearSession() { localStorage.removeItem('currentUser') }
function formatDate(d) { if (!d) return '-'; var dt = new Date(d); return dt.toLocaleDateString('ru-RU') + ' ' + dt.toLocaleTimeString('ru-RU', {hour:'2-digit',minute:'2-digit'}) }
function currentMonth() { var d = new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).slice(-2) }

// ====== ЗАРПЛАТА ======
async function recalculateSalary(userId) {
  var userRes = await supabase.from('users').select('*, roles(*)').eq('id', userId).single()
  if (!userRes.data) return
  var user = userRes.data, role = user.roles, newPending = 0
  if (role && role.salary_value > 0) {
    if (role.salary_type === 'hourly') newPending = (user.play_hours || 0) * role.salary_value
    else if (role.salary_type === 'fixed') newPending = (user.play_hours || 0) > 0 ? role.salary_value : 0
  }
  await supabase.from('users').update({ pending_salary: newPending }).eq('id', userId)
}

async function paySalary(userId) {
  var userRes = await supabase.from('users').select('*').eq('id', userId).single()
  if (!userRes.data) return
  var user = userRes.data, pending = user.pending_salary || 0
  if (pending <= 0) return
  await supabase.from('users').update({
    balance: (user.balance || 0) + pending,
    issued_salary: (user.issued_salary || 0) + pending,
    pending_salary: 0
  }).eq('id', userId)
  await supabase.from('salary_history').insert({ user_id: userId, amount: pending, type: 'salary', month: currentMonth() })
  var statRes = await supabase.from('monthly_stats').select('*').eq('user_id', userId).eq('month', currentMonth()).single()
  if (statRes.data) await supabase.from('monthly_stats').update({ salary: pending }).eq('id', statRes.data.id)
  else await supabase.from('monthly_stats').insert({ user_id: userId, month: currentMonth(), play_hours: user.play_hours || 0, salary: pending, warns: user.warns || 0, bonuses: 0 })
  if (userId === currentUser.id) {
    currentUser.balance += pending
    currentUser.issued_salary += pending
    currentUser.pending_salary = 0
    saveSession()
  }
  showUserProfile(userId)
}

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
  for (var group in themeGroups) {
    themeOpts += '<optgroup label="' + group + '">'
    for (var t = 0; t < themeGroups[group].length; t++) {
      var key = themeGroups[group][t]
      themeOpts += '<option value="' + key + '"' + (currentTheme === key ? ' selected' : '') + '>' + themes[key].name + '</option>'
    }
    themeOpts += '</optgroup>'
  }
  
  var fontOpts = ''
  for (var fg in fontGroups) {
    fontOpts += '<optgroup label="' + fg + '">'
    for (var f = 0; f < fontGroups[fg].length; f++) {
      var fk = fontGroups[fg][f]
      fontOpts += '<option value="' + fk + '"' + (currentFont === fk ? ' selected' : '') + '>' + fonts[fk].name + '</option>'
    }
    fontOpts += '</optgroup>'
  }
  
  var html = '<div class="nav-bar"><div class="nav-user">' +
    '<span style="color:' + (currentUser.role_color || 'var(--accent)') + '">' + (currentUser.is_super_admin ? '👑 ' : '') + currentUser.username + '</span>' +
    '<span class="user-mode">' + (currentUser.mode || 'Не указан') + '</span>' +
    '<span style="color:var(--text2);font-size:var(--font-size-sm)">💰 ' + (currentUser.balance || 0) + '₽</span>' +
    '</div><div class="nav-actions">' +
    '<div class="settings-dropdown"><button onclick="toggleSettings()">⚙️</button>' +
    '<div id="settings-menu" class="settings-menu">' +
      '<div class="setting-group"><label>Тема</label><select id="theme-select" onchange="changeTheme()">' + themeOpts + '</select></div>' +
      '<div class="setting-group"><label>Шрифт</label><select id="font-select" onchange="changeFont()">' + fontOpts + '</select></div>' +
    '</div></div>' +
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

function toggleSettings() {
  var menu = document.getElementById('settings-menu')
  if (menu) menu.classList.toggle('show')
}

function changeTheme() { var s = document.getElementById('theme-select'); if (s) { currentTheme = s.value; applyTheme(); createParticles() } }
function changeFont() { var s = document.getElementById('font-select'); if (s) { currentFont = s.value; applyFont() } }

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
    else if (userFilter.sort === 'pending_salary') users.sort(function(a, b) { return (b.pending_salary||0) - (a.pending_salary||0) })
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
      '<select id="user-sort" onchange="updateFilter()" style="max-width:160px;width:auto">' +
        '<option value="priority"' + (userFilter.sort === 'priority' ? ' selected' : '') + '>По приоритету</option>' +
        '<option value="play_hours"' + (userFilter.sort === 'play_hours' ? ' selected' : '') + '>По часам</option>' +
        '<option value="pending_salary"' + (userFilter.sort === 'pending_salary' ? ' selected' : '') + '>По зарплате</option>' +
        '<option value="balance"' + (userFilter.sort === 'balance' ? ' selected' : '') + '>По балансу</option>' +
        '<option value="username"' + (userFilter.sort === 'username' ? ' selected' : '') + '>По нику</option>' +
      '</select>' +
    '</div>' +
    '<div style="overflow-x:auto"><table><thead><tr><th>Ник</th><th>Режим</th><th>Должность</th><th>Часы</th><th>Баланс</th><th>Ожидает</th><th>Выдано</th><th>Варны</th></tr></thead><tbody>'
  
  for (var l = 0; l < users.length; l++) {
    var u = users[l]
    var nc = u.roles ? u.roles.color : 'var(--accent)'
    if (u.is_super_admin) nc = '#ffd700'
    html += '<tr>' +
      '<td><a onclick="showUserProfile(\'' + u.id + '\')" style="color:' + nc + ';cursor:pointer;text-decoration:underline">' + u.username + (u.is_super_admin ? ' 👑' : '') + '</a></td>' +
      '<td>' + (u.mode || '-') + '</td>' +
      '<td style="color:' + nc + '">' + (u.roles ? u.roles.name : '-') + '</td>' +
      '<td>' + (u.play_hours || 0) + 'ч</td>' +
      '<td>' + (u.balance || 0) + '₽</td>' +
      '<td style="color:#ffd700">' + (u.pending_salary || 0) + '₽</td>' +
      '<td style="color:var(--success-text)">' + (u.issued_salary || 0) + '₽</td>' +
      '<td>' + (u.warns || 0) + '</td></tr>'
  }
  html += '</tbody></table></div></div>'
  c.innerHTML = html
}

function updateFilter() {
  var s = document.getElementById('user-search'), m = document.getElementById('user-mode-filter')
  var r = document.getElementById('user-role-filter'), sort = document.getElementById('user-sort')
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
  var bonusesRes = await supabase.from('bonuses').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  var statsRes = await supabase.from('monthly_stats').select('*').eq('user_id', userId).order('month', { ascending: false }).limit(12)
  var rolesRes = await supabase.from('roles').select('*').order('priority', { ascending: false })
  
  var userWarns = warnsRes.data || []
  var userBonuses = bonusesRes.data || []
  var userStats = statsRes.data || []
  var allRoles = rolesRes.data || []
  
  var nc = user.roles ? user.roles.color : 'var(--accent)'
  if (user.is_super_admin) nc = '#ffd700'
  
  var html = '<button onclick="switchTab(\'users\')" style="margin-bottom:20px">← Назад</button>' +
    '<div class="table-container">' +
      '<div class="profile-header">' +
        '<div class="profile-avatar" style="border-color:' + nc + '">' + (user.is_super_admin ? '👑' : '👤') + '</div>' +
        '<div class="profile-info">' +
          '<h2 style="color:' + nc + '">' + user.username + (user.is_super_admin ? ' 👑' : '') + '</h2>' +
          '<div class="profile-badges">' +
            '<span class="badge mode">' + (user.mode || 'Без режима') + '</span>' +
            (user.roles ? '<span class="badge role" style="color:' + nc + ';border-color:' + nc + '">' + user.roles.name + '</span>' : '') +
            (user.warns > 0 ? '<span class="badge warns">⚠️ ' + user.warns + ' варнов</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="stats-grid">' +
      '<div class="stat-card"><div class="stat-value">' + (user.play_hours || 0) + 'ч</div><div class="stat-label">Часы</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + (user.balance || 0) + '₽</div><div class="stat-label">Баланс</div></div>' +
      '<div class="stat-card"><div class="stat-value" style="color:#ffd700">' + (user.pending_salary || 0) + '₽</div><div class="stat-label">Ожидает</div></div>' +
      '<div class="stat-card"><div class="stat-value" style="color:var(--success-text)">' + (user.issued_salary || 0) + '₽</div><div class="stat-label">Выдано</div></div>' +
    '</div>'
  
  // Контакты
  html += '<div class="table-container"><h3>📞 Контакты</h3>' +
    '<div class="contacts-grid">' +
      '<div class="contact-card"><div class="contact-icon">📋</div><div class="contact-label">VK ID</div><div class="contact-value">' + (user.vk_id || 'Не указан') + '</div></div>' +
      '<div class="contact-card"><div class="contact-icon">💬</div><div class="contact-label">Discord</div><div class="contact-value">' + (user.discord || 'Не указан') + '</div></div>' +
      '<div class="contact-card"><div class="contact-icon">🌐</div><div class="contact-label">Forum</div><div class="contact-value">' + (user.forum || 'Не указан') + '</div></div>' +
    '</div></div>'
  
  // Смена должности
  if (user.id !== currentUser.id || currentUser.is_super_admin) {
    var roleOpts = '<option value="">Без должности</option>'
    for (var r = 0; r < allRoles.length; r++) {
      roleOpts += '<option value="' + allRoles[r].id + '"' + (user.role_id === allRoles[r].id ? ' selected' : '') + '>' + allRoles[r].name + ' (пр.' + allRoles[r].priority + ')</option>'
    }
    html += '<div class="table-container"><h3>🎨 Должность</h3>' +
      '<div class="form-group"><select id="profile-role" onchange="updateUserRole(\'' + userId + '\')">' + roleOpts + '</select></div>' +
    '</div>'
  }
  
  // Кнопки действий
  if (user.id !== currentUser.id) {
    html += '<div class="profile-actions" style="padding:0 18px;margin-bottom:15px">' +
      '<button onclick="showEditContactsModal(\'' + userId + '\')">✏️ Контакты</button>' +
      '<button onclick="showWarnModal(\'' + userId + '\')">⚠️ Варн</button>' +
      '<button onclick="showBanModal(\'' + userId + '\')">🔒 Бан</button>' +
      '<button onclick="showBonusModal(\'' + userId + '\')">💰 Премия</button>' +
      '<button onclick="showEditHoursModal(\'' + userId + '\')">⏱ Часы</button>' +
      '<button onclick="paySalary(\'' + userId + '\')" class="success">💳 Выдать</button>' +
      (!user.is_approved ? '<button onclick="approveUser(\'' + userId + '\')">✅</button>' : '') +
      '<button onclick="toggleBlockUser(\'' + userId + '\', ' + user.is_blocked + ')" class="danger">' + (user.is_blocked ? '🔓' : '🔒') + '</button>' +
      '<button onclick="deleteUserAccount(\'' + userId + '\')" class="danger">🗑</button>' +
    '</div>'
  }
  
  // Варны
  html += '<div class="table-container"><h3>⚠️ Варны (' + userWarns.length + ')</h3>'
  if (userWarns.length === 0) html += '<p style="color:var(--text2);font-size:var(--font-size-sm)">Нет</p>'
  else {
    html += '<table><thead><tr><th>Причина</th><th>Штраф</th><th>Кто</th><th>Дата</th><th>Истекает</th><th></th></tr></thead><tbody>'
    for (var w = 0; w < userWarns.length; w++) {
      html += '<tr><td>' + userWarns[w].reason + '</td><td>' + userWarns[w].fine + '₽</td><td>' + userWarns[w].created_by + '</td><td>' + formatDate(userWarns[w].created_at) + '</td><td>' + (userWarns[w].expires_at ? formatDate(userWarns[w].expires_at) : 'Навсегда') + '</td>' +
        '<td><button onclick="editWarn(\'' + userWarns[w].id + '\',\'' + userId + '\')" style="font-size:var(--font-size-sm);padding:4px 8px">✏️</button> <button onclick="deleteWarn(\'' + userWarns[w].id + '\',\'' + userId + '\')" class="danger" style="font-size:var(--font-size-sm);padding:4px 8px">✕</button></td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  // Премии
  html += '<div class="table-container"><h3>💰 Премии (' + userBonuses.length + ')</h3>'
  if (userBonuses.length === 0) html += '<p style="color:var(--text2);font-size:var(--font-size-sm)">Нет</p>'
  else {
    html += '<table><thead><tr><th>Сумма</th><th>Причина</th><th>Кто</th><th>Дата</th><th></th></tr></thead><tbody>'
    for (var bn = 0; bn < userBonuses.length; bn++) {
      html += '<tr><td style="color:var(--success-text)">+' + userBonuses[bn].amount + '₽</td><td>' + userBonuses[bn].reason + '</td><td>' + userBonuses[bn].created_by + '</td><td>' + formatDate(userBonuses[bn].created_at) + '</td>' +
        '<td><button onclick="editBonus(\'' + userBonuses[bn].id + '\',\'' + userId + '\')" style="font-size:var(--font-size-sm);padding:4px 8px">✏️</button> <button onclick="deleteBonus(\'' + userBonuses[bn].id + '\',\'' + userId + '\')" class="danger" style="font-size:var(--font-size-sm);padding:4px 8px">✕</button></td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  // Статистика
  html += '<div class="table-container"><h3>📊 Статистика</h3>'
  if (userStats.length === 0) html += '<p style="color:var(--text2);font-size:var(--font-size-sm)">Нет данных</p>'
  else {
    html += '<table><thead><tr><th>Месяц</th><th>Часы</th><th>Зарплата</th><th>Варны</th><th>Премии</th></tr></thead><tbody>'
    for (var s = 0; s < userStats.length; s++) html += '<tr><td>' + userStats[s].month + '</td><td>' + (userStats[s].play_hours||0) + 'ч</td><td>' + (userStats[s].salary||0) + '₽</td><td>' + (userStats[s].warns||0) + '</td><td>' + (userStats[s].bonuses||0) + '₽</td></tr>'
    html += '</tbody></table>'
  }
  html += '</div>'
  
  c.innerHTML = html
}

async function updateUserRole(userId) {
  var sel = document.getElementById('profile-role')
  if (!sel) return
  var roleId = sel.value || null
  await supabase.from('users').update({ role_id: roleId }).eq('id', userId)
  await recalculateSalary(userId)
  if (userId === currentUser.id) {
    var uRes = await supabase.from('users').select('*, roles(*)').eq('id', userId).single()
    if (uRes.data) {
      currentUser.pending_salary = uRes.data.pending_salary
      currentUser.role_name = uRes.data.roles ? uRes.data.roles.name : null
      currentUser.role_color = uRes.data.roles ? uRes.data.roles.color : null
      currentUser.role_id = uRes.data.role_id
      saveSession()
    }
  }
  showUserProfile(userId)
}

// ====== КОНТАКТЫ ======
function showEditContactsModal(userId) {
  var user = null
  for (var i = 0; i < users.length; i++) { if (users[i].id === userId) { user = users[i]; break } }
  if (!user) return
  
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>✏️ Контакты</h3>' +
    '<div class="form-group"><label>VK ID</label><input id="edit-vk" value="' + (user.vk_id || '') + '" /></div>' +
    '<div class="form-group"><label>Discord</label><input id="edit-discord" value="' + (user.discord || '') + '" /></div>' +
    '<div class="form-group"><label>Forum</label><input id="edit-forum" value="' + (user.forum || '') + '" /></div>' +
    '<button onclick="saveContacts(\'' + userId + '\')">💾 Сохранить</button> ' +
    '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function saveContacts(userId) {
  await supabase.from('users').update({
    vk_id: document.getElementById('edit-vk').value,
    discord: document.getElementById('edit-discord').value,
    forum: document.getElementById('edit-forum').value
  }).eq('id', userId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

// ====== ВАРНЫ ======
function editWarn(warnId, userId) {
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>✏️ Варн</h3>' +
    '<div class="form-group"><label>Причина</label><input id="edit-warn-reason" /></div>' +
    '<div class="form-group"><label>Штраф</label><input id="edit-warn-fine" type="number" /></div>' +
    '<button onclick="saveWarn(\'' + warnId + '\',\'' + userId + '\')">💾</button> ' +
    '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function saveWarn(warnId, userId) {
  await supabase.from('warns').update({
    reason: document.getElementById('edit-warn-reason').value,
    fine: parseInt(document.getElementById('edit-warn-fine').value) || 0,
    updated_at: new Date().toISOString()
  }).eq('id', warnId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

async function deleteWarn(warnId, userId) {
  if (!confirm('Удалить?')) return
  await supabase.from('warns').delete().eq('id', warnId)
  var c = await supabase.from('warns').select('id', { count: 'exact' }).eq('user_id', userId).eq('is_active', true)
  await supabase.from('users').update({ warns: c.count || 0 }).eq('id', userId)
  showUserProfile(userId)
}

function editBonus(bonusId, userId) {
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>✏️ Премия</h3>' +
    '<div class="form-group"><label>Сумма</label><input id="edit-bonus-amount" type="number" /></div>' +
    '<div class="form-group"><label>Причина</label><input id="edit-bonus-reason" /></div>' +
    '<button onclick="saveBonus(\'' + bonusId + '\',\'' + userId + '\')">💾</button> ' +
    '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function saveBonus(bonusId, userId) {
  await supabase.from('bonuses').update({
    amount: parseInt(document.getElementById('edit-bonus-amount').value) || 0,
    reason: document.getElementById('edit-bonus-reason').value,
    updated_at: new Date().toISOString()
  }).eq('id', bonusId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

async function deleteBonus(bonusId, userId) {
  if (!confirm('Удалить?')) return
  await supabase.from('bonuses').delete().eq('id', bonusId)
  showUserProfile(userId)
}

// ====== МОДАЛКИ ======
function showWarnModal(userId) {
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>⚠️ Варн</h3>' +
    '<div class="form-group"><label>Причина</label><input id="warn-reason" /></div>' +
    '<div class="form-group"><label>Штраф (₽)</label><input id="warn-fine" type="number" value="100" /></div>' +
    '<div class="form-group"><label>Срок (дней)</label><input id="warn-days" type="number" value="0" /></div>' +
    '<button onclick="issueWarn(\'' + userId + '\')">Выдать</button> ' +
    '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function issueWarn(userId) {
  var reason = document.getElementById('warn-reason').value
  var fine = parseInt(document.getElementById('warn-fine').value) || 0
  var days = parseInt(document.getElementById('warn-days').value) || 0
  if (!reason) return
  var exp = null; if (days > 0) { var d = new Date(); d.setDate(d.getDate() + days); exp = d.toISOString() }
  await supabase.from('warns').insert({ user_id: userId, reason: reason, fine: fine, created_by: currentUser.username, expires_at: exp, is_active: true })
  var u = null; for (var i = 0; i < users.length; i++) { if (users[i].id === userId) { u = users[i]; break } }
  if (u) await supabase.from('users').update({ warns: (u.warns || 0) + 1, balance: Math.max(0, (u.balance || 0) - fine) }).eq('id', userId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

function showBanModal(userId) {
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>🔒 Бан</h3>' +
    '<div class="form-group"><label>Причина</label><input id="ban-reason" /></div>' +
    '<div class="form-group"><label>Срок</label><select id="ban-duration"><option value="1h">1 час</option><option value="6h">6 ч</option><option value="1d">1 день</option><option value="3d">3 дня</option><option value="7d">7 дней</option><option value="30d">30 дней</option><option value="permanent">Навсегда</option></select></div>' +
    '<button onclick="issueBan(\'' + userId + '\')">Бан</button> ' +
    '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
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
    '<button onclick="issueBonus(\'' + userId + '\')">Выдать</button> ' +
    '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function issueBonus(userId) {
  var amt = parseInt(document.getElementById('bonus-amount').value) || 0
  var reason = document.getElementById('bonus-reason').value
  await supabase.from('bonuses').insert({ user_id: userId, amount: amt, reason: reason, created_by: currentUser.username })
  var u = null; for (var i = 0; i < users.length; i++) { if (users[i].id === userId) { u = users[i]; break } }
  if (u) await supabase.from('users').update({ balance: (u.balance || 0) + amt }).eq('id', userId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

function showEditHoursModal(userId) {
  var u = null; for (var i = 0; i < users.length; i++) { if (users[i].id === userId) { u = users[i]; break } }
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>⏱ Часы</h3>' +
    '<div class="form-group"><label>Количество</label><input id="edit-hours-val" type="number" value="' + (u ? u.play_hours || 0 : 0) + '" /></div>' +
    '<button onclick="saveHours(\'' + userId + '\')">💾</button> ' +
    '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button></div>'
  document.body.appendChild(m)
}

async function saveHours(userId) {
  var h = parseInt(document.getElementById('edit-hours-val').value) || 0
  await supabase.from('users').update({ play_hours: h }).eq('id', userId)
  await recalculateSalary(userId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

async function approveUser(userId) { await supabase.from('users').update({ is_approved: true }).eq('id', userId); showUserProfile(userId) }
async function toggleBlockUser(userId, blocked) { await supabase.from('users').update({ is_blocked: !blocked }).eq('id', userId); showUserProfile(userId) }

async function deleteUserAccount(userId) {
  if (!confirm('Удалить?')) return
  await supabase.from('warns').delete().eq('user_id', userId)
  await supabase.from('bans').delete().eq('user_id', userId)
  await supabase.from('bonuses').delete().eq('user_id', userId)
  await supabase.from('purchase_requests').delete().eq('user_id', userId)
  await supabase.from('salary_history').delete().eq('user_id', userId)
  await supabase.from('monthly_stats').delete().eq('user_id', userId)
  await supabase.from('users').delete().eq('id', userId)
  if (userId === currentUser.id) handleLogout(); else switchTab('users')
}

// ====== ОСЛЫ ======
async function loadOsly() {
  var c = document.getElementById('tab-content')
  if (!c) return
  var q = supabase.from('users').select('*').or('is_approved.eq.false,is_blocked.eq.true')
  if (!currentUser.is_super_admin && currentUser.admin_mode) q = q.eq('mode', currentUser.admin_mode)
  var res = await q; var osly = res.data || []
  var html = '<div class="table-container"><h3>🫏 Ослы (' + osly.length + ')</h3>'
  if (osly.length === 0) html += '<p style="color:var(--text2)">Все одобрены!</p>'
  else {
    html += '<table><thead><tr><th>Ник</th><th>Режим</th><th>Статус</th><th></th></tr></thead><tbody>'
    for (var i = 0; i < osly.length; i++) {
      var o = osly[i], st = o.is_blocked ? '<span class="status-blocked">Заблок</span>' : '<span class="status-pending">Не одобрен</span>'
      html += '<tr><td>' + o.username + '</td><td>' + (o.mode || '-') + '</td><td>' + st + '</td>' +
        '<td>' + (!o.is_approved ? '<button onclick="approveUserFromList(\'' + o.id + '\')" style="font-size:var(--font-size-sm)">✅</button> ' : '') +
        '<button onclick="toggleBlockFromList(\'' + o.id + '\',' + o.is_blocked + ')" class="danger" style="font-size:var(--font-size-sm)">' + (o.is_blocked ? '🔓' : '🔒') + '</button></td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'; c.innerHTML = html
}

async function approveUserFromList(userId) { await supabase.from('users').update({ is_approved: true }).eq('id', userId); loadOsly() }
async function toggleBlockFromList(userId, blocked) { await supabase.from('users').update({ is_blocked: !blocked }).eq('id', userId); loadOsly() }

// ====== ЗАЯВКИ ======
async function loadRequests() {
  var c = document.getElementById('tab-content')
  if (!c) return
  var q = supabase.from('purchase_requests').select('*').order('created_at', { ascending: false })
  if (!currentUser.is_super_admin && currentUser.admin_mode) q = q.eq('mode', currentUser.admin_mode)
  var res = await q; allRequests = res.data || []
  var html = '<div class="table-container"><h3>📋 Заявки (' + allRequests.length + ')</h3>'
  if (allRequests.length === 0) html += '<p style="color:var(--text2)">Нет</p>'
  else {
    html += '<table><thead><tr><th>Ник</th><th>Режим</th><th>Услуга</th><th>Цена</th><th>Статус</th><th>Дата</th><th></th></tr></thead><tbody>'
    for (var i = 0; i < allRequests.length; i++) {
      var req = allRequests[i], sc = req.status === 'approved' ? 'var(--success-text)' : req.status === 'rejected' ? '#d47474' : '#ffd700'
      var st = req.status === 'approved' ? 'Одобрено' : req.status === 'rejected' ? 'Отклонено' : 'Ожидает'
      html += '<tr><td>' + req.username + '</td><td>' + req.mode + '</td><td>' + req.service + '</td><td>' + req.price + '₽</td><td style="color:' + sc + '">' + st + '</td><td>' + formatDate(req.created_at) + '</td>' +
        '<td>' + (req.status === 'pending' ? '<button onclick="processRequest(\'' + req.id + '\',\'approved\')" style="font-size:var(--font-size-sm)">✅</button> <button onclick="processRequest(\'' + req.id + '\',\'rejected\')" class="danger" style="font-size:var(--font-size-sm)">❌</button>' : '') + '</td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'; c.innerHTML = html
}

async function processRequest(reqId, status) {
  var req = null; for (var i = 0; i < allRequests.length; i++) { if (allRequests[i].id === reqId) { req = allRequests[i]; break } }
  if (!req) return
  await supabase.from('purchase_requests').update({ status: status, processed_at: new Date().toISOString() }).eq('id', reqId)
  if (status === 'rejected') {
    var ur = await supabase.from('users').select('balance').eq('username', req.username).single()
    if (ur.data) await supabase.from('users').update({ balance: (ur.data.balance || 0) + req.price }).eq('username', req.username)
  }
  loadRequests()
}

// ====== БАЛАНС ======
async function loadBalance() {
  var c = document.getElementById('tab-content')
  if (!c) return
  var hr = await supabase.from('purchase_requests').select('*').eq('username', currentUser.username).order('created_at', { ascending: false })
  var history = hr.data || []
  var html = '<div class="stats-grid">' +
    '<div class="stat-card"><div class="stat-value">' + (currentUser.balance || 0) + '₽</div><div class="stat-label">Баланс</div></div>' +
    '<div class="stat-card"><div class="stat-value" style="color:#ffd700">' + (currentUser.pending_salary || 0) + '₽</div><div class="stat-label">Ожидает</div></div>' +
    '<div class="stat-card"><div class="stat-value" style="color:var(--success-text)">' + (currentUser.issued_salary || 0) + '₽</div><div class="stat-label">Выдано</div></div>' +
  '</div>' +
  '<div class="table-container"><h3>🛒 Приобрести услугу</h3>' +
    '<div class="form-group"><label>Ник</label><input id="purchase-nick" value="' + currentUser.username + '" readonly /></div>' +
    '<div class="form-group"><label>Режим</label><select id="purchase-mode"><option>Выживание</option><option>Гриферский</option><option>РП-Школа</option><option>Анархия-PE</option></select></div>' +
    '<div class="form-group"><label>Услуга</label><input id="purchase-service" /></div>' +
    '<div class="form-group"><label>Цена (₽)</label><input id="purchase-price" type="number" /></div>' +
    '<button onclick="submitPurchase()">📤 Отправить</button><div id="purchase-msg" style="margin-top:10px;font-size:var(--font-size-sm)"></div>' +
  '</div>' +
  '<div class="table-container"><h3>📋 История (' + history.length + ')</h3>'
  if (history.length === 0) html += '<p style="color:var(--text2)">Нет</p>'
  else {
    html += '<table><thead><tr><th>Услуга</th><th>Цена</th><th>Статус</th><th>Дата</th></tr></thead><tbody>'
    for (var i = 0; i < history.length; i++) {
      var h = history[i], sc = h.status === 'approved' ? 'var(--success-text)' : h.status === 'rejected' ? '#d47474' : '#ffd700'
      html += '<tr><td>' + h.service + '</td><td>' + h.price + '₽</td><td style="color:' + sc + '">' + (h.status === 'approved' ? 'Одобрено' : h.status === 'rejected' ? 'Отклонено' : 'Ожидает') + '</td><td>' + formatDate(h.created_at) + '</td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'; c.innerHTML = html
}

async function submitPurchase() {
  var service = document.getElementById('purchase-service').value, price = parseInt(document.getElementById('purchase-price').value) || 0
  var mode = document.getElementById('purchase-mode').value, msg = document.getElementById('purchase-msg')
  if (!service || !price) { msg.style.color = '#d47474'; msg.textContent = 'Заполните поля'; return }
  if (price > (currentUser.balance || 0)) { msg.style.color = '#d47474'; msg.textContent = 'Недостаточно средств'; return }
  await supabase.from('purchase_requests').insert({ user_id: currentUser.id, username: currentUser.username, mode: mode, service: service, price: price })
  await supabase.from('users').update({ balance: (currentUser.balance || 0) - price }).eq('id', currentUser.id)
  currentUser.balance -= price; saveSession()
  msg.style.color = 'var(--success-text)'; msg.textContent = '✅ Отправлено!'
  setTimeout(function() { loadBalance() }, 1500)
}

// ====== ПРОФИЛЬ (свой) ======
async function loadProfile() {
  var c = document.getElementById('tab-content')
  if (!c) return
  var warnsRes = await supabase.from('warns').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
  var bonusesRes = await supabase.from('bonuses').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
  var statsRes = await supabase.from('monthly_stats').select('*').eq('user_id', currentUser.id).order('month', { ascending: false }).limit(12)
  var myWarns = warnsRes.data || [], myBonuses = bonusesRes.data || [], myStats = statsRes.data || []
  var nc = currentUser.role_color || 'var(--accent)'
  if (currentUser.is_super_admin) nc = '#ffd700'
  
  var html = '<div class="table-container">' +
    '<div class="profile-header">' +
      '<div class="profile-avatar" style="border-color:' + nc + '">' + (currentUser.is_super_admin ? '👑' : '👤') + '</div>' +
      '<div class="profile-info">' +
        '<h2 style="color:' + nc + '">' + currentUser.username + '</h2>' +
        '<div class="profile-badges">' +
          '<span class="badge mode">' + (currentUser.mode || 'Без режима') + '</span>' +
          (currentUser.role_name ? '<span class="badge role" style="color:' + nc + ';border-color:' + nc + '">' + currentUser.role_name + '</span>' : '') +
          (currentUser.warns > 0 ? '<span class="badge warns">⚠️ ' + currentUser.warns + ' варнов</span>' : '') +
        '</div>' +
      '</div>' +
    '</div></div>' +
    '<div class="stats-grid">' +
      '<div class="stat-card"><div class="stat-value">' + (currentUser.play_hours || 0) + 'ч</div><div class="stat-label">Часы</div></div>' +
      '<div class="stat-card"><div class="stat-value">' + (currentUser.balance || 0) + '₽</div><div class="stat-label">Баланс</div></div>' +
      '<div class="stat-card"><div class="stat-value" style="color:#ffd700">' + (currentUser.pending_salary || 0) + '₽</div><div class="stat-label">Ожидает</div></div>' +
      '<div class="stat-card"><div class="stat-value" style="color:var(--success-text)">' + (currentUser.issued_salary || 0) + '₽</div><div class="stat-label">Выдано</div></div>' +
    '</div>' +
    '<div class="table-container"><h3>📞 Контакты</h3>' +
    '<div class="contacts-grid">' +
      '<div class="contact-card"><div class="contact-icon">📋</div><div class="contact-label">VK ID</div><div class="contact-value">' + (currentUser.vk_id || 'Не указан') + '</div></div>' +
      '<div class="contact-card"><div class="contact-icon">💬</div><div class="contact-label">Discord</div><div class="contact-value">' + (currentUser.discord || 'Не указан') + '</div></div>' +
      '<div class="contact-card"><div class="contact-icon">🌐</div><div class="contact-label">Forum</div><div class="contact-value">' + (currentUser.forum || 'Не указан') + '</div></div>' +
    '</div></div>' +
    '<button onclick="handleLogout()" class="danger" style="margin:15px 0;width:100%">🚪 Выйти из аккаунта</button>' +
    '<div class="table-container"><h3>⚠️ Варны (' + myWarns.length + ')</h3>'
  if (myWarns.length === 0) html += '<p style="color:var(--text2)">Нет</p>'
  else {
    html += '<table><thead><tr><th>Причина</th><th>Штраф</th><th>Дата</th><th>Истекает</th></tr></thead><tbody>'
    for (var i = 0; i < myWarns.length; i++) html += '<tr><td>' + myWarns[i].reason + '</td><td>' + myWarns[i].fine + '₽</td><td>' + formatDate(myWarns[i].created_at) + '</td><td>' + (myWarns[i].expires_at ? formatDate(myWarns[i].expires_at) : 'Навсегда') + '</td></tr>'
    html += '</tbody></table>'
  }
  html += '</div>' +
  '<div class="table-container"><h3>💰 Премии (' + myBonuses.length + ')</h3>'
  if (myBonuses.length === 0) html += '<p style="color:var(--text2)">Нет</p>'
  else {
    html += '<table><thead><tr><th>Сумма</th><th>Причина</th><th>Дата</th></tr></thead><tbody>'
    for (var j = 0; j < myBonuses.length; j++) html += '<tr><td style="color:var(--success-text)">+' + myBonuses[j].amount + '₽</td><td>' + myBonuses[j].reason + '</td><td>' + formatDate(myBonuses[j].created_at) + '</td></tr>'
    html += '</tbody></table>'
  }
  html += '</div>' +
  '<div class="table-container"><h3>📊 Статистика</h3>'
  if (myStats.length === 0) html += '<p style="color:var(--text2)">Нет</p>'
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
  var res = await q; if (res.data) roles = res.data
  var html = '<div class="table-container"><h3>🎨 Должности</h3><button onclick="showCreateRole()" style="margin-bottom:15px">+ Создать</button>' +
    '<table><thead><tr><th>Название</th><th>Цвет</th><th>Пр.</th><th>Режим</th><th>Зарплата</th><th>Штраф</th><th></th></tr></thead><tbody>'
  for (var i = 0; i < roles.length; i++) {
    var r = roles[i], st = r.salary_type === 'fixed' ? 'Фикс: ' + (r.salary_value||0) + '₽' : 'Час: ' + (r.salary_value||0) + '₽'
    html += '<tr><td style="color:' + r.color + '">' + r.name + '</td><td><span style="display:inline-block;width:16px;height:16px;background:' + r.color + ';border:1px solid var(--border);border-radius:4px"></span></td><td>' + r.priority + '</td><td>' + r.mode + '</td><td>' + st + '</td><td>' + (r.warn_fine||0) + '₽</td>' +
      '<td><button onclick="editRole(\'' + r.id + '\')" style="font-size:var(--font-size-sm);padding:4px 8px">✏️</button> <button onclick="deleteRole(\'' + r.id + '\')" class="danger" style="font-size:var(--font-size-sm);padding:4px 8px">✕</button></td></tr>'
  }
  html += '</tbody></table></div>'; c.innerHTML = html
}

function showCreateRole() {
  var modes = ['Выживание','Гриферский','РП-Школа','Анархия','SKYPVP']
  var opts = ''; for (var i = 0; i < modes.length; i++) opts += '<option>' + modes[i] + '</option>'
  var m = document.createElement('div'); m.className = 'modal-overlay'
  m.innerHTML = '<div class="modal"><h3>🎨 Новая должность</h3>' +
    '<div class="form-group"><label>Название</label><input id="role-name" /></div>' +
    '<div class="form-group"><label>Цвет</label><input id="role-color" type="color" value="#d4a574" /></div>' +
    '<div class="form-group"><label>Приоритет</label><input id="role-priority" type="number" value="1" /></div>' +
    '<div class="form-group"><label>Режим</label><select id="role-mode">' + opts + '</select></div>' +
    '<div class="form-group"><label>Тип зарплаты</label><select id="role-salary-type"><option value="hourly">Почасовая</option><option value="fixed">Фиксированная</option></select></div>' +
    '<div class="form-group"><label>Сумма</label><input id="role-salary-value" type="number" value="0" /></div>' +
    '<div class="form-group"><label>Штраф</label><input id="role-warn-fine" type="number" value="100" /></div>' +
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
  var role = null; for (var i = 0; i < roles.length; i++) { if (roles[i].id === roleId) { role = roles[i]; break } }
  if (!role) return
  var modes = ['Выживание','Гриферский','РП-Школа','Анархия','SKYPVP']
  var opts = ''; for (var j = 0; j < modes.length; j++) opts += '<option value="' + modes[j] + '"' + (role.mode === modes[j] ? ' selected' : '') + '>' + modes[j] + '</option>'
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
  document.querySelector('.modal-overlay').remove(); loadRoles()
}

async function deleteRole(roleId) { if (!confirm('Удалить?')) return; await supabase.from('roles').delete().eq('id', roleId); loadRoles() }

// ====== АВТОРИЗАЦИЯ ======
async function handleLogin() {
  var ue = document.getElementById('login-username'), pe = document.getElementById('login-password'), ee = document.getElementById('login-error')
  var uname = ue ? ue.value.trim() : '', pwd = pe ? pe.value : ''
  if (!uname || !pwd) { if (ee) ee.textContent = 'Заполните поля'; return }
  showLoading('Вход...', async function() {
    var hash = simpleHash(pwd + uname)
    var res = await supabase.from('users').select('*, roles(*)').eq('username', uname)
    if (res.error || !res.data || res.data.length === 0) { renderApp(); var e = document.getElementById('login-error'); if (e) e.textContent = 'Неверный ник или пароль'; return }
    var u = res.data[0]
    if (u.password_hash !== hash) { renderApp(); var e2 = document.getElementById('login-error'); if (e2) e2.textContent = 'Неверный пароль'; return }
    if (u.is_blocked) { renderApp(); var e3 = document.getElementById('login-error'); if (e3) e3.textContent = 'Заблокирован'; return }
    currentUser = {
      id: u.id, username: u.username, mode: u.mode, position: u.position,
      role_id: u.role_id, is_approved: u.is_approved, is_blocked: u.is_blocked,
      is_super_admin: u.is_super_admin, admin_mode: u.admin_mode,
      play_hours: u.play_hours, warns: u.warns, notes: u.notes,
      balance: u.balance, issued_salary: u.issued_salary, pending_salary: u.pending_salary,
      vk_id: u.vk_id, discord: u.discord, forum: u.forum,
      role_name: u.roles ? u.roles.name : null, role_color: u.roles ? u.roles.color : null
    }
    saveSession(); renderApp()
  }, 2000)
}

async function handleRegister() {
  var ue = document.getElementById('reg-username'), pe = document.getElementById('reg-password')
  var me = document.getElementById('reg-mode'), ce = document.getElementById('reg-custom-mode')
  var ee = document.getElementById('reg-error'), se = document.getElementById('reg-success')
  var uname = ue ? ue.value.trim() : '', pwd = pe ? pe.value : '', mode = me ? me.value : ''
  if (mode === '__custom__' && ce) mode = ce.value.trim()
  if (ee) ee.textContent = ''; if (se) se.textContent = ''
  if (uname.length < 3) { if (ee) ee.textContent = 'Ник от 3 символов'; return }
  if (pwd.length < 6) { if (ee) ee.textContent = 'Пароль от 6 символов'; return }
  if (!mode) { if (ee) ee.textContent = 'Выберите режим'; return }
  var check = await supabase.from('users').select('id').eq('username', uname)
  if (check.data && check.data.length > 0) { if (ee) ee.textContent = 'Ник занят'; return }
  var hash = simpleHash(pwd + uname)
  var ins = await supabase.from('users').insert({ username: uname, password_hash: hash, mode: mode, balance: 0, pending_salary: 0, issued_salary: 0 })
  if (ins.error) { if (ee) ee.textContent = 'Ошибка: ' + ins.error.message; return }
  if (se) se.textContent = '✅ Успешно!'
  setTimeout(function() { currentPage = 'login'; renderApp() }, 2000)
}

function handleLogout() { clearSession(); currentUser = null; currentPage = 'login'; renderApp() }
function renderApp() {
  var app = document.getElementById('app')
  if (!app) return
  if (!currentUser) app.innerHTML = currentPage === 'register' ? renderRegister() : renderLogin()
  else app.innerHTML = renderDashboard()
}
function navigateTo(p) { currentPage = p; renderApp() }

// ====== ЗАПУСК ======
applyTheme(); applyFont(); createParticles()

if (supabase) {
  if (loadSession()) {
    supabase.from('users').select('*, roles(*)').eq('id', currentUser.id).single().then(function(r) {
      if (r.data) {
        if (r.data.is_blocked) { clearSession(); currentUser = null }
        else {
          currentUser.pending_salary = r.data.pending_salary
          currentUser.issued_salary = r.data.issued_salary
          currentUser.balance = r.data.balance
          currentUser.play_hours = r.data.play_hours
          currentUser.warns = r.data.warns
          currentUser.vk_id = r.data.vk_id
          currentUser.discord = r.data.discord
          currentUser.forum = r.data.forum
          currentUser.role_id = r.data.role_id
          currentUser.role_name = r.data.roles ? r.data.roles.name : null
          currentUser.role_color = r.data.roles ? r.data.roles.color : null
          saveSession()
        }
      }
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
