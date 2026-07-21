import './App.css'
import './styles/global.scss'
import { Route, Routes } from 'react-router-dom'
import { FrontPage } from './containers/front page/front-page.containers.tsx'

function App() {

  return (
    <Routes>
      <Route path="/" element={<FrontPage />} />
      <Route path="/:serverSlug" element={<FrontPage />} />
    </Routes>
  )
}

export default App
