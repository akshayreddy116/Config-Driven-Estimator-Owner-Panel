function formatCurrency(amount, currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ResultStep({ result, businessName, onRestart }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center py-4">
      <div>
        <p className="text-gray-500">Your estimated project cost</p>
        <p className="text-3xl font-bold text-brand-700 mt-1">
          {formatCurrency(result.estimate_low, result.currency)} –{" "}
          {formatCurrency(result.estimate_high, result.currency)}
        </p>
      </div>
      <p className="text-sm text-gray-500 max-w-sm">
        This range reflects typical material, labor, and permit costs for your
        answers. A {businessName} representative will follow up to confirm
        details and schedule an on-site walkthrough.
      </p>
      <button
        onClick={onRestart}
        className="text-brand-600 font-semibold underline underline-offset-2"
      >
        Start a new estimate
      </button>
    </div>
  );
}
