import { createStitches, CSS as StitchesCSS } from "@stitches/react";
import { tomatoDark, mauveDark, violetDark, grassDark } from "@radix-ui/colors";
export const { styled, css, globalCss, config } = createStitches({
  theme: {
    colors: {
      hiContrast: "hsl(206,10%,5%)",
      loContrast: "white",
      ...tomatoDark,
      ...mauveDark,
      ...violetDark,
      ...grassDark,
    },

    fonts: {
      system: "system-ui",
    },
  },
  media: {
    bp1: `(min-width: 520px)`,
    bp2: `(min-width: 900px)`,
  },
});

export const globalStyles = globalCss({
  "*": {
    boxSizing: " border-box",
  },
});

export type CSS = StitchesCSS<typeof config>;
