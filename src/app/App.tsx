import { ThemeProvider } from '../presentation/providers/ThemeProvider'
import { Routers } from './routes/Routers'

export default function App() {
  return (
    <>
      <ThemeProvider>
        <Routers />
      </ThemeProvider>
    </>
  )
  return <Routers />
}
