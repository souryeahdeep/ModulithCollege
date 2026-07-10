import { useState } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

const emptyTeacher = () => ({
  id: "",
  name: "",
  email: "",
  birthDate: "",
  password: "",
  department: "",
});

export default function TeacherForm() {
  const [formData, setFormData] = useState([emptyTeacher()]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const API_BASE_URL = import.meta.env.VITE_TEACHER_ADD;

  const handleChange = (index, field, value) => {
    const newFormData = [...formData];
    newFormData[index][field] = value;
    setFormData(newFormData);
  };

  const addTeacherRow = () => {
    setFormData([...formData, emptyTeacher()]);
  };

  const removeTeacherRow = (index) => {
    if (formData.length > 1) {
      const newFormData = formData.filter((_, i) => i !== index);
      setFormData(newFormData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Mirrors the backend's CreateTeacherRequest record field-for-field:
    // teacherId, teacherName, password, teacherEmail, teacherDateOfBirth
    // (yyyy-MM-dd, which the <input type="date"> already gives us), departmentName.
    const transformedData = formData.map((teacher) => ({
      teacherId: teacher.id,
      teacherName: teacher.name,
      password: teacher.password,
      teacherEmail: teacher.email,
      teacherDateOfBirth: teacher.birthDate,
      departmentName: teacher.department,
    }));
    console.log("Transformed Data:", transformedData);

    fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedData),
    })
      .then(async (response) => {
        return response.text().then((text) => {
          if (response.ok) {
            return text || "Added Successfully";
          }
          throw new Error(text || "Failed to add teachers");
        });
      })
      .then((data) => {
        setMessage(data);
        setFormData([emptyTeacher()]);
      })
      .catch((error) => {
        setMessage(`Error: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Teacher Registration
          </h1>

          <div className="space-y-6">
            {formData.map((teacher, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200 relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Teacher {index + 1}
                  </h3>
                  {formData.length > 1 && (
                    <button
                      onClick={() => removeTeacherRow(index)}
                      className="text-red-500 hover:text-red-700 transition"
                      type="button"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher ID
                    </label>
                    <input
                      type="text"
                      value={teacher.id}
                      onChange={(e) =>
                        handleChange(index, "id", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Enter teacher ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher Name
                    </label>
                    <input
                      type="text"
                      value={teacher.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Enter teacher name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher Email
                    </label>
                    <input
                      type="email"
                      value={teacher.email}
                      onChange={(e) =>
                        handleChange(index, "email", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="teacher@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      value={teacher.birthDate}
                      onChange={(e) =>
                        handleChange(index, "birthDate", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={teacher.password}
                      onChange={(e) =>
                        handleChange(index, "password", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={teacher.department}
                      onChange={(e) =>
                        handleChange(index, "department", e.target.value)
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addTeacherRow}
              type="button"
              className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg font-semibold hover:border-indigo-500 hover:bg-indigo-50 transition duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Another Teacher
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? "Submitting..."
                : `Submit ${formData.length} Teacher(s)`}
            </button>
            {message && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  message.toLowerCase().includes("success")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}