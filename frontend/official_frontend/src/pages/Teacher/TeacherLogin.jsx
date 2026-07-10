import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!id) {
      newErrors.id = 'ID is required';
    } else if (id.length < 6) {
      newErrors.id = 'ID must be at least 6 characters';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) return;

    setIsLoading(true);
    
    // Build API URL from env or use fallback
    const baseApi = import.meta.env.VITE_TEACHER_LOGIN_API;
    
      
    try {
      const res = await fetch(`${baseApi}?teacherId=${id}&password=${password}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body?.message || 'Invalid credentials or server error.');
        setIsLoading(false);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data?.success === false) {
        setServerError(data?.message || 'Invalid credentials.');
        setIsLoading(false);
        return;
      }

      // On success the backend returns a single TeacherDTO:
      // { id, teacherId, teacherName, teacherEmail, teacherDateOfBirth, departmentName }.
      // The timetable page reads its session as { teacherName, teacherId, details, token },
      // where details.data holds the DTO — mirroring the student flow's shape — so wrap
      // the DTO the same way here rather than passing it bare.
      const teacherDto = data;

      navigate('/teachertimetable', {
        state: {
          teacherName: teacherDto?.teacherName,
          teacherId: teacherDto?.teacherId ?? id,
          details: { data: teacherDto },
        },
      });
    } catch (err) {
      console.error('Network error during login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-screen max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
                Teacher ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="id"
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.id ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                />
              </div>
              {errors.id && (
                <p className="mt-2 text-sm text-red-600">{errors.id}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-12 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <div className="flex items-center gap-4 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => navigate('/teacher-change-password')}
                  className="text-blue-600 hover:text-blue-500"
                >
                  Change password
                </button>
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Forgot id?
                </a>
              </div>
            </div>

            {serverError && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded p-2">{serverError}</div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-linear-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}