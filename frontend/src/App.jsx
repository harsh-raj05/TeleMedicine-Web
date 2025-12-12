import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import BookAppointment from "./pages/BookAppointment";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import WritePrescription from "./pages/WritePrescription";
import UploadRecord from "./pages/UploadRecord";
import ViewRecords from "./pages/ViewRecords";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Patient Only */}
        <Route
          path="/patient-dashboard"
          element={
            <RoleProtectedRoute allowedRole="patient">
              <PatientDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/book-appointment"
          element={
            <RoleProtectedRoute allowedRole="patient">
              <BookAppointment />
            </RoleProtectedRoute>
          }
        />

        {/* Doctor Only */}
        <Route
          path="/doctor-dashboard"
          element={
            <RoleProtectedRoute allowedRole="doctor">
              <DoctorDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/write-prescription/:id"
          element={
            <RoleProtectedRoute allowedRole="doctor">
              <WritePrescription />
            </RoleProtectedRoute>
          }
        />
        {/* Patient Medical Records */}
        <Route
          path="/upload-record"
          element={
            <RoleProtectedRoute allowedRole="patient">
              <UploadRecord />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/view-records"
          element={
            <RoleProtectedRoute allowedRole="patient">
              <ViewRecords />
            </RoleProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
