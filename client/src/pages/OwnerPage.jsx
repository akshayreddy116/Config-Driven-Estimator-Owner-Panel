import { useState } from "react";
import Login from "../components/owner/Login.jsx";
import ConfigEditor from "../components/owner/ConfigEditor.jsx";
import LeadsTable from "../components/owner/LeadsTable.jsx";

const TOKEN_KEY = "roof_estimator_owner_token";

export default function OwnerPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [tab, setTab] = useState("config"); // config | leads

  const handleLoggedIn = (t) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (!token) {
    return <Login onLoggedIn={handleLoggedIn} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Owner Panel</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 font-medium">
          Sign out
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setTab("config")}
          className={`px-4 py-2 font-semibold text-sm border-b-2 ${
            tab === "config" ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500"
          }`}
        >
          Rates & Questions
        </button>
        <button
          onClick={() => setTab("leads")}
          className={`px-4 py-2 font-semibold text-sm border-b-2 ${
            tab === "leads" ? "border-brand-600 text-brand-700" : "border-transparent text-gray-500"
          }`}
        >
          Leads
        </button>
      </div>

      {tab === "config" ? (
        <ConfigEditor token={token} onAuthError={handleLogout} />
      ) : (
        <LeadsTable token={token} onAuthError={handleLogout} />
      )}
    </div>
  );
}
