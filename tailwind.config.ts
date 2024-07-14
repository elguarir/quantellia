import type { Config } from "tailwindcss";
import {
   animations,
   components,
   grays,
   palettes,
   rounded,
   shade,
} from "@tailus/themer";
import { PluginAPI } from "tailwindcss/types/config";
// 50 -> 950
const { primary, secondary, accent, warning, danger, info, success } =
   palettes.oz;

const config = {
   darkMode: ["class"],
   content: [
      "./components/**/*.{ts,tsx}",
      "./app/**/*.{ts,tsx}",
      "./node_modules/@tailus/themer/dist/components/**/*.{js,ts}",
   ],
   prefix: "",
   theme: {
      container: {
         center: true,
         padding: "1.2rem",
         screens: {
            "2xl": "1400px",
         },
      },
      extend: {
         fontFamily: {
            sans: ["var(--font-geist-sans)"],
            mono: ["var(--font-geist-mono)"],
         },
         colors: {
            // main colors
            primary: {
               ...primary,
               DEFAULT: primary[500],
               foreground: primary[100],
            },
            secondary: {
               ...secondary,
               DEFAULT: secondary[500],
               foreground: secondary[100],
            },

            accent: {
               ...accent,
               DEFAULT: accent[500],
               foreground: accent[100],
            },
            warning: {
               ...warning,
               DEFAULT: warning[500],
               foreground: warning[100],
            },
            danger: {
               ...danger,
               DEFAULT: danger[500],
               foreground: danger[100],
            },
            gray: {
               ...grays.neutral,
               DEFAULT: grays.neutral[500],
               foreground: grays.neutral[100],
            },
            info: {
               ...info,
               DEFAULT: info[500],
               foreground: info[100],
            },
            success: {
               ...success,
               DEFAULT: success[500],
               foreground: success[100],
            },
            // other colors
            border: "hsl(var(--border))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            muted: {
               DEFAULT: "hsl(var(--muted))",
               foreground: "hsl(var(--muted-foreground))",
            },
            popover: {
               DEFAULT: "hsl(var(--popover))",
               foreground: "hsl(var(--popover-foreground))",
            },
            card: {
               DEFAULT: "hsl(var(--card))",
               foreground: "hsl(var(--card-foreground))",
            },
            destructive: {
               DEFAULT: "hsl(var(--destructive))",
               foreground: "hsl(var(--destructive-foreground))",
            },
         },
         borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
         },
         keyframes: {
            "accordion-down": {
               from: { height: "0" },
               to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
               from: { height: "var(--radix-accordion-content-height)" },
               to: { height: "0" },
            },
            "caret-blink": {
               "0%,70%,100%": { opacity: "1" },
               "20%,50%": { opacity: "0" },
            },
            wobble: {
               "0%,100%": { transform: "translateX(-90%)" },
               "50%": { transform: "translateX(90%)" },
            },
            "line-spin": {
               "0%,100%": { transform: "scaleY(0.4)" },
               "50%": { transform: "scaleY(1)" },
            },
            "spinner-spin": {
               "0%": { transform: "rotate(0deg)" },
               to: { transform: "rotate(1turn)" },
            },
         },
         animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
            "spinner-ease-spin": "spinner-spin .8s ease-in-out infinite",
            "spinner-linear-spin": "spinner-spin .8s linear infinite",
            "caret-blink": "caret-blink 1.25s ease-out infinite",
            "spin-slow": "spin 3s linear infinite",
            "spin-fast": "spin 0.5s linear infinite",
            pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            wobble: "wobble 1.75s ease-in-out infinite",
            "line-spin": "line-spin 1.2s ease-in-out infinite",
         },
      },
   },
   plugins: [
      require("tailwindcss-animate"),
      require("@tailwindcss/typography"),
      rounded,
      shade,
      components,
      animations,
   ],
} satisfies Config;

export default config;
