import { useState } from 'react'
import './App.css'
import StageDashboard from './components/StageDashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import WorkflowBuilder from './components/WorkflowBuilder'
import NavBar from './components/NavBar'
import Home from './components/Home'
import About from './components/About'
import ProcessListing from './components/ProcessListing'
import ProcessTaskSteps from './components/ProcessTaskSteps'
import CreateProcess from './components/CreateProcess'

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    if(theme==='dark'){
    document.getElementsByTagName('body')[0].classList.add('dark');
  }else{
    document.getElementsByTagName('body')[0].classList.remove('dark');
  }
  setTheme(theme === 'dark' ? 'light' : 'dark');
}

  return (
    <>
    <BrowserRouter>
     <NavBar theme={theme} toggleTheme={toggleTheme} />
      <Routes>
        <Route path='/' element={<WorkflowBuilder />} />
        <Route path="/about" element={<About />} />
        <Route path="/process" element={<ProcessListing />} />
        <Route path="/process/:id" element={<ProcessTaskSteps />} />
        <Route path="/createProcess" element={<CreateProcess/>}/><Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/process" element={<ProcessListing />} />
        <Route path="/process/:id" element={<ProcessTaskSteps />} />
        <Route path="/createProcess" element={<CreateProcess/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
