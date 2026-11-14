import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Bits components, installed verbatim from the shadcn registry
    // (https://reactbits.dev/r/{Name}-TS-TW). They read refs during render and
    // prime state from an effect by design; the upstream source is kept close
    // to the registry so future updates stay a straight re-install, so the two
    // compiler-oriented rules are relaxed for these files only. Everything the
    // project owns is still linted at full strictness.
    files: [
      "components/BlurText.tsx",
      "components/ClickSpark.tsx",
      "components/CountUp.tsx",
      "components/DecryptedText.tsx",
      "components/GlareHover.tsx",
      "components/GradientText.tsx",
      "components/Magnet.tsx",
      "components/Noise.tsx",
      "components/ShinyText.tsx",
      "components/SplitText.tsx",
      "components/SpotlightCard.tsx",
      "components/StarBorder.tsx",
    ],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    ".open-next/**",
    ".wrangler/**",
    "out/**",
    "build/**",
    "env.d.ts",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
