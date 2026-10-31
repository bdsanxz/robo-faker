import { describe, expect, it } from "vitest";
import {
  ROBOT_NAMES,
  ROBOT_PREFIXES,
  ROBOT_SUFFIXES,
  robotName,
  robotNames,
} from "../src/index.js";

/** Short 4-6 letters, first capitalized, rest lowercase. */
const SHORT = /^[A-Z][a-z]{3,5}$/;
/** Two back-to-back consonants (y counts as a consonant). */
const HAS_CC = /[^aeiou]{2}/i;

describe("robo-faker short style", () => {
  it("exposes the curated list + syllable patterns", () => {
    expect(ROBOT_NAMES.length).toBeGreaterThan(0);
    // De-duplicated (case-insensitive).
    expect(new Set(ROBOT_NAMES.map((n) => n.toLowerCase())).size).toBe(
      ROBOT_NAMES.length,
    );
    for (const name of ROBOT_NAMES) expect(name).toMatch(SHORT);
    expect(ROBOT_PREFIXES.length).toBeGreaterThan(0);
    expect(ROBOT_SUFFIXES.length).toBeGreaterThan(0);
  });

  it("keeps the original tables as a compatible prefix", () => {
    expect(ROBOT_PREFIXES.slice(0, 16)).toEqual([
      "Kr",
      "Dr",
      "Br",
      "Zy",
      "Vr",
      "Kl",
      "Gr",
      "Pr",
      "Th",
      "Tr",
      "Qy",
      "Xy",
      "Vy",
      "Ky",
      "Str",
      "Thr",
    ]);
    expect(ROBOT_SUFFIXES.slice(0, 26)).toEqual([
      "ro",
      "yx",
      "exi",
      "yra",
      "av",
      "ynx",
      "orn",
      "yon",
      "ix",
      "yph",
      "ion",
      "ax",
      "ber",
      "ora",
      "ron",
      "ex",
      "yza",
      "tra",
      "xon",
      "rex",
      "rix",
      "uxa",
      "ryx",
      "nex",
      "yro",
      "yn",
    ]);
    expect(ROBOT_NAMES.slice(0, 8)).toEqual([
      "Zyro",
      "Kryx",
      "Vexi",
      "Xyra",
      "Bryx",
      "Drav",
      "Klyx",
      "Zynx",
    ]);
  });

  it("format: 4-6 letters, capitalized, no digits/separators", () => {
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

  it("most results contain a 2-consonant cluster", () => {
    const generated = robotNames(50, { seed: "cc", curated: false });
    const genCc = generated.filter((n) => HAS_CC.test(n)).length;
    expect(genCc).toBeGreaterThanOrEqual(40);

    const mixed = robotNames(50, { seed: "cc-mixed" });
    const mixedCc = mixed.filter((n) => HAS_CC.test(n)).length;
    expect(mixedCc).toBeGreaterThanOrEqual(35);
  });

  it("is deterministic per seed", () => {
    expect(robotName({ seed: "herdr-1" })).toBe(robotName({ seed: "herdr-1" }));
    expect(robotName({ seed: 42 })).toBe(robotName({ seed: 42 }));
    expect(robotNames(10, { seed: "herdr-1" })).toEqual(
      robotNames(10, { seed: "herdr-1" }),
    );
  });

  it("avoids taken (case-insensitive)", () => {
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

  it("keeps count unique", () => {
    const names = robotNames(20, { seed: "uniq" });
    expect(names).toHaveLength(20);
    expect(new Set(names.map((n) => n.toLowerCase())).size).toBe(20);
  });

  it("stays unique beyond ROBOT_NAMES.length", () => {
    const count = ROBOT_NAMES.length + 10;
    const names = robotNames(count, { seed: "overflow" });
    expect(names).toHaveLength(count);
    expect(new Set(names.map((n) => n.toLowerCase())).size).toBe(count);
    for (const name of names) expect(name).toMatch(SHORT);
  });

  it("supports large generator-only batches", () => {
    const names = robotNames(800, { seed: "large", curated: false });
    expect(names).toHaveLength(800);
    expect(new Set(names.map((n) => n.toLowerCase())).size).toBe(800);
    for (const name of names) expect(name).toMatch(SHORT);
  });

  it("fails fast when the namespace is exhausted", () => {
    expect(() => robotNames(1_000_000, { seed: "nope" })).toThrow(
      /covers the namespace/,
    );
    expect(() =>
      robotNames(3, {
        seed: "nope",
        curated: false,
        taken: robotNames(800, { seed: "nope", curated: false }),
      }),
    ).not.toThrow();
  });

  it("rejects invalid input", () => {
    expect(() => robotNames(-1)).toThrow(RangeError);
    expect(() => robotNames(1.5)).toThrow(RangeError);
    expect(() => robotName({ seed: Number.NaN })).toThrow(TypeError);
    expect(() => robotName({ curated: "yes" as unknown as boolean })).toThrow(
      TypeError,
    );
    expect(() => robotName({ taken: 42 as unknown as string[] })).toThrow(
      TypeError,
    );
    expect(robotNames(0)).toEqual([]);
  });
});
