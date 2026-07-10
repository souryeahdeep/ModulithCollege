import { ArrowRight, CalendarCheck, ClipboardList, CreditCard, GraduationCap, Receipt } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QRScanner from "../components/QRScanner";

const featureCards = [
	{
		title: "Details & Dashboard",
		description: "Jump into your student dashboard for profile, attendance stats, and QR scans.",
		action: "Go to Dashboard",
		icon: ArrowRight,
		path: "/details",
		accent: "indigo",
	},
	{
		title: "Online Payment",
		description: "Pay tuition, hostel, and other dues securely once you're signed in.",
		action: "Go to Payment",
		icon: CreditCard,
		path: "/payment",
		accent: "emerald",
	},
	{
		title: "Fees & Dues",
		description: "Review pending dues, payment history, and upcoming fee windows.",
		action: "Go to Fees & Dues",
		icon: Receipt,
		path: "/checkdues",
		accent: "amber",
	},
	{
		title: "Accession Taken Status",
		description: "Track recent library accessions and their current status.",
		action: "Go to Accession Status",
		icon: CalendarCheck,
		path: "/accession",
		accent: "blue",
	},
	{
		title: "Exam Section",
		description: "Access exam schedules, halls, and resources once authenticated.",
		action: "Go to Exam Section",
		icon: GraduationCap,
		path: "/exam",
		accent: "violet",
	},
	{
		title: "Exam Enrollment",
		description: "Enroll for upcoming exams and view enrollment status.",
		action: "Go to Exam Enrollment",
		icon: ClipboardList,
		path: "/enrollment",
		accent: "cyan",
	},
	{
		title: "Timetable",
		description: "View your class schedule and exam timetable.",
		action: "Go to Timetable",
		icon: CalendarCheck,
		path: "/timetable",
		accent: "blue",
	},
	
];

export default function LandingPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const sessionState = location.state;
	const studentName = sessionState?.studentName || "Student";
	const studentId = sessionState?.studentId || "ID not available";
	const initialDetails = sessionState?.details;
	const tokenFromState = sessionState?.token;

	const [studentDetails, setStudentDetails] = useState(initialDetails);

	// Resolve token
	const token =
		tokenFromState ||
		studentDetails?.token ||
		(typeof window !== "undefined"
			? window.localStorage.getItem("studentToken")
			: null);

	const sharedNavigationState = {
		studentName,
		studentId,
		token,
		details: studentDetails,
	};

	const resolveValue = (details, paths, fallback = "N/A") => {
		for (const path of paths) {
			const keys = path.split(".");
			let value = details;

			for (const key of keys) {
				value = value?.[key];
				if (value === undefined) break;
			}

			if (value !== undefined && value !== null) {
				return value;
			}
		}
		return fallback;
	};


	const resolvePresentFromDetails = () => {
		const presentValue = resolveValue(studentDetails || {}, ["student.present"], null);
		const numericPresent = Number(presentValue);
		return Number.isFinite(numericPresent) ? numericPresent : "N/A";
	};

	const [currentPresent, setCurrentPresent] = useState(() => {
		if (studentId && studentId !== "ID not available") {
			try {
				const storedValue = window.sessionStorage.getItem(
					`attendance-present-${studentId}`
				);
				if (storedValue !== null) {
					const parsed = Number(storedValue);
					if (Number.isFinite(parsed)) return parsed;
				}
			} catch (error) {
				console.warn("Unable to read present count from storage", error);
			}
		}
		return resolvePresentFromDetails();
	});

	const [usedScanValues, setUsedScanValues] = useState(() => {
		if (studentId && studentId !== "ID not available") {
			try {
				const stored = window.sessionStorage.getItem(
					`attendance-used-scans-${studentId}`
				);
				if (stored) {
					const parsed = JSON.parse(stored);
					if (Array.isArray(parsed)) return parsed;
				}
			} catch (error) {
				console.warn("Unable to read used scan list", error);
			}
		}
		return [];
	});

	// Sync currentPresent with details updates
	useEffect(() => {
		const latest = resolvePresentFromDetails();
		if (latest !== "N/A" && latest !== currentPresent) {
			setCurrentPresent(latest);
		}
	}, [studentDetails]);

	// Persist token
	useEffect(() => {
		if (token) {
			try {
				window.localStorage.setItem("studentToken", token);
			} catch (error) {
				console.warn("Unable to persist student token", error);
			}
		}
	}, [token]);

	// Persist present count
	useEffect(() => {
		if (studentId && currentPresent !== undefined && currentPresent !== null) {
			try {
				window.sessionStorage.setItem(
					`attendance-present-${studentId}`,
					String(currentPresent)
				);
			} catch (error) {
				console.warn("Unable to persist present count", error);
			}
		}
	}, [currentPresent, studentId]);

	// Persist used scans
	useEffect(() => {
		if (studentId) {
			try {
				window.sessionStorage.setItem(
					`attendance-used-scans-${studentId}`,
					JSON.stringify(usedScanValues)
				);
			} catch (error) {
				console.warn("Unable to persist used scan list", error);
			}
		}
	}, [usedScanValues, studentId]);

	const refreshStudentDetails = async () => {
		if (!studentName || !studentId || studentId === "ID not available") return;

		try {
			const response = await fetch(
				`http://localhost:8080/student/login?name=${encodeURIComponent(
					studentName.trim()
				)}&id=${studentId.trim()}`,
				{ method: "GET" }
			);

			const isJson = (response.headers.get("content-type") || "").includes(
				"application/json"
			);
			const data = isJson ? await response.json().catch(() => ({})) : {};

			if (!response.ok) {
				throw new Error(data?.message || "Unable to refresh details.");
			}

			setStudentDetails(data);

			const latestPresent = Number(data?.student?.present);
			if (Number.isFinite(latestPresent)) {
				setCurrentPresent(latestPresent);
			}
		} catch (error) {
			console.error("Failed to refresh student details", error);
		}
	};

	const handleScanSuccess = async () => {
		setCurrentPresent((prev) => {
			const numeric = Number(prev);
			return Number.isFinite(numeric) ? numeric + 1 : 1;
		});

		await refreshStudentDetails();
	};

	const forwardToDashboard = () => {
		if (sessionState || studentDetails || token) {
			navigate("/details", {
				state: {
					studentName,
					studentId,
					token,
					details: studentDetails,
				},
			});
		} else {
			navigate("/login");
		}
	};

	const handleNavigate = (path) => {
		if (path === "/details") {
			forwardToDashboard();
			return;
		}
		if (path === "/payment") {
			navigate(path, { state: sharedNavigationState });
			return;
		}
		if (path === "/checkdues") {
			navigate(path, { state: sharedNavigationState });
			return;
		}
		if(path==="/timetable"){
			navigate(path, { state: sharedNavigationState });
			return;
		}
	};

	const accentClasses = {
		indigo: "from-indigo-50 to-indigo-100 text-indigo-700",
		emerald: "from-emerald-50 to-emerald-100 text-emerald-700",
		amber: "from-amber-50 to-amber-100 text-amber-700",
		blue: "from-blue-50 to-blue-100 text-blue-700",
		violet: "from-violet-50 to-violet-100 text-violet-700",
		cyan: "from-cyan-50 to-cyan-100 text-cyan-700",
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-blue-50">
			<div className="max-w-5xl mx-auto px-6 py-10">
				<header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div className="max-w-2xl">
						<p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Student Portal</p>
						<h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">{studentName}</h1>
						<p className="mt-2 text-lg text-gray-700">ID: {studentId}</p>
						<p className="mt-4 text-lg text-gray-600">
							Start with your dashboard to view details, then handle payments, dues, attendance confirmations, and exam info without hunting through menus.
						</p>
				
					</div>
					<div className="w-full md:w-80">
						<QRScanner
							onScanSuccess={handleScanSuccess}
							studentName={studentName}
							studentId={studentId}
							token={token}
							details={studentDetails}
							usedScanValues={usedScanValues}
							setUsedScanValues={setUsedScanValues}
							setCurrentPresent={setCurrentPresent}
						/>
					</div>
				</header>

				<section className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{featureCards.map(({ title, description, action, icon: Icon, path, accent }) => (
						<div
							key={title}
							className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-md transition"
						>
							<div
								className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accentClasses[accent]} flex items-center justify-center`}
							>
								<Icon className="w-6 h-6" />
							</div>
							<div className="space-y-2">
								<h2 className="text-lg font-semibold text-gray-900">{title}</h2>
								<p className="text-sm text-gray-600 leading-relaxed">{description}</p>
							</div>
							<button
								onClick={() => handleNavigate(path)}
								className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700"
							>
								{action}
								<ArrowRight className="w-4 h-4" />
							</button>
						</div>
					))}
				</section>

			</div>
		</div>
	);
}
