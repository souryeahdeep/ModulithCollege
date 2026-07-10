import { useEffect, useMemo, useState } from "react";
import { Edit2, Save, X } from "lucide-react";

const FETCH_URL = import.meta.env.VITE_TEACHER_FETCH;
const UPDATE_URL = import.meta.env.VITE_TEACHER_UPDATE;

export default function UpdateTeacher() {
	const [teachers, setTeachers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("teacherName");
	const [sortOrder, setSortOrder] = useState("asc");
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [editForm, setEditForm] = useState(null);

	useEffect(() => {
		fetchTeachers(page);
	}, [page]);

	const fetchTeachers = async (pageNumber) => {
		if (!FETCH_URL) return;
		try {
			const response = await fetch(`${FETCH_URL}/${pageNumber}`);
			if (!response.ok) throw new Error("Failed to load teachers");
			const data = await response.json();
			setTeachers(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("Error fetching teachers:", error);
			setMessage(`Error: ${error.message}`);
		}
	};

	const filteredTeachers = useMemo(() => {
		const term = searchTerm.toLowerCase();
		return teachers.filter((teacher) =>
			[teacher.teacherName, teacher.teacherId]
				.filter(Boolean)
				.some((value) => value.toLowerCase().includes(term))
		);
	}, [teachers, searchTerm]);

	const sortedTeachers = useMemo(() => {
		const list = [...filteredTeachers];
		list.sort((a, b) => {
			const aVal = a?.[sortBy]?.toString().toLowerCase() ?? "";
			const bVal = b?.[sortBy]?.toString().toLowerCase() ?? "";
			if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
			if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
		return list;
	}, [filteredTeachers, sortBy, sortOrder]);

	const startEdit = (teacher) => {
		setEditingId(teacher.teacherId);
		setEditForm({
			id: teacher.teacherId,
			name: teacher.teacherName,
			email: teacher.teacherEmail,
			birthDate: teacher.teacherDateOfBirth,
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
			id: editForm.id,
			name: editForm.name,
			email: editForm.email,
			birthdate: editForm.birthDate,
		};

		try {
			const response = await fetch(UPDATE_URL, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || "Failed to update teacher");
			}

			setMessage("Teacher updated successfully!");
			cancelEdit();
			fetchTeachers(page);
		} catch (error) {
			setMessage(`Error: ${error.message}`);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
			<div className="max-w-5xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
						Update Teachers
					</h1>

					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
						<input
							type="text"
							placeholder="Search by name or ID..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
						/>
						<div className="flex items-center gap-2">
							<label className="text-sm text-gray-700 font-medium">
								Sort by:
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
							>
								<option value="teacherName">Name</option>
								<option value="teacherId">ID</option>
								<option value="teacherDateOfBirth">Birth Date</option>
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

					{sortedTeachers.length ? (
						<div className="space-y-3">
							{sortedTeachers.map((teacher) => (
								<div
									key={teacher.teacherId}
									className="p-4 bg-gray-50 rounded-lg border border-gray-200"
								>
									{editingId === teacher.teacherId ? (
										<div className="space-y-4">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Teacher ID
													</label>
													<input
														type="text"
														value={editForm.id}
														disabled
														className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Teacher Name
													</label>
													<input
														type="text"
														value={editForm.name}
														onChange={(e) =>
															handleEditChange("name", e.target.value)
														}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Teacher Email
													</label>
													<input
														type="email"
														value={editForm.email}
														onChange={(e) =>
															handleEditChange("email", e.target.value)
														}
														className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">
														Birth Date
													</label>
													<input
														type="date"
														value={editForm.birthDate}
														onChange={(e) =>
															handleEditChange("birthDate", e.target.value)
														}
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
											<div className="flex justify-between items-start mb-2">
												<p className="font-semibold text-lg text-gray-800">
													{teacher.teacherName}
												</p>
												<div className="flex items-center gap-2">
													<span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
														{teacher.teacherId}
													</span>
													<button
														onClick={() => startEdit(teacher)}
														className="text-blue-600 hover:text-blue-800 transition"
														title="Edit teacher"
													>
														<Edit2 size={18} />
													</button>
												</div>
											</div>
											<p className="text-sm text-gray-600 mb-1">
												<span className="font-medium">Email:</span> {" "}
												{teacher.teacherEmail}
											</p>
											<p className="text-sm text-gray-600">
												<span className="font-medium">Birth Date:</span> {" "}
												{teacher.teacherDateOfBirth}
											</p>
										</>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-gray-500">No teachers found.</p>
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
						{teachers.length >= 5 && (
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
