import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './Components/Header'
import Footer from './Components/Footer'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import Dashboard from './Pages/Dashboard'
import Overview from './Pages/dashboard/Overview'
import Medications from './Pages/dashboard/Medications'
import Reminders from './Pages/dashboard/Reminders'
import AIVerification from './Pages/dashboard/AIVerification'
import RiskReport from './Pages/dashboard/RiskReport'
import CaregiverLink from './Pages/dashboard/CaregiverLink'
import Settings from './Pages/dashboard/Settings'
import './index.css'

function App() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/Dashboard')

  return (
    <>
      {!isDashboard && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="Medications" element={<Medications />} />
          <Route path="Reminders" element={<Reminders />} />
          <Route path="AIVerification" element={<AIVerification />} />
          <Route path="RiskReport" element={<RiskReport />} />
          <Route path="CaregiverLink" element={<CaregiverLink />} />
          <Route path="Settings" element={<Settings />} />
        </Route>
      </Routes>
      {!isDashboard && <Footer />}
    </>
  )
}

export default App
