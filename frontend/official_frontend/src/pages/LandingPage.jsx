import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  const handleTeacherLogin = () => {
    navigate('/teacher-login');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Main Heading */}
        <h1 className="text-6xl md:text-7xl font-bold text-center text-indigo-900 mb-16 tracking-wide">
          JIS COLLEGE
        </h1>

        {/* Login Boxes Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Administration Login Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 text-center">
                Administration Login
              </h2>
              <p className="text-gray-600 text-center">
                Access administrative functions and manage the system
              </p>
              <button
                onClick={handleAdminLogin}
                className="mt-6 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-300 w-full"
              >
                Login as Admin
              </button>
            </div>
          </div>

          {/* Teacher Login Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-semibold text-gray-800 text-center">
                Teacher Login
              </h2>
              <p className="text-gray-600 text-center">
                Access your classes and manage attendance records
              </p>
              <button
                onClick={handleTeacherLogin}
                className="mt-6 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-300 w-full"
              >
                Login as Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
