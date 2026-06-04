// ====== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ======
var currentUser = null
var currentPage = 'login'
var users = []
var roles = []
var modes = []

// ====== ЧАСТИЦЫ ======
function createParticles() {
  var container = document.querySelector('.particles')
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
    particle.style.opacity = Math.random() * 0.4 + 0.2
    container.appendChild(particle)
  }
}

// ====== РЕНДЕР ФОРМ ======
function renderLogin() {
  return '<div class="form-card">' +
    '<h2>Вход в панель</h2>' +
    '<div class="form-group">' +
      '<label>Никнейм</label>' +
      '<input id="login-username" placeholder="Введите ник..." />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Пароль</label>' +
      '<input id="login-password" type="password" placeholder="Введите пароль..." />' +
    '</div>' +
    '<div id="login-error" class="error-msg"></div>' +
    '<button onclick="handleLogin()">Войти</button>' +
    '<div class="form-links">' +
      '<a onclick="navigateTo(\'register\')">Нет аккаунта? Зарегистрироваться</a>' +
    '</div>' +
  '</div>'
}

function renderRegister() {
  var modesOptions = ''
  for (var i = 0; i < modes.length; i++) {
    modesOptions += '<option value="' + modes[i].name + '">' + modes[i].name + '</option>'
  }
  
  return '<div class="form-card">' +
    '<h2>Регистрация</h2>' +
    '<div class="form-group">' +
      '<label>Никнейм</label>' +
      '<input id="reg-username" placeholder="Придумайте ник..." />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Пароль</label>' +
      '<input id="reg-password" type="password" placeholder="Придумайте пароль..." />' +
    '</div>' +
    '<div class="form-group">' +
      '<label>Режим</label>' +
      '<select id="reg-mode">' + modesOptions + '</select>' +
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
  
  var isAdmin = currentUser.role_id !== null || currentUser.is_super_admin
  
  var html = '<div class="nav-bar">' +
    '<div class="nav-user">' +
      '<span style="color: ' + (currentUser.role_color || '#ffd700') + '">' +
        (currentUser.is_super_admin ? '👑 ' : '') + currentUser.username +
      '</span>' +
      '<span class="user-mode">' + currentUser.mode + '</span>'
  
  if (currentUser.role_name) {
    html += '<span style="color: ' + (currentUser.role_color || '#ffd700') + '; font-size: 9px;">' + currentUser.role_name + '</span>'
  }
  
  html += '</div>' +
    '<div class="nav-actions">' +
      '<button onclick="handleLogout()">Выйти</button>' +
    '</div>' +
  '</div>' +
  
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
  '</div>'
  
  if (!isAdmin) {
    html += '<div style="text-align: center; padding: 40px; color: #a89070; font-size: 11px;">' +
      'Ваш аккаунт ожидает одобрения администратором.<br>' +
      'После одобрения вам будет назначена роль и откроется доступ к функциям.' +
    '</div>'
  } else {
    html += '<div class="tabs">' +
      '<button class="tab-btn active" onclick="switchTab(\'users\')">Пользователи</button>' +
      '<button class="tab-btn" onclick="switchTab(\'roles\')">Роли</button>' +
      '<button class="tab-btn" onclick="switchTab(\'modes\')">Режимы</button>' +
    '</div>' +
    '<div id="tab-content">' + renderUsersTab() + '</div>'
  }
  
  return html
}

function renderUsersTab() {
  var html = '<div class="table-container">' +
    '<h3>📋 Список пользователей</h3>' +
    '<table>' +
      '<thead><tr>' +
        '<th>Ник</th><th>Режим</th><th>Роль</th><th>Часы</th><th>Зарплата</th><th>Варны</th><th>Статус</th><th>Действия</th>' +
      '</tr></thead>' +
      '<tbody>'
  
  for (var i = 0; i < users.length; i++) {
    var u = users[i]
    var statusHtml = ''
    if (u.is_blocked) {
      statusHtml = '<span class="status-blocked">Заблокирован</span>'
    } else if (u.is_approved) {
      statusHtml = '<span class="status-approved">Активен</span>'
    } else {
      statusHtml = '<span class="status-pending">Ожидает</span>'
    }
    
    html += '<tr>' +
      '<td style="color: ' + (u.role_color || '#c4a882') + '">' + u.username + '</td>' +
      '<td>' + u.mode + '</td>' +
      '<td style="color: ' + (u.role_color || '#c4a882') + '">' + (u.role_name || '—') + '</td>' +
      '<td>' + u.play_hours + 'ч</td>' +
      '<td>' + u.salary + '₽</td>' +
      '<td>' + u.warns + '</td>' +
      '<td>' + statusHtml + '</td>' +
      '<td>'
    
    if (currentUser.is_super_admin || currentUser.can_manage_users) {
      html += '<button onclick="approveUser(\'' + u.id + '\')" style="font-size: 8px; padding: 6px 10px;">Одобрить</button> ' +
        '<button onclick="toggleBlockUser(\'' + u.id + '\', ' + u.is_blocked + ')" class="danger" style="font-size: 8px; padding: 6px 10px;">' + (u.is_blocked ? 'Разблок' : 'Блок') + '</button> ' +
        '<button onclick="showEditUser(\'' + u.id + '\')" style="font-size: 8px; padding: 6px 10px;">Изменить</button>'
      
      if (currentUser.is_super_admin) {
        html += ' <button onclick="toggleAdmin(\'' + u.id + '\')" style="font-size: 8px; padding: 6px 10px;">' + (u.is_super_admin ? 'Снять GA' : 'Дать GA') + '</button>' +
          ' <button onclick="deleteUser(\'' + u.id + '\')" class="danger" style="font-size: 8px; padding: 6px 10px;">Удалить</button>'
      }
    } else {
      html += '<span style="font-size: 7px; color: #6b4f3a;">Нет прав</span>'
    }
    
    html += '</td></tr>'
  }
  
  html += '</tbody></table></div>'
  return html
}

function renderRolesTab() {
  var html = '<div class="table-container">' +
    '<h3>🎨 Управление ролями</h3>' +
    '<button onclick="showCreateRole()" style="margin-bottom: 20px;">+ Создать роль</button>' +
    '<table>' +
      '<thead><tr>' +
        '<th>Название</th><th>Цвет</th><th>Приоритет</th><th>Режим</th><th>Действия</th>' +
      '</tr></thead>' +
      '<tbody>'
  
  for (var i = 0; i < roles.length; i++) {
    var r = roles[i]
    html += '<tr>' +
      '<td style="color: ' + r.color + '">' + r.name + '</td>' +
      '<td><span style="display: inline-block; width: 20px; height: 20px; background: ' + r.color + '; border: 2px solid #5c3a1e;"></span> ' + r.color + '</td>' +
      '<td>' + r.priority + '</td>' +
      '<td>' + r.mode + '</td>' +
      '<td>'
    
    if (currentUser.is_super_admin || currentUser.can_manage_roles) {
      html += '<button onclick="editRole(\'' + r.id + '\')" style="font-size: 8px; padding: 6px 10px;">Изменить</button> ' +
        '<button onclick="deleteRole(\'' + r.id + '\')" class="danger" style="font-size: 8px; padding: 6px 10px;">Удалить</button>'
    } else {
      html += '<span style="font-size: 7px; color: #6b4f3a;">Нет прав</span>'
    }
    
    html += '</td></tr>'
  }
  
  html += '</tbody></table></div>'
  return html
}

function renderModesTab() {
  if (!currentUser.is_super_admin) {
    return '<div style="text-align: center; padding: 40px; color: #a89070; font-size: 11px;">Только Главный Администратор может управлять режимами.</div>'
  }
  
  var html = '<div class="table-container">' +
    '<h3>🌍 Управление режимами</h3>' +
    '<button onclick="showCreateMode()" style="margin-bottom: 20px;">+ Создать режим</button>' +
    '<table>' +
      '<thead><tr><th>Название</th><th>Действия</th></tr></thead>' +
      '<tbody>'
  
  for (var i = 0; i < modes.length; i++) {
    var m = modes[i]
    html += '<tr>' +
      '<td>' + m.name + '</td>' +
      '<td><button onclick="deleteMode(\'' + m.id + '\')" class="danger" style="font-size: 8px; padding: 6px 10px;">Удалить</button></td>' +
    '</tr>'
  }
  
  html += '</tbody></table></div>'
  return html
}

// ====== ГЛАВНЫЙ РЕНДЕР ======
function renderApp() {
  var app = document.getElementById('app')
  
  if (typeof supabase === 'undefined') {
    app.innerHTML = '<div style="text-align: center; padding: 100px; color: #ff4444; font-size: 14px;">Ошибка: Supabase не подключен. Проверь конфигурацию в supabase.js и подключение библиотеки в index.html</div>'
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

function switchTab(tab) {
  var tabContent = document.getElementById('tab-content')
  if (!tabContent) return
  
  var buttons = document.querySelectorAll('.tab-btn')
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active')
  }
  
  var event = window.event
  if (event && event.target) {
    event.target.classList.add('active')
  }
  
  if (tab === 'users') tabContent.innerHTML = renderUsersTab()
  else if (tab === 'roles') tabContent.innerHTML = renderRolesTab()
  else if (tab === 'modes') tabContent.innerHTML = renderModesTab()
}

// ====== АВТОРИЗАЦИЯ ======
async function handleLogin() {
  var username = document.getElementById('login-username')
  var password = document.getElementById('login-password')
  var errorDiv = document.getElementById('login-error')
  
  if (!username || !password) {
    if (errorDiv) errorDiv.textContent = 'Заполните все поля'
    return
  }
  
  var usernameValue = username.value.trim()
  var passwordValue = password.value
  
  if (!usernameValue || !passwordValue) {
    if (errorDiv) errorDiv.textContent = 'Заполните все поля'
    return
  }
  
  try {
    var result = await supabase.rpc('login_user', { 
      p_username: usernameValue, 
      p_password: passwordValue 
    })
    
    if (result.error || !result.data || result.data.length === 0) {
      if (errorDiv) errorDiv.textContent = 'Неверный ник или пароль'
      return
    }
    
    var user = result.data[0]
    
    if (user.is_blocked) {
      if (errorDiv) errorDiv.textContent = 'Ваш аккаунт заблокирован'
      return
    }
    
    currentUser = user
    await loadData()
    renderApp()
  } catch (e) {
    if (errorDiv) errorDiv.textContent = 'Ошибка подключения: ' + e.message
    console.error(e)
  }
}

async function handleRegister() {
  var username = document.getElementById('reg-username')
  var password = document.getElementById('reg-password')
  var mode = document.getElementById('reg-mode')
  var errorDiv = document.getElementById('reg-error')
  var successDiv = document.getElementById('reg-success')
  
  if (errorDiv) errorDiv.textContent = ''
  if (successDiv) successDiv.textContent = ''
  
  if (!username || !password || !mode) {
    if (errorDiv) errorDiv.textContent = 'Заполните все поля'
    return
  }
  
  var usernameValue = username.value.trim()
  var passwordValue = password.value
  var modeValue = mode.value
  
  if (usernameValue.length < 3) {
    if (errorDiv) errorDiv.textContent = 'Ник должен быть не менее 3 символов'
    return
  }
  
  if (passwordValue.length < 6) {
    if (errorDiv) errorDiv.textContent = 'Пароль должен быть не менее 6 символов'
    return
  }
  
  try {
    var result = await supabase.rpc('register_user', {
      p_username: usernameValue,
      p_password: passwordValue,
      p_mode: modeValue
    })
    
    if (result.error) {
      if (result.error.message && (result.error.message.includes('duplicate') || result.error.message.includes('уже существует'))) {
        if (errorDiv) errorDiv.textContent = 'Пользователь с таким ником уже существует'
      } else {
        if (errorDiv) errorDiv.textContent = 'Ошибка регистрации: ' + (result.error.message || 'неизвестная ошибка')
      }
      return
    }
    
    if (successDiv) successDiv.textContent = 'Регистрация успешна! Ожидайте одобрения администратором.'
    setTimeout(function() {
      currentPage = 'login'
      renderApp()
    }, 2000)
  } catch (e) {
    if (errorDiv) errorDiv.textContent = 'Ошибка подключения: ' + e.message
    console.error(e)
  }
}

function handleLogout() {
  currentUser = null
  users = []
  roles = []
  currentPage = 'login'
  renderApp()
}

// ====== ЗАГРУЗКА ДАННЫХ ======
async function loadData() {
  if (!currentUser) return
  
  // Загружаем пользователей
  var userQuery = supabase.from('users').select('*, roles(*)')
  if (!currentUser.is_super_admin) {
    userQuery = userQuery.eq('mode', currentUser.mode)
  }
  
  var usersResult = await userQuery
  users = []
  
  if (usersResult.data) {
    for (var i = 0; i < usersResult.data.length; i++) {
      var u = usersResult.data[i]
      users.push({
        id: u.id,
        username: u.username,
        mode: u.mode,
        role_id: u.role_id,
        is_approved: u.is_approved,
        is_blocked: u.is_blocked,
        is_super_admin: u.is_super_admin,
        play_hours: u.play_hours,
        salary: u.salary,
        warns: u.warns,
        role_name: u.roles ? u.roles.name : null,
        role_color: u.roles ? u.roles.color : null,
        can_manage_users: (u.roles && u.roles.can_manage_users) || u.is_super_admin,
        can_manage_roles: (u.roles && u.roles.can_manage_roles) || u.is_super_admin,
        can_manage_modes: (u.roles && u.roles.can_manage_modes) || u.is_super_admin,
        can_manage_warns: (u.roles && u.roles.can_manage_warns) || u.is_super_admin,
        can_manage_salary: (u.roles && u.roles.can_manage_salary) || u.is_super_admin
      })
    }
  }
  
  // Обновляем текущего пользователя
  for (var j = 0; j < users.length; j++) {
    if (users[j].id === currentUser.id) {
      currentUser = users[j]
      break
    }
  }
  
  // Загружаем роли
  var roleQuery = supabase.from('roles').select('*')
  if (!currentUser.is_super_admin) {
    roleQuery = roleQuery.eq('mode', currentUser.mode)
  }
  var rolesResult = await roleQuery
  roles = rolesResult.data || []
  
  // Загружаем режимы
  var modesResult = await supabase.from('modes').select('*')
  modes = modesResult.data || []
}

// ====== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ======
async function approveUser(userId) {
  await supabase.from('users').update({ is_approved: true }).eq('id', userId)
  await loadData()
  renderApp()
}

async function toggleBlockUser(userId, isBlocked) {
  await supabase.from('users').update({ is_blocked: !isBlocked }).eq('id', userId)
  await loadData()
  renderApp()
}

async function toggleAdmin(userId) {
  var user = null
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === userId) {
      user = users[i]
      break
    }
  }
  if (!user) return
  
  await supabase.from('users').update({ is_super_admin: !user.is_super_admin }).eq('id', userId)
  await loadData()
  renderApp()
}

async function deleteUser(userId) {
  if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return
  
  await supabase.from('users').delete().eq('id', userId)
  await loadData()
  renderApp()
}

// ====== ЗАПУСК ПРИЛОЖЕНИЯ ======
function startApp() {
  console.log('Запуск приложения...')
  createParticles()
  
  // Загружаем режимы для регистрации
  supabase.from('modes').select('*').then(function(result) {
    if (result.data) {
      modes = result.data
      console.log('Режимы загружены:', modes.length)
    }
    if (result.error) {
      console.error('Ошибка загрузки режимов:', result.error)
    }
    renderApp()
  }).catch(function(error) {
    console.error('Критическая ошибка:', error)
    document.getElementById('app').innerHTML = '<div style="text-align: center; padding: 100px; color: #ff4444;">Ошибка подключения к базе данных: ' + error.message + '</div>'
  })
}
