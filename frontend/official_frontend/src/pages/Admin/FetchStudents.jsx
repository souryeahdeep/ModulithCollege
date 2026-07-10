import { useEffect, useMemo, useState } from "react";

const FETCH_URL = import.meta.env.VITE_STUDENT_FETCH;

export default function FetchStudents() {
	const [students, setStudents] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState("studentName");
	const [sortOrder, setSortOrder] = useState("asc");
	const [page, setPage] = useState(1);
	const [message, setMessage] = useState("");

	useEffect(() => {
		fetchStudents();
	}, [page]);

	const fetchStudents = async () => {
		if (!FETCH_URL) {
			setMessage("Error: VITE_STUDENT_FETCH is not set");
			return;
		}
		try {
			setMessage("");
			const response = await fetch(`${FETCH_URL}`);
			const text = await response.text();
			// Some backends respond with 302/FOUND plus a JSON body; treat that as success.
			if (!response.ok && response.status !== 302) {
				throw new Error(text || "Failed to load students");
			}

			let data;
			try {
				data = JSON.parse(text);
			} catch (err) {
				console.error("Unable to parse student response as JSON", err);
				throw new Error("Invalid student response");
			}

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
				student.branch,
				student.presentAddress,
				student.city,
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

	return (
		<div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="bg-white rounded-lg shadow-lg p-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
						Students
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
								<option value="branch">Branch</option>
								<option value="rollNo">Roll No</option>
								<option value="registrationNo">Registration No</option>
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
						<div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">{message}</div>
					)}

					{sortedStudents.length ? (
						<div className="space-y-3">
							{sortedStudents.map((student) => {
								const attendancePct = student.totalClass
									? Math.round(((student.present || 0) / student.totalClass) * 100)
									: null;
								return (
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
													<span className="font-medium">Group / Section:</span> {student.group} / {student.section}
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Roll / Reg:</span> {student.rollNo} / {student.registrationNo}
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Attendance:</span> {student.present} / {student.totalClass}
													{attendancePct !== null ? ` (${attendancePct}%)` : ""}
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Mobile:</span> {student.mobileNo}
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">DOB:</span> {student.dateOfBirth}
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Blood Group:</span> {student.bloodGroup}
												</p>
												<p className="text-sm text-gray-600">
													<span className="font-medium">Address:</span> {student.presentAddress}
												</p>
											</div>
											<div className="flex flex-col items-end gap-1">
												<span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
													{student.studentId}
												</span>
												<span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
													{student.city}{student.pin ? `, ${student.pin}` : ""}
												</span>
											</div>
										</div>
									</div>
								);
							})}
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
