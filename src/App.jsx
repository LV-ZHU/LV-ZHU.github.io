import { studySections } from './config/site'
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
        {studySections.map(({ path }) => <Route key={path} path={path} element={<StudySubject subject={path.split('/').pop()} />} />)}
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
