// Конфигурация Supabase
var SUPABASE_URL = 'https://bedztjcclihaqapabaox.supabase.co'
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZHp0amNjbGloYXFhcGFiYW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTAwNTUsImV4cCI6MjA5NjE2NjA1NX0.kkZD_3SIkSKkdwrIAKZtqhs3NIaWrEHL2G51ItgRIoc'

// Ждем загрузки библиотеки Supabase и создаем клиент
var supabase = null

function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    console.log('✅ Supabase подключен успешно!')
    return true
  }
  return false
}

// Пробуем инициализировать сразу
if (!initSupabase()) {
  // Если не получилось, ждем и пробуем еще раз
  console.log('⏳ Ожидание загрузки Supabase...')
  var attempts = 0
  var interval = setInterval(function() {
    attempts++
    if (initSupabase()) {
      clearInterval(interval)
    } else if (attempts > 20) {
      clearInterval(interval)
      console.error('❌ Не удалось загрузить Supabase после 10 секунд ожидания')
      console.error('Проверь подключение к интернету и URL библиотеки')
    }
  }, 500)
}
