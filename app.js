// ====== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ======
var supabase = window.supabaseClient || window.supabase
var currentUser = null
var currentPage = 'login'
var currentTab = 'users'
var users = []
var roles = []
var modes = []

console.log('🚀 app.js загружен, supabase:', !!supabase)

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

// ====== ЭКРАН ЗАГРУЗКИ ======
function showLoading(text, callback, delay) {
  var app = document.getElementById('app')
  if (!app) return
  
  app.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; min-height: 400px;">' +
    '<div style="text-align: center;">' +
      '<div style="font-size: 48px; animation: bounce 0.6s ease infinite alternate;">⛏️</div>' +
      '<div style="color: #ffd700; font-size: 14px; margin-top: 20px;">' + (text || 'Загрузка...') + '</div>' +
      '<div class="loading-bar" style="width: 200px; height: 4px; background: #3d1c1c; margin: 15px auto 0; border: 2px solid #5c3a1e; position: relative; overflow: hidden;">' +
        '<div style="position: absolute; top: 0; left: 0; height: 100%; width: 60%; background: #ffd700; animation: loading 1.5s ease infinite;"></div>' +
      '</div>' +
    '</div>' +
  '</div>'
  
  setTimeout(function() {
    if (callback) callback()
  }, delay || 2000)
}

// ====== СОХРАНЕНИЕ СЕССИИ ======
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

// ====== РЕНДЕР ======
function renderLogin() {
  return '<div class="form-card">' +
    '<h2>Вход в панель</h2>' +
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
  var options = ''
  for (var i = 0; i < modes.length; i++) {
    options += '<option value="' + modes[i].id + '">' + modes[i].name + '</option>'
  }
  
  return '<div class="form-card">' +
    '<h2>Регистрация</h2>' +
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
      '<select id="reg-mode">' + options + '</select>' +
    '</div>' +
    '<div id="reg-error" class="error-msg"></div>' +
    '<div id="reg-success" class="success-msg"></div>' +
    '<button onclick="handleRegister()">Зарегистрироваться</button>' +
    '<div class="form-links">' +
      '<a onclick="navigateTo(\'login\')">Уже есть аккаунт? Войти</a>' +
    '</div>' +
  '</div>'
}

function renderDashboard() {
  if (!currentUser) return renderLogin()
  
  var isAdmin = currentUser.is_super_admin || (currentUser.role_id !== null)
  
  var html = '<div class="nav-bar">' +
    '<div class="nav-user">' +
      '<span style="color: ' + (currentUser.role_color || '#ffd700') + '">' +
        (currentUser.is_super_admin ? '👑 ' : '') + currentUser.username +
      '</span>' +
      '<span class="user-mode">' + currentUser.mode + '</span>'
  
  if (currentUser.role_name) {
    html += '<span style="color: ' + (currentUser.role_color || '#ffd700') + '; font-size: 9px;">' + currentUser.role_name + '</span>'
  }
  
  if (currentUser.position) {
    html += '<span style="color: #a89070; font-size: 8px;">' + currentUser.position + '</span>'
  }
  
  html += '</div>' +
    '<div class="nav-actions">' +
      (isAdmin ? '<button onclick="switchAdminTab(\'users\')">👥 Пользователи</button>' : '') +
      (isAdmin ? '<button onclick="switchAdminTab(\'roles\')">🎨 Роли</button>' : '') +
      '<button onclick="showProfile()">👤 Профиль</button>' +
      '<button onclick="handleLogout()">Выйти</button>' +
    '</div>' +
  '</div>'
  
  if (isAdmin) {
    html += '<div id="admin-content"></div>'
    setTimeout(function() {
      switchAdminTab('users')
    }, 0)
  } else {
    html += '<div id="admin-content">' +
      '<div class="stats-grid">' +
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
      (currentUser.is_approved ? '' : '<div style="text-align: center; padding: 20px; color: #ffd700; font-size: 11px;">⏳ Ваш аккаунт ожидает одобрения администратором.</div>') +
      (currentUser.notes ? '<div class="table-container"><h3>📝 Предупреждения</h3><p style="color: #a89070; font-size: 10px;">' + currentUser.notes + '</p></div>' : '') +
    '</div>'
  }
  
  return html
}

// ====== АДМИН ВКЛАДКИ ======
function switchAdminTab(tab) {
  currentTab = tab
  
  var buttons = document.querySelectorAll('.nav-actions button')
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active')
  }
  
  var content = document.getElementById('admin-content')
  if (!content) return
  
  if (tab === 'users') {
    loadUsers()
  } else if (tab === 'roles') {
    loadRoles()
  }
}

async function loadUsers() {
  var content = document.getElementById('admin-content')
  if (!content) return
  
  content.innerHTML = '<div style="text-align: center; padding: 40px; color: #ffd700;">⏳ Загрузка...</div>'
  
  // Загружаем пользователей (только своего режима, если не супер-админ)
  var query = supabase.from('users').select('*, roles(*)').order('created_at', { ascending: false })
  
  if (!currentUser.is_super_admin) {
    query = query.eq('mode', currentUser.mode)
  }
  
  var result = await query
  
  if (result.data) {
    users = result.data
  }
  
  var html = '<div class="table-container">' +
    '<h3>📋 Пользователи (' + users.length + ')</h3>' +
    '<div style="overflow-x: auto;">' +
    '<table>' +
      '<thead><tr>' +
        '<th>Ник</th>' +
        '<th>Режим</th>' +
        '<th>Должность</th>' +
        '<th>Роль</th>' +
        '<th>Часы</th>' +
        '<th>Зарплата</th>' +
        '<th>Варны</th>' +
        '<th>Статус</th>' +
        '<th>Действия</th>' +
      '</tr></thead>' +
      '<tbody>'
  
  for (var i = 0; i < users.length; i++) {
    var u = users[i]
    var status = u.is_blocked ? '<span class="status-blocked">Заблок</span>' : u.is_approved ? '<span class="status-approved">Активен</span>' : '<span class="status-pending">Ждёт</span>'
    
    html += '<tr>' +
      '<td style="color: ' + (u.roles ? u.roles.color : '#c4a882') + '">' + u.username + (u.is_super_admin ? ' 👑' : '') + '</td>' +
      '<td>' + (u.mode || '-') + '</td>' +
      '<td>' + (u.position || '-') + '</td>' +
      '<td style="color: ' + (u.roles ? u.roles.color : '#c4a882') + '">' + (u.roles ? u.roles.name : '-') + '</td>' +
      '<td>' + (u.play_hours || 0) + 'ч</td>' +
      '<td>' + (u.salary || 0) + '₽</td>' +
      '<td>' + (u.warns || 0) + '</td>' +
      '<td>' + status + '</td>' +
      '<td>' +
        (u.id !== currentUser.id ? '<button onclick="editUser(\'' + u.id + '\')" style="font-size: 8px; padding: 5px 8px;">✏️</button> ' : '') +
        (!u.is_approved && u.id !== currentUser.id ? '<button onclick="approveUser(\'' + u.id + '\')" style="font-size: 8px; padding: 5px 8px;">✅</button> ' : '') +
        (u.id !== currentUser.id ? '<button onclick="toggleBlockUser(\'' + u.id + '\', ' + u.is_blocked + ')" class="danger" style="font-size: 8px; padding: 5px 8px;">' + (u.is_blocked ? '🔓' : '🔒') + '</button>' : '') +
      '</td>' +
    '</tr>'
  }
  
  html += '</tbody></table></div></div>'
  content.innerHTML = html
}

async function loadRoles() {
  var content = document.getElementById('admin-content')
  if (!content) return
  
  content.innerHTML = '<div style="text-align: center; padding: 40px; color: #ffd700;">⏳ Загрузка...</div>'
  
  var query = supabase.from('roles').select('*').order('priority', { ascending: false })
  if (!currentUser.is_super_admin) {
    query = query.eq('mode', currentUser.mode)
  }
  
  var result = await query
  if (result.data) {
    roles = result.data
  }
  
  var html = '<div class="table-container">' +
    '<h3>🎨 Роли</h3>' +
    '<button onclick="showCreateRole()" style="margin-bottom: 15px;">+ Создать роль</button>' +
    '<table>' +
      '<thead><tr>' +
        '<th>Название</th>' +
        '<th>Цвет</th>' +
        '<th>Приоритет</th>' +
        '<th>Режим</th>' +
        '<th>Зарплата</th>' +
        '<th>Штраф</th>' +
        '<th>Действия</th>' +
      '</tr></thead>' +
      '<tbody>'
  
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

// ====== ПРОФИЛЬ ======
function showProfile() {
  var content = document.getElementById('admin-content')
  if (!content) return
  
  content.innerHTML = '<div class="stats-grid">' +
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
    '<p style="color: #a89070; font-size: 10px;">Режим: <span style="color: #ffd700;">' + currentUser.mode + '</span></p>' +
    '<p style="color: #a89070; font-size: 10px;">Должность: <span style="color: #ffd700;">' + (currentUser.position || 'Не указана') + '</span></p>' +
    '<p style="color: #a89070; font-size: 10px;">Роль: <span style="color: ' + (currentUser.role_color || '#ffd700') + ';">' + (currentUser.role_name || 'Нет') + '</span></p>' +
    (currentUser.notes ? '<div style="margin-top: 15px;"><h3 style="color: #ffd700; font-size: 12px;">📝 Предупреждения</h3><p style="color: #ff4444; font-size: 10px;">' + currentUser.notes + '</p></div>' : '') +
  '</div>'
}

// ====== РЕДАКТИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ ======
function editUser(userId) {
  var user = null
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      user = users[i]
      break
    }
  }
  if (!user) return
  
  var roleOptions = '<option value="">Без роли</option>'
  for (var j = 0; j < roles.length; j++) {
    var selected = user.role_id === roles[j].id ? ' selected' : ''
    roleOptions += '<option value="' + roles[j].id + '"' + selected + '>' + roles[j].name + '</option>'
  }
  
  var modeOptions = ''
  for (var k = 0; k < modes.length; k++) {
    var mSelected = user.mode === modes[k].name ? ' selected' : ''
    modeOptions += '<option value="' + modes[k].name + '"' + mSelected + '>' + modes[k].name + '</option>'
  }
  
  var modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = '<div class="modal">' +
    '<h3>✏️ Редактирование: ' + user.username + '</h3>' +
    '<div class="form-group">' +
      '<label>Режим</label>' +
      '<select id="edit-mode">' + modeOptions + '</select>' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Должность</label>' +
      '<input id="edit-position" value="' + (user.position || '') + '" placeholder="Например: Модератор" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Роль</label>' +
      '<select id="edit-role">' + roleOptions + '</select>' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Часы</label>' +
      '<input id="edit-hours" type="number" value="' + (user.play_hours || 0) + '" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Зарплата (₽)</label>' +
      '<input id="edit-salary" type="number" value="' + (user.salary || 0) + '" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Варны</label>' +
      '<input id="edit-warns" type="number" value="' + (user.warns || 0) + '" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Предупреждения</label>' +
      '<textarea id="edit-notes" style="width: 100%; height: 60px; background: #2d1810; border: 3px solid #5c3a1e; color: #f0e6d2; font-family: inherit; font-size: 10px; padding: 10px;">' + (user.notes || '') + '</textarea>' +
    '</div>' +
    '<div style="display: flex; gap: 10px; margin-top: 15px;">' +
      '<button onclick="saveUser(\'' + userId + '\')">💾 Сохранить</button>' +
      '<button onclick="this.closest(\'.modal-overlay\').remove()">❌ Отмена</button>' +
    '</div>' +
  '</div>'
  
  document.body.appendChild(modal)
}

async function saveUser(userId) {
  var mode = document.getElementById('edit-mode').value
  var position = document.getElementById('edit-position').value
  var roleId = document.getElementById('edit-role').value || null
  var hours = parseInt(document.getElementById('edit-hours').value) || 0
  var salary = parseInt(document.getElementById('edit-salary').value) || 0
  var warns = parseInt(document.getElementById('edit-warns').value) || 0
  var notes = document.getElementById('edit-notes').value
  
  var updateData = {
    mode: mode,
    position: position,
    role_id: roleId,
    play_hours: hours,
    salary: salary,
    warns: warns,
    notes: notes
  }
  
  var result = await supabase.from('users').update(updateData).eq('id', userId)
  
  document.querySelector('.modal-overlay').remove()
  
  if (!result.error) {
    await loadUsers()
    
    // Обновляем текущего пользователя если это он
    if (userId === currentUser.id) {
      var updated = await supabase.from('users').select('*, roles(*)').eq('id', userId).single()
      if (updated.data) {
        currentUser = {
          id: updated.data.id,
          username: updated.data.username,
          mode: updated.data.mode,
          position: updated.data.position,
          role_id: updated.data.role_id,
          is_approved: updated.data.is_approved,
          is_blocked: updated.data.is_blocked,
          is_super_admin: updated.data.is_super_admin,
          play_hours: updated.data.play_hours,
          salary: updated.data.salary,
          warns: updated.data.warns,
          notes: updated.data.notes,
          role_name: updated.data.roles ? updated.data.roles.name : null,
          role_color: updated.data.roles ? updated.data.roles.color : null
        }
        saveSession()
      }
    }
  }
}

async function approveUser(userId) {
  await supabase.from('users').update({ is_approved: true }).eq('id', userId)
  await loadUsers()
}

async function toggleBlockUser(userId, isBlocked) {
  await supabase.from('users').update({ is_blocked: !isBlocked }).eq('id', userId)
  await loadUsers()
}

// ====== СОЗДАНИЕ РОЛИ ======
function showCreateRole() {
  var modeOptions = ''
  for (var i = 0; i < modes.length; i++) {
    modeOptions += '<option value="' + modes[i].name + '">' + modes[i].name + '</option>'
  }
  
  var modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = '<div class="modal">' +
    '<h3>🎨 Новая роль</h3>' +
    '<div class="form-group">' +
      '<label>Название</label>' +
      '<input id="role-name" placeholder="Модератор" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Цвет</label>' +
      '<div class="color-picker-wrapper">' +
        '<input id="role-color" type="color" value="#ffd700" />' +
        '<span style="color: #a89070; font-size: 10px;">Выберите цвет</span>' +
      '</div>' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Приоритет</label>' +
      '<input id="role-priority" type="number" value="1" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Режим</label>' +
      '<select id="role-mode">' + modeOptions + '</select>' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Тип зарплаты</label>' +
      '<select id="role-salary-type">' +
        '<option value="hourly">Почасовая</option>' +
        '<option value="fixed">Фиксированная</option>' +
      '</select>' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Сумма (₽)</label>' +
      '<input id="role-salary-value" type="number" value="0" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Штраф за варн (₽)</label>' +
      '<input id="role-warn-fine" type="number" value="100" />' +
    '</div>' +
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
  
  if (!name) return
  
  var result = await supabase.from('roles').insert({
    name: name,
    color: color,
    priority: priority,
    mode: mode,
    salary_type: salaryType,
    salary_value: salaryValue,
    warn_fine: warnFine
  })
  
  document.querySelector('.modal-overlay').remove()
  
  if (!result.error) {
    await loadRoles()
  }
}

async function editRole(roleId) {
  var role = null
  for (var i = 0; i < roles.length; i++) {
    if (roles[i].id === roleId) {
      role = roles[i]
      break
    }
  }
  if (!role) return
  
  var modeOptions = ''
  for (var j = 0; j < modes.length; j++) {
    var selected = role.mode === modes[j].name ? ' selected' : ''
    modeOptions += '<option value="' + modes[j].name + '"' + selected + '>' + modes[j].name + '</option>'
  }
  
  var modal = document.createElement('div')
  modal.className = 'modal-overlay'
  modal.innerHTML = '<div class="modal">' +
    '<h3>✏️ Редактирование роли</h3>' +
    '<div class="form-group">' +
      '<label>Название</label>' +
      '<input id="edit-role-name" value="' + role.name + '" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Цвет</label>' +
      '<input id="edit-role-color" type="color" value="' + role.color + '" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Приоритет</label>' +
      '<input id="edit-role-priority" type="number" value="' + role.priority + '" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Режим</label>' +
      '<select id="edit-role-mode">' + modeOptions + '</select>' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Тип зарплаты</label>' +
      '<select id="edit-role-salary-type">' +
        '<option value="hourly"' + (role.salary_type === 'hourly' ? ' selected' : '') + '>Почасовая</option>' +
        '<option value="fixed"' + (role.salary_type === 'fixed' ? ' selected' : '') + '>Фиксированная</option>' +
      '</select>' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Сумма (₽)</label>' +
      '<input id="edit-role-salary-value" type="number" value="' + (role.salary_value || 0) + '" />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Штраф за варн (₽)</label>' +
      '<input id="edit-role-warn-fine" type="number" value="' + (role.warn_fine || 0) + '" />' +
    '</div>' +
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
  await loadRoles()
}

async function deleteRole(roleId) {
  if (!confirm('Удалить роль?')) return
  await supabase.from('roles').delete().eq('id', roleId)
  await loadRoles()
}

// ====== НАВИГАЦИЯ ======
function navigateTo(page) {
  currentPage = page
  renderApp()
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
      
      var result = await supabase
        .from('users')
        .select('*, roles(*)')
        .eq('username', username)
        .eq('password_hash', hashedPassword)
      
      if (result.error || !result.data || result.data.length === 0) {
        renderApp()
        var errEl = document.getElementById('login-error')
        if (errEl) errEl.textContent = 'Неверный ник или пароль'
        return
      }
      
      var user = result.data[0]
      
      if (user.is_blocked) {
        renderApp()
        var errEl2 = document.getElementById('login-error')
        if (errEl2) errEl2.textContent = 'Ваш аккаунт заблокирован'
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
      var errEl3 = document.getElementById('login-error')
      if (errEl3) errEl3.textContent = 'Ошибка: ' + e.message
    }
  }, 2000)
}

async function handleRegister() {
  var usernameEl = document.getElementById('reg-username')
  var passwordEl = document.getElementById('reg-password')
  var modeEl = document.getElementById('reg-mode')
  var errorEl = document.getElementById('reg-error')
  var successEl = document.getElementById('reg-success')
  
  var username = usernameEl ? usernameEl.value.trim() : ''
  var password = passwordEl ? passwordEl.value : ''
  var modeId = modeEl ? modeEl.value : ''
  
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
  
  var modeName = ''
  for (var i = 0; i < modes.length; i++) {
    if (modes[i].id === modeId) {
      modeName = modes[i].name
      break
    }
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
      mode: modeName
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
    app.innerHTML = '<div style="text-align: center; padding: 100px; color: #ff4444;">❌ Ошибка подключения к базе данных</div>'
    return
  }
  
  if (!currentUser) {
    app.innerHTML = currentPage === 'register' ? renderRegister() : renderLogin()
  } else {
    app.innerHTML = renderDashboard()
  }
}

// ====== ЗАПУСК ======
console.log('🚀 Запуск приложения...')
createParticles()

if (supabase) {
  // Пробуем загрузить сохранённую сессию
  if (loadSession()) {
    console.log('✅ Сессия загружена:', currentUser.username)
    // Проверяем, не заблокирован ли пользователь
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
          { id: '3', name: 'Другое' }
        ]
      }
      renderApp()
    })
  }
}
