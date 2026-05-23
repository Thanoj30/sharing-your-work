import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import './styles/global.css';
import DashboardHome from './pages/DashboardHome.jsx';
import Friends from './pages/Friends.jsx';
import Login from './pages/Login.jsx';
import NearbyUsers from './pages/NearbyUsers.jsx';
import ParcelHelp from './pages/ParcelHelp.jsx';
import PlaceholderPage from './pages/PlaceholderPage.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route
            path="parcel-help"
            element={<ParcelHelp />}
          />
          <Route
            path="grocery-help"
            element={<PlaceholderPage title="Grocery Help" description="Grocery Help will be implemented in a later step." />}
          />
          <Route
            path="friends"
            element={<Friends />}
          />
          <Route
            path="nearby-users"
            element={<NearbyUsers />}
          />
          <Route
            path="messages"
            element={<PlaceholderPage title="Messages" description="Messaging will be implemented in a later step." />}
          />
          <Route
            path="profile"
            element={<Profile />}
          />
          <Route
            path="settings"
            element={<PlaceholderPage title="Settings" description="Update account preferences and app settings." />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
