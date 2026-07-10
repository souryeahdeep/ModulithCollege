import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, BadgeCheck, CreditCard, FileText, School } from "lucide-react";

const feeOptions = [
  {
    key: "exam",
    title: "Exam Fees",
    description: "Pay exam registration and processing charges for the current session.",
    icon: FileText,
  },
  {
    key: "tuition",
    title: "Tuition Fees",
    description: "Pay semester tuition and other academic dues securely in one place.",
    icon: School,
  },
];

export default function OnlinePayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionState = location.state;
  const studentName = sessionState?.studentName || "Student";
  const studentId = sessionState?.studentId || "ID not available";

  const [selectedFee, setSelectedFee] = useState("exam");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("upi");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedCard = useMemo(
    () => feeOptions.find((option) => option.key === selectedFee),
    [selectedFee]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

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
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Online Payment</p>
              <h1 className="text-3xl font-bold text-gray-900">Pay your fees</h1>
              <p className="text-gray-700">{studentName} | {studentId}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-sm border border-gray-200">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <span className="text-sm font-semibold text-gray-700">Secure checkout</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {feeOptions.map(({ key, title, description, icon: Icon }) => {
                const isActive = selectedFee === key;
                return (
                  <button
                    key={key}
                    className={`w-full text-left p-4 rounded-2xl border transition shadow-sm hover:shadow-md flex gap-3 ${
                      isActive
                        ? "border-indigo-500 bg-white"
                        : "border-gray-200 bg-white"
                    }`}
                    onClick={() => {
                      setSelectedFee(key);
                      setSubmitted(false);
                    }}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? "bg-indigo-50 text-indigo-700" : "bg-slate-100 text-slate-700"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5"
            >
              <div className="space-y-2">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Selected option</p>
                <h2 className="text-xl font-semibold text-gray-900">{selectedCard?.title}</h2>
                <p className="text-sm text-gray-600">{selectedCard?.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-800">Amount (INR)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 1200"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-medium text-gray-800">Payment method</span>
                  <select
                    value={method}
                    onChange={(event) => setMethod(event.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="upi">UPI</option>
                    <option value="card">Debit / Credit Card</option>
                    <option value="netbanking">Netbanking</option>
                    <option value="wallet">Wallet</option>
                  </select>
                </label>
              </div>

              <label className="space-y-1 block">
                <span className="text-sm font-medium text-gray-800">Notes (optional)</span>
                <textarea
                  rows="3"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Add reference number, semester, or remarks"
                />
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                >
                  <CreditCard className="w-4 h-4" />
                  Proceed to pay
                </button>
                {submitted && (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                    <BadgeCheck className="w-4 h-4" />
                    Payment details captured. Continue with your preferred gateway.
                  </span>
                )}
              </div>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Need help?</h3>
              <p className="text-sm text-gray-600">Contact the bursar or exam section with your receipt ID after completing the gateway payment.</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full" />Use the same student ID while paying.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full" />Save the transaction reference for reconciliation.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full" />Check dues to confirm the updated balance.
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl p-5 shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" />
                <div>
                  <p className="text-sm font-semibold">Gateway notice</p>
                  <p className="text-xs text-indigo-100">You will be redirected to the secure payment gateway to finish the transaction.</p>
                </div>
              </div>
              <div className="h-px bg-indigo-500/60" />
              <p className="text-xs text-indigo-50">After successful payment, return to the portal and verify your receipt under fees and dues.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
