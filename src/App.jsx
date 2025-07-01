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
import { height } from '@fortawesome/free-brands-svg-icons/fa42Group'
import Orchestration from './components/Orchestration'
import TicketFlow from './components/TicketFlow'
import TicketListing from './components/TicketListing'
import Dashboard from './components/Dashboard'
import Report from './components/Report'
function App() {
  const [theme, setTheme] = useState('dark');
  const toggleTheme = () => {
    if(theme==='light'){
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
     <div style={{height: '90vh'}}>
      <Routes>
        <Route path='/' element={<Dashboard/>} />
        <Route path="/about" element={<About />} />
        <Route path="/process" element={<ProcessListing />} />
        <Route path="/process/:id" element={<ProcessTaskSteps />} />
        <Route path="/createProcess" element={<CreateProcess/>}/>
        <Route path="/orchestration/:id" element={<Orchestration />} />
        <Route path="/ticketflow" element={<TicketFlow />} />
        <Route path="/ticketlisting" element={<TicketListing />} />
        <Route path="/workflowbuilder" element={<WorkflowBuilder />} />
        <Route path='/reports' element={<Report/>}/>
      </Routes>
      </div>
      </BrowserRouter>
    </>
  )
}

export default App
