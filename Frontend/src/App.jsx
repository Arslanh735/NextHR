
import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

import AuthBootstrap from "./features/auth/AuthBootstrap";
import ProtectedRoute from "./features/auth/ProtectedRoute";

function Unauthorized() {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>403 - Access Denied</h1>
      <p>You do not have permission to access this page.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthBootstrap>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute allowedRoles={["admin", "hr", "employee"]} />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route
              index
              element={<Navigate to="/dashboard" replace />}
            />

            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
      </Routes>
    </AuthBootstrap>
  );
}
