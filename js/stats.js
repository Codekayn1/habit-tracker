import { dailyTotals } from "./logic.js";

let chart = null;

// Chart — глобальний об'єкт з Chart.js (підключений у index.html)
export function renderStats(habits, canvas) {
  if (typeof Chart === "undefined") return; // бібліотека не завантажилась
  Chart.defaults.color = getComputedStyle(document.body).color;

  const { labels, values } = dailyTotals(habits, 14);
  if (chart) chart.destroy();

  chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels,
      datasets: [{ label: "Виконано звичок", data: values, backgroundColor: "#4f46e5" }],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, suggestedMax: habits.length, ticks: { precision: 0 } },
      },
    },
  });
}
