"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Bike, 
  Clock, 
  CheckCircle2, 
  Search, 
  Plus, 
  Eye, 
  X, 
  Loader2, 
  RefreshCw, 
  Trash2, 
  AlertCircle,
  MapPin,
  Phone,
  DollarSign,
  UtensilsCrossed,
  Flame,
  Check
} from "lucide-react";

interface OrderItem {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: string;
  cuisine: string;
  total: number;
  paymentMethod: string;
  status: "Order Confirmed" | "Cooking in Kitchen" | "Rider on the Way" | "Delivered" | "Cancelled";
  rider: string;
  orderTime: string;
  rawDetails?: any;
}

const DEFAULT_ORDERS: OrderItem[] = [
  {
    id: "1",
    orderId: "CB-849201",
    customerName: "Sophia Taylor",
    phone: "+1 (555) 234-5678",
    address: "128 Oak Street, Apt 3B, Downtown",
    items: "2x Truffle Burrata Margherita Pizza, 1x Molten Lava Cake",
    cuisine: "Artisan Pizzas",
    total: 47.97,
    paymentMethod: "Card",
    status: "Cooking in Kitchen",
    rider: "David Miller",
    orderTime: "6 mins ago",
  },
  {
    id: "2",
    orderId: "CB-849200",
    customerName: "Liam Johnson",
    phone: "+1 (555) 345-6789",
    address: "540 Pine Ave, Suite 12",
    items: "1x Double Smash Wagyu Cheeseburger, 1x Truffle Fries",
    cuisine: "Gourmet Burgers",
    total: 19.50,
    paymentMethod: "Cash on Delivery",
    status: "Rider on the Way",
    rider: "Alex Rivera",
    orderTime: "14 mins ago",
  },
  {
    id: "3",
    orderId: "CB-849199",
    customerName: "Emily Davis",
    phone: "+1 (555) 456-7890",
    address: "880 Lexington Rd",
    items: "1x Royal Hyderabadi Dum Biryani, 2x Garlic Butter Naan",
    cuisine: "Biryani & Curries",
    total: 21.49,
    paymentMethod: "Apple Pay",
    status: "Delivered",
    rider: "Chris Parker",
    orderTime: "35 mins ago",
  },
  {
    id: "4",
    orderId: "CB-849198",
    customerName: "Michael Brown",
    phone: "+1 (555) 567-8901",
    address: "210 Broadway, Floor 4",
    items: "2x Tokyo Black Garlic Tonkotsu Ramen",
    cuisine: "Asian & Noodles",
    total: 34.50,
    paymentMethod: "Card",
    status: "Delivered",
    rider: "Sam Kelly",
    orderTime: "52 mins ago",
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>(DEFAULT_ORDERS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // New Order Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newItems, setNewItems] = useState("");
  const [newTotal, setNewTotal] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // Map backend status to delivery status
  const mapBackendStatus = (st: string): OrderItem["status"] => {
    if (st === "Delivered" || st === "Completed") return "Delivered";
    if (st === "Rider on the Way" || st === "On Hold") return "Rider on the Way";
    if (st === "Cooking in Kitchen" || st === "Active") return "Cooking in Kitchen";
    if (st === "Cancelled" || st === "Closed") return "Cancelled";
    return "Order Confirmed";
  };

  const fetchOrders = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await fetch("/api/cases");
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        const fetched: OrderItem[] = data.data.map((c: any) => {
          let parsedDesc: any = null;
          try {
            if (c.description && c.description.startsWith("{")) {
              parsedDesc = JSON.parse(c.description);
            }
          } catch (_) {}

          // Extract total
          let totalVal = 25.0;
          if (parsedDesc?.total) {
            totalVal = parsedDesc.total;
          } else if (c.caseReferenceNumber) {
            const num = parseFloat(c.caseReferenceNumber.replace(/[^0-9.]/g, ""));
            if (!isNaN(num)) totalVal = num;
          }

          // Relative time
          let orderTimeStr = "Recently";
          if (c.openedDate || c.createdAt) {
            const diffMin = Math.round((Date.now() - new Date(c.openedDate || c.createdAt).getTime()) / 60000);
            if (diffMin < 2) orderTimeStr = "Just now";
            else if (diffMin < 60) orderTimeStr = `${diffMin} mins ago`;
            else if (diffMin < 1440) orderTimeStr = `${Math.round(diffMin / 60)} hrs ago`;
            else orderTimeStr = new Date(c.openedDate || c.createdAt).toLocaleDateString();
          }

          return {
            id: c._id || c.caseId,
            orderId: c.caseId || `CB-${Math.floor(100000 + Math.random() * 900000)}`,
            customerName: c.clientName || "Valued Foodie",
            phone: c.clientPhone || "+1 (555) 000-1122",
            address: c.courtInstitution || parsedDesc?.deliveryAddress?.street || "Store Pickup",
            items: c.title || "Custom Gourmet Order",
            cuisine: c.practiceArea || "Chef Kitchen",
            total: totalVal,
            paymentMethod: parsedDesc?.paymentMethod ? parsedDesc.paymentMethod.toUpperCase() : (c.caseReferenceNumber?.includes("CASH") ? "Cash on Delivery" : "Card"),
            status: mapBackendStatus(c.status),
            rider: "David Miller",
            orderTime: orderTimeStr,
            rawDetails: parsedDesc,
          };
        });
        setOrders(fetched);
      }
    } catch (e) {
      console.error("Failed to fetch live orders:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => fetchOrders(true), 15000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === "All Orders" || o.status === statusFilter;
    const matchesSearch =
      search === "" ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.items.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (id: string, newStatus: OrderItem["status"]) => {
    // Optimistic UI update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await fetch(`/api/cases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Are you sure you want to remove this order?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    if (selectedOrder?.id === id) setSelectedOrder(null);

    try {
      await fetch(`/api/cases/${id}`, { method: "DELETE" });
    } catch (e) {
      console.error("Delete order error:", e);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer || !newItems) return;
    setSubmittingOrder(true);

    const generatedId = `CB-${Math.floor(100000 + Math.random() * 900000)}`;
    const billNum = parseFloat(newTotal) || 25.0;

    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: generatedId,
          title: newItems,
          clientName: newCustomer,
          clientPhone: newPhone || "+1 (555) 000-1122",
          clientEmail: "counter@cravebite.com",
          courtInstitution: newAddress || "Counter Pickup",
          caseReferenceNumber: `$${billNum.toFixed(2)} (CASH)`,
          practiceArea: "Counter / Phone Order",
          status: "Cooking in Kitchen",
          priority: billNum > 50 ? "High" : "Medium",
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchOrders(true);
      }
    } catch (err) {
      console.error("Error creating order:", err);
    } finally {
      setSubmittingOrder(false);
      setIsAddModalOpen(false);
      setNewCustomer("");
      setNewPhone("");
      setNewAddress("");
      setNewItems("");
      setNewTotal("");
    }
  };

  return (
    <div className="p-6 lg:p-10 font-sans space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            Live Operations Board
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-950 mt-2">
            Food Delivery Orders Manager
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">Real-time sync with online checkout orders & kitchen dispatch</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-orange-600" : ""}`} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Phone / Counter Order</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["All Orders", "Cooking in Kitchen", "Rider on the Way", "Delivered"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                statusFilter === st
                  ? "bg-orange-600 text-white shadow-xs"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID or customer..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-hidden focus:border-orange-500 font-medium"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <p className="text-xs font-bold">Syncing live kitchen orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-stone-400">
            <ShoppingBag className="w-12 h-12 text-stone-300" />
            <p className="text-sm font-bold text-stone-600">No orders found matching your search</p>
            <p className="text-xs text-stone-400">Orders placed on the website will instantly appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-stone-50 text-[10px] font-extrabold uppercase text-stone-400 border-b border-stone-200">
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Items & Details</th>
                  <th className="py-3 px-4 font-bold">Total</th>
                  <th className="py-3 px-4 font-bold">Placed</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3.5 px-4 font-black text-stone-900">
                      <span className="font-mono text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                        {ord.orderId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{ord.customerName}</div>
                      <div className="text-[10px] text-stone-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" /> {ord.phone}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-medium text-stone-900 truncate">{ord.items}</div>
                      <div className="text-[10px] text-stone-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0 text-orange-500" />
                        <span>{ord.address}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-stone-950">Rs. {ord.total.toFixed(2)}</span>
                      <div className="text-[9px] font-bold text-stone-400 uppercase">{ord.paymentMethod}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 text-[11px] whitespace-nowrap">
                      {ord.orderTime}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as any)}
                        className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border cursor-pointer ${
                          ord.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : ord.status === "Rider on the Way"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : ord.status === "Cancelled"
                            ? "bg-red-100 text-red-800 border-red-200"
                            : "bg-orange-100 text-orange-800 border-orange-200"
                        }`}
                      >
                        <option value="Cooking in Kitchen">Cooking in Kitchen</option>
                        <option value="Rider on the Way">Rider on the Way</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 text-stone-500 hover:text-orange-600 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                          title="View Full Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(ord.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Delete Order"
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

      {/* View Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-100 animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-full">
                  Ticket #{selectedOrder.orderId}
                </span>
                <h3 className="text-lg font-black mt-1">Live Order Details</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1 pb-3 border-b border-stone-100">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Customer & Destination</span>
                <div className="font-bold text-sm text-stone-900">{selectedOrder.customerName}</div>
                <div className="text-stone-600 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                  <span>{selectedOrder.address}</span>
                </div>
                <div className="text-stone-500 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{selectedOrder.phone}</span>
                </div>
              </div>

              <div className="space-y-1 pb-3 border-b border-stone-100">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Dishes & Preparation</span>
                <div className="font-medium text-stone-800 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                  {selectedOrder.items}
                </div>
              </div>

              <div className="flex items-center justify-between text-stone-800 bg-orange-50 p-3.5 rounded-xl border border-orange-100">
                <span className="font-bold">Total Bill:</span>
                <span className="text-base font-black text-orange-600">Rs. {selectedOrder.total.toFixed(2)} ({selectedOrder.paymentMethod})</span>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-stone-400 font-bold uppercase text-[10px]">Update Kitchen & Delivery Status</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Cooking in Kitchen")}
                    className={`py-2 font-bold rounded-xl text-[10px] transition cursor-pointer ${
                      selectedOrder.status === "Cooking in Kitchen"
                        ? "bg-orange-600 text-white"
                        : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                    }`}
                  >
                    In Kitchen
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Rider on the Way")}
                    className={`py-2 font-bold rounded-xl text-[10px] transition cursor-pointer ${
                      selectedOrder.status === "Rider on the Way"
                        ? "bg-amber-600 text-white"
                        : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }`}
                  >
                    On Delivery
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "Delivered")}
                    className={`py-2 font-bold rounded-xl text-[10px] transition cursor-pointer ${
                      selectedOrder.status === "Delivered"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    }`}
                  >
                    Delivered ✓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-stone-100 animate-in zoom-in-95">
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white flex items-center justify-between">
              <h3 className="text-base font-black">Create Manual Counter Order</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  placeholder="e.g. Jason Reed"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Street address or Counter Pickup"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Dishes & Items *</label>
                <input
                  type="text"
                  required
                  value={newItems}
                  onChange={(e) => setNewItems(e.target.value)}
                  placeholder="e.g. 1x Truffle Pizza, 1x Buffalo Wings"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-700 mb-1">Total Bill (Rs.) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newTotal}
                  onChange={(e) => setNewTotal(e.target.value)}
                  placeholder="32.50"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={submittingOrder}
                className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-md transition cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                {submittingOrder ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting to Kitchen...</span>
                  </>
                ) : (
                  <span>Transmit Order to Kitchen</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}