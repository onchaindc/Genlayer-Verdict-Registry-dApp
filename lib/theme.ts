'use client'

export type Theme = 'light' | 'dark' | 'system'

const THEME_KEY = 'verdict-registry-theme'

export function getTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem(THEME_KEY) as Theme) || 'system'
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme)
  applyTheme(theme)
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement

  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', isDark)
  } else {
    root.classList.toggle('dark', theme === 'dark')
  }
}

export function useTheme() {
  const getCurrentTheme = () => getTheme()
  const setCurrentTheme = (theme: Theme) => setTheme(theme)

  return {
    theme: getCurrentTheme(),
    setTheme: setCurrentTheme,
  }
}
