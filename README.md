# @xzy-ai/robo-faker

Generate nama robotik pendek satu kata seperti `Zyro`, `Kryx`.
Dipakai Herdr untuk menamai tab/agent baru otomatis.

Tanpa dependency runtime. ESM only.

## Pasang

```sh
pnpm add @xzy-ai/robo-faker
```

## Pakai

```ts
import { robotName, robotNames } from "@xzy-ai/robo-faker";

robotName(); // mis. "Zyro" (acak)
robotName({ seed: "agent-1" }); // deterministik: seed sama → nama sama
robotName({ taken: ["Zyro", "kryx"] }); // dijamin tidak mengembalikan taken (case-insensitive)

robotNames(3, { seed: "tab-7" }); // mis. ["Drix", "Vynx", "Zyrex"]
robotNames(60, { seed: "banyak" }); // > ROBOT_NAMES.length tetap unik (lanjut ke generator)
robotNames(5, { curated: false, seed: "gen" }); // generator saja, tanpa daftar curated
```

## API

- `robotName(options?)`: satu nama (`ROBOT_NAMES` dulu, lalu generator saat habis).
- `robotNames(count, options?)`: `count` nama unik (case-insensitive), tidak ada di `taken`.
- Options:
  - `seed?: string | number` — hasil deterministik untuk seed yang sama.
  - `taken?: Set<string> | string[]` — dibandingkan case-insensitive.
  - `curated?: boolean` — default `true`. `false` = generator saja.
- Ekspor lain: `ROBOT_NAMES` (curated, de-duplikat),
  `ROBOT_PREFIXES` (onset gugusan konsonan: Kr, Dr, Xy, …),
  `ROBOT_SUFFIXES` (rima pendek: yx, ron, tra, …).

Format hasil: satu kata 4-6 huruf, huruf pertama kapital, tanpa angka/pemisah,
gugusan 2 konsonan di sebagian besar hasil, tanpa rangkaian 3 vokal.
