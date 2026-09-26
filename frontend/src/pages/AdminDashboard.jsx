// src/pages/AdminDashboard.jsx
// ------------------------------------------------------------------
// The admin control panel: three tabs (Restaurants / Food Items /
// Users), each with a table + add/edit/delete actions. Already
// wrapped in <AdminRoute> by App.jsx, so we know req.user is an admin.
// ------------------------------------------------------------------

import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import AdminRestaurantForm from "../components/AdminRestaurantForm";
import AdminFoodForm from "../components/AdminFoodForm";

const TABS = ["Restaurants", "Food Items", "Users"];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Restaurants");

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Manage restaurants, food items, prices, offers, and users.
      </p>

      {/* Tab bar */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition ${
              activeTab === tab
                ? "border-brand text-brand"
                : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Restaurants" && <RestaurantsTab />}
      {activeTab === "Food Items" && <FoodItemsTab />}
      {activeTab === "Users" && <UsersTab />}
    </div>
  );
}

// ====================================================================
// RESTAURANTS TAB
// ====================================================================
function RestaurantsTab() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // restaurant being edited, or null = creating
  const [submitting, setSubmitting] = useState(false);

  const fetchRestaurants = async () => {
    setLoading(true);
    const { data } = await api.get("/restaurants");
    setRestaurants(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/admin/restaurants/${editing._id}`, formData);
      } else {
        await api.post("/admin/restaurants", formData);
      }
      setModalOpen(false);
      setEditing(null);
      fetchRestaurants();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save restaurant");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this restaurant and all its food items?")) return;
    await api.delete(`/admin/restaurants/${id}`);
    fetchRestaurants();
  };

  if (loading) return <Loader />;

  return (
    <div>
      <button
        onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        className="mb-4 px-4 py-2 rounded-md bg-brand text-white text-sm hover:bg-brand-dark"
      >
        + Add Restaurant
      </button>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Address</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Delivery Time</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((r) => (
              <tr key={r._id} className="border-t border-gray-100 dark:border-gray-700">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-gray-500 dark:text-gray-400">{r.address}</td>
                <td className="p-3">⭐ {r.rating}</td>
                <td className="p-3">{r.deliveryTime}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditing(r);
                      setModalOpen(true);
                    }}
                    className="text-brand hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          title={editing ? "Edit Restaurant" : "Add Restaurant"}
          onClose={() => setModalOpen(false)}
        >
          <AdminRestaurantForm
            initialData={editing}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}

// ====================================================================
// FOOD ITEMS TAB
// ====================================================================
function FoodItemsTab() {
  const [items, setItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [foodRes, restaurantRes] = await Promise.all([
      api.get("/food"),
      api.get("/restaurants"),
    ]);
    setItems(foodRes.data);
    setRestaurants(restaurantRes.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/admin/food/${editing._id}`, formData);
      } else {
        await api.post("/admin/food", formData);
      }
      setModalOpen(false);
      setEditing(null);
      fetchAll();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save food item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this food item?")) return;
    await api.delete(`/admin/food/${id}`);
    fetchAll();
  };

  if (loading) return <Loader />;

  if (restaurants.length === 0) {
    return (
      <p className="text-gray-500">
        Add at least one restaurant first (see the Restaurants tab) before creating food items.
      </p>
    );
  }

  return (
    <div>
      <button
        onClick={() => {
          setEditing(null);
          setModalOpen(true);
        }}
        className="mb-4 px-4 py-2 rounded-md bg-brand text-white text-sm hover:bg-brand-dark"
      >
        + Add Food Item
      </button>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Restaurant</th>
              <th className="p-3">Swiggy ₹</th>
              <th className="p-3">Zomato ₹</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t border-gray-100 dark:border-gray-700">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3 text-gray-500 dark:text-gray-400">
                  {item.restaurant?.name || "—"}
                </td>
                <td className="p-3">₹{item.swiggyPrice}</td>
                <td className="p-3">₹{item.zomatoPrice}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditing(item);
                      setModalOpen(true);
                    }}
                    className="text-brand hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal
          title={editing ? "Edit Food Item" : "Add Food Item"}
          onClose={() => setModalOpen(false)}
        >
          <AdminFoodForm
            initialData={editing}
            restaurants={restaurants}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </Modal>
      )}
    </div>
  );
}

// ====================================================================
// USERS TAB
// ====================================================================
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await api.get("/admin/users");
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    await api.put(`/admin/users/${user._id}/role`, { role: newRole });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this user account?")) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 dark:bg-gray-700 text-left">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Role</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t border-gray-100 dark:border-gray-700">
              <td className="p-3 font-medium">{u.name}</td>
              <td className="p-3 text-gray-500 dark:text-gray-400">{u.email}</td>
              <td className="p-3 capitalize">{u.role}</td>
              <td className="p-3 text-right space-x-2">
                <button onClick={() => toggleRole(u)} className="text-brand hover:underline">
                  Make {u.role === "admin" ? "User" : "Admin"}
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
