// Конфигурация Supabase
// ЗАМЕНИ НА СВОИ ДАННЫЕ ИЗ SUPABASE
var SUPABASE_URL = 'https://bedztjcclihaqapabaox.supabase.co'
var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlZHp0amNjbGloYXFhcGFiYW94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTAwNTUsImV4cCI6MjA5NjE2NjA1NX0.kkZD_3SIkSKkdwrIAKZtqhs3NIaWrEHL2G51ItgRIoc'

// Создаем клиент Supabase
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
