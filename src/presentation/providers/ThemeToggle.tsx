import { Button } from 'primereact/button'
import { useThemeStore } from '../../infrastructure/stores/theme.store'

export const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useThemeStore()

  // El middleware persist de Zustand ya sincroniza el estado con localStorage.
  const handleToggle = () => toggleTheme()

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
