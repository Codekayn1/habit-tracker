import { describe, it, expect } from "vitest";
import { addDays, currentStreak, longestStreak, completionRate, dailyTotals } from "../js/logic.js";

const TODAY = "2026-03-10";

describe("addDays", () => {
  it("переходить через межу місяця", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});

describe("currentStreak", () => {
  it("рахує послідовні дні включно із сьогодні", () => {
    expect(currentStreak(["2026-03-08", "2026-03-09", "2026-03-10"], TODAY)).toBe(3);
  });
  it("не обриває серію, якщо сьогодні ще не відмічено", () => {
    expect(currentStreak(["2026-03-08", "2026-03-09"], TODAY)).toBe(2);
  });
  it("обривається після пропуску дня", () => {
    expect(currentStreak(["2026-03-07", "2026-03-10"], TODAY)).toBe(1);
  });
  it("повертає 0 без відміток", () => {
    expect(currentStreak([], TODAY)).toBe(0);
  });
});

describe("longestStreak", () => {
  it("знаходить найдовшу серію", () => {
    const dates = ["2026-03-01", "2026-03-02", "2026-03-05", "2026-03-06", "2026-03-07"];
    expect(longestStreak(dates)).toBe(3);
  });
  it("ігнорує дублікати", () => {
    expect(longestStreak(["2026-03-01", "2026-03-01"])).toBe(1);
  });
});

describe("completionRate", () => {
  it("рахує відсоток за 7 днів", () => {
    expect(completionRate(["2026-03-10", "2026-03-09", "2026-03-08"], 7, TODAY)).toBe(43);
  });
});

describe("dailyTotals", () => {
  it("рахує виконані звички по днях", () => {
    const habits = [
      { dates: ["2026-03-10", "2026-03-09"] },
      { dates: ["2026-03-10"] },
    ];
    const { labels, values } = dailyTotals(habits, 3, TODAY);
    expect(labels).toEqual(["03-08", "03-09", "03-10"]);
    expect(values).toEqual([0, 1, 2]);
  });
});
