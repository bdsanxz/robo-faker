/**
 * @xzy-ai/robo-faker
 *
 * Generate nama robotik pendek satu kata seperti `Zyro`, `Kryx`.
 * Tanpa dependency runtime. ESM only.
 *
 * Sumber nama ada dua:
 * - `ROBOT_NAMES`: daftar curated dari user, dipakai dulu bila `curated: true`.
 * - Generator pola suku kata (onset gugusan konsonan + rima pendek)
 *   untuk saat daftar curated habis atau `curated: false`.
 *   Hasil selalu 4-6 huruf, huruf pertama kapital, tanpa angka/pemisah.
 */

/**
 * Onset: gugusan 2 konsonan (Titlecase, 2-3 huruf).
 * Setiap hasil generator diawali salah satunya, jadi mayoritas
 * hasil mengandung gugusan konsonan berurutan.
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
];

/**
 * Rima pendek: nukleus vokal singkat + koda (lowercase, 2-3 huruf).
 * Vokal sedikit, sering memakai y, sering berakhir x/n/r/a.
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
];

/**
 * Daftar curated dari user (de-duplikat, urutan asli dipertahankan).
 * Dipakai dulu saat `curated: true` (default).
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
];

/** Opsi untuk {@link robotName} dan {@link robotNames}. */
export interface RobotNameOptions {
  /**
   * Seed deterministik. Seed yang sama selalu menghasilkan urutan yang sama.
   * Tanpa seed hasilnya acak (`Math.random`).
   */
  seed?: string | number;
  /**
   * Nama yang tidak boleh dipakai. Perbandingan case-insensitive:
   * `taken: ["kryx"]` memblokir `"Kryx"`.
   * Hasil dijamin tidak ada di dalamnya (case-insensitive).
   * Untuk `robotNames`, hasil juga unik satu sama lain.
   */
  taken?: Set<string> | readonly string[];
  /**
   * Default `true`: pakai `ROBOT_NAMES` dulu (di-shuffle deterministik
   * bila `seed` diisi), lalu generator onset+rima saat habis.
   * `false`: langsung generator saja.
   */
  curated?: boolean;
}

/** Tiga vokal berurutan dibuang (tak pernah terjadi dengan daftar di atas; pengaman). */
const TRIPLE_VOWEL = /[aeiou]{3}/i;

/**
 * Gabung onset + rima. Huruf ganda di perbatasan dibuang satu
 * (`Xy` + `yra` → `Xyra`, `Qy` + `yph` → `Qyph`).
 * Hasil Titlecase: onset kapital + rima lowercase.
 */
function joinParts(prefix: string, suffix: string): string {
  const last = prefix[prefix.length - 1]?.toLowerCase() ?? "";
  const first = suffix[0]?.toLowerCase() ?? "";
  const head = last !== "" && last === first ? prefix.slice(0, -1) : prefix;
  return head + suffix;
}

/** FNV-1a 32-bit untuk seed string. */
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
      throw new TypeError("seed number harus finite");
    }
    return Math.trunc(seed) >>> 0;
  }
  if (typeof seed === "string") {
    return hashStringToUint32(seed);
  }
  throw new TypeError("seed harus string atau number");
}

/** PRNG mulberry32: kecil, cepat, deterministik. */
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
    throw new TypeError("curated harus boolean");
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
  throw new TypeError("taken harus Set<string> atau string[]");
}

/** Fisher-Yates shuffle memakai RNG yang diberikan. */
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

/** Satu kandidat generator, atau null bila di luar pakem (panjang/rangkaian vokal). */
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

function generateOne(random: () => number, used: Set<string>): string {
  const maxAttempts = Math.min(generatorSpace() * 8 + 100, 200_000);
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = randomCandidate(random);
    if (candidate === null) continue;
    const key = candidate.toLowerCase();
    if (!used.has(key)) return candidate;
  }
  throw new Error("Kehabisan nama robot yang tersedia (taken menutupi namespace)");
}

/**
 * Generate satu nama robot pendek, mis. `"Zyro"`.
 *
 * Dengan `seed` yang sama hasilnya selalu sama (kecuali `taken`
 * memaksa maju ke kandidat berikutnya, tetap deterministik).
 * Perbandingan `taken` case-insensitive.
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
    // Curated habis (atau semua di-taken): lanjut ke generator.
  }

  return generateOne(random, used);
}

/**
 * Generate `count` nama robot yang unik satu sama lain
 * (case-insensitive) dan tidak ada di `options.taken`.
 *
 * Dengan `curated: true` (default), `ROBOT_NAMES` dipakai dulu
 * lalu generator onset+rima saat habis, sehingga meminta lebih
 * dari `ROBOT_NAMES.length` tetap unik.
 */
export function robotNames(count: number, options: RobotNameOptions = {}): string[] {
  if (!Number.isInteger(count) || count < 0) {
    throw new RangeError("count harus integer >= 0");
  }
  if (count === 0) return [];

  const curated = resolveCurated(options.curated);
  const used = toTakenLowerSet(options.taken);
  const random = createRandom(options.seed);
  const result: string[] = [];

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
      throw new Error(
        "Kehabisan nama robot yang tersedia (taken menutupi namespace)",
      );
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
