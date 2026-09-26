// src/components/AdminRestaurantForm.jsx
// ------------------------------------------------------------------
// Add/Edit form for a Restaurant. Used inside a <Modal> by the Admin
// Dashboard. If "initialData" is passed, the form is in "edit" mode
// and pre-fills the fields; otherwise it's a blank "create" form.
// ------------------------------------------------------------------

import { useState } from "react";

function AdminRestaurantForm({ initialData, onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    image: initialData?.image || "",
    address: initialData?.address || "",
    rating: initialData?.rating ?? 4.0,
    deliveryTime: initialData?.deliveryTime || "30-40 mins",
    // categories stored as an array in the DB, edited here as comma-separated text
    categories: initialData?.categories?.join(", ") || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      rating: Number(form.rating),
      categories: form.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Rating (0-5)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Time</label>
          <input
            name="deliveryTime"
            value={form.deliveryTime}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Categories (comma-separated)
        </label>
        <input
          name="categories"
          value={form.categories}
          onChange={handleChange}
          placeholder="Pizza, Italian"
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 rounded-md bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-60"
      >
        {submitting ? "Saving..." : initialData ? "Update Restaurant" : "Create Restaurant"}
      </button>
    </form>
  );
}

export default AdminRestaurantForm;
