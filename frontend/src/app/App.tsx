import Router from './router'
import './App.css'
import './pages/Components/BasicCalendar.css'
import { BrowserRouter } from 'react-router-dom'
import BasicCalendar from './pages/Components/BasicCalendar'


function App() {
  return (
    <BrowserRouter>
      <div style={{height: "50vh"}}>
        <BasicCalendar />
      </div>
      <Router />
    </BrowserRouter>
  )
}

export default App
