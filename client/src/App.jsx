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
import OtpVerification from "./pages/DTE_home/addmission/OtpVerification.jsx";
import ApplicationWrapper from "./pages/DTE_home/addmission/ApplicationWrapper.jsx";
import CollegeList from "./pages/DTE_home/colleges/CollegeList.jsx";
import NocPage from "./pages/DTE_home/noc/NocPage.jsx";
import RosterPage from "./pages/DTE_home/roster/RosterPage.jsx";
import RtiPage from "./pages/DTE_home/rti/RtiPage.jsx";
import CircularsLettersPage from "./pages/DTE_home/documents/CircularsLettersPage.jsx";
import EstablishmentPage from "./pages/DTE_home/documents/EstablishmentPage.jsx";
import DepartmentRulesPage from "./pages/DTE_home/documents/DepartmentRulesPage.jsx";
import TransferOrdersPage from "./pages/DTE_home/employee/TransferOrdersPage.jsx";
import PromotionOrdersPage from "./pages/DTE_home/employee/PromotionOrdersPage.jsx";
import PostingOrdersPage from "./pages/DTE_home/employee/PostingOrdersPage.jsx";
import StudentsCornerPage from "./pages/DTE_home/students/StudentsCornerPage.jsx";
import TendersAuctionsPage from "./pages/DTE_home/tenders/TendersAuctionsPage.jsx";
import DetailedNews from "./pages/DTE_home/content/detailedNews.jsx";
import Chatbot from "./pages/DTE_home/Chatbot.jsx";
import Macet from "./pages/DTE_home/colleges/macet/Macet.jsx";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Home route - DTE page for normal users */}
          <Route path="/" element={<DTE showChatbot={true} />} />
          
          {/* New Admission Flow - OTP Verification */}
          <Route path="/admission/otp-verification" element={<OtpVerification />} />
          
          {/* Course-specific Application Routes with Session Management */}
          <Route path="/application/:courseId" element={<ApplicationWrapper />} />
          
          {/* Legacy Admission routes - redirect to OTP verification */}
          <Route path="/admission/engineering" element={<Admission admissionType="engineering" />} />
          <Route path="/admission/non-engineering" element={<Admission admissionType="non-engineering" />} />
          
          {/* New nested admission routes - redirect to OTP verification */}
          <Route path="/admission/diploma-engineering-first-year" element={<Admission admissionType="diploma-engineering-first-year" />} />
          <Route path="/admission/diploma-engineering-lateral-entry" element={<Admission admissionType="diploma-engineering-lateral-entry" />} />
          <Route path="/admission/diploma-non-engineering-first-year" element={<Admission admissionType="diploma-non-engineering-first-year" />} />
          <Route path="/admission/diploma-non-engineering-second-year-graduate" element={<Admission admissionType="diploma-non-engineering-second-year-graduate" />} />
          <Route path="/admission/diploma-non-engineering-first-year-degree" element={<Admission admissionType="diploma-non-engineering-first-year-degree" />} />
          
          {/* College List Route */}
          <Route path="/colleges" element={<CollegeList />} />
          
          {/* MACET College Routes */}
          <Route path="/macet/*" element={<Macet />} />
          
          {/* NOC Route */}
          <Route path="/noc" element={<NocPage />} />
          
          {/* Roster Route */}
          <Route path="/roster" element={<RosterPage />} />
          
          {/* RTI Route */}
          <Route path="/rti" element={<RtiPage />} />
          
          {/* Documents Routes */}
          <Route path="/documents/circulars-letters" element={<CircularsLettersPage />} />
          <Route path="/documents/establishment" element={<EstablishmentPage />} />
          <Route path="/documents/department-rules" element={<DepartmentRulesPage />} />
          
          {/* Students Corner Route */}
          <Route path="/students-corner" element={<StudentsCornerPage />} />
          
          {/* Tenders & Auctions Route */}
          <Route path="/tenders-auctions" element={<TendersAuctionsPage />} />
          
          {/* News Detail Route */}
          <Route path="/news/:id" element={<DetailedNews />} />
          
          {/* Employee Corner Routes */}
          <Route path="/employee/transfer-orders" element={<TransferOrdersPage />} />
          <Route path="/employee/promotion-orders" element={<PromotionOrdersPage />} />
          <Route path="/employee/posting-orders" element={<PostingOrdersPage />} />
          
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
          <Route path="/application" element={
            <ProtectedRoute>
              <Application />
            </ProtectedRoute>
          } />
          <Route path="/main" element={<Main />} />
          <Route path="/dummy" element={<Dummy />} />
          
          {/* Catch-all route for DTE without chatbot */}
          <Route path="/dte" element={<DTE showChatbot={false} />} />
          
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
