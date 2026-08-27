import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const Study = lazy(() => import('./pages/Study'))
const StudySubject = lazy(() => import('./pages/StudySubject'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Jottings = lazy(() => import('./pages/Jottings'))
const JottingArticle = lazy(() => import('./pages/JottingArticle'))
const Favorites = lazy(() => import('./pages/Favorites'))
const FavoritesLetter = lazy(() => import('./pages/FavoritesLetter'))
const Music = lazy(() => import('./pages/Music'))
const Travel = lazy(() => import('./pages/Travel'))
const Acgn = lazy(() => import('./pages/Acgn'))
const Tutoring = lazy(() => import('./pages/Tutoring'))
const Account = lazy(() => import('./pages/Account'))
const NotFound = lazy(() => import('./pages/NotFound'))

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
        <Route path="/study/algorithm-design" element={<StudySubject subject="algorithm-design" />} />
        <Route path="/study/artificial-intelligence" element={<StudySubject subject="artificial-intelligence" />} />
        <Route path="/study/security-math-foundations" element={<StudySubject subject="security-math-foundations" />} />
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
