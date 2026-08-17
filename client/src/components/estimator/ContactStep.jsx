import { useState } from "react";

export default function ContactStep({ onSubmit, submitting, error }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [touched, setTouched] = useState(false);

  const isValid = form.name.trim() && form.phone.trim() && /\S+@\S+\.\S+/.test(form.email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-gray-600 text-sm">
        Almost done. We'll send your estimate to these details.
      </p>

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-800">Full name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {touched && !form.name.trim() && (
          <p className="text-sm text-red-600">Name is required.</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-800">Phone *</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {touched && !form.phone.trim() && (
          <p className="text-sm text-red-600">Phone is required.</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-800">Email *</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        {touched && !/\S+@\S+\.\S+/.test(form.email) && (
          <p className="text-sm text-red-600">A valid email is required.</p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 bg-brand-600 text-white rounded-lg py-3 font-semibold hover:bg-brand-700 disabled:opacity-50"
      >
        {submitting ? "Calculating..." : "Get my estimate"}
      </button>
    </form>
  );
}
