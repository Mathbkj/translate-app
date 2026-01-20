export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-indigo-600 w-24 h-24 animate-spin"></div>

        {/* Middle rotating ring - opposite direction */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-purple-600 border-l-indigo-600 w-20 h-20 animate-spin-reverse"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-6 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 w-12 h-12 animate-pulse"></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-indigo-700 rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute mt-40 flex flex-col items-center gap-4">
        <p className="text-gray-800 text-xl font-semibold animate-pulse">
          Loading
        </p>
        <div className="flex gap-2">
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>

      <style>{`
        @keyframes spin-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
