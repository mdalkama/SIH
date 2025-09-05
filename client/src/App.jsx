import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./pages/Login.jsx";
import menuConfig from "./utils/menuConfigUtils.js";
import CourseForm from "./components/Trial.jsx";
import AddCourse from "./components/Forms/AddCourse.jsx";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/trial" element={<CourseForm />} />
          <Route path="/addcourse" element={<AddCourse />} />


          {/* Layout with Navbar */}
          <Route path="/" element={<Navbar />}>
            {/* Dynamically map routes from menuConfig */}
            {Object.values(menuConfig).flat().map((item) =>
              item.component ? (
                <Route
                  key={item.id}
                  path={item.path}
                  element={<item.component />}
                />
              ) : null
            )}

            {/* Default redirect */}
            <Route index element={<Navigate to="/student/dashboard" replace />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
