import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./hooks/useAuth";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Configure from "./pages/Configure";
import Results from "./pages/Results";
import Remediation from "./pages/Remediation";
import Reports from "./pages/Reports";
import Monitor from "./pages/Monitor";
import Settings from "./pages/Settings";
import LiveAudit from "./pages/LiveAudit";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="aurora grid min-h-screen place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-saffron-400/30 border-t-saffron-400" />
        <p className="label">Loading Nyaay</p>
      </div>
    </div>
  );
  if (!user && import.meta.env.VITE_REQUIRE_AUTH === "true") return <Navigate to="/auth" replace />;
  return children;
}

export default function App() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><Upload /></PrivateRoute>} />
        <Route path="/configure" element={<PrivateRoute><Configure /></PrivateRoute>} />
        <Route path="/results/:auditId" element={<PrivateRoute><Results /></PrivateRoute>} />
        <Route path="/remediation/:auditId" element={<PrivateRoute><Remediation /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/monitor" element={<PrivateRoute><Monitor /></PrivateRoute>} />
        <Route path="/live-audit" element={<PrivateRoute><LiveAudit /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
