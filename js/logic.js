// Чиста логіка без роботи з DOM: легко тестувати.
// Дати зберігаються як рядки "YYYY-MM-DD" (локальний час).

export function toKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function fromKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const date = fromKey(key);
  date.setDate(date.getDate() + n);
  return toKey(date);
}

// Поточна серія: якщо сьогодні ще не відмічено, серія не обривається до кінця дня.
export function currentStreak(dates, today = toKey()) {
  const set = new Set(dates);
  let cursor = set.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function longestStreak(dates) {
  const sorted = [...new Set(dates)].sort();
  let best = 0, run = 0, prev = null;
  for (const key of sorted) {
    run = prev && addDays(prev, 1) === key ? run + 1 : 1;
    best = Math.max(best, run);
    prev = key;
  }
  return best;
}

// Відсоток виконання за останні `days` днів (включно із сьогодні).
export function completionRate(dates, days, today = toKey()) {
  const set = new Set(dates);
  let done = 0;
  for (let i = 0; i < days; i++) {
    if (set.has(addDays(today, -i))) done++;
  }
  return Math.round((done / days) * 100);
}

// Дані для графіка: скільки звичок виконано в кожен з останніх `days` днів.
export function dailyTotals(habits, days, today = toKey()) {
  const labels = [];
  const values = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = addDays(today, -i);
    labels.push(key.slice(5)); // MM-DD
    values.push(habits.filter((h) => h.dates.includes(key)).length);
  }
  return { labels, values };
}
