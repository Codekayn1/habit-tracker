const KEY = "habit-tracker:habits";

export function loadHabits() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Не вдалося прочитати дані:", err);
    return [];
  }
}

export function saveHabits(habits) {
  try {
    localStorage.setItem(KEY, JSON.stringify(habits));
  } catch (err) {
    console.error("Не вдалося зберегти дані:", err);
  }
}
