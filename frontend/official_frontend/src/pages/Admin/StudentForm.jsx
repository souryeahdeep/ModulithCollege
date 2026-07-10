import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_STUDENT_ADD;

export default function StudentForm() {
  const [formData, setFormData] = useState([
    {
      studentId: "",
      studentName: "",
      group: "",
      section: "",
      totalClass: "",
      present: "",
      semester: "",
      branch: "",
      rollNo: "",
      registrationNo: "",
      presentAddress: "",
      city: "",
      pin: "",
      mobileNo: "",
      dateOfBirth: "",
      bloodGroup: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
  };

  const addStudentRow = () => {
    setFormData([
      ...formData,
      {
        studentId: "",
        studentName: "",
        group: "",
        section: "",
        totalClass: "",
        present: "",
        semester: "",
        branch: "",
        rollNo: "",
        registrationNo: "",
        presentAddress: "",
        city: "",
        pin: "",
        mobileNo: "",
        dateOfBirth: "",
        bloodGroup: "",
      },
    ]);
  };

  const removeStudentRow = (index) => {
    if (formData.length > 1) {
      setFormData(formData.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!API_BASE_URL) return;
    setLoading(true);
    setMessage("");

    const payload = formData.map((student) => ({
      studentId: student.studentId,
      studentName: student.studentName,
      group: student.group,
      section: student.section,
      totalClass: student.totalClass,
      present: student.present,
      semester: student.semester,
      branch: student.branch,
      rollNo: student.rollNo,
      registrationNo: student.registrationNo,
      presentAddress: student.presentAddress,
      city: student.city,
      pin: student.pin,
      mobileNo: student.mobileNo,
      dateOfBirth: student.dateOfBirth,
      bloodGroup: student.bloodGroup,
    }));

    fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) =>
        response.text().then((text) => {
          if (response.ok) return text || "Added Successfully";
          throw new Error(text || "Failed to add students");
        })
      )
      .then((text) => {
        setMessage(text);
        setFormData([
          {
            studentId: "",
            studentName: "",
            group: "",
            section: "",
            totalClass: "",
            present: "",
            semester: "",
            branch: "",
            rollNo: "",
            registrationNo: "",
            presentAddress: "",
            city: "",
            pin: "",
            mobileNo: "",
            dateOfBirth: "",
            bloodGroup: "",
          },
        ]);
      })
      .catch((error) => setMessage(`Error: ${error.message}`))
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Student Registration
          </h1>

          <div className="space-y-6">
            {formData.map((student, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200 relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Student {index + 1}
                  </h3>
                  {formData.length > 1 && (
                    <button
                      onClick={() => removeStudentRow(index)}
                      className="text-red-500 hover:text-red-700 transition"
                      type="button"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID
                    </label>
                        <input
                      type="text"
                      value={student.studentId}
                      onChange={(e) => handleChange(index, "studentId", e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Enter student ID"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student Name
                    </label>
                    <input
                      type="text"
                      value={student.studentName}
                      onChange={(e) => handleChange(index, "studentName", e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Enter student name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group No
                    </label>
                    <input
                      type="number"
                      value={student.group}
                      onChange={(e) => handleChange(index, "group", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Group"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section No
                    </label>
                    <input
                      type="number"
                      value={student.section}
                      onChange={(e) => handleChange(index, "section", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Section"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Class
                    </label>
                    <input
                      type="number"
                      value={student.totalClass}
                      onChange={(e) => handleChange(index, "totalClass", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Total classes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Present
                    </label>
                    <input
                      type="number"
                      value={student.present}
                      onChange={(e) => handleChange(index, "present", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Present count"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Semester
                    </label>
                    <input
                      type="number"
                      value={student.semester}
                      onChange={(e) => handleChange(index, "semester", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Semester"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={student.branch}
                      onChange={(e) => handleChange(index, "branch", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Branch"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Roll No
                    </label>
                    <input
                      type="number"
                      value={student.rollNo}
                      onChange={(e) => handleChange(index, "rollNo", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Roll number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration No
                    </label>
                    <input
                      type="text"
                      value={student.registrationNo}
                      onChange={(e) => handleChange(index, "registrationNo", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Registration number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Present Address
                    </label>
                    <input
                      type="text"
                      value={student.presentAddress}
                      onChange={(e) => handleChange(index, "presentAddress", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Present address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={student.city}
                      onChange={(e) => handleChange(index, "city", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN
                    </label>
                    <input
                      type="number"
                      value={student.pin}
                      onChange={(e) => handleChange(index, "pin", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="PIN"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile No
                    </label>
                    <input
                      type="tel"
                      value={student.mobileNo}
                      onChange={(e) => handleChange(index, "mobileNo", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Mobile number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={student.dateOfBirth}
                      onChange={(e) => handleChange(index, "dateOfBirth", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <input
                      type="text"
                      value={student.bloodGroup}
                      onChange={(e) => handleChange(index, "bloodGroup", e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                      placeholder="Blood group"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={addStudentRow}
              type="button"
              className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg font-semibold hover:border-indigo-500 hover:bg-indigo-50 transition duration-200 flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Another Student
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? "Submitting..."
                : `Submit ${formData.length} Student(s)`}
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
