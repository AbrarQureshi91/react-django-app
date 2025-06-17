import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserInfo from './auth/UserInfo';
import Login from './auth/login';
import Register from './auth/register';
import Dashboard from './auth/dashboard';
import StudentDashboard from './auth/StudentDashboard';
import Administration from './auth/Administration';
import ClerkDashboard from './auth/ClerkDashboard';
import TeacherDashboard from './auth/TeacherDashboard';
import ProtectedRoute from './auth/ProtectedRoute';



const App = () => {
  return (
    <>
    
    <Router>
      <UserInfo/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/student" element={<ProtectedRoute allowedRoles={["student"]}> <StudentDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}> <Administration />  </ProtectedRoute>} />
        <Route path="/teacher" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/clerk" element={<ProtectedRoute allowedRoles={["clerk"]}><ClerkDashboard /></ProtectedRoute>} />
        
      </Routes>
    </Router>
    </>
  );
};
export default App;
