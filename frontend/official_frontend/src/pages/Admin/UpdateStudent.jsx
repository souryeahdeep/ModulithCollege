import { useEffect, useMemo, useState } from "react";
import { Edit2, Save, X } from "lucide-react";

const FETCH_URL = import.meta.env.VITE_STUDENT_FETCH;
const UPDATE_URL = import.meta.env.VITE_STUDENT_UPDATE;

export default function UpdateStudent() {
	const [students, setStudents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("studentName");
	const [sortOrder, setSortOrder] = useState("asc");
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editForm, setEditForm] = useState(null);

	useEffect(() => {
		fetchStudents(page);
	}, [page]);

	const fetchStudents = async () => {
		if (!FETCH_URL) return;
		try {
			const response = await fetch(`${FETCH_URL}`);			
			if (!response.ok) throw new Error("Failed to load students");
			const data = await response.json();
			setStudents(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("Error fetching students:", error);
			setMessage(`Error: ${error.message}`);
		}
	};

	const filteredStudents = useMemo(() => {
		const term = searchTerm.toLowerCase();
		return students.filter((student) =>
			[
				student.studentName,
				student.studentId,
				student.registrationNo,
				student.rollNo?.toString(),
			]
				.filter(Boolean)
				.some((value) => value.toLowerCase().includes(term))
		);
	}, [students, searchTerm]);

	const sortedStudents = useMemo(() => {
		const list = [...filteredStudents];
		list.sort((a, b) => {
			const aVal = a?.[sortBy]?.toString().toLowerCase() ?? "";
			const bVal = b?.[sortBy]?.toString().toLowerCase() ?? "";
			if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
			if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
		return list;
	}, [filteredStudents, sortBy, sortOrder]);

	const startEdit = (student) => {
		setEditingId(student.studentId);
		setEditForm({
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
		});
		setMessage("");
	};

	const cancelEdit = () => {
		setEditingId(null);
		setEditForm(null);
	};

	const handleEditChange = (field, value) => {
		setEditForm((prev) => ({ ...prev, [field]: value }));
	};

	const saveEdit = async () => {
		if (!UPDATE_URL || !editForm) return;
		setLoading(true);
		setMessage("");

		const payload = {
			studentId: editForm.studentId,
			studentName: editForm.studentName,
			group: editForm.group,
			section: editForm.section,
			totalClass: editForm.totalClass,
			present: editForm.present,
			semester: editForm.semester,
			branch: editForm.branch,
			rollNo: editForm.rollNo,
			registrationNo: editForm.registrationNo,
			presentAddress: editForm.presentAddress,
			city: editForm.city,
			pin: editForm.pin,
			mobileNo: editForm.mobileNo,
			dateOfBirth: editForm.dateOfBirth,
			bloodGroup: editForm.bloodGroup,
		};

		try {
			const response = await fetch(UPDATE_URL, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Failed to update student");
			}

			setMessage("Student updated successfully!");
			cancelEdit();
			fetchStudents(page);
		} catch (error) {
			setMessage(`Error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
						Update Students
					</h1>

					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
						<input
							type="text"
							placeholder="Search by name, ID, roll or reg no..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
						/>
						<div className="flex items-center gap-2">
							<label className="text-sm text-gray-700 font-medium">Sort by:</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
							>
								<option value="studentName">Name</option>
								<option value="studentId">ID</option>
								<option value="semester">Semester</option>
								<option value="branch">Branch</option>
							</select>
							<button
								onClick={() =>
									setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
								}
								className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-gray-700"
								title={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
							>
								{sortOrder === "asc" ? "↑" : "↓"}
							</button>
						</div>
					</div>

					{message && (
						<div
							className={`mb-4 p-4 rounded-lg ${
								message.toLowerCase().includes("success")
									? "bg-green-100 text-green-700"
									: "bg-red-100 text-red-700"
							}`}
						>
							{message}
						</div>
					)}

					{sortedStudents.length ? (
						<div className="space-y-3">
							{sortedStudents.map((student) => (
								<div
									key={student.studentId}
									className="p-4 bg-gray-50 rounded-lg border border-gray-200"
								>
									{editingId === student.studentId ? (
										<div className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Student ID
													</label>
													<input
														type="text"
														value={editForm.studentId}
														disabled
														className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Student Name
													</label>
													<input
														type="text"
														value={editForm.studentName}
														onChange={(e) => handleEditChange("studentName", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Branch
													</label>
													<input
														type="text"
														value={editForm.branch}
														onChange={(e) => handleEditChange("branch", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Semester
													</label>
													<input
														type="number"
														value={editForm.semester}
														onChange={(e) => handleEditChange("semester", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Group
													</label>
													<input
														type="number"
														value={editForm.group}
														onChange={(e) => handleEditChange("group", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Section
													</label>
													<input
														type="number"
														value={editForm.section}
														onChange={(e) => handleEditChange("section", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Total Class
													</label>
													<input
														type="number"
														value={editForm.totalClass}
														onChange={(e) => handleEditChange("totalClass", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Present
													</label>
													<input
														type="number"
														value={editForm.present}
														onChange={(e) => handleEditChange("present", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Roll No
													</label>
													<input
														type="number"
														value={editForm.rollNo}
														onChange={(e) => handleEditChange("rollNo", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Registration No
													</label>
													<input
														type="text"
														value={editForm.registrationNo}
														onChange={(e) => handleEditChange("registrationNo", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Present Address
													</label>
													<input
														type="text"
														value={editForm.presentAddress}
														onChange={(e) => handleEditChange("presentAddress", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														City
													</label>
													<input
														type="text"
														value={editForm.city}
														onChange={(e) => handleEditChange("city", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														PIN
													</label>
													<input
														type="number"
														value={editForm.pin}
														onChange={(e) => handleEditChange("pin", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Mobile No
													</label>
													<input
														type="tel"
														value={editForm.mobileNo}
														onChange={(e) => handleEditChange("mobileNo", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Date of Birth
													</label>
													<input
														type="date"
														value={editForm.dateOfBirth}
														onChange={(e) => handleEditChange("dateOfBirth", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Blood Group
													</label>
													<input
														type="text"
														value={editForm.bloodGroup}
														onChange={(e) => handleEditChange("bloodGroup", e.target.value)}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
											</div>
											<div className="flex gap-2">
												<button
													onClick={saveEdit}
													disabled={loading}
													className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
												>
													<Save size={16} />
													Save
												</button>
												<button
													onClick={cancelEdit}
													className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
												>
													<X size={16} />
													Cancel
												</button>
											</div>
										</div>
									) : (
										<>
											<div className="flex justify-between items-start gap-2">
												<div className="space-y-1">
													<p className="font-semibold text-lg text-gray-800">
														{student.studentName}
													</p>
													<p className="text-sm text-gray-600">
														<span className="font-medium">Branch:</span> {student.branch}
													</p>
													<p className="text-sm text-gray-600">
														<span className="font-medium">Semester:</span> {student.semester}
													</p>
													<p className="text-sm text-gray-600">
														<span className="font-medium">Group / Section:</span> {student.group} / {student.section}
													</p>
													<p className="text-sm text-gray-600">
														<span className="font-medium">Roll / Reg:</span> {student.rollNo} / {student.registrationNo}
													</p>
													<p className="text-sm text-gray-600">
														<span className="font-medium">Mobile:</span> {student.mobileNo}
													</p>
													<p className="text-sm text-gray-600">
														<span className="font-medium">DOB:</span> {student.dateOfBirth}
													</p>
												</div>
												<div className="flex items-center gap-2">
													<span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
														{student.studentId}
													</span>
													<button
														onClick={() => startEdit(student)}
														className="text-blue-600 hover:text-blue-800 transition"
														title="Edit student"
													>
														<Edit2 size={18} />
													</button>
												</div>
											</div>
										</>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">No students found.</p>
					)}

					<div className="mt-6 flex justify-center gap-4">
						{page > 1 && (
							<button
								onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
								className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
							>
								Previous Page
							</button>
						)}
						{students.length >= 5 && (
							<button
								onClick={() => setPage((prev) => prev + 1)}
								className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
							>
								Next Page
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
