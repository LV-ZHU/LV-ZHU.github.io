import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import ThemeProvider from './components/ThemeProvider'
import './styles/common.css'
import './styles/tokens.css'
import './styles/shell.css'
import './styles/atlas-pages.css'

document.body.style.opacity = '0'
document.body.style.transition = 'opacity 0.5s ease'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)

requestAnimationFrame(() => {
  document.body.style.opacity = '1'
})
