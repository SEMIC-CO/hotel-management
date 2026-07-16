import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import '../presentation/styles/index.css'
// import 'calendarkit-basic/dist/styles.css'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
// import { PrimeReactProvider } from 'primereact/api'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
