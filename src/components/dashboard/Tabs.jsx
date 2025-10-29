export default function DashboardTabs({ activeTab, switchTab }) {
  return (
    <div className="relative z-10 px-6 py-4 flex gap-4">
      <button
        className={`px-4 py-2 border ${activeTab === "questions" ? "border-white" : "border-gray-500"} rounded`}
        onClick={() => switchTab("questions")}
      >
        Questions
      </button>
      <button
        className={`px-4 py-2 border ${activeTab === "points" ? "border-white" : "border-gray-500"} rounded`}
        onClick={() => switchTab("points")}
      >
        Points
      </button>
    </div>
  );
}
