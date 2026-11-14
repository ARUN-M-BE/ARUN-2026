# CREDITS

## 3D hero model

The hero canvas renders **`/public/models/hero.glb`** and tints its materials
with the active palette. The file is intentionally **not committed** — the
project ships with a procedural emblem that renders until the asset is added,
so the build never depends on a binary asset.

**Recommended source (pick one, both CC0 1.0 — public domain, commercial use OK):**

| Source | Model | License | Link |
| --- | --- | --- | --- |
| Poly Pizza (Quaternius packs) | `Computer` / `Retro Laptop` / `Terminal` | CC0 1.0 | <https://poly.pizza/u/Quaternius> |
| Khronos glTF Sample Assets | `BoomBox`, `Lantern`, `CesiumMilkTruck` | CC0 1.0 | <https://github.com/KhronosGroup/glTF-Sample-Assets> |

When you add a model, record it here in this form:

```
Model:    <Arun>
Author:   <arun>
Source:   <url>
License:  CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/)
Modified: meshopt compressed, rescaled, materials tinted at runtime
```

### Adding the model

1. Download the `.glb` (CC0 or CC-BY only).
2. Compress it below **2 MB** — Draco or meshopt both work:

   ```bash
   npx @gltf-transform/cli optimize in.glb hero.glb --compress meshopt --texture-compress webp
   npx @gltf-transform/cli resize --width 1024 --height 1024 hero.glb
   ```

3. Save it as `public/models/hero.glb` (or point `NEXT_PUBLIC_HERO_MODEL_URL`
   at any other URL).
4. Reload — the loader picks it up automatically, centres it, scales it to the
   viewport and recolours it.

### Runtime behaviour

- Materials are cloned per instance, so the shared glTF material cache is never
  mutated. Neutrally coloured meshes are tinted fully; coloured meshes are
  blended 35 % toward the palette so authored textures survive.
- DPR is capped at 1.5, rendering pauses when the canvas leaves the viewport or
  the tab is hidden, and `prefers-reduced-motion` disables rotation and float.
- If WebGL is unavailable or the model fails to load, a static SVG emblem is
  rendered instead.

## Cursor ink trail

`components/effects/splash-cursor.tsx` is a TypeScript port of the **SplashCursor**
component from React Bits, mounted once per visit through
`components/effects/splash-cursor-layer.tsx`.

```
Component: SplashCursor (JavaScript + CSS variant)
Author:    React Bits
Source:    https://reactbits.dev
License:   MIT (re-licensed under this project's MIT terms — see LICENSE)
Modified:  ported to TypeScript, WebGL setup isolated in one disposed effect,
           palette bound to the published theme tokens, mounted lazily on idle
           for fine pointers only
```

The WebGL simulation starts after an idle slot, never during first paint. It is
skipped entirely on touch input and whenever `prefers-reduced-motion: reduce` is
set, and the simulation loop parks itself once the ink has faded.

## Libraries

- [three.js](https://threejs.org) — MIT
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) — MIT
- [@react-three/drei](https://github.com/pmndrs/drei) — MIT
- [Framer Motion](https://www.framer.com/motion/) — MIT
- [Motion](https://motion.dev) — MIT
- [lucide-react](https://lucide.dev) — ISC
