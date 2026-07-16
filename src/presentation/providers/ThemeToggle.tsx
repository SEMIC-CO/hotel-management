import { Button } from 'primereact/button'
import { useThemeStore } from '../../infrastructure/stores/theme.store'

export const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useThemeStore()

  const handleToggle = () => {
    toggleTheme()
    // Forzar la actualización del tema en localStorage
    const savedTheme = localStorage.getItem('theme-storage')
    if (savedTheme) {
      const themeData = JSON.parse(savedTheme)
      themeData.state.isDarkMode = !isDarkMode
      localStorage.setItem('theme-storage', JSON.stringify(themeData))
    }
  }

  return (
    <Button
      icon={isDarkMode ? 'pi pi-sun' : 'pi pi-moon'}
      text
      severity={isDarkMode ? 'warning' : 'secondary'}
      aria-label="Toggle theme"
      onClick={handleToggle}
      className="transition-colors duration-200"
      tooltip={isDarkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      tooltipOptions={{ position: 'bottom' }}
    />
  )
}
