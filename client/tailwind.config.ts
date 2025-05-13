import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          // Dải màu xám cho Primary (trung tâm quanh ~25% lightness)
          "50": "#f7f7f7", // hsl(0, 0%, 97%)
          "100": "#e3e3e3", // hsl(0, 0%, 89%)
          "200": "#c9c9c9", // hsl(0, 0%, 79%)
          "300": "#a6a6a6", // hsl(0, 0%, 65%)
          "400": "#808080", // hsl(0, 0%, 50%) // Có thể dùng làm base cho secondary
          "500": "#666666", // hsl(0, 0%, 40%)
          DEFAULT: "hsl(var(--primary))", // Sẽ là hsl(0, 0%, 25%) cho light, hsl(0, 0%, 80%) cho dark
          foreground: "hsl(var(--primary-foreground))",
          "600": "#4d4d4d", // hsl(0, 0%, 30%)
          "700": "#333333", // hsl(0, 0%, 20%)
          "800": "#262626", // hsl(0, 0%, 15%)
          "900": "#1c1c1c", // hsl(0, 0%, 11%)
          "950": "#0d0d0d", // hsl(0, 0%, 5%)
        },
        secondary: {
          // Dải màu xám cho Secondary (trung tâm quanh ~50% lightness)
          "50": "#fafafa", // hsl(0, 0%, 98%)
          "100": "#f0f0f0", // hsl(0, 0%, 94%)
          "200": "#dedede", // hsl(0, 0%, 87%)
          "300": "#c2c2c2", // hsl(0, 0%, 76%)
          "400": "#a3a3a3", // hsl(0, 0%, 64%)
          DEFAULT: "hsl(var(--secondary))", // Sẽ là hsl(0, 0%, 50%) cho light, hsl(0, 0%, 40%) cho dark
          foreground: "hsl(var(--secondary-foreground))",
          "500": "#808080", // hsl(0, 0%, 50%) // Trùng với DEFAULT của nó trong light mode
          "600": "#757575", // hsl(0, 0%, 46%)
          "700": "#616161", // hsl(0, 0%, 38%)
          "800": "#4d4d4d", // hsl(0, 0%, 30%)
          "900": "#3b3b3b", // hsl(0, 0%, 23%)
          "950": "#212121", // hsl(0, 0%, 13%)
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Xanh cổ vịt
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        chart: {
          // Giữ nguyên màu chart hiện tại, bạn có thể điều chỉnh nếu muốn
          "1": "hsl(var(--chart-1, 210 45% 52%))",
          "2": "hsl(var(--chart-2, 38 48% 65%))",
          "3": "hsl(var(--chart-3, 210 50% 70%))",
          "4": "hsl(var(--chart-4, 210 48% 46%))",
          "5": "hsl(var(--chart-5, 38 55% 50%))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontFamily: {
        heading:
          'var(--font-eb-garamond), ui-serif, Georgia, Cambria, Times, "Times New Roman", serif',
        body: 'var(--font-merriweather), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
