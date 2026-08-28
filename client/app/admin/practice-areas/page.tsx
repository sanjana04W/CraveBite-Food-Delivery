"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  UtensilsCrossed, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Star, 
  Clock, 
  X, 
  CheckCircle2, 
  Flame,
  Tag,
  Sparkles,
  Loader2,
  RefreshCw
} from "lucide-react";
import { MenuItem } from "@/data/menuData";

export default function AdminMenuPage() {
  const [dishes, setDishes] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Cuisines");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Artisan Pizzas");
  const [price, setPrice] = useState("");
  const [prepTime, setPrepTime] = useState("20 min");
  const [calories, setCalories] = useState("650");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [isVeg, setIsVeg] = useState(true);

  const categories = ["All Cuisines", "Artisan Pizzas", "Gourmet Burgers", "Asian & Noodles", "Biryani & Curries", "Healthy Bowls & Salads", "Desserts & Shakes"];

  const fetchDishes = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch("/api/practice-areas?all=true");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const mapped: MenuItem[] = data.data.map((item: any) => ({
          id: item._id || item.slug,
          slug: item.slug,
          name: item.title || item.name,
          category: item.category || "Artisan Pizzas",
          categorySlug: (item.category || "artisan-pizzas").toLowerCase().replace(/\s+/g, "-"),
          price: typeof item.price === "number" ? item.price : 15.99,
          rating: item.rating || 4.9,
          reviewsCount: item.reviewsCount || 120,
          prepTime: item.prepTime || "20 min",
          calories: item.calories || 550,
          isVeg: item.isVeg !== undefined ? item.isVeg : true,
          isChefSpecial: item.isChefSpecial || false,
          isPopular: true,
          image: item.image || item.heroImage || "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop",
          description: item.description || item.overviewDescription || "",
        }));
        setDishes(mapped);
      }
    } catch (e) {
      console.error("Error fetching dishes:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDishes();
    const interval = setInterval(() => fetchDishes(true), 30000);
    return () => clearInterval(interval);
  }, [fetchDishes]);

  const filteredDishes = dishes.filter((dish) => {
    const matchesCat = categoryFilter === "All Cuisines" || dish.category === categoryFilter;
    const matchesSearch =
      search === "" ||
      dish.name.toLowerCase().includes(search.toLowerCase()) ||
      dish.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDelete = async (dish: MenuItem) => {
    if (!confirm(`Are you sure you want to remove "${dish.name}" from the menu?`)) return;

    try {
      const res = await fetch(`/api/practice-areas/${dish.slug || dish.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setDishes((prev) => prev.filter((d) => d.id !== dish.id));
      setSuccessMsg(`"${dish.name}" removed from menu.`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not delete dish.");
      setTimeout(() => setErrorMsg(""), 4000);
    }
  };

  const handleOpenAdd = () => {
    setEditingDish(null);
    setName("");
    setCategory("Artisan Pizzas");
    setPrice("");
    setPrepTime("20 min");
    setCalories("650");
    setImage("https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000&auto=format&fit=crop");
    setDescription("");
    setIsVeg(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dish: MenuItem) => {
    setEditingDish(dish);
    setName(dish.name);
    setCategory(dish.category);
    setPrice(dish.price.toString());
    setPrepTime(dish.prepTime);
    setCalories(dish.calories.toString());
    setImage(dish.image);
    setDescription(dish.description);
    setIsVeg(dish.isVeg);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    setSaving(true);
    setErrorMsg("");

    const dishPayload = {
      title: name,
      category,
      price: parseFloat(price),
      prepTime,
      calories: parseInt(calories) || 500,
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
      heroImage: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop",
      description,
      overviewDescription: description,
      isVeg,
      status: "Published",
      visibility: true,
    };

    try {
      let res: Response;
      if (editingDish) {
        res = await fetch(`/api/practice-areas/${editingDish.slug || editingDish.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dishPayload),
        });
      } else {
        res = await fetch("/api/practice-areas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dishPayload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error: ${res.status}`);

      setSuccessMsg(editingDish ? `"${name}" updated successfully!` : `"${name}" added to menu!`);
      setTimeout(() => setSuccessMsg(""), 3500);
      await fetchDishes(true);
      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Could not save dish. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 font-sans space-y-6 max-w-7xl mx-auto">

      {/* Toast Notifications */}
      {successMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="fixed top-5 right-5 z-[9999] bg-red-500 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <X className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            Menu & Recipes Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-950 mt-2">
            Food Menu & Dishes Manager
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">Manage live dish pricing, calories, preparation time, and dietary tags</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchDishes(true)}
            disabled={refreshing}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition cursor-pointer"
            title="Refresh Dishes"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-orange-600" : ""}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                categoryFilter === cat
                  ? "bg-orange-600 text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dish name..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
          />
        </div>
      </div>

      {/* Dishes Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <p className="text-xs font-bold">Syncing live food menu...</p>
          </div>
        ) : filteredDishes.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-stone-400">
            <UtensilsCrossed className="w-12 h-12 text-stone-300" />
            <p className="text-sm font-bold text-stone-600">No dishes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-extrabold uppercase text-stone-400 border-b border-stone-200">
                  <th className="py-3 px-4 font-bold">Dish</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Price</th>
                  <th className="py-3 px-4 font-bold">Prep Time</th>
                  <th className="py-3 px-4 font-bold">Diet</th>
                  <th className="py-3 px-4 font-bold">Rating</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredDishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-stone-900">{dish.name}</div>
                          <div className="text-[10px] text-stone-400 max-w-xs truncate">{dish.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-600">{dish.category}</td>
                    <td className="py-3.5 px-4 font-black text-stone-950">Rs. {dish.price.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-stone-500">{dish.prepTime}</td>
                    <td className="py-3.5 px-4">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                        dish.isVeg
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}>
                        {dish.isVeg ? "🌱 Veg" : "🍗 Non-Veg"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">
                      <span className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {dish.rating}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(dish)}
                          className="p-1.5 text-stone-500 hover:text-orange-600 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                          title="Edit Dish"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dish)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-100 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-black">
                {editingDish ? "Edit Dish Details" : "Create New Menu Dish"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Dish Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Smoky BBQ Bacon Burger"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Cuisine Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium cursor-pointer"
                  >
                    <option value="Artisan Pizzas">Artisan Pizzas</option>
                    <option value="Gourmet Burgers">Gourmet Burgers</option>
                    <option value="Asian & Noodles">Asian & Noodles</option>
                    <option value="Biryani & Curries">Biryani & Curries</option>
                    <option value="Healthy Bowls & Salads">Healthy Bowls & Salads</option>
                    <option value="Desserts & Shakes">Desserts & Shakes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Price (Rs.) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="18.99"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="20 min"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="650"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Diet Type</label>
                  <select
                    value={isVeg ? "veg" : "non-veg"}
                    onChange={(e) => setIsVeg(e.target.value === "veg")}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium cursor-pointer"
                  >
                    <option value="veg">🌱 Vegetarian</option>
                    <option value="non-veg">🍗 Non-Veg</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Description & Ingredients</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key gourmet ingredients, seasoning, preparation technique..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium resize-none"
                />
              </div>

              {/* In-modal error */}
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <X className="w-3.5 h-3.5 shrink-0" /> {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Menu...</span>
                  </>
                ) : (
                  <span>{editingDish ? "Update Menu Dish" : "Publish to Live Menu"}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}