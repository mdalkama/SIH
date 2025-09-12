import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./pages/Login.jsx";
import menuConfig from "./utils/menuConfigUtils.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProtectedLoginRoute from "./components/ProtectedLoginRoute.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import Application from "./components/Application/Application.jsx";
import Dummy from "./pages/Dummy/Dummy.jsx"; 
import Main from "./pages/DTE_home/content/content.jsx";
import DTE from "./pages/DTE_home/dte.jsx";
import Admission from "./pages/DTE_home/addmission/addmission.jsx";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Home route - DTE page for normal users */}
          <Route path="/" element={<DTE />} />
          
          {/* Admission routes */}
          <Route path="/admission/engineering" element={<Admission admissionType="engineering" />} />
          <Route path="/admission/non-engineering" element={<Admission admissionType="non-engineering" />} />
          
          {/* New nested admission routes */}
          <Route path="/admission/diploma-engineering-first-year" element={<Admission admissionType="diploma-engineering-first-year" />} />
          <Route path="/admission/diploma-engineering-lateral-entry" element={<Admission admissionType="diploma-engineering-lateral-entry" />} />
          <Route path="/admission/diploma-non-engineering-first-year" element={<Admission admissionType="diploma-non-engineering-first-year" />} />
          <Route path="/admission/diploma-non-engineering-second-year-graduate" element={<Admission admissionType="diploma-non-engineering-second-year-graduate" />} />
          <Route path="/admission/diploma-non-engineering-first-year-degree" element={<Admission admissionType="diploma-non-engineering-first-year-degree" />} />
          
          {/* Other routes */}
          {/* Login route protected */}
          <Route
            path="/login"
            element={
              <ProtectedLoginRoute>
                <Login />
              </ProtectedLoginRoute>
            }
          />
          <Route path="/application" element={<Application />} />
          <Route path="/main" element={<Main />} />
          <Route path="/dummy" element={<Dummy />} />
          
          {/* Unauthorized page */}
          <Route
            path="/not-authorized"
            element={<Unauthorized/>}
          />
          
          {/* Student Routes */}
          <Route path="/student/*" element={<Navbar />}>
            {menuConfig.student?.map((item) => (
              <Route
                key={item.id}
                path={item.path.replace('/student/', '')}
                element={
                  <ProtectedRoute allowedRoles={[item?.role]}>
                    <item.component />
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>
          
          {/* University Admin Routes */}
          <Route path="/university-admin/*" element={<Navbar />}>
            {menuConfig.UniversityAdmin?.map((item) => (
              <Route
                key={item.id}
                path={item.path.replace('/university-admin/', '')}
                element={
                  <ProtectedRoute allowedRoles={[item?.role]}>
                    <item.component />
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>
          
          {/* College Admin Routes */}
          <Route path="/college-admin/*" element={<Navbar />}>
            {menuConfig.CollegeAdmin?.map((item) => (
              <Route
                key={item.id}
                path={item.path.replace('/college-admin/', '')}
                element={
                  <ProtectedRoute allowedRoles={[item?.role]}>
                    <item.component />
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>
          
          {/* Add all other role routes similarly */}
          {Object.entries(menuConfig).map(([role, items]) => {
            if (['student', 'UniversityAdmin', 'CollegeAdmin'].includes(role)) {
              return null; // Already handled above
            }
            
            const basePath = items[0]?.path.split('/').slice(0, -1).join('/') || `/${role.toLowerCase()}`;
            
            return (
              <Route key={role} path={`${basePath}/*`} element={<Navbar />}>
                {items.map((item) => (
                  <Route
                    key={item.id}
                    path={item.path.replace(basePath + '/', '')}
                    element={
                      <ProtectedRoute allowedRoles={[item?.role]}>
                        <item.component />
                      </ProtectedRoute>
                    }
                  />
                ))}
              </Route>
            );
          })}
        </Routes>
      </UserProvider>
    </Router>
  );
}
import { Home } from "lucide-react";

export default App;
