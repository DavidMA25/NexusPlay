import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Community from './components/Community';
import VideoSection from './components/VideoSection';
import UpcomingEvents from './components/UpcomingEvents';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import FindTeams from './pages/FindTeams';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import FindPlayers from './pages/FindPlayers';
import ProtectedRoute from './components/ProtectedRoute';
import Events from './pages/Events';
import Settings from './pages/Settings';
import ViewProfile from './pages/ViewProfile';
import VerifyEmailNotice from './pages/VerifyEmailNotice';
import VerifyEmailCallback from './pages/VerifyEmailCallback';
import MyTeams from './pages/MyTeams';
import TeamProfile from './pages/TeamProfile';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] font-sans relative overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.10) 0%, rgba(10, 10, 10, 0) 50%)`
        }}>

        <Routes>
          {}
          <Route path="/" element={
            <>
              <Navbar />
              <Hero />
              <Features />
              <UpcomingEvents />
              <Community />
              <VideoSection />
              <Footer />
            </>
          } />

          <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
          <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />

          {}
          <Route path="/verify-email" element={<><Navbar /><VerifyEmailNotice /><Footer /></>} />
          <Route path="/verify-email-callback" element={<><Navbar /><VerifyEmailCallback /><Footer /></>} />

          {}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="players" element={<FindPlayers />} />
            <Route path="teams" element={<FindTeams />} />
            <Route path="events" element={<Events />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<ViewProfile />} />
            <Route path="my-teams" element={<MyTeams />} />
            <Route path="team-profile" element={<TeamProfile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>

      </div>
    </Router>
  );
}

export default App;