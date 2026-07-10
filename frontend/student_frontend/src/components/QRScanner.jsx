import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

export default function QRScanner({
  onScanSuccess,
  studentName,
  studentId,
  token,
  details,
  usedScanValues,
  setUsedScanValues,
  setCurrentPresent,
}) {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanSubmitStatus, setScanSubmitStatus] = useState("");
  const [scanSubmitError, setScanSubmitError] = useState("");

  const captureCoordinates = async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      console.warn("Geolocation is not supported in this environment.");
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Unable to capture geolocation", error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const submitScanResult = async (qrToken) => {
    if (!qrToken) return;
    const studentToken =
      token ||
      (typeof window !== "undefined"
        ? window.localStorage.getItem("studentToken")
        : null);

    if (!studentToken) {
      setScanSubmitError("Session expired. Please log in again.");
      return;
    }

    if (usedScanValues.includes(qrToken)) {
      setScanSubmitError("This QR code has already been scanned.");
      return;
    }

    setScanSubmitStatus("Submitting attendance...");
    setScanSubmitError("");

    try {
      const coordinates = await captureCoordinates();

      const response = await fetch(
        "http://localhost:8081/teacher/attendance/scan",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${studentToken}`,
          },
          body: JSON.stringify({
            qrToken: qrToken, 
            studentId: studentId, 
            latitude: coordinates?.latitude ?? null,
            longitude: coordinates?.longitude ?? null,
          }),
        }
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body?.message || "Attendance submission failed");
      }

      setScanSubmitStatus("Attendance submitted successfully.");

      setUsedScanValues((prev) =>
        prev.includes(qrToken) ? prev : [...prev, qrToken]
      );

      if (onScanSuccess) onScanSuccess();
    } catch (err) {
      setScanSubmitStatus("");
      setScanSubmitError(err.message || "Unable to submit attendance.");
    }
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Scan Attendance QR
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Use your device camera to scan the QR code displayed by your teacher
            and log attendance instantly.
          </p>
        </div>
        <button
          onClick={() => {
            setShowScanner((prev) => !prev);
            setScanError("");
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
        >
          {showScanner ? "Close Scanner" : "Start Scan"}
        </button>
      </div>

      {scanError && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
          {scanError}
        </div>
      )}

      {showScanner && (
        <div className="mt-5">
          <Scanner
            onScan={(detected) => {
              if (detected?.length) {
                const value = detected[0]?.rawValue || "";
                console.log("QR Code scanned:", value);
                setScanResult(value);
                setShowScanner(false);
                submitScanResult(value);
              }
            }}
            onError={(error) =>
              setScanError(error?.message || "Unable to access camera.")
            }
            constraints={{ facingMode: "environment" }}
            styles={{
              container: { borderRadius: "0.75rem", overflow: "hidden" },
              video: { borderRadius: "0.75rem" },
            }}
          />
          <p className="mt-2 text-xs text-gray-500 text-center">
            Align the QR code within the frame to capture it automatically.
          </p>
        </div>
      )}

      {scanResult && (
        <div className="mt-5 p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
          {scanSubmitStatus && (
            <p className="mt-3 text-sm text-green-600">
              {scanSubmitStatus}
            </p>
          )}
          {scanSubmitError && (
            <p className="mt-3 text-sm text-red-600">
              {scanSubmitError}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
