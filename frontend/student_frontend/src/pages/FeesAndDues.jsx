import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  ArrowLeft,
  BadgeInfo,
  CalendarClock,
  CheckCircle,
  Clock3,
  CreditCard,
  History,
  IndianRupee,
} from "lucide-react";

const samplePending = [
  {
    id: "PF-2025-01",
    label: "Tuition Fee - Spring 2025",
    amount: 18000,
    dueDate: "Mar 31, 2025",
    status: "Pending",
  },
  {
    id: "PF-2025-02",
    label: "Exam Fee - Midterm",
    amount: 1200,
    dueDate: "Feb 15, 2025",
    status: "Due soon",
  },
];

const sampleHistory = [
  {
    id: "TXN-8841",
    label: "Tuition Fee - Fall 2024",
    amount: 17500,
    date: "Oct 05, 2024",
    method: "UPI",
    status: "Success",
  },
  {
    id: "TXN-8720",
    label: "Exam Fee - Finals",
    amount: 1500,
    date: "Jul 20, 2024",
    method: "Card",
    status: "Success",
  },
];

const sampleWindows = [
  {
    label: "Re-evaluation window",
    range: "Mar 10 - Mar 20, 2025",
  },
  {
    label: "Hostel fee window",
    range: "Apr 05 - Apr 25, 2025",
  },
];

export default function FeesAndDues() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionState = location.state;
  const studentName = sessionState?.studentName || "Student";
  const studentId = sessionState?.studentId || "ID not available";

  const duesTotal = useMemo(
    () => samplePending.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    []
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <header className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to previous page
            </button>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Fees and dues</p>
              <h1 className="text-3xl font-bold text-gray-900">Review pending dues and history</h1>
              <p className="text-gray-700">{studentName} | {studentId}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-200">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-gray-700">Keep receipts handy</span>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <IndianRupee className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Pending total</p>
              <p className="text-xl font-semibold text-gray-900">INR {duesTotal.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <Clock3 className="w-5 h-5 text-amber-500" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Next due date</p>
              <p className="text-sm font-semibold text-gray-900">{samplePending[1].dueDate}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <BadgeInfo className="w-5 h-5 text-emerald-600" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Status</p>
              <p className="text-sm font-semibold text-gray-900">Payments enabled</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Pending dues</h2>
            </div>
            <div className="space-y-3">
              {samplePending.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-xl flex flex-col gap-2 hover:border-indigo-200 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-600">Ref: {item.id}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">INR {item.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Due by {item.dueDate}</span>
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                      onClick={() => navigate("/payment", { state: sessionState })}
                    >
                      Pay now
                    </button>
                    <button className="text-sm font-semibold text-gray-600 hover:text-gray-800">View breakdown</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-900">Payment history</h2>
            </div>
            <div className="space-y-3">
              {sampleHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border border-gray-200 rounded-xl flex items-start justify-between hover:border-emerald-200 transition"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-600">Ref: {item.id} | {item.method}</p>
                    <p className="text-xs text-gray-600">{item.date}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-gray-900">INR {item.amount.toLocaleString()}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Upcoming fee windows</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sampleWindows.map((window) => (
              <div
                key={window.label}
                className="p-4 border border-gray-200 rounded-xl bg-slate-50"
              >
                <p className="text-sm font-semibold text-gray-900">{window.label}</p>
                <p className="text-xs text-gray-700 mt-1">{window.range}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2 flex items-center gap-1">
            <BadgeInfo className="w-4 h-4 text-indigo-600" />
            Dates are illustrative. Verify with the exam or accounts section.
          </p>
        </section>
      </div>
    </div>
  );
}
