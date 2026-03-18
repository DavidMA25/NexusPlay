import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Community from './components/Community';
import VideoSection from './components/VideoSection';
import Footer from './components/Footer';
import Login from './pages/Login'; 
import Register from './pages/Register';
import FindTeams from './pages/FindTeams';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] font-sans relative overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.10) 0%, rgba(10, 10, 10, 0) 50%)`
        }}>

        <Routes>
          {/* Rutas publicas: Aqui SI queremos el Navbar y el Footer del Home */}
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
              <Features />
              <Community />
              <VideoSection />
              <Footer />
            </>
          } />

          <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
          <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />
          <Route path="/find-teams" element={<><Navbar /><FindTeams /><Footer /></>} />

          {/* Ruta del Dashboard  */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
          </Route>
        </Routes>

      </div>
    </Router>
  );
}

export default App;