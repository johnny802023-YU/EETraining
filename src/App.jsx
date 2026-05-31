import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ComponentsPage from "./pages/ComponentsPage.jsx";
import CircuitsPage from "./pages/CircuitsPage.jsx";
import ProtocolsPage from "./pages/ProtocolsPage.jsx";
import DebugPage from "./pages/DebugPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import { useLearningProgress } from "./hooks/useLearningProgress.js";

export default function App() {
  const progress = useLearningProgress();

  return (
    <Routes>
      <Route path="/" element={<Layout progress={progress} />}>
        <Route index element={<Dashboard />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="circuits" element={<CircuitsPage />} />
        <Route path="protocols" element={<ProtocolsPage />} />
        <Route path="debug" element={<DebugPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
