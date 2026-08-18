import { Fragment, useEffect, useState } from "react";
import { fetchAdminLeads } from "../../services/api.js";

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function LeadsTable({ token, onAuthError }) {
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetchAdminLeads(token)
      .then(setLeads)
      .catch((err) => {
        if (err.status === 401) {
          onAuthError?.();
          return;
        }

        setError(err.message || "Failed to load leads.");
      });
  }, [token, onAuthError]);

  // Toggle details for a lead
  const toggleDetails = (id) => {
    setExpanded((current) => (current === id ? null : id));
  };

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!leads) {
    return (
      <div className="flex min-h-32 items-center justify-center text-sm text-slate-400">
        Loading leads...
      </div>
    );
  }

  if (!leads.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="font-semibold text-slate-700">No leads yet</p>
        <p className="mt-1 text-sm text-slate-400">
          New roofing estimates will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Captured Leads
          <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
            {leads.length}
          </span>
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Customers who submitted the roofing estimator.
        </p>
      </div>

      {/* ========================================================
          DESKTOP / TABLET  and above
      ======================================================== */}

      <div className="hidden w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full table-fixed text-sm">
          {/* ==================================================
              TABLE HEADER
          ================================================== */}

          <thead className="bg-slate-50">
            <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
              {/* Customer */}
              <th className="w-[17%] px-4 py-3">Customer</th>

              {/* Phone */}
              <th className="w-[16%] px-4 py-3">Phone</th>

              {/* Email */}
              <th className="w-[23%] px-4 py-3">Email</th>

              {/* Submitted */}
              <th className="w-[15%] px-4 py-3">Submitted</th>

              {/* Estimate */}
              <th className="w-[21%] px-4 py-3">Estimate</th>

              {/* Details */}
              <th className="w-[8%] px-3 py-3"></th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {leads.map((lead) => {
              const isExpanded = expanded === lead._id;
              return (
                <Fragment key={lead._id}>
                  {/* CUSTOMER ROW */}
                  <tr className="border-t border-slate-100 transition hover:bg-slate-50">
                    {/* CUSTOMER */}
                    <td className="min-w-0 px-4 py-3 font-semibold text-slate-800">
                      <div className="truncate" title={lead.name}>
                        {lead.name}
                      </div>
                    </td>
                    {/* PHONE */}
                    <td className="min-w-0 px-4 py-3 text-slate-600">
                      <div className="truncate" title={lead.phone}>
                        {lead.phone}
                      </div>
                    </td>
                    {/* EMAIL */}
                    <td className="min-w-0 px-4 py-3 text-slate-600">
                      <div className="truncate" title={lead.email}>
                        {lead.email}
                      </div>
                    </td>
                    {/* SUBMITTED */}
                    <td className="min-w-0 px-4 py-3 text-slate-500">
                      <div className="whitespace-nowrap">
                        {new Date(lead.captured_at).toLocaleDateString()}
                      </div>
                    </td>

                    {/* ESTIMATE */}
                    <td className="min-w-0 px-4 py-3 font-semibold text-emerald-700">
                      <div className="whitespace-nowrap">
                        {money(lead.estimate_low)}
                        <span className="mx-1 text-slate-400">–</span>
                        {money(lead.estimate_high)}
                      </div>
                    </td>

                    {/* DETAILS BUTTON */}
                    <td className="px-3 py-3">
                      <button
                        type="button"
                        onClick={() => toggleDetails(lead._id)}
                        className="whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        {isExpanded ? "Hide" : "Details"}
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td
                        colSpan={6}
                        className="border-t border-slate-100 bg-slate-50 p-0"
                      >
                        <Details lead={lead} desktop />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MOBILE Below */}
      <div className="space-y-2.5 md:hidden">
        {leads.map((lead) => {
          const isExpanded = expanded === lead._id;
          return (
            <div
              key={lead._id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              {/* CUSTOMER INFORMATION */}
              <div className="p-3.5">
                {/* NAME + ESTIMATE */}
                <div className="flex items-start justify-between gap-2.5">
                  {/* CUSTOMER */}
                  <div className="min-w-0">
                    <h3
                      className="truncate font-bold text-slate-900"
                      title={lead.name}
                    >
                      {lead.name}
                    </h3>
                    <p
                      className="mt-0.5 truncate text-sm text-slate-500"
                      title={lead.phone}
                    >
                      {lead.phone}
                    </p>
                  </div>


                  <div className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                    <span>{money(lead.estimate_low)}</span>

                    <span className="mx-1 text-emerald-500">–</span>

                    <span>{money(lead.estimate_high)}</span>
                  </div>
                </div>


                <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2">
                  {/* EMAIL */}

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Email</p>
                    <p
                      className="mt-0.5 truncate text-sm text-slate-700"
                      title={lead.email}
                    >
                      {lead.email}
                    </p>
                  </div>
                  {/* SUBMITTED */}
                  <div>
                    <p className="text-xs text-slate-400">Submitted</p>

                    <p className="mt-0.5 text-sm text-slate-700">
                      {new Date(lead.captured_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleDetails(lead._id)}
                  className="mt-3 w-full rounded-lg bg-slate-100 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  {isExpanded ? "Hide Details" : "View Details"}
                </button>
              </div>

              {/* MOBILE DETAILS */}

              {isExpanded && <Details lead={lead} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* DETAILS COMPONENT*/

function Details({ lead, desktop = false }) {
  const answers = Object.entries(lead.answers || {});
  return (
    <div
      className={
        desktop
          ? "w-full bg-slate-50 px-4 py-4"
          : "border-t border-slate-100 bg-slate-50 p-3.5"
      }
    >
      {/* CONFIGURATION INFORMATION */}
      <p className="mb-3 text-xs text-slate-500">
        Config version {lead.config_version} {" · "} Answers submitted
      </p>
      <div
        className={
          desktop
            ? "grid grid-cols-2 gap-2.5 lg:grid-cols-3 xl:grid-cols-4"
            : "grid grid-cols-1 gap-2 sm:grid-cols-2"
        }
      >
        {answers.map(([key, value]) => (
          <div
            key={key}
            className="min-w-0 rounded-lg border border-slate-200 bg-white p-2.5"
          >
            {/* ANSWER NAME */}
            <p className="break-words text-xs text-slate-400">{key}</p>
            {/* ANSWER VALUE */}
            <p className="mt-0.5 break-words text-sm font-semibold text-slate-700">
              {String(value)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}