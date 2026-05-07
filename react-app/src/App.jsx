import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Study from './pages/Study'
import StudySubject from './pages/StudySubject'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Jottings from './pages/Jottings'
import JottingArticle from './pages/JottingArticle'
import Favorites from './pages/Favorites'
import FavoritesLetter from './pages/FavoritesLetter'
import Music from './pages/Music'
import Travel from './pages/Travel'
import Acgn from './pages/Acgn'
import Tutoring from './pages/Tutoring'
import Account from './pages/Account'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/study" element={<Study />} />
        <Route path="/study/data-structure" element={<StudySubject subject="data-structure" />} />
        <Route path="/study/computer-organization" element={<StudySubject subject="computer-organization" />} />
        <Route path="/study/os" element={<StudySubject subject="os" />} />
        <Route path="/study/computer-network" element={<StudySubject subject="computer-network" />} />
        <Route path="/study/math-analysis" element={<StudySubject subject="math-analysis" />} />
        <Route path="/study/linear-algebra" element={<StudySubject subject="linear-algebra" />} />
        <Route path="/study/discrete-math" element={<StudySubject subject="discrete-math" />} />
        <Route path="/study/physics" element={<StudySubject subject="physics" />} />
        <Route path="/study/circuit-theory" element={<StudySubject subject="circuit-theory" />} />
        <Route path="/study/assembly_language_programming" element={<StudySubject subject="assembly_language_programming" />} />
        <Route path="/study/database" element={<StudySubject subject="database" />} />
        <Route path="/study/cryptography" element={<StudySubject subject="cryptography" />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/jottings" element={<Jottings />} />
        <Route path="/jottings/:slug" element={<JottingArticle />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/favorites/:letter" element={<FavoritesLetter />} />
        <Route path="/music" element={<Music />} />
        <Route path="/travel" element={<Travel />} />
        <Route path="/acgn" element={<Acgn />} />
        <Route path="/tutoring" element={<Tutoring />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
