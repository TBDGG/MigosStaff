// Ждём пока supabase станет доступен
console.log('script.js загружен, жду Supabase...')

var waitForSupabase = setInterval(function() {
  if (typeof supabase !== 'undefined' && supabase !== null) {
    clearInterval(waitForSupabase)
    console.log('✅ Supabase доступен, запускаю приложение!')
    createParticles()
    loadModesAndStart()
  }
}, 200)

// Таймаут
setTimeout(function() {
  if (!supabase) {
    clearInterval(waitForSupabase)
    console.error('❌ Таймаут: Supabase не стал доступен')
    document.getElementById('app').innerHTML = '<div style="text-align: center; padding: 100px; color: #ff4444;">❌ Ошибка: Supabase не отвечает</div>'
  }
}, 15000)

function loadModesAndStart() {
  console.log('Загружаю режимы...')
  supabase.from('modes').select('*').then(function(result) {
    if (result.error) {
      console.error('Ошибка загрузки режимов:', result.error)
      // Пробуем создать таблицу режимов автоматически
      supabase.rpc('create_modes_table').then(function() {
        modes = []
        renderApp()
      }).catch(function() {
        modes = []
        renderApp()
      })
    } else {
      modes = result.data || []
      console.log('Режимы загружены:', modes.length)
      renderApp()
    }
  }).catch(function(error) {
    console.error('Критическая ошибка:', error)
    modes = []
    renderApp()
  })
}

// ... дальше весь остальной код из script.js ...
