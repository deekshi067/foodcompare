// src/components/AdminFoodForm.jsx
// ------------------------------------------------------------------
// Add/Edit form for a Food Item, including both platform prices,
// offers, and redirect URLs. Needs the list of restaurants (passed
// as a prop) to populate the "which restaurant does this belong to"
// dropdown.
// ------------------------------------------------------------------

import { useState } from "react";

function AdminFoodForm({ initialData, restaurants, onSubmit, submitting }) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    restaurant: initialData?.restaurant?._id || initialData?.restaurant || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    swiggyPrice: initialData?.swiggyPrice ?? "",
    zomatoPrice: initialData?.zomatoPrice ?? "",
    swiggyOffer: initialData?.offers?.swiggy || "",
    zomatoOffer: initialData?.offers?.zomato || "",
    swiggyUrl: initialData?.swiggyUrl || "https://www.swiggy.com",
    zomatoUrl: initialData?.zomatoUrl || "https://www.zomato.com",
    rating: initialData?.rating ?? 4.0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      restaurant: form.restaurant,
      category: form.category,
      description: form.description,
      image: form.image,
      swiggyPrice: Number(form.swiggyPrice),
      zomatoPrice: Number(form.zomatoPrice),
      offers: { swiggy: form.swiggyOffer, zomato: form.zomatoOffer },
      swiggyUrl: form.swiggyUrl,
      zomatoUrl: form.zomatoUrl,
      rating: Number(form.rating),
    });
  };

  const inputClass =
    "w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">Food Name</label>
        <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Restaurant</label>
        <select
          name="restaurant"
          value={form.restaurant}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="">Select a restaurant</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input name="category" value={form.category} onChange={handleChange} required className={inputClass} />
        </div>
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
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={2}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input name="image" value={form.image} onChange={handleChange} className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Swiggy Price (₹)</label>
          <input
            type="number"
            min="0"
            name="swiggyPrice"
            value={form.swiggyPrice}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zomato Price (₹)</label>
          <input
            type="number"
            min="0"
            name="zomatoPrice"
            value={form.zomatoPrice}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Swiggy Offer</label>
          <input name="swiggyOffer" value={form.swiggyOffer} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zomato Offer</label>
          <input name="zomatoOffer" value={form.zomatoOffer} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Swiggy URL</label>
          <input name="swiggyUrl" value={form.swiggyUrl} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zomato URL</label>
          <input name="zomatoUrl" value={form.zomatoUrl} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 rounded-md bg-brand text-white font-medium hover:bg-brand-dark disabled:opacity-60"
      >
        {submitting ? "Saving..." : initialData ? "Update Food Item" : "Create Food Item"}
      </button>
    </form>
  );
}

export default AdminFoodForm;
