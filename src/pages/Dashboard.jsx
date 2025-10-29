// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashSphere from "../components/DashSphere";
import DashHoloStreams from "../components/DashHoloStreams";
import DashHoloTerminals from "../components/DashTerminal";
import Snackbar, { showSnackbar } from "./Snackbar";

import DashboardNavbar from "../components/dashboard/Navbar";
import DashboardTabs from "../components/dashboard/Tabs";
import QuestionsTab from "../components/dashboard/Questions";
import PointsTab from "../components/dashboard/Points";
import QuestionOverlay from "../components/dashboard/QuestionOverlay";
import CyberCursor from "../components/dashboard/CyberCursor";
import { difficultyColor } from "../components/dashboard/utils";
import API from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("questions");
  const [tabFade, setTabFade] = useState(true);
  const [questionPopup, setQuestionPopup] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [username, setUsername] = useState(
    localStorage.getItem("teamName") || ""
  );

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  // ✅ Change this ID when switching rounds
  const ROUND_ID = "68d2d45f8ebd3cd49556f102"; // Example: Round 1

  // ✅ Track team score
  const [teamScore, setTeamScore] = useState(null);

  // ✅ Mouse tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ Fetch challenges for ONE round
  useEffect(() => {
    const fetchChallenges = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No auth token found — skipping challenges fetch.");
        return;
      }

      try {
        const { data } = await API.get(`/challenges/${ROUND_ID}`);

        const normalized = (data || []).map((ch) => ({
          id: ch.id,
          title: ch.title,
          type: ch.category || ch.type || "Misc",
          difficulty: ch.difficulty,
          description: ch.description,
          hints: (ch.hints || []).map((h) => h.id),
          solved: !!ch.solved,
          points: ch.points ?? 0,
          resourceUrl: ch.resourceUrl || null,
        }));

        setQuestions(normalized);
      } catch (err) {
        console.error("Failed to fetch challenges:", err);
      }
    };

    fetchChallenges();
  }, [ROUND_ID, username]);

  // ✅ Fetch team score
  useEffect(() => {
    const fetchTeamScore = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/score/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeamScore(data);
      } catch (err) {
        console.error("Failed to fetch team score:", err);
      }
    };

    fetchTeamScore();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teamName");
    localStorage.removeItem("currentRoundId");
    navigate("/");
  };

  // ✅ Submit answer
  const submitAnswer = async (challengeId) => {
    const flag = answers[challengeId];
    if (!flag) return showSnackbar("Please enter a flag.", "error");

    try {
      const { data } = await API.post(`/challenges/${challengeId}/submit`, {
        flag,
      });

      if (
        data?.correct ||
        data?.message?.toLowerCase().includes("already solved")
      ) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === challengeId ? { ...q, solved: true } : q))
        );

        const solvedKey = `solvedQuestions_${username}`;
        const solvedIds = JSON.parse(localStorage.getItem(solvedKey) || "[]");
        if (!solvedIds.includes(challengeId)) {
          solvedIds.push(challengeId);
          localStorage.setItem(solvedKey, JSON.stringify(solvedIds));
        }

        setQuestionPopup(null);
        showSnackbar(
          "Correct flag! Question solved and marks have been awarded",
          "success"
        );
      } else {
        showSnackbar("Incorrect flag...try again", "error");
      }
    } catch (err) {
      showSnackbar(
        err.response?.data?.message || "Error submitting flag.",
        "error"
      );
    }
  };

  const displayedQuestions = questions.filter((q) => {
    const matchesSearch = q.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesDifficulty =
      filterDifficulty === "all" ||
      q.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  const handleOpenQuestion = (question) => {
    if (question.solved) {
      showSnackbar("This challenge is already solved!", "info");
      return;
    }
    setQuestionPopup(question);
  };

  const switchTab = (tab) => {
    setTabFade(false);
    setTimeout(() => {
      setActiveTab(tab);
      setTabFade(true);
    }, 150);
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white cyber-font">
      <style>{`body { cursor: none !important; }`}</style>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(0px at ${mousePos.x}px ${mousePos.y}px, rgba(244,66,39,0.01), black 80%)`,
        }}
      />
      <DashSphere color="#f44227" />
      <DashHoloTerminals />
      <DashHoloStreams />
      <DashboardNavbar username={username} onLogout={handleLogout} />
      <DashboardTabs activeTab={activeTab} switchTab={switchTab} />
      {activeTab === "questions" && (
        <QuestionsTab
          displayedQuestions={displayedQuestions}
          searchText={searchText}
          setSearchText={setSearchText}
          filterDifficulty={filterDifficulty}
          setFilterDifficulty={setFilterDifficulty}
          setQuestionPopup={handleOpenQuestion}
          difficultyColor={difficultyColor}
          tabFade={tabFade}
        />
      )}
      {activeTab === "points" && (
        <PointsTab
          teamScore={teamScore}
          username={username}
          tabFade={tabFade}
        />
      )}
      <QuestionOverlay
        questionPopup={questionPopup}
        setQuestionPopup={setQuestionPopup}
        answers={answers}
        setAnswers={setAnswers}
        submitAnswer={submitAnswer}
      />
      <Snackbar />
      <CyberCursor mousePos={mousePos} />
    </div>
  );
}
