// ====== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ======
var supabase = window.supabaseClient || window.supabase
var currentUser = null
var currentPage = 'login'
var currentTab = 'users'
var users = []
var roles = []
var modes = []
var userWarns = []
var userBans = []
var userBonuses = []

console.log('🚀 app.js загружен')

// ====== ЧАСТИЦЫ ======
function createParticles() {
  var container = document.querySelector('.particles')
  if (!container) return
  
  var icons = ['✦', '✧', '⛏', '⚔', '🪓', '🔮', '⭐', '💎', '🏹', '🛡']
  
  for (var i = 0; i < 35; i++) {
    var particle = document.createElement('span')
    particle.className = 'particle'
    particle.textContent = icons[Math.floor(Math.random() * icons.length)]
    particle.style.left = Math.random() * 100 + '%'
    particle.style.fontSize = (Math.random() * 14 + 8) + 'px'
    particle.style.animationDuration = (Math.random() * 15 + 10) + 's'
    particle.style.animationDelay = Math.random() * 15 + 's'
    particle.style.setProperty('--drift', ((Math.random() - 0.5) * 200) + 'px')
    particle.style.setProperty('--spin', (Math.random() * 360) + 'deg')
    container.appendChild(particle)
  }
}

// ====== ПОЛЕЗНЫЕ ФУНКЦИИ ======
function showLoading(text, callback, delay) {
  var app = document.getElementById('app')
  if (!app) return
  
  app.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; min-height: 400px;">' +
    '<div style="text-align: center;">' +
      '<div style="font-size: 48px; animation: bounce 0.6s ease infinite alternate;">⛏️</div>' +
      '<div style="color: #ffd700; font-size: 14px; margin-top: 20px; font-family: \'Press Start 2P\', cursive;">' + (text || 'Загрузка...') + '</div>' +
    '</div>' +
  '</div>'
  
  setTimeout(function() {
    if (callback) callback()
  }, delay || 1500)
}

function saveSession() {
  if (currentUser) {
    localStorage.setItem('currentUser', JSON.stringify(currentUser))
  }
}

function loadSession() {
  var saved = localStorage.getItem('currentUser')
  if (saved) {
    try {
      currentUser = JSON.parse(saved)
      return true
    } catch(e) {
      return false
    }
  }
  return false
}

function clearSession() {
  localStorage.removeItem('currentUser')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  var d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

// ====== РЕНДЕР ======
function renderLogin() {
  return '<div class="form-card">' +
    '<h2>⚡ Вход в панель</h2>' +
    '<div class="form-group">' +
      '<label>Никнейм</label>' +
      '<input id="login-username" placeholder="Введите ник..." autocomplete="off" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Пароль</label>' +
      '<input id="login-password" type="password" placeholder="Введите пароль..." autocomplete="off" />' +
    '</div>' +
    '<div id="login-error" class="error-msg"></div>' +
    '<button onclick="handleLogin()">Войти</button>' +
    '<div class="form-links">' +
      '<a onclick="navigateTo(\'register\')">Нет аккаунта? Зарегистрироваться</a>' +
    '</div>' +
  '</div>'
}

function renderRegister() {
  var options = '<option value="">Выберите режим...</option>'
  for (var i = 0; i < modes.length; i++) {
    options += '<option value="' + modes[i].name + '">' + modes[i].name + '</option>'
  }
  options += '<option value="__custom__">✏️ Свой вариант...</option>'
  
  return '<div class="form-card">' +
    '<h2>📝 Регистрация</h2>' +
    '<div class="form-group">' +
      '<label>Никнейм</label>' +
      '<input id="reg-username" placeholder="Введите ник..." autocomplete="off" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Пароль</label>' +
      '<input id="reg-password" type="password" placeholder="Минимум 6 символов" autocomplete="off" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Режим</label>' +
      '<select id="reg-mode" onchange="checkCustomMode()">' + options + '</select>' +
      '<input id="reg-custom-mode" placeholder="Введите свой режим..." style="display: none; margin-top: 10px;" />' +
    '</div>' +
    '<div id="reg-error" class="error-msg"></div>' +
    '<div id="reg-success" class="success-msg"></div>' +
    '<button onclick="handleRegister()">Зарегистрироваться</button>' +
    '<div class="form-links">' +
      '<a onclick="navigateTo(\'login\')">Уже есть аккаунт? Войти</a>' +
    '</div>' +
  '</div>'
}

function checkCustomMode() {
  var select = document.getElementById('reg-mode')
  var customInput = document.getElementById('reg-custom-mode')
  if (select && customInput) {
    if (select.value === '__custom__') {
      customInput.style.display = 'block'
    } else {
      customInput.style.display = 'none'
    }
  }
}

function renderDashboard() {
  if (!currentUser) return renderLogin()
  
  var isAdmin = currentUser.is_super_admin || (currentUser.admin_mode && currentUser.is_approved)
  
  var html = '<div class="nav-bar">' +
    '<div class="nav-user">' +
      '<span style="color: ' + (currentUser.role_color || '#ffd700') + '; font-size: 11px;">' +
        (currentUser.is_super_admin ? '👑 ' : '') + currentUser.username +
      '</span>' +
      '<span class="user-mode">' + (currentUser.mode || 'Не указан') + '</span>'
  
  if (currentUser.position) {
    html += '<span style="color: #a89070; font-size: 8px;">' + currentUser.position + '</span>'
  }
  
  html += '</div>' +
    '<div class="nav-actions">' +
      '<button onclick="showProfile()">👤 Профиль</button>' +
      (isAdmin ? '<button onclick="switchTab(\'users\')">👥 Пользователи</button>' : '') +
      (isAdmin ? '<button onclick="switchTab(\'roles\')">🎨 Роли</button>' : '') +
      '<button onclick="handleLogout()">🚪 Выйти</button>' +
    '</div>' +
  '</div>' +
  '<div id="tab-content"></div>'
  
  setTimeout(function() {
    if (isAdmin) {
      switchTab('users')
    } else {
      showProfile()
    }
  }, 0)
  
  return html
}

// ====== ВКЛАДКИ ======
function switchTab(tab) {
  currentTab = tab
  var content = document.getElementById('tab-content')
  if (!content) return
  
  var buttons = document.querySelectorAll('.nav-actions button')
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active')
  }
  
  if (tab === 'users') {
    loadUsers()
  } else if (tab === 'roles') {
    loadRoles()
  }
}

// ====== ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ ======
var userFilter = { mode: '', sort: 'created_at', search: '' }

async function loadUsers() {
  var content = document.getElementById('tab-content')
  if (!content) return
  
  content.innerHTML = '<div style="text-align: center; padding: 40px; color: #ffd700;">⏳ Загрузка...</div>'
  
  var query = supabase.from('users').select('*, roles(*)')
  
  // Фильтр по режиму админа
  if (!currentUser.is_super_admin && currentUser.admin_mode) {
    query = query.eq('mode', currentUser.admin_mode)
  }
  
  var result = await query.order(userFilter.sort, { ascending: userFilter.sort === 'salary' || userFilter.sort === 'play_hours' ? false : true })
  
  if (result.data) {
    users = result.data
    
    // Применяем фильтры
    if (userFilter.mode) {
      users = users.filter(function(u) { return u.mode === userFilter.mode })
    }
    if (userFilter.search) {
      var s = userFilter.search.toLowerCase()
      users = users.filter(function(u) { return u.username.toLowerCase().indexOf(s) !== -1 })
    }
  }
  
  var modesList = []
  for (var i = 0; i < users.length; i++) {
    if (modesList.indexOf(users[i].mode) === -1 && users[i].mode) {
      modesList.push(users[i].mode)
    }
  }
  
  var modeFilterOptions = '<option value="">Все режимы</option>'
  for (var j = 0; j < modesList.length; j++) {
    var sel = userFilter.mode === modesList[j] ? ' selected' : ''
    modeFilterOptions += '<option value="' + modesList[j] + '"' + sel + '>' + modesList[j] + '</option>'
  }
  
  var html = '<div class="table-container">' +
    '<h3>📋 Пользователи (' + users.length + ')</h3>' +
    '<div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; align-items: center;">' +
      '<input id="user-search" placeholder="🔍 Поиск по нику..." value="' + userFilter.search + '" style="max-width: 250px;" oninput="updateUserFilter()" />' +
      '<select id="user-mode-filter" onchange="updateUserFilter()" style="max-width: 200px;">' + modeFilterOptions + '</select>' +
      '<select id="user-sort" onchange="updateUserFilter()" style="max-width: 200px;">' +
        '<option value="created_at"' + (userFilter.sort === 'created_at' ? ' selected' : '') + '>По дате</option>' +
        '<option value="play_hours"' + (userFilter.sort === 'play_hours' ? ' selected' : '') + '>По часам</option>' +
        '<option value="salary"' + (userFilter.sort === 'salary' ? ' selected' : '') + '>По зарплате</option>' +
        '<option value="username"' + (userFilter.sort === 'username' ? ' selected' : '') + '>По нику</option>' +
      '</select>' +
    '</div>' +
    '<div style="overflow-x: auto;">' +
    '<table>' +
      '<thead><tr>' +
        '<th>Ник</th>' +
        '<th>Режим</th>' +
        '<th>Должность</th>' +
        '<th>Часы</th>' +
        '<th>Зарплата</th>' +
        '<th>Варны</th>' +
        '<th>Статус</th>' +
      '</tr></thead>' +
      '<tbody>'
  
  for (var k = 0; k < users.length; k++) {
    var u = users[k]
    var status = u.is_blocked ? '<span class="status-blocked">Заблок</span>' : u.is_approved ? '<span class="status-approved">Активен</span>' : '<span class="status-pending">Ждёт</span>'
    var nickColor = u.roles ? u.roles.color : '#c4a882'
    if (u.is_super_admin) nickColor = '#ffd700'
    
    html += '<tr>' +
      '<td><a onclick="showUserProfile(\'' + u.id + '\')" style="color: ' + nickColor + '; cursor: pointer; text-decoration: underline;">' + u.username + (u.is_super_admin ? ' 👑' : '') + '</a></td>' +
      '<td>' + (u.mode || '-') + '</td>' +
      '<td>' + (u.position || '-') + '</td>' +
      '<td>' + (u.play_hours || 0) + 'ч</td>' +
      '<td>' + (u.salary || 0) + '₽</td>' +
      '<td>' + (u.warns || 0) + '</td>' +
      '<td>' + status + '</td>' +
    '</tr>'
  }
  
  html += '</tbody></table></div></div>'
  content.innerHTML = html
}

function updateUserFilter() {
  var searchEl = document.getElementById('user-search')
  var modeEl = document.getElementById('user-mode-filter')
  var sortEl = document.getElementById('user-sort')
  
  if (searchEl) userFilter.search = searchEl.value
  if (modeEl) userFilter.mode = modeEl.value
  if (sortEl) userFilter.sort = sortEl.value
  
  loadUsers()
}

// ====== ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ======
async function showUserProfile(userId) {
  var user = null
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      user = users[i]
      break
    }
  }
  if (!user) return
  
  var content = document.getElementById('tab-content')
  if (!content) return
  
  content.innerHTML = '<div style="text-align: center; padding: 40px; color: #ffd700;">⏳ Загрузка профиля...</div>'
  
  // Загружаем варны, баны, премии
  var warnsResult = await supabase.from('warns').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  var bansResult = await supabase.from('bans').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  var bonusesResult = await supabase.from('bonuses').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  
  userWarns = warnsResult.data || []
  userBans = bansResult.data || []
  userBonuses = bonusesResult.data || []
  
  var nickColor = user.roles ? user.roles.color : '#ffd700'
  if (user.is_super_admin) nickColor = '#ffd700'
  
  var html = '<div style="margin-bottom: 20px;">' +
    '<button onclick="switchTab(\'users\')">← Назад к списку</button>' +
  '</div>' +
  '<div class="stats-grid">' +
    '<div class="stat-card">' +
      '<div class="stat-value">' + (user.play_hours || 0) + 'ч</div>' +
      '<div class="stat-label">Наиграно часов</div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-value">' + (user.salary || 0) + '₽</div>' +
      '<div class="stat-label">Зарплата</div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-value">' + (user.warns || 0) + '</div>' +
      '<div class="stat-label">Активных варнов</div>' +
    '</div>' +
  '</div>' +
  '<div class="table-container">' +
    '<h3>👤 ' + user.username + '</h3>' +
    '<p style="color: #a89070; font-size: 10px;">Режим: <span style="color: #ffd700;">' + (user.mode || '-') + '</span></p>' +
    '<p style="color: #a89070; font-size: 10px;">Должность: <span style="color: #ffd700;">' + (user.position || '-') + '</span></p>' +
    '<p style="color: #a89070; font-size: 10px;">Роль: <span style="color: ' + nickColor + ';">' + (user.roles ? user.roles.name : 'Нет') + '</span></p>' +
    '<p style="color: #a89070; font-size: 10px;">Статус: ' + (user.is_blocked ? '<span style="color: #ff4444;">Заблокирован</span>' : user.is_approved ? '<span style="color: #44ff44;">Активен</span>' : '<span style="color: #ffd700;">Ожидает одобрения</span>') + '</p>' +
    '<p style="color: #a89070; font-size: 10px;">Предупреждения: <span style="color: #ff4444;">' + (user.notes || 'Нет') + '</span></p>' +
  '</div>'
  
  // Кнопки действий
  if (user.id !== currentUser.id) {
    html += '<div style="display: flex; gap: 10px; margin: 15px 0; flex-wrap: wrap;">' +
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
  html += '<div class="table-container"><h3>⚠️ Варны</h3>'
  if (userWarns.length === 0) {
    html += '<p style="color: #a89070; font-size: 10px;">Нет варнов</p>'
  } else {
    html += '<table><thead><tr><th>Причина</th><th>Штраф</th><th>Кто выдал</th><th>Дата</th><th>Истекает</th></tr></thead><tbody>'
    for (var w = 0; w < userWarns.length; w++) {
      var warn = userWarns[w]
      html += '<tr>' +
        '<td>' + warn.reason + '</td>' +
        '<td>' + warn.fine + '₽</td>' +
        '<td>' + warn.created_by + '</td>' +
        '<td>' + formatDate(warn.created_at) + '</td>' +
        '<td>' + (warn.expires_at ? formatDate(warn.expires_at) : 'Навсегда') + '</td>' +
      '</tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  // Баны
  html += '<div class="table-container"><h3>🔒 Баны</h3>'
  if (userBans.length === 0) {
    html += '<p style="color: #a89070; font-size: 10px;">Нет банов</p>'
  } else {
    html += '<table><thead><tr><th>Причина</th><th>Длительность</th><th>Кто выдал</th><th>Дата</th></tr></thead><tbody>'
    for (var b = 0; b < userBans.length; b++) {
      var ban = userBans[b]
      html += '<tr>' +
        '<td>' + ban.reason + '</td>' +
        '<td>' + (ban.is_permanent ? 'Навсегда' : ban.duration) + '</td>' +
        '<td>' + ban.created_by + '</td>' +
        '<td>' + formatDate(ban.created_at) + '</td>' +
      '</tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  // Премии
  html += '<div class="table-container"><h3>💰 Премии</h3>'
  if (userBonuses.length === 0) {
    html += '<p style="color: #a89070; font-size: 10px;">Нет премий</p>'
  } else {
    html += '<table><thead><tr><th>Сумма</th><th>Причина</th><th>Кто выдал</th><th>Дата</th></tr></thead><tbody>'
    for (var bn = 0; bn < userBonuses.length; bn++) {
      var bonus = userBonuses[bn]
      html += '<tr>' +
        '<td style="color: #44ff44;">+' + bonus.amount + '₽</td>' +
        '<td>' + bonus.reason + '</td>' +
        '<td>' + bonus.created_by + '</td>' +
        '<td>' + formatDate(bonus.created_at) + '</td>' +
      '</tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  content.innerHTML = html
}

// ====== МОДАЛЬНЫЕ ОКНА ======
function showWarnModal(userId) {
  var modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = '<div class="modal">' +
    '<h3>⚠️ Выдать варн</h3>' +
    '<div class="form-group"><label>Причина</label><input id="warn-reason" placeholder="Причина варна..." /></div>' +
    '<div class="form-group"><label>Штраф (₽)</label><input id="warn-fine" type="number" value="100" /></div>' +
    '<div class="form-group"><label>Срок (дней, 0 = навсегда)</label><input id="warn-days" type="number" value="0" /></div>' +
    '<div style="display: flex; gap: 10px; margin-top: 15px;">' +
      '<button onclick="issueWarn(\'' + userId + '\')">Выдать</button>' +
      '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button>' +
    '</div>' +
  '</div>'
  document.body.appendChild(modal)
}

async function issueWarn(userId) {
  var reason = document.getElementById('warn-reason').value
  var fine = parseInt(document.getElementById('warn-fine').value) || 0
  var days = parseInt(document.getElementById('warn-days').value) || 0
  
  if (!reason) return
  
  var expiresAt = null
  if (days > 0) {
    var d = new Date()
    d.setDate(d.getDate() + days)
    expiresAt = d.toISOString()
  }
  
  await supabase.from('warns').insert({
    user_id: userId,
    reason: reason,
    fine: fine,
    created_by: currentUser.username,
    expires_at: expiresAt
  })
  
  // Обновляем счётчик варнов и зарплату
  var user = null
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === userId) { user = users[i]; break }
  }
  if (user) {
    await supabase.from('users').update({
      warns: (user.warns || 0) + 1,
      salary: Math.max(0, (user.salary || 0) - fine)
    }).eq('id', userId)
  }
  
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

function showBanModal(userId) {
  var modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = '<div class="modal">' +
    '<h3>🔒 Выдать бан</h3>' +
    '<div class="form-group"><label>Причина</label><input id="ban-reason" placeholder="Причина бана..." /></div>' +
    '<div class="form-group"><label>Длительность</label><select id="ban-duration">' +
      '<option value="1h">1 час</option><option value="6h">6 часов</option><option value="1d">1 день</option>' +
      '<option value="3d">3 дня</option><option value="7d">7 дней</option><option value="30d">30 дней</option>' +
      '<option value="permanent">Навсегда</option>' +
    '</select></div>' +
    '<div style="display: flex; gap: 10px; margin-top: 15px;">' +
      '<button onclick="issueBan(\'' + userId + '\')">Забанить</button>' +
      '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button>' +
    '</div>' +
  '</div>'
  document.body.appendChild(modal)
}

async function issueBan(userId) {
  var reason = document.getElementById('ban-reason').value
  var duration = document.getElementById('ban-duration').value
  
  if (!reason) return
  
  var isPermanent = duration === 'permanent'
  
  await supabase.from('bans').insert({
    user_id: userId,
    reason: reason,
    duration: isPermanent ? 'Навсегда' : duration,
    created_by: currentUser.username,
    is_permanent: isPermanent
  })
  
  if (isPermanent) {
    await supabase.from('users').update({ is_blocked: true }).eq('id', userId)
  }
  
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

function showBonusModal(userId) {
  var modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = '<div class="modal">' +
    '<h3>💰 Выдать премию</h3>' +
    '<div class="form-group"><label>Сумма (₽)</label><input id="bonus-amount" type="number" value="100" /></div>' +
    '<div class="form-group"><label>Причина</label><input id="bonus-reason" placeholder="За что премия..." /></div>' +
    '<div style="display: flex; gap: 10px; margin-top: 15px;">' +
      '<button onclick="issueBonus(\'' + userId + '\')">Выдать</button>' +
      '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button>' +
    '</div>' +
  '</div>'
  document.body.appendChild(modal)
}

async function issueBonus(userId) {
  var amount = parseInt(document.getElementById('bonus-amount').value) || 0
  var reason = document.getElementById('bonus-reason').value
  
  await supabase.from('bonuses').insert({
    user_id: userId,
    amount: amount,
    reason: reason,
    created_by: currentUser.username
  })
  
  var user = null
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === userId) { user = users[i]; break }
  }
  if (user) {
    await supabase.from('users').update({
      salary: (user.salary || 0) + amount
    }).eq('id', userId)
  }
  
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

function showEditHoursModal(userId) {
  var user = null
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === userId) { user = users[i]; break }
  }
  
  var modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = '<div class="modal">' +
    '<h3>⏱ Указать часы</h3>' +
    '<div class="form-group"><label>Количество часов</label><input id="edit-hours-val" type="number" value="' + (user ? user.play_hours || 0 : 0) + '" /></div>' +
    '<div style="display: flex; gap: 10px; margin-top: 15px;">' +
      '<button onclick="saveHours(\'' + userId + '\')">Сохранить</button>' +
      '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button>' +
    '</div>' +
  '</div>'
  document.body.appendChild(modal)
}

async function saveHours(userId) {
  var hours = parseInt(document.getElementById('edit-hours-val').value) || 0
  await supabase.from('users').update({ play_hours: hours }).eq('id', userId)
  document.querySelector('.modal-overlay').remove()
  showUserProfile(userId)
}

// ====== ДЕЙСТВИЯ ======
async function approveUser(userId) {
  await supabase.from('users').update({ is_approved: true }).eq('id', userId)
  showUserProfile(userId)
}

async function toggleBlockUser(userId, isBlocked) {
  await supabase.from('users').update({ is_blocked: !isBlocked }).eq('id', userId)
  showUserProfile(userId)
}

async function deleteUserAccount(userId) {
  if (!confirm('Точно удалить пользователя? Это действие необратимо!')) return
  
  await supabase.from('warns').delete().eq('user_id', userId)
  await supabase.from('bans').delete().eq('user_id', userId)
  await supabase.from('bonuses').delete().eq('user_id', userId)
  await supabase.from('users').delete().eq('id', userId)
  
  if (userId === currentUser.id) {
    handleLogout()
  } else {
    switchTab('users')
  }
}

// ====== РОЛИ ======
async function loadRoles() {
  var content = document.getElementById('tab-content')
  if (!content) return
  
  content.innerHTML = '<div style="text-align: center; padding: 40px; color: #ffd700;">⏳ Загрузка...</div>'
  
  var query = supabase.from('roles').select('*').order('priority', { ascending: false })
  if (!currentUser.is_super_admin && currentUser.admin_mode) {
    query = query.eq('mode', currentUser.admin_mode)
  }
  
  var result = await query
  if (result.data) roles = result.data
  
  var html = '<div class="table-container">' +
    '<h3>🎨 Роли</h3>' +
    '<button onclick="showCreateRole()" style="margin-bottom: 15px;">+ Создать роль</button>' +
    '<table><thead><tr>' +
      '<th>Название</th><th>Цвет</th><th>Приоритет</th><th>Режим</th><th>Зарплата</th><th>Штраф</th><th>Действия</th>' +
    '</tr></thead><tbody>'
  
  for (var i = 0; i < roles.length; i++) {
    var r = roles[i]
    var salaryType = r.salary_type === 'fixed' ? 'Фикс: ' + (r.salary_value || 0) + '₽' : 'В час: ' + (r.salary_value || 0) + '₽'
    
    html += '<tr>' +
      '<td style="color: ' + r.color + '">' + r.name + '</td>' +
      '<td><span style="display: inline-block; width: 20px; height: 20px; background: ' + r.color + '; border: 2px solid #5c3a1e;"></span></td>' +
      '<td>' + r.priority + '</td>' +
      '<td>' + r.mode + '</td>' +
      '<td>' + salaryType + '</td>' +
      '<td>' + (r.warn_fine || 0) + '₽</td>' +
      '<td>' +
        '<button onclick="editRole(\'' + r.id + '\')" style="font-size: 8px; padding: 5px 8px;">✏️</button> ' +
        '<button onclick="deleteRole(\'' + r.id + '\')" class="danger" style="font-size: 8px; padding: 5px 8px;">🗑</button>' +
      '</td>' +
    '</tr>'
  }
  
  html += '</tbody></table></div>'
  content.innerHTML = html
}

function showCreateRole() {
  var modeOptions = ''
  var allModes = ['Выживание', 'Гриферский', 'РП-Школа', 'Анархия', 'SKYPVP']
  for (var i = 0; i < allModes.length; i++) {
    modeOptions += '<option value="' + allModes[i] + '">' + allModes[i] + '</option>'
  }
  
  var modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = '<div class="modal">' +
    '<h3>🎨 Новая роль</h3>' +
    '<div class="form-group"><label>Название</label><input id="role-name" placeholder="Модератор" /></div>' +
    '<div class="form-group"><label>Цвет</label><input id="role-color" type="color" value="#ffd700" /></div>' +
    '<div class="form-group"><label>Приоритет</label><input id="role-priority" type="number" value="1" /></div>' +
    '<div class="form-group"><label>Режим</label><select id="role-mode">' + modeOptions + '</select></div>' +
    '<div class="form-group"><label>Тип зарплаты</label><select id="role-salary-type"><option value="hourly">Почасовая</option><option value="fixed">Фиксированная</option></select></div>' +
    '<div class="form-group"><label>Сумма (₽)</label><input id="role-salary-value" type="number" value="0" /></div>' +
    '<div class="form-group"><label>Штраф за варн (₽)</label><input id="role-warn-fine" type="number" value="100" /></div>' +
    '<div style="display: flex; gap: 10px; margin-top: 15px;">' +
      '<button onclick="createRole()">Создать</button>' +
      '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button>' +
    '</div>' +
  '</div>'
  document.body.appendChild(modal)
}

async function createRole() {
  var name = document.getElementById('role-name').value
  var color = document.getElementById('role-color').value
  var priority = parseInt(document.getElementById('role-priority').value) || 0
  var mode = document.getElementById('role-mode').value
  var salaryType = document.getElementById('role-salary-type').value
  var salaryValue = parseInt(document.getElementById('role-salary-value').value) || 0
  var warnFine = parseInt(document.getElementById('role-warn-fine').value) || 0
  
  if (!name) return alert('Введите название роли')
  
  var result = await supabase.from('roles').insert({
    name: name,
    color: color,
    priority: priority,
    mode: mode,
    salary_type: salaryType,
    salary_value: salaryValue,
    warn_fine: warnFine
  })
  
  if (result.error) {
    alert('Ошибка: ' + result.error.message)
  } else {
    document.querySelector('.modal-overlay').remove()
    loadRoles()
  }
}

async function editRole(roleId) {
  var role = null
  for (var i = 0; i < roles.length; i++) {
    if (roles[i].id === roleId) { role = roles[i]; break }
  }
  if (!role) return
  
  var allModes = ['Выживание', 'Гриферский', 'РП-Школа', 'Анархия', 'SKYPVP']
  var modeOptions = ''
  for (var j = 0; j < allModes.length; j++) {
    var sel = role.mode === allModes[j] ? ' selected' : ''
    modeOptions += '<option value="' + allModes[j] + '"' + sel + '>' + allModes[j] + '</option>'
  }
  
  var modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = '<div class="modal">' +
    '<h3>✏️ Редактирование роли</h3>' +
    '<div class="form-group"><label>Название</label><input id="edit-role-name" value="' + role.name + '" /></div>' +
    '<div class="form-group"><label>Цвет</label><input id="edit-role-color" type="color" value="' + role.color + '" /></div>' +
    '<div class="form-group"><label>Приоритет</label><input id="edit-role-priority" type="number" value="' + role.priority + '" /></div>' +
    '<div class="form-group"><label>Режим</label><select id="edit-role-mode">' + modeOptions + '</select></div>' +
    '<div class="form-group"><label>Тип зарплаты</label><select id="edit-role-salary-type"><option value="hourly"' + (role.salary_type === 'hourly' ? ' selected' : '') + '>Почасовая</option><option value="fixed"' + (role.salary_type === 'fixed' ? ' selected' : '') + '>Фиксированная</option></select></div>' +
    '<div class="form-group"><label>Сумма (₽)</label><input id="edit-role-salary-value" type="number" value="' + (role.salary_value || 0) + '" /></div>' +
    '<div class="form-group"><label>Штраф за варн (₽)</label><input id="edit-role-warn-fine" type="number" value="' + (role.warn_fine || 0) + '" /></div>' +
    '<div style="display: flex; gap: 10px; margin-top: 15px;">' +
      '<button onclick="updateRole(\'' + roleId + '\')">💾 Сохранить</button>' +
      '<button onclick="this.closest(\'.modal-overlay\').remove()">Отмена</button>' +
    '</div>' +
  '</div>'
  document.body.appendChild(modal)
}

async function updateRole(roleId) {
  var data = {
    name: document.getElementById('edit-role-name').value,
    color: document.getElementById('edit-role-color').value,
    priority: parseInt(document.getElementById('edit-role-priority').value) || 0,
    mode: document.getElementById('edit-role-mode').value,
    salary_type: document.getElementById('edit-role-salary-type').value,
    salary_value: parseInt(document.getElementById('edit-role-salary-value').value) || 0,
    warn_fine: parseInt(document.getElementById('edit-role-warn-fine').value) || 0
  }
  
  await supabase.from('roles').update(data).eq('id', roleId)
  document.querySelector('.modal-overlay').remove()
  loadRoles()
}

async function deleteRole(roleId) {
  if (!confirm('Удалить роль?')) return
  await supabase.from('roles').delete().eq('id', roleId)
  loadRoles()
}

// ====== ПРОФИЛЬ ======
function showProfile() {
  var content = document.getElementById('tab-content')
  if (!content) return
  
  loadUserWarns()
}

async function loadUserWarns() {
  var content = document.getElementById('tab-content')
  if (!content) return
  
  var warnsResult = await supabase.from('warns').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
  var bonusesResult = await supabase.from('bonuses').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false })
  
  userWarns = warnsResult.data || []
  userBonuses = bonusesResult.data || []
  
  var html = '<div class="stats-grid">' +
    '<div class="stat-card">' +
      '<div class="stat-value">' + (currentUser.play_hours || 0) + 'ч</div>' +
      '<div class="stat-label">Наиграно часов</div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-value">' + (currentUser.salary || 0) + '₽</div>' +
      '<div class="stat-label">Зарплата</div>' +
    '</div>' +
    '<div class="stat-card">' +
      '<div class="stat-value">' + (currentUser.warns || 0) + '</div>' +
      '<div class="stat-label">Варнов</div>' +
    '</div>' +
  '</div>' +
  '<div class="table-container">' +
    '<h3>👤 Мой профиль</h3>' +
    '<p style="color: #a89070; font-size: 10px;">Ник: <span style="color: #ffd700;">' + currentUser.username + '</span></p>' +
    '<p style="color: #a89070; font-size: 10px;">Режим: <span style="color: #ffd700;">' + (currentUser.mode || 'Не указан') + '</span></p>' +
    '<p style="color: #a89070; font-size: 10px;">Должность: <span style="color: #ffd700;">' + (currentUser.position || 'Не указана') + '</span></p>' +
  '</div>' +
  '<div class="table-container"><h3>⚠️ Мои варны</h3>'
  
  if (userWarns.length === 0) {
    html += '<p style="color: #a89070; font-size: 10px;">Нет варнов</p>'
  } else {
    html += '<table><thead><tr><th>Причина</th><th>Штраф</th><th>Дата</th><th>Истекает</th></tr></thead><tbody>'
    for (var i = 0; i < userWarns.length; i++) {
      var w = userWarns[i]
      html += '<tr><td>' + w.reason + '</td><td>' + w.fine + '₽</td><td>' + formatDate(w.created_at) + '</td><td>' + (w.expires_at ? formatDate(w.expires_at) : 'Навсегда') + '</td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  // Премии
  html += '<div class="table-container"><h3>💰 Мои премии</h3>'
  if (userBonuses.length === 0) {
    html += '<p style="color: #a89070; font-size: 10px;">Нет премий</p>'
  } else {
    html += '<table><thead><tr><th>Сумма</th><th>Причина</th><th>Дата</th></tr></thead><tbody>'
    for (var j = 0; j < userBonuses.length; j++) {
      var bn = userBonuses[j]
      html += '<tr><td style="color: #44ff44;">+' + bn.amount + '₽</td><td>' + bn.reason + '</td><td>' + formatDate(bn.created_at) + '</td></tr>'
    }
    html += '</tbody></table>'
  }
  html += '</div>'
  
  content.innerHTML = html
}

// ====== АВТОРИЗАЦИЯ ======
async function handleLogin() {
  var usernameEl = document.getElementById('login-username')
  var passwordEl = document.getElementById('login-password')
  var errorEl = document.getElementById('login-error')
  
  var username = usernameEl ? usernameEl.value.trim() : ''
  var password = passwordEl ? passwordEl.value : ''
  
  if (!username || !password) {
    if (errorEl) errorEl.textContent = 'Заполните все поля'
    return
  }
  
  showLoading('Вход в систему...', async function() {
    try {
      var hashedPassword = btoa(password + username)
      
      // Ищем пользователя по имени
      var result = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('username', username)
      
      if (result.error || !result.data || result.data.length === 0) {
        renderApp()
        var errEl = document.getElementById('login-error')
        if (errEl) errEl.textContent = 'Неверный ник или пароль'
        return
      }
      
      var user = result.data[0]
      
      // Проверяем пароль
      if (user.password_hash !== hashedPassword) {
        renderApp()
        var errEl2 = document.getElementById('login-error')
        if (errEl2) errEl2.textContent = 'Неверный пароль'
        return
      }
      
      if (user.is_blocked) {
        renderApp()
        var errEl3 = document.getElementById('login-error')
        if (errEl3) errEl3.textContent = 'Ваш аккаунт заблокирован'
        return
      }
      
      currentUser = {
        id: user.id,
        username: user.username,
        mode: user.mode,
        position: user.position,
        role_id: user.role_id,
        is_approved: user.is_approved,
        is_blocked: user.is_blocked,
        is_super_admin: user.is_super_admin,
        admin_mode: user.admin_mode,
        play_hours: user.play_hours,
        salary: user.salary,
        warns: user.warns,
        notes: user.notes,
        role_name: user.roles ? user.roles.name : null,
        role_color: user.roles ? user.roles.color : null
      }
      
      saveSession()
      renderApp()
    } catch (e) {
      renderApp()
      var errEl4 = document.getElementById('login-error')
      if (errEl4) errEl4.textContent = 'Ошибка: ' + e.message
    }
  }, 2000)
}
async function handleRegister() {
  var usernameEl = document.getElementById('reg-username')
  var passwordEl = document.getElementById('reg-password')
  var modeEl = document.getElementById('reg-mode')
  var customEl = document.getElementById('reg-custom-mode')
  var errorEl = document.getElementById('reg-error')
  var successEl = document.getElementById('reg-success')
  
  var username = usernameEl ? usernameEl.value.trim() : ''
  var password = passwordEl ? passwordEl.value : ''
  var mode = modeEl ? modeEl.value : ''
  
  if (mode === '__custom__' && customEl) {
    mode = customEl.value.trim()
  }
  
  if (errorEl) errorEl.textContent = ''
  if (successEl) successEl.textContent = ''
  
  if (username.length < 3) {
    if (errorEl) errorEl.textContent = 'Ник должен быть не менее 3 символов'
    return
  }
  
  if (password.length < 6) {
    if (errorEl) errorEl.textContent = 'Пароль должен быть не менее 6 символов'
    return
  }
  
  if (!mode) {
    if (errorEl) errorEl.textContent = 'Выберите режим'
    return
  }
  
  try {
    var checkResult = await supabase.from('users').select('id').eq('username', username)
    
    if (checkResult.data && checkResult.data.length > 0) {
      if (errorEl) errorEl.textContent = 'Пользователь с таким ником уже существует'
      return
    }
    
    var hashedPassword = btoa(password + username)
    
    var insertResult = await supabase.from('users').insert({
      username: username,
      password_hash: hashedPassword,
      mode: mode
    })
    
    if (insertResult.error) {
      if (errorEl) errorEl.textContent = 'Ошибка: ' + insertResult.error.message
      return
    }
    
    if (successEl) successEl.textContent = '✅ Регистрация успешна! Ожидайте одобрения.'
    setTimeout(function() {
      currentPage = 'login'
      renderApp()
    }, 2000)
  } catch (e) {
    if (errorEl) errorEl.textContent = 'Ошибка: ' + e.message
  }
}

function handleLogout() {
  clearSession()
  currentUser = null
  currentPage = 'login'
  renderApp()
}

// ====== ГЛАВНЫЙ РЕНДЕР ======
function renderApp() {
  var app = document.getElementById('app')
  if (!app) return
  
  if (!supabase) {
    app.innerHTML = '<div style="text-align: center; padding: 100px; color: #ff4444;">❌ Ошибка подключения</div>'
    return
  }
  
  if (!currentUser) {
    app.innerHTML = currentPage === 'register' ? renderRegister() : renderLogin()
  } else {
    app.innerHTML = renderDashboard()
  }
}

// ====== НАВИГАЦИЯ ======
function navigateTo(page) {
  currentPage = page
  renderApp()
}

// ====== ЗАПУСК ======
createParticles()

if (supabase) {
  if (loadSession()) {
    console.log('✅ Сессия загружена:', currentUser.username)
    supabase.from('users').select('is_blocked').eq('id', currentUser.id).single().then(function(r) {
      if (r.data && r.data.is_blocked) {
        clearSession()
        currentUser = null
      }
      renderApp()
    })
  } else {
    supabase.from('modes').select('*').then(function(result) {
      if (result.data && result.data.length > 0) {
        modes = result.data
      } else {
        modes = [
          { id: '1', name: 'Выживание' },
          { id: '2', name: 'Гриферский' },
          { id: '3', name: 'РП-Школа' },
          { id: '4', name: 'Анархия' },
          { id: '5', name: 'SKYPVP' },
          { id: '6', name: 'Другое' }
        ]
      }
      renderApp()
    })
  }
}
