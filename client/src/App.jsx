import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EstimatorPage from "./pages/EstimatorPage.jsx";
import OwnerPage from "./pages/OwnerPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EstimatorPage />} />
        <Route path="/admin" element={<OwnerPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
