import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Setup from './pages/Setup';
import Welcome from './pages/Welcome';
import HotspotLanding from './pages/HotspotLanding';
import { AuthProvider } from './hooks/useAuth';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/hotspot" element={<HotspotLanding />} />
            <Route path="/hotspot-landing" element={<HotspotLanding />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;