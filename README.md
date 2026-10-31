# @xzy-ai/robo-faker

Short single-word robotic names like `Zyro`, `Kryx`.
Used by Herdr to name new tabs/agents automatically.

No runtime dependencies. ESM only.

## Install

```sh
pnpm add @xzy-ai/robo-faker
```

## Use

```ts
import { robotName, robotNames } from "@xzy-ai/robo-faker";

robotName(); // e.g. "Zyro" (random)
robotName({ seed: "agent-1" }); // deterministic: same seed → same name
robotName({ taken: ["Zyro", "kryx"] }); // never returns a taken name (case-insensitive)

robotNames(3, { seed: "tab-7" }); // e.g. ["Drix", "Vynx", "Zyrex"]
robotNames(800, { seed: "many" }); // stays unique while capacity allows
robotNames(5, { curated: false, seed: "gen" }); // generator only, no curated list
```

## API

- `robotName(options?)`: one name (`ROBOT_NAMES` first, then the generator).
- `robotNames(count, options?)`: `count` unique names (case-insensitive), none in `taken`.
- Options:
  - `seed?: string | number` — deterministic output for the same seed
    within the same library version.
  - `taken?: Set<string> | string[]` — compared case-insensitively.
  - `curated?: boolean` — default `true`. `false` = generator only.
- Also exported: `ROBOT_NAMES` (curated, de-duplicated),
  `ROBOT_PREFIXES` (consonant-cluster onsets: Kr, Dr, Xy, …),
  `ROBOT_SUFFIXES` (short rimes: yx, ron, tra, …).

Result shape: one word of 4-6 letters, first letter capitalized, no
digits/separators, a 2-consonant cluster in most results, no run of
3 vowels.

Capacity: requesting more distinct names than the curated ∪ generator
pool (minus `taken`) throws instead of looping. Seeded sequences are
stable within a version; extending the tables in a new version may
reshuffle them.
