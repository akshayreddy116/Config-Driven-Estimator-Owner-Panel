import { Fragment, useEffect, useState } from "react";
import { fetchAdminLeads } from "../../services/api.js";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LeadsTable({ token, onAuthError }) {
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchAdminLeads(token)
      .then(setLeads)
      .catch((err) => {
        if (err.status === 401) return onAuthError?.();
        setError(err.message);
      });
  }, [token]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!leads) return <p className="text-gray-400">Loading leads…</p>;
  if (leads.length === 0) return <p className="text-gray-400">No leads captured yet.</p>;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">Captured Leads ({leads.length})</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold hidden sm:table-cell">Phone</th>
              <th className="p-3 font-semibold hidden md:table-cell">Email</th>
              <th className="p-3 font-semibold">Submitted</th>
              <th className="p-3 font-semibold">Estimate</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <Fragment key={lead._id}>
                <tr className="border-t border-gray-100">
                  <td className="p-3 font-medium">{lead.name}</td>
                  <td className="p-3 hidden sm:table-cell">{lead.phone}</td>
                  <td className="p-3 hidden md:table-cell">{lead.email}</td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(lead.captured_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {formatCurrency(lead.estimate_low)} – {formatCurrency(lead.estimate_high)}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setExpandedId(expandedId === lead._id ? null : lead._id)}
                      className="text-brand-600 font-semibold text-xs"
                    >
                      {expandedId === lead._id ? "Hide" : "Details"}
                    </button>
                  </td>
                </tr>
                {expandedId === lead._id && (
                  <tr className="bg-gray-50 border-t border-gray-100">
                    <td colSpan={6} className="p-4">
                      <p className="text-xs text-gray-500 mb-2">
                        Config version {lead.config_version} · Answers as submitted:
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        {Object.entries(lead.answers).map(([key, value]) => (
                          <div key={key} className="bg-white border border-gray-200 rounded p-2">
                            <div className="text-gray-400">{key}</div>
                            <div className="font-medium">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
