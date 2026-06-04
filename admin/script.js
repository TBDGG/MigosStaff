import { supabase } from './supabase.js'

// ====== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ======
let currentUser = null
let currentPage = 'login'
let users = []
let roles = []
let modes = []

// ====== ЧАСТИЦЫ ======
function createParticles() {
  const container = document.querySelector('.particles')
  const icons = ['✦', '✧', '⛏', '⚔', '🪓', '🔮', '⭐', '💎', '🏹', '🛡']
  
  for (let i = 0; i < 35; i++) {
    const particle = document.createElement('span')
    particle.className = 'particle'
    particle.textContent = icons[Math.floor(Math.random() * icons.length)]
    particle.style.left = `${Math.random() * 100}%`
    particle.style.fontSize = `${Math.random() * 14 + 8}px`
    particle.style.animationDuration = `${Math.random() * 15 + 10}s`
    particle.style.animationDelay = `${Math.random() * 15}s`
    particle.style.setProperty('--drift', `${(Math.random() - 0.5) * 200}px`)
    particle.style.setProperty('--spin', `${Math.random() * 360}deg`)
    particle.style.opacity = `${Math.random() * 0.4 + 0.2}`
    container.appendChild(particle)
  }
}

// ====== РОУТИНГ ======
function renderLogin() {
  return `
    <div class="form-card">
      <h2>Вход в панель</h2>
      <div class="form-group">
        <label>Никнейм</label>
        <input id="login-username" placeholder="Введите ник..." />
      </div>
      <div class="form-group">
        <label>Пароль</label>
        <input id="login-password" type="password" placeholder="Введите пароль..." />
      </div>
      <div id="login-error" class="error-msg"></div>
      <button onclick="window.handleLogin()">Войти</button>
      <div class="form-links">
        <a onclick="window.navigateTo('register')">Нет аккаунта? Зарегистрироваться</a>
      </div>
    </div>
  `
}

function renderRegister() {
  return `
    <div class="form-card">
      <h2>Регистрация</h2>
      <div class="form-group">
        <label>Никнейм</label>
        <input id="reg-username" placeholder="Придумайте ник..." />
      </div>
      <div class="form-group">
        <label>Пароль</label>
        <input id="reg-password" type="password" placeholder="Придумайте пароль..." />
      </div>
      <div class="form-group">
        <label>Режим</label>
        <select id="reg-mode">
          ${modes.map(m => `<option value="${m.name}">${m.name}</option>`).join('')}
        </select>
      </div>
      <div id="reg-error" class="error-msg"></div>
      <div id="reg-success" class="success-msg"></div>
      <button onclick="window.handleRegister()">Зарегистрироваться</button>
      <div class="form-links">
        <a onclick="window.navigateTo('login')">Уже есть аккаунт? Войти</a>
      </div>
    </div>
  `
}

function renderDashboard() {
  if (!currentUser) return renderLogin()
  
  const isAdmin = currentUser.role_id !== null || currentUser.is_super_admin
  
  return `
    <div class="nav-bar">
      <div class="nav-user">
        <span style="color: ${currentUser.role_color || '#ffd700'}">
          ${currentUser.is_super_admin ? '👑 ' : ''}${currentUser.username}
        </span>
        <span class="user-mode">${currentUser.mode}</span>
        ${currentUser.role_name ? `<span style="color: ${currentUser.role_color || '#ffd700'}; font-size: 9px;">${currentUser.role_name}</span>` : ''}
      </div>
      <div class="nav-actions">
        <button onclick="window.handleLogout()">Выйти</button>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${currentUser.play_hours || 0}ч</div>
        <div class="stat-label">Наиграно часов</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${currentUser.salary || 0}₽</div>
        <div class="stat-label">Зарплата</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${currentUser.warns || 0}</div>
        <div class="stat-label">Варнов</div>
      </div>
    </div>

    ${!isAdmin ? `
      <div style="text-align: center; padding: 40px; color: #a89070; font-size: 11px;">
        Ваш аккаунт ожидает одобрения администратором.<br>
        После одобрения вам будет назначена роль и откроется доступ к функциям.
      </div>
    ` : `
      <div class="tabs">
        <button class="tab-btn active" onclick="window.switchTab('users')">Пользователи</button>
        <button class="tab-btn" onclick="window.switchTab('roles')">Роли</button>
        <button class="tab-btn" onclick="window.switchTab('modes')">Режимы</button>
      </div>
      <div id="tab-content"></div>
    `}
  `
}

function renderUsersTab() {
  return `
    <div class="table-container">
      <h3>📋 Список пользователей</h3>
      <table>
        <thead>
          <tr>
            <th>Ник</th>
            <th>Режим</th>
            <th>Роль</th>
            <th>Часы</th>
            <th>Зарплата</th>
            <th>Варны</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(u => `
            <tr>
              <td style="color: ${u.role_color || '#c4a882'}">${u.username}</td>
              <td>${u.mode}</td>
              <td style="color: ${u.role_color || '#c4a882'}">${u.role_name || '—'}</td>
              <td>${u.play_hours}ч</td>
              <td>${u.salary}₽</td>
              <td>${u.warns}</td>
              <td>
                ${u.is_blocked 
                  ? '<span class="status-blocked">Заблокирован</span>' 
                  : u.is_approved 
                    ? '<span class="status-approved">Активен</span>' 
                    : '<span class="status-pending">Ожидает</span>'}
              </td>
              <td>
                ${currentUser.is_super_admin || currentUser.can_manage_users ? `
                  <button onclick="window.approveUser('${u.id}')" style="font-size: 8px; padding: 6px 10px;">Одобрить</button>
                  <button onclick="window.toggleBlockUser('${u.id}', ${u.is_blocked})" class="danger" style="font-size: 8px; padding: 6px 10px;">${u.is_blocked ? 'Разблок' : 'Блок'}</button>
                  ${currentUser.is_super_admin ? `
                    <button onclick="window.toggleAdmin('${u.id}')" style="font-size: 8px; padding: 6px 10px;">${u.is_super_admin ? 'Снять GA' : 'Дать GA'}</button>
                    <button onclick="window.deleteUser('${u.id}')" class="danger" style="font-size: 8px; padding: 6px 10px;">Удалить</button>
                  ` : ''}
                  <button onclick="window.showEditUser('${u.id}')" style="font-size: 8px; padding: 6px 10px;">Изменить</button>
                ` : '<span style="font-size: 7px; color: #6b4f3a;">Нет прав</span>'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderRolesTab() {
  return `
    <div class="table-container">
      <h3>🎨 Управление ролями</h3>
      <button onclick="window.showCreateRole()" style="margin-bottom: 20px;">+ Создать роль</button>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Цвет</th>
            <th>Приоритет</th>
            <th>Режим</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          ${roles.map(r => `
            <tr>
              <td style="color: ${r.color}">${r.name}</td>
              <td><span style="display: inline-block; width: 20px; height: 20px; background: ${r.color}; border: 2px solid #5c3a1e;"></span> ${r.color}</td>
              <td>${r.priority}</td>
              <td>${r.mode}</td>
              <td>
                ${currentUser.is_super_admin || currentUser.can_manage_roles ? `
                  <button onclick="window.editRole('${r.id}')" style="font-size: 8px; padding: 6px 10px;">Изменить</button>
                  <button onclick="window.deleteRole('${r.id}')" class="danger" style="font-size: 8px; padding: 6px 10px;">Удалить</button>
                ` : '<span style="font-size: 7px; color: #6b4f3a;">Нет прав</span>'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function renderModesTab() {
  if (!currentUser.is_super_admin) {
    return `
      <div style="text-align: center; padding: 40px; color: #a89070; font-size: 11px;">
        Только Главный Администратор может управлять режимами.
      </div>
    `
  }
  
  return `
    <div class="table-container">
      <h3>🌍 Управление режимами</h3>
      <button onclick="window.showCreateMode()" style="margin-bottom: 20px;">+ Создать режим</button>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          ${modes.map(m => `
            <tr>
              <td>${m.name}</td>
              <td>
                <button onclick="window.deleteMode('${m.id}')" class="danger" style="font-size: 8px; padding: 6px 10px;">Удалить</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// ====== ГЛАВНЫЙ РЕНДЕР ======
function renderApp() {
  const app = document.getElementById('app')
  
  if (!supabase) {
    app.innerHTML = '<div style="text-align: center; padding: 100px; color: #ff4444; font-size: 14px;">Ошибка: Supabase не подключен. Проверь конфигурацию в supabase.js</div>'
    return
  }
  
  let content = ''
  
  if (!currentUser) {
    content = currentPage === 'register' ? renderRegister() : renderLogin()
  } else {
    content = renderDashboard()
    setTimeout(() => {
      if (currentUser && (currentUser.role_id || currentUser.is_super_admin)) {
        renderTabContent()
      }
    }, 0)
  }
  
  app.innerHTML = content
}

function renderTabContent() {
  const tabContent = document.getElementById('tab-content')
  if (!tabContent) return
  
  tabContent.innerHTML = renderUsersTab()
}

// ====== НАВИГАЦИЯ ======
window.navigateTo = function(page) {
  currentPage = page
  renderApp()
}

window.switchTab = function(tab) {
  const tabContent = document.getElementById('tab-content')
  if (!tabContent) return
  
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
  event.target.classList.add('active')
  
  switch(tab) {
    case 'users':
      tabContent.innerHTML = renderUsersTab()
      break
    case 'roles':
      tabContent.innerHTML = renderRolesTab()
      break
    case 'modes':
      tabContent.innerHTML = renderModesTab()
      break
  }
}

// ====== АВТОРИЗАЦИЯ ======
window.handleLogin = async function() {
  const username = document.getElementById('login-username')?.value?.trim()
  const password = document.getElementById('login-password')?.value
  const errorDiv = document.getElementById('login-error')
  
  if (!username || !password) {
    errorDiv.textContent = 'Заполните все поля'
    return
  }
  
  try {
    // Хэшируем пароль через Supabase RPC функцию
    const { data: userData, error } = await supabase
      .rpc('login_user', { 
        p_username: username, 
        p_password: password 
      })
    
    if (error || !userData || userData.length === 0) {
      errorDiv.textContent = 'Неверный ник или пароль'
      return
    }
    
    const user = userData[0]
    
    if (user.is_blocked) {
      errorDiv.textContent = 'Ваш аккаунт заблокирован'
      return
    }
    
    currentUser = user
    await loadData()
    renderApp()
  } catch (e) {
    errorDiv.textContent = 'Ошибка подключения'
    console.error(e)
  }
}

window.handleRegister = async function() {
  const username = document.getElementById('reg-username')?.value?.trim()
  const password = document.getElementById('reg-password')?.value
  const mode = document.getElementById('reg-mode')?.value
  const errorDiv = document.getElementById('reg-error')
  const successDiv = document.getElementById('reg-success')
  
  errorDiv.textContent = ''
  successDiv.textContent = ''
  
  if (!username || !password) {
    errorDiv.textContent = 'Заполните все поля'
    return
  }
  
  if (username.length < 3) {
    errorDiv.textContent = 'Ник должен быть не менее 3 символов'
    return
  }
  
  if (password.length < 6) {
    errorDiv.textContent = 'Пароль должен быть не менее 6 символов'
    return
  }
  
  try {
    const { data, error } = await supabase
      .rpc('register_user', {
        p_username: username,
        p_password: password,
        p_mode: mode
      })
    
    if (error) {
      if (error.message?.includes('duplicate') || error.message?.includes('уже существует')) {
        errorDiv.textContent = 'Пользователь с таким ником уже существует'
      } else {
        errorDiv.textContent = 'Ошибка регистрации: ' + (error.message || 'неизвестная ошибка')
      }
      return
    }
    
    successDiv.textContent = 'Регистрация успешна! Ожидайте одобрения администратором.'
    setTimeout(() => {
      currentPage = 'login'
      renderApp()
    }, 2000)
  } catch (e) {
    errorDiv.textContent = 'Ошибка подключения'
    console.error(e)
  }
}

window.handleLogout = function() {
  currentUser = null
  users = []
  roles = []
  currentPage = 'login'
  renderApp()
}

// ====== ЗАГРУЗКА ДАННЫХ ======
async function loadData() {
  if (!currentUser) return
  
  // Загружаем пользователей только своего режима (если не супер-админ)
  let userQuery = supabase.from('users').select('*, roles(*)')
  
  if (!currentUser.is_super_admin) {
    userQuery = userQuery.eq('mode', currentUser.mode)
  }
  
  const { data: usersData } = await userQuery
  users = (usersData || []).map(u => ({
    ...u,
    role_name: u.roles?.name,
    role_color: u.roles?.color,
    can_manage_users: u.roles?.can_manage_users || u.is_super_admin,
    can_manage_roles: u.roles?.can_manage_roles || u.is_super_admin,
    can_manage_modes: u.roles?.can_manage_modes || u.is_super_admin,
    can_manage_warns: u.roles?.can_manage_warns || u.is_super_admin,
    can_manage_salary: u.roles?.can_manage_salary || u.is_super_admin,
  }))
  
  // Обновляем текущего пользователя
  const updatedUser = users.find(u => u.id === currentUser.id)
  if (updatedUser) {
    currentUser = updatedUser
  }
  
  // Загружаем роли
  let roleQuery = supabase.from('roles').select('*')
  if (!currentUser.is_super_admin) {
    roleQuery = roleQuery.eq('mode', currentUser.mode)
  }
  const { data: rolesData } = await roleQuery
  roles = rolesData || []
  
  // Загружаем режимы
  const { data: modesData } = await supabase.from('modes').select('*')
  modes = modesData || []
}

// ====== УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ======
window.approveUser = async function(userId) {
  const user = users.find(u => u.id === userId)
  if (!user) return
  
  const { error } = await supabase
    .from('users')
    .update({ is_approved: true })
    .eq('id', userId)
  
  if (!error) {
    await loadData()
    renderApp()
    setTimeout(() => renderTabContent(), 0)
  }
}

window.toggleBlockUser = async function(userId, isBlocked) {
  const { error } = await supabase
    .from('users')
    .update({ is_blocked: !isBlocked })
    .eq('id', userId)
  
  if (!error) {
    await loadData()
    renderApp()
    setTimeout(()
