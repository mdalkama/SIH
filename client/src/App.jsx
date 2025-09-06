import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./pages/Login.jsx";
import menuConfig from "./utils/menuConfigUtils.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProtectedLoginRoute from "./components/ProtectedLoginRoute.jsx";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Login route protected */}
          <Route
            path="/login"
            element={
              <ProtectedLoginRoute>
                <Login />
              </ProtectedLoginRoute>
            }
          />

          {/* Layout with Navbar */}
          <Route path="/" element={<Navbar />}>
            {Object.values(menuConfig).flat().map((item) =>
              item.component ? (
                <Route
                  key={item.id}
                  path={item.path}
                  element={
                    <ProtectedRoute allowedRoles={[item?.role]}>
                      <item.component />
                    </ProtectedRoute>
                  }
                />
              ) : null
            )}

            {/* Unauthorized page */}
            <Route
              path="/not-authorized"
              element={<h1>You don’t have permission to access this page</h1>}
            />

            {/* Default redirect */}
            <Route index element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
