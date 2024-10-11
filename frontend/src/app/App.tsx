import './App.css';
import './pages/Components/BasicCalendar.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BasicCalendar from './pages/Components/BasicCalendar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TopNav from './pages/Components/TopNav';


function App() {
  return (
    <BrowserRouter>
      <div className="app-container">

        {/* Always show the TopNav */}
        <TopNav />
        {/* Always show the Dashboard */}
        <div className ="main-content">
          <Dashboard />

          {/* Render the page components based on the route */}
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/create-event" element={<CreateEvent />} /> */}
              <Route path="/calendar" element={<BasicCalendar />} />
              {/* <Route path="/volunteer-management" element={<VolunteerManagement />} /> */}
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;