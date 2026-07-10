import { useEffect, useMemo, useState } from "react";
import { Trash2 } from "lucide-react";

const FETCH_URL = import.meta.env.VITE_STUDENT_FETCH;
const DELETE_URL = import.meta.env.VITE_STUDENT_DELETE;

export default function DeleteStudent() {
	const [students, setStudents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("studentName");
	const [sortOrder, setSortOrder] = useState("asc");
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetchStudents(page);
	}, [page]);

	const fetchStudents = async (pageNumber) => {
		if (!FETCH_URL) return;
		try {
			const response = await fetch(`${FETCH_URL}${pageNumber}`);
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

	const handleDelete = async (studentId) => {
		if (!DELETE_URL) return;
		if (!window.confirm("Are you sure you want to delete this student?")) {
			return;
		}

		setLoading(true);
		setMessage("");

		try {
			const response = await fetch(`${DELETE_URL}${studentId}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Failed to delete student");
			}

			setMessage("Student deleted successfully!");
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
						Delete Students
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
									className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-2"
								>
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
										</div>
										<div className="flex flex-col items-end gap-2">
											<span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
												{student.studentId}
											</span>
											<button
												onClick={() => handleDelete(student.studentId)}
												disabled={loading}
												className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-400"
											>
												<Trash2 size={16} />
												Delete
											</button>
										</div>
									</div>
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
