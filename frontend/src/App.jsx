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
import FindPlayers from './pages/FindPlayers';
import ProtectedRoute from './components/ProtectedRoute';
import Events from './pages/Events';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] font-sans relative overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.10) 0%, rgba(10, 10, 10, 0) 50%)`
        }}>

        <Routes>
          {/* Rutas publicas: Aqui SI meto el Navbar y el Footer de la landing page */}
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
          
          {/* Rutas del Dashboard protegidas para que no entre cualquiera sin loguearse */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="players" element={<FindPlayers />} />
            {/* La ruta de los equipos arreglada para que no me de el pantallazo en negro */}
            <Route path="teams" element={<FindTeams />} />
            {/* Nueva ruta para los torneos y eventos que acabo de maquetar */}
            <Route path="events" element={<Events />} />
          </Route>
        </Routes>

      </div>
    </Router>
  );
}

export default App;