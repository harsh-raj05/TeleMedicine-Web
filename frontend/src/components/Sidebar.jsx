import { Link } from "react-router-dom";

function Sidebar({ userRole }) {
  return (
    <div className="w-64 bg-white shadow-xl h-screen fixed left-0 top-0 p-6 border-r border-gray-200">

      <h2 className="text-2xl font-bold text-blue-700 mb-10">
        TeleMedicine
      </h2>

      <nav className="space-y-4 text-gray-700">

        {userRole === "patient" && (
          <>
            <Link 
              to="/patient-dashboard"
              className="block p-3 rounded-lg hover:bg-blue-100"
            >
              Dashboard
            </Link>

            <Link 
              to="/book-appointment"
              className="block p-3 rounded-lg hover:bg-blue-100"
            >
              Book Appointment
            </Link>
          </>
        )}

        {userRole === "doctor" && (
          <>
            <Link 
              to="/doctor-dashboard"
              className="block p-3 rounded-lg hover:bg-blue-100"
            >
              Appointments
            </Link>
          </>
        )}

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          className="block text-left text-red-600 p-3 rounded-lg hover:bg-red-100 w-full"
        >
          Logout
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;
