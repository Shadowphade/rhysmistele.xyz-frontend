import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router'
import './index.css'
import App from './App.tsx'
import Home from './pages/home.tsx'
import { Articles, Article } from './pages/articles.tsx'
import Projects from './pages/projects.tsx'
import { PomodoroUi } from './pages/projects/pomodoro.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Home />} />
                <Route path="articles" element={<Articles />} />
                <Route path="article/:name" element={<Article />} />
                <Route path="projects" element={<Projects />} />
                <Route path="projects/pomodoro" element={<PomodoroUi />} />
            </Route>

        </Routes>
    </BrowserRouter>
  </StrictMode>
)
