/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{tsx,ts}", "./app/**/*.{tsx,ts}", "./screens/**/*.{tsx,ts}", "./components/**/*.{tsx,ts}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background:  "#F2EFE7",
        surface:     "#F2EFE7",
        primary:     "#000000",
        secondary:   "#FFFFFF",
        border:      "#000000",
        accent:      "#F25F06",
        success:     "#00E676",
        warning:     "#FFD600",
        error:       "#FF1744",
        "text-primary":   "#000000",
        "text-secondary": "#717171",
      },
      fontFamily: {
        sans:      ["DMSans_400Regular"],
        "sans-bold": ["DMSans_700Bold"],
      },
      fontSize: {
        xs:   ["12px", { lineHeight: "16px" }],
        sm:   ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg:   ["20px", { lineHeight: "28px" }],
        xl:   ["24px", { lineHeight: "32px" }],
        "2xl": ["32px", { lineHeight: "40px" }],
        "3xl": ["40px", { lineHeight: "48px" }],
        "4xl": ["48px", { lineHeight: "56px" }],
      },
      borderRadius: {
        sm:   9999,
        md:   16,
        lg:   24,
        card: 12,
        full: 9999,
      },
      spacing: {
        1:  4,
        2:  8,
        3:  12,
        4:  16,
        6:  24,
        8:  32,
        12: 48,
        16: 64,
      },
    },
  },
  plugins: [],
};
