/**
 * @xzy-ai/robo-faker
 *
 * Short single-word robotic names such as `Zyro`, `Kryx`.
 * No runtime dependencies. ESM only.
 *
 * Names come from two sources:
 * - `ROBOT_NAMES`: a curated list, used first when `curated: true`.
 * - A syllable-pattern generator (consonant-cluster onset + short rime)
 *   once the curated list is exhausted or when `curated: false`.
 *   Results are always 4-6 letters, first letter capitalized, no digits
 *   or separators.
 *
 * Determinism note: a given `seed` always produces the same sequence
 * within the same library version. Extending the tables in a new
 * version can reshuffle seeded sequences, so seeds are stable
 * per version, not across versions.
 */

/**
 * Onsets: 2-consonant clusters (Titlecase, 2-3 letters).
 * Every generator result starts with one of these, so the vast
 * majority of results contain back-to-back consonants.
 */
export const ROBOT_PREFIXES: readonly string[] = [
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
  "Bl",
  "Cl",
  "Fl",
  "Gl",
  "Pl",
  "Sl",
  "Cr",
  "Fr",
  "Sk",
  "Sp",
  "St",
  "Sh",
  "Ch",
  "Ph",
  "Sn",
  "Sm",
  "Sw",
  "Rh",
  "Spr",
  "Chr",
];

/**
 * Short rimes: a brief vowel nucleus + coda (lowercase, 2-3 letters).
 * Vowels are kept light with frequent y-endings in x/n/r/a.
 */
export const ROBOT_SUFFIXES: readonly string[] = [
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
  "an",
  "en",
  "in",
  "on",
  "un",
  "ar",
  "er",
  "ir",
  "or",
  "as",
  "es",
  "is",
  "os",
  "ak",
  "ek",
  "ok",
  "al",
  "el",
  "ol",
  "ath",
  "esh",
  "oth",
  "ark",
  "ork",
  "elo",
  "ara",
  "ino",
  "us",
];

/**
 * Curated list (de-duplicated, original order preserved).
 * Used first when `curated: true` (the default).
 */
export const ROBOT_NAMES: readonly string[] = [
  "Zyro",
  "Kryx",
  "Vexi",
  "Xyra",
  "Bryx",
  "Drav",
  "Klyx",
  "Zynx",
  "Vorn",
  "Kryon",
  "Drix",
  "Zyph",
  "Trion",
  "Gryx",
  "Vrax",
  "Kyber",
  "Zora",
  "Pryx",
  "Xyron",
  "Brion",
  "Krix",
  "Vyron",
  "Drex",
  "Zyron",
  "Qyro",
  "Vynx",
  "Threx",
  "Kryza",
  "Xyber",
  "Gryon",
  "Zetra",
  "Vetra",
  "Pryon",
  "Daxon",
  "Klyra",
  "Zyrex",
  "Veyra",
  "Xyrix",
  "Bryon",
  "Truxa",
  "Zyntra",
  "Vexon",
  "Deyro",
  "Qyber",
  "Xetra",
  "Zytra",
  "Voryx",
  "Kynex",
  "Drexon",
  "Blan",
  "Clar",
  "Flin",
  "Glen",
  "Plor",
  "Slon",
  "Crak",
  "Frel",
  "Skar",
  "Spin",
  "Ston",
  "Shan",
  "Chen",
  "Phor",
  "Snak",
  "Smel",
  "Swin",
  "Rhon",
  "Spran",
  "Chren",
  "Blark",
  "Cloth",
  "Flesh",
  "Glino",
  "Plara",
  "Slelo",
  "Croth",
  "Frara",
  "Skelo",
  "Spara",
  "Stath",
  "Shelo",
  "Chark",
  "Phino",
  "Snara",
  "Smino",
  "Swara",
  "Rhelo",
  "Blex",
  "Clon",
  "Glix",
  "Slax",
  "Frix",
  "Skon",
  "Spex",
  "Stex",
  "Shex",
  "Chon",
  "Phex",
  "Snex",
  "Smax",
  "Swex",
  "Rhex",
  "Sprex",
  "Blrex",
  "Clrex",
  "Flrex",
  "Glrex",
  "Plnex",
  "Slnex",
  "Crnex",
  "Frnex",
  "Sknex",
  "Spelo",
  "Stelo",
  "Chrex",
  "Shrex",
  "Thelo",
  "Threlo",
  "Strelo",
  "Drelo",
];

/** Options for {@link robotName} and {@link robotNames}. */
export interface RobotNameOptions {
  /**
   * Deterministic seed. The same seed always yields the same sequence
   * within the same library version.
   * Without a seed the result is random (`Math.random`).
   */
  seed?: string | number;
  /**
   * Names that must not be returned. Comparison is case-insensitive:
   * `taken: ["kryx"]` blocks `"Kryx"`.
   * Results are guaranteed to avoid them (case-insensitive).
   * For `robotNames`, results are also unique among themselves.
   */
  taken?: Set<string> | readonly string[];
  /**
   * Default `true`: use `ROBOT_NAMES` first (shuffled deterministically
   * when `seed` is set), then the onset+rime generator once exhausted.
   * `false`: generator only.
   */
  curated?: boolean;
}

/** Three vowels in a row are discarded (never occurs with the tables above; guard). */
const TRIPLE_VOWEL = /[aeiou]{3}/i;

/**
 * Join an onset + rime. A doubled letter at the boundary is dropped once
 * (`Xy` + `yra` → `Xyra`, `Qy` + `yph` → `Qyph`).
 * Result is Titlecase: capitalized onset + lowercase rime.
 */
function joinParts(prefix: string, suffix: string): string {
  const last = prefix[prefix.length - 1]?.toLowerCase() ?? "";
  const first = suffix[0]?.toLowerCase() ?? "";
  const head = last !== "" && last === first ? prefix.slice(0, -1) : prefix;
  return head + suffix;
}

/** FNV-1a 32-bit for string seeds. */
function hashStringToUint32(input: string): number {
  let hash = 0x81_1c_9d_c5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01_00_01_93);
  }
  return hash >>> 0;
}

function seedToUint32(seed: string | number): number {
  if (typeof seed === "number") {
    if (!Number.isFinite(seed)) {
      throw new TypeError("seed number must be finite");
    }
    return Math.trunc(seed) >>> 0;
  }
  if (typeof seed === "string") {
    return hashStringToUint32(seed);
  }
  throw new TypeError("seed must be a string or number");
}

/** PRNG mulberry32: small, fast, deterministic. */
function mulberry32(state: number): () => number {
  let current = state >>> 0;
  return () => {
    current = (current + 0x6d_2b_79_f5) | 0;
    let mixed = Math.imul(current ^ (current >>> 15), 1 | current);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function createRandom(seed: string | number | undefined): () => number {
  if (seed === undefined) return Math.random;
  return mulberry32(seedToUint32(seed));
}

function resolveCurated(curated: boolean | undefined): boolean {
  if (curated === undefined) return true;
  if (typeof curated !== "boolean") {
    throw new TypeError("curated must be a boolean");
  }
  return curated;
}

function toTakenLowerSet(
  taken: Set<string> | readonly string[] | undefined,
): Set<string> {
  if (taken === undefined) return new Set();
  if (taken instanceof Set) {
    const out = new Set<string>();
    for (const name of taken) out.add(String(name).toLowerCase());
    return out;
  }
  if (Array.isArray(taken)) {
    return new Set(taken.map((name) => String(name).toLowerCase()));
  }
  throw new TypeError("taken must be a Set<string> or string[]");
}

/** Fisher-Yates shuffle using the given RNG. */
function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const temp = arr[i] as T;
    arr[i] = arr[j] as T;
    arr[j] = temp;
  }
  return arr;
}

/** One generator candidate, or null when outside the shape (length/vowel run). */
function randomCandidate(random: () => number): string | null {
  const prefix = ROBOT_PREFIXES[
    Math.floor(random() * ROBOT_PREFIXES.length)
  ] as string;
  const suffix = ROBOT_SUFFIXES[
    Math.floor(random() * ROBOT_SUFFIXES.length)
  ] as string;
  const candidate = joinParts(prefix, suffix);
  if (candidate.length < 4 || candidate.length > 6) return null;
  if (TRIPLE_VOWEL.test(candidate)) return null;
  return candidate;
}

function generatorSpace(): number {
  return ROBOT_PREFIXES.length * ROBOT_SUFFIXES.length;
}

/**
 * Exact set of distinct generator names (lowercased) the current tables
 * can produce. Small enough (~2k pairs) to enumerate, so exhaustion is
 * detected up front instead of by blind retry loops.
 */
function validGeneratorKeys(): Set<string> {
  const keys = new Set<string>();
  for (const prefix of ROBOT_PREFIXES) {
    for (const suffix of ROBOT_SUFFIXES) {
      const candidate = joinParts(prefix, suffix);
      if (candidate.length < 4 || candidate.length > 6) continue;
      if (TRIPLE_VOWEL.test(candidate)) continue;
      keys.add(candidate.toLowerCase());
    }
  }
  return keys;
}

/** Distinct names still available: curated ∪ generator minus `used`. */
function remainingCapacity(used: Set<string>): number {
  const pool = validGeneratorKeys();
  for (const name of ROBOT_NAMES) pool.add(name.toLowerCase());
  let remaining = 0;
  for (const key of pool) {
    if (!used.has(key)) remaining += 1;
  }
  return remaining;
}

function exhausted(): Error {
  return new Error(
    "Ran out of available robot names (taken covers the namespace)",
  );
}

function generateOne(random: () => number, used: Set<string>): string {
  if (remainingCapacity(used) < 1) throw exhausted();
  const maxAttempts = Math.min(generatorSpace() * 8 + 100, 200_000);
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = randomCandidate(random);
    if (candidate === null) continue;
    const key = candidate.toLowerCase();
    if (!used.has(key)) return candidate;
  }
  throw exhausted();
}

/**
 * Generate one short robot name, e.g. `"Zyro"`.
 *
 * The same `seed` always yields the same result within the same library
 * version (unless `taken` forces a move to the next candidate, which
 * stays deterministic). `taken` comparison is case-insensitive.
 */
export function robotName(options: RobotNameOptions = {}): string {
  const curated = resolveCurated(options.curated);
  const used = toTakenLowerSet(options.taken);
  const random = createRandom(options.seed);

  if (curated) {
    for (const name of shuffled(ROBOT_NAMES, random)) {
      const key = name.toLowerCase();
      if (!used.has(key)) return name;
    }
    // Curated list exhausted (or fully taken): fall through to generator.
  }

  return generateOne(random, used);
}

/**
 * Generate `count` robot names, unique among themselves
 * (case-insensitive) and absent from `options.taken`.
 *
 * With `curated: true` (the default), `ROBOT_NAMES` is used first,
 * then the onset+rime generator, so requesting more than
 * `ROBOT_NAMES.length` stays unique while capacity allows.
 * Throws when `count` exceeds the remaining capacity instead of
 * looping forever.
 */
export function robotNames(count: number, options: RobotNameOptions = {}): string[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError("count must be an integer >= 0");
  }
  if (count === 0) return [];

  const curated = resolveCurated(options.curated);
  const used = toTakenLowerSet(options.taken);
  const random = createRandom(options.seed);
  const result: string[] = [];

  if (remainingCapacity(used) < count) throw exhausted();

  if (curated) {
    for (const name of shuffled(ROBOT_NAMES, random)) {
      if (result.length >= count) break;
      const key = name.toLowerCase();
      if (used.has(key)) continue;
      used.add(key);
      result.push(name);
    }
  }

  const maxAttempts = Math.min(generatorSpace() * 8 + count * 4 + 100, 300_000);
  let attempts = 0;
  while (result.length < count) {
    if (attempts >= maxAttempts) {
      throw exhausted();
    }
    attempts += 1;
    const candidate = randomCandidate(random);
    if (candidate === null) continue;
    const key = candidate.toLowerCase();
    if (used.has(key)) continue;
    used.add(key);
    result.push(candidate);
  }
  return result;
}
