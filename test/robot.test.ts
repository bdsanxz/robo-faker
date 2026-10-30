import { describe, expect, it } from "vitest";
import {
  ROBOT_NAMES,
  ROBOT_PREFIXES,
  ROBOT_SUFFIXES,
  robotName,
  robotNames,
} from "../src/index.js";

/** Pendek 4-6 huruf, huruf pertama kapital, sisanya lowercase. */
const SHORT = /^[A-Z][a-z]{3,5}$/;
/** Dua konsonan berurutan (y dihitung konsonan). */
const HAS_CC = /[^aeiou]{2}/i;

describe("robo-faker gaya pendek", () => {
  it("mengekspos daftar curated + pola suku kata", () => {
    expect(ROBOT_NAMES.length).toBeGreaterThan(0);
    // De-duplikat (case-insensitive).
    expect(new Set(ROBOT_NAMES.map((n) => n.toLowerCase())).size).toBe(
      ROBOT_NAMES.length,
    );
    for (const name of ROBOT_NAMES) expect(name).toMatch(SHORT);
    expect(ROBOT_PREFIXES.length).toBeGreaterThan(0);
    expect(ROBOT_SUFFIXES.length).toBeGreaterThan(0);
  });

  it("format: 4-6 huruf, kapital, tanpa angka/pemisah", () => {
    const batch = robotNames(50, { seed: "format" });
    expect(batch).toHaveLength(50);
    for (const name of batch) {
      expect(name).toMatch(SHORT);
      expect(name).not.toMatch(/\d/);
      expect(name).not.toMatch(/[-_ ]/);
    }
    for (let i = 0; i < 20; i += 1) {
      expect(robotName()).toMatch(SHORT);
    }
    for (const name of robotNames(30, { curated: false, seed: "gen" })) {
      expect(name).toMatch(SHORT);
    }
  });

  it("sebagian besar hasil mengandung gugusan 2 konsonan", () => {
    const generated = robotNames(50, { seed: "cc", curated: false });
    const genCc = generated.filter((n) => HAS_CC.test(n)).length;
    expect(genCc).toBeGreaterThanOrEqual(40);

    const mixed = robotNames(50, { seed: "cc-mixed" });
    const mixedCc = mixed.filter((n) => HAS_CC.test(n)).length;
    expect(mixedCc).toBeGreaterThanOrEqual(35);
  });

  it("deterministik per seed", () => {
    expect(robotName({ seed: "herdr-1" })).toBe(robotName({ seed: "herdr-1" }));
    expect(robotName({ seed: 42 })).toBe(robotName({ seed: 42 }));
    expect(robotNames(10, { seed: "herdr-1" })).toEqual(
      robotNames(10, { seed: "herdr-1" }),
    );
  });

  it("menghindari taken (case-insensitive)", () => {
    const first = robotName({ seed: "s1" });
    const second = robotName({ seed: "s1", taken: [first.toUpperCase()] });
    expect(second.toLowerCase()).not.toBe(first.toLowerCase());

    const taken = robotNames(5, { seed: "t" });
    const takenLower = new Set(taken.map((t) => t.toLowerCase()));
    const next = robotNames(5, { seed: "t", taken });
    expect(next).toHaveLength(5);
    for (const name of next) {
      expect(takenLower.has(name.toLowerCase())).toBe(false);
    }
  });

  it("count unik", () => {
    const names = robotNames(20, { seed: "uniq" });
    expect(names).toHaveLength(20);
    expect(new Set(names.map((n) => n.toLowerCase())).size).toBe(20);
  });

  it("tetap unik saat meminta lebih dari jumlah ROBOT_NAMES", () => {
    const count = ROBOT_NAMES.length + 10;
    const names = robotNames(count, { seed: "overflow" });
    expect(names).toHaveLength(count);
    expect(new Set(names.map((n) => n.toLowerCase())).size).toBe(count);
    for (const name of names) expect(name).toMatch(SHORT);
  });
});
