import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Community from './components/Community';
import VideoSection from './components/VideoSection';
import Footer from './components/Footer';
import Login from './pages/Login'; 
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] font-sans relative overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.10) 0%, rgba(10, 10, 10, 0) 50%)`
        }}>

        <Navbar />

        <Routes>
          {/* Esta es la ruta del Home (el index) */}
          <Route path="/" element={
            <>
              <Hero />
              <Features />
              <Community />
              <VideoSection />
            </>
          } />

          {/* Esta es la ruta para el Login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;