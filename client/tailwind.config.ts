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
          // Sắc độ Xanh Lam Rõ Ràng (Dựa trên HSL ~210, 45%, 52%) - Cải thiện
          "50": "#f5f8fe", // hsl(210, 40%, 97%)
          "100": "#e9effc", // hsl(210, 42%, 94%)
          "200": "#cfe0f9", // hsl(210, 44%, 86%)
          "300": "#a9c7f3", // hsl(210, 45%, 75%)
          "400": "#80acf0", // hsl(210, 45%, 64%)
          "500": "#5791e0", // hsl(210, 45%, 52%) - Gần với DEFAULT
          DEFAULT: "hsl(var(--primary))", // Tham chiếu --primary (hsl(210, 45%, 52%))
          foreground: "hsl(var(--primary-foreground))", // Tham chiếu --primary-foreground
          "600": "#447fd5", // hsl(210, 48%, 46%)
          "700": "#336ac8", // hsl(210, 50%, 39%)
          "800": "#2553a7", // hsl(210, 55%, 32%)
          "900": "#1a3e85", // hsl(210, 60%, 25%)
          "950": "#112b63", // hsl(210, 65%, 18%)
        },
        secondary: {
          // Sắc độ Vàng Ochre/Cát Tinh Tế (Dựa trên HSL ~38, 48%, 65%) - Cải thiện
          "50": "#fdfaf6", // hsl(38, 40%, 98%)
          "100": "#fbf3ea", // hsl(38, 45%, 95%)
          "200": "#f6e8d3", // hsl(38, 48%, 88%)
          "300": "#f0d8b3", // hsl(38, 48%, 78%)
          "400": "#e8c38c", // hsl(38, 48%, 65%) - Gần với DEFAULT
          DEFAULT: "hsl(var(--secondary))", // Tham chiếu --secondary (hsl(38, 48%, 65%))
          foreground: "hsl(var(--secondary-foreground))", // Tham chiếu --secondary-foreground
          "500": "#e0b370", // hsl(38, 50%, 58%)
          "600": "#d69e54", // hsl(38, 55%, 50%)
          "700": "#c3873a", // hsl(38, 60%, 42%)
          "800": "#b07126", // hsl(38, 65%, 35%)
          "900": "#985d19", // hsl(38, 70%, 28%)
          "950": "#7f490f", // hsl(38, 75%, 21%)
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        chart: {
          // Placeholder
          "1": "hsl(var(--chart-1, 210 45% 52%))", // Primary
          "2": "hsl(var(--chart-2, 38 48% 65%))", // Secondary
          "3": "hsl(var(--chart-3, 210 50% 70%))", // Accent
          "4": "hsl(var(--chart-4, 210 48% 46%))", // Primary-600
          "5": "hsl(var(--chart-5, 38 55% 50%))", // Secondary-600
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
        body: 'var(--font-open-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
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
