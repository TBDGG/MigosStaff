const rules = [
  {
    id: "2.1",
    title: "Оскорбление игроков",
    description: "Запрещены оскорбления игроков в чате.",
    punishment: "Мут 30м - 2ч",
    frequent: true
  },
  {
    id: "2.2",
    title: "Флуд",
    description: "Флуд, спам, бессмысленные сообщения.",
    punishment: "Мут 30м - 2ч",
    frequent: true
  },
  {
    id: "3.1",
    title: "Читы",
    description: "Использование любого стороннего ПО.",
    punishment: "Бан 30 дней + IP",
    frequent: true
  },
  {
    id: "4.3",
    title: "Гриферство",
    description: "Уничтожение построек и регионов игроков.",
    punishment: "15 дней - перма",
    frequent: true
  },
  {
    id: "7.1",
    title: "Голосовой чат",
    description: "Шум, музыка, крики и помехи микрофона.",
    punishment: "Мут 30 минут",
    frequent: true
  }
];

let tab = "frequent";

function render() {
  const search = document.getElementById("search").value.toLowerCase();
  const container = document.getElementById("rules");

  let filtered = rules;

  if (tab === "frequent") {
    filtered = filtered.filter(r => r.frequent);
  }

  if (search) {
    filtered = filtered.filter(r =>
      r.id.includes(search) ||
      r.title.toLowerCase().includes(search)
    );
  }

  container.innerHTML = filtered.map(r => `
    <div class="card">
      <div class="title">${r.id} ${r.title}</div>
      <div class="desc">${r.description}</div>
      <div class="punish">${r.punishment}</div>
    </div>
  `).join("");
}

function setTab(t) {
  tab = t;
  document.querySelectorAll(".tab").forEach((b, i) => {
    b.classList.toggle("active", i === (t === "frequent" ? 0 : 1));
  });
  render();
}

document.getElementById("search").addEventListener("input", render);

render();
