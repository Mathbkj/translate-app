export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-400 border-r-purple-400 w-24 h-24 animate-spin"></div>

        {/* Middle rotating ring - opposite direction */}
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-pink-400 border-l-purple-400 w-20 h-20 animate-spin-reverse"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 w-12 h-12 animate-pulse"></div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute mt-40 flex flex-col items-center gap-4">
        <p className="text-white text-xl font-semibold animate-pulse">
          Loading
        </p>
        <div className="flex gap-2">
          <div
            className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
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
