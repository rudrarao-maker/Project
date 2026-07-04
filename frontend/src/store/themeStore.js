import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTheme = create(
  persist(
    (set) => ({
      theme: "system", // 'light' | 'dark' | 'system'
      accentColor: "saffron", // 'saffron' | 'green' | 'blue' | 'purple'

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      setAccentColor: (accentColor) => {
        set({ accentColor });
        document.documentElement.setAttribute("data-accent", accentColor);
      },
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
          document.documentElement.setAttribute(
            "data-accent",
            state.accentColor,
          );
        }
      },
    },
  ),
);

export const applyTheme = (theme) => {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else if (theme === "system") {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (systemPrefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
};

// Listen for system theme changes
if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const currentTheme = useTheme.getState().theme;
      if (currentTheme === "system") {
        applyTheme("system");
      }
    });
}
