import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './styles/index.css'
import App from './app/App.jsx'
import 'katex/dist/katex.min.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App/>
    </StrictMode>
)
