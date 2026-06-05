// ====== ГЛОБАЛЬНОЕ СОСТОЯНИЕ ======
var currentUser = null
var currentPage = 'login'
var users = []
var roles = []
var modes = []

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

// ====== РЕНДЕР ======
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
  var options = ''
  for (var i = 0; i < modes.length; i++) {
    options += '<option value="' + modes[i].name + '">' + modes[i].name + '</option>'
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
  }
  
  return html
}

function renderApp() {
  var app = document.getElementById('app')
  if (!app) return
  
  if (!supabase) {
    app.innerHTML = '<div style="text-align: center; padding: 100px; color: #ff4444;">Ошибка: Supabase не подключен</div>'
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
  
  try {
    var result = await supabase.rpc('login_user', { 
      p_username: username, 
      p_password: password 
    })
    
    if (result.error || !result.data || result.data.length === 0) {
      if (errorEl) errorEl.textContent = 'Неверный ник или пароль'
      return
    }
    
    var user = result.data[0]
    
    if (user.is_blocked) {
      if (errorEl) errorEl.textContent = 'Ваш аккаунт заблокирован'
      return
    }
    
    currentUser = user
    renderApp()
  } catch (e) {
    if (errorEl) errorEl.textContent = 'Ошибка: ' + e.message
    console.error(e)
  }
}

async function handleRegister() {
  var usernameEl = document.getElementById('reg-username')
  var passwordEl = document.getElementById('reg-password')
  var modeEl = document.getElementById('reg-mode')
  var errorEl = document.getElementById('reg-error')
  var successEl = document.getElementById('reg-success')
  
  var username = usernameEl ? usernameEl.value.trim() : ''
  var password = passwordEl ? passwordEl.value : ''
  var mode = modeEl ? modeEl.value : 'Выживание'
  
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
  
  try {
    var result = await supabase.rpc('register_user', {
      p_username: username,
      p_password: password,
      p_mode: mode
    })
    
    if (result.error) {
      if (errorEl) errorEl.textContent = 'Ошибка: ' + result.error.message
      return
    }
    
    if (successEl) successEl.textContent = '✅ Регистрация успешна! Ожидайте одобрения.'
    setTimeout(function() {
      currentPage = 'login'
      renderApp()
    }, 2000)
  } catch (e) {
    if (errorEl) errorEl.textContent = 'Ошибка: ' + e.message
    console.error(e)
  }
}

function handleLogout() {
  currentUser = null
  currentPage = 'login'
  renderApp()
}

// ====== ЗАПУСК ======
console.log('🚀 script.js выполнен')
createParticles()

// Загружаем режимы и запускаем приложение
supabase.from('modes').select('*').then(function(result) {
  if (result.data) {
    modes = result.data
    console.log('✅ Режимы загружены:', modes.length)
  } else {
    console.log('⚠️ Режимы не найдены, создаю стандартные...')
    modes = [{ name: 'Выживание' }, { name: 'Гриферский' }, { name: 'SkyBlock' }]
  }
  renderApp()
}).catch(function(error) {
  console.error('Ошибка загрузки режимов:', error)
  modes = [{ name: 'Выживание' }]
  renderApp()
})
