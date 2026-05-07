import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/common.css'

document.body.style.opacity = '0'
document.body.style.transition = 'opacity 0.5s ease'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

requestAnimationFrame(() => {
  document.body.style.opacity = '1'
})
