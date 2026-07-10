import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Details from './pages/Details';
import OnlinePayment from './pages/OnlinePayment';
import FeesAndDues from './pages/FeesAndDues';
import Timetable from './pages/Timetable';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/details" element={<Details />} />
        <Route path="/payment" element={<OnlinePayment />} />
        <Route path="/checkdues" element={<FeesAndDues />} />
        <Route path="/timetable" element={<Timetable />} />

      </Routes>
    </Router>
  );
}

export default App;
