import { useEffect, useMemo, useState } from "react";

const FETCH_URL = import.meta.env.VITE_TEACHER_FETCH;

export default function FetchTeachers() {
	const [teachers, setTeachers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("teacherName");
	const [sortOrder, setSortOrder] = useState("asc");
	const [page, setPage] = useState(1);
	const [message, setMessage] = useState("");

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

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
			<div className="max-w-5xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
						Teachers
					</h1>

					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
						<input
							type="text"
							placeholder="Search by name or ID or Branch"
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
						<div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">
							{message}
						</div>
					)}

					{sortedTeachers.length ? (
						<div className="space-y-3">
							{sortedTeachers.map((teacher) => (
								<div
									key={teacher.teacherId}
									className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-2"
								>
									<div className="flex justify-between items-start">
										<div>
											<p className="font-semibold text-lg text-gray-800">
												{teacher.teacherName}
											</p>
											<p className="text-sm text-gray-600">
												<span className="font-medium">Email:</span> {" "}
												{teacher.teacherEmail}
											</p>
											<p className="text-sm text-gray-600">
												<span className="font-medium">Birth Date:</span> {" "}
												{teacher.teacherDateOfBirth}
											</p>
										</div>
										<span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
											{teacher.teacherId}
										</span>
									</div>
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
