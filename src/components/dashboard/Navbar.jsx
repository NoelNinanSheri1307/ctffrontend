import { LogOut } from "lucide-react";

export default function DashboardNavbar({ username, onLogout }) {
  return (
    <div className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-red-500/40 bg-black/50 backdrop-blur-md">
      <h1 className="glitch-cycle text-2xl md:text-3xl">
        Dashboard <span className="text-red-400">Control Center</span>
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-red-200 text-sm">Logged in as {username}</span>
        <button
          onClick={onLogout}
          className="flex items-center gap-1 px-3 py-1 rounded bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 transition"
        >
          <LogOut className="w-4 h-4 text-red-400" /> Logout
        </button>
      </div>
    </div>
  );
}
