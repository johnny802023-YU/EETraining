import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComponentsPage from "./pages/ComponentsPage.jsx";
import CircuitsPage from "./pages/CircuitsPage.jsx";
import ProtocolsPage from "./pages/ProtocolsPage.jsx";
import DebugPage from "./pages/DebugPage.jsx";
import AutomotivePage from "./pages/AutomotivePage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import RecordsPage from "./pages/RecordsPage.jsx";
import TeamProgressAdminPage from "./pages/TeamProgressAdminPage.jsx";
import { useLearningProgress } from "./hooks/useLearningProgress.js";
import { useTrainingRecords } from "./hooks/useTrainingRecords.js";

export default function App() {
  const trainingRecords = useTrainingRecords();
  const progress = useLearningProgress({
    onCompletionChange: trainingRecords.recordCompletion,
  });

  return (
    <Routes>
      <Route path="/" element={<Layout progress={progress} trainingRecords={trainingRecords} />}>
        <Route index element={<Dashboard />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="circuits" element={<CircuitsPage />} />
        <Route path="protocols" element={<ProtocolsPage />} />
        <Route path="debug" element={<DebugPage />} />
        <Route path="automotive" element={<AutomotivePage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="records" element={<RecordsPage />} />
        <Route path="admin/team-progress" element={<TeamProgressAdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
