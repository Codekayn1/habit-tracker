import { toKey, currentStreak, longestStreak, completionRate } from "./logic.js";
import { loadHabits, saveHabits } from "./storage.js";
import { renderStats } from "./stats.js";

let habits = loadHabits();

const form = document.querySelector("#habit-form");
const input = document.querySelector("#habit-name");
const list = document.querySelector("#habit-list");
const empty = document.querySelector("#empty");
const statsSection = document.querySelector("#stats");
const statsCanvas = document.querySelector("#stats-chart");

function addHabit(name) {
  habits.push({ id: Date.now().toString(), name, dates: [] });
  update();
}

function toggleToday(id) {
  const habit = habits.find((h) => h.id === id);
  if (!habit) return;
  const today = toKey();
  habit.dates = habit.dates.includes(today)
    ? habit.dates.filter((d) => d !== today)
    : [...habit.dates, today];
  update();
}

function removeHabit(id) {
  habits = habits.filter((h) => h.id !== id);
  update();
}

function update() {
  saveHabits(habits);
  render();
}

function makeButton(text, className, onClick) {
  const btn = document.createElement("button");
  btn.textContent = text;
  btn.className = className;
  btn.addEventListener("click", onClick);
  return btn;
}

function render() {
  list.replaceChildren();
  empty.hidden = habits.length > 0;
  const today = toKey();

  for (const habit of habits) {
    const done = habit.dates.includes(today);

    const li = document.createElement("li");
    li.className = done ? "habit done" : "habit";

    const info = document.createElement("div");
    const name = document.createElement("div");
    name.className = "habit-name";
    name.textContent = habit.name; // textContent захищає від HTML-ін'єкцій

    const stats = document.createElement("div");
    stats.className = "habit-stats";
    stats.textContent =
      `Серія: ${currentStreak(habit.dates)} · Рекорд: ${longestStreak(habit.dates)} · ` +
      `7 днів: ${completionRate(habit.dates, 7)}%`;

    info.append(name, stats);

    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(
      makeButton(done ? "Виконано ✓" : "Відмітити", "check", () => toggleToday(habit.id)),
      makeButton("Видалити", "ghost", () => removeHabit(habit.id))
    );

    li.append(info, actions);
    list.append(li);
  }

  statsSection.hidden = habits.length === 0;
  if (habits.length > 0) renderStats(habits, statsCanvas);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = input.value.trim();
  if (!name) return;
  addHabit(name);
  input.value = "";
});

render();
