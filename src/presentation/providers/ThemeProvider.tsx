import { useEffect } from 'react'
import { useThemeStore } from '../../infrastructure/stores/theme.store'

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { isDarkMode } = useThemeStore()

  // Efecto para manejar el tema inicial
  useEffect(() => {
    // const savedTheme = localStorage.getItem('theme-storage')
    // if (savedTheme) {
    //   const { state } = JSON.parse(savedTheme)
    //   if (state.isDarkMode) {
    //     document.documentElement.classList.add('dark')
    //   }
    // }
  }, [])

  // Efecto para manejar los cambios de tema
  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
      document.querySelector('link[href*="lara-light-cyan"]')?.setAttribute('disabled', 'true')
      document.querySelector('link[href*="lara-dark-cyan"]')?.removeAttribute('disabled')
    } else {
      root.classList.remove('dark')
      document.querySelector('link[href*="lara-dark-cyan"]')?.setAttribute('disabled', 'true')
      document.querySelector('link[href*="lara-light-cyan"]')?.removeAttribute('disabled')
    }

    // Actualizar variables CSS
    root.style.setProperty('--primary-color', isDarkMode ? '#6366F1' : '#4F46E5')
  }, [isDarkMode])

  return <>{children}</>
}
