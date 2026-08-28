"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "@/data/menuData";

export interface CartItem {
  id: string; // dish id + customization hash
  menuItem: MenuItem;
  quantity: number;
  selectedCustomizations?: Record<string, string>;
  specialInstructions?: string;
  itemTotalPrice: number;
}

export interface PlacedOrder {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  appliedCoupon?: string;
  deliveryAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    instructions?: string;
  };
  paymentMethod: "cod" | "card" | "wallet";
  status: "Order Confirmed" | "Preparing in Kitchen" | "Rider on the Way" | "Delivered";
  createdAt: string;
  estimatedDeliveryTime: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity?: number,
    customizations?: Record<string, string>,
    instructions?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  grandTotal: number;
  appliedCoupon: string | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  activeOrder: PlacedOrder | null;
  setActiveOrder: (order: PlacedOrder | null) => void;
  orderHistory: PlacedOrder[];
  placeOrder: (
    deliveryDetails: PlacedOrder["deliveryAddress"],
    paymentMethod: PlacedOrder["paymentMethod"]
  ) => PlacedOrder;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 30;
const STANDARD_DELIVERY_FEE = 350;
const TAX_RATE = 0.08; // 8%

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<PlacedOrder | null>(null);
  const [orderHistory, setOrderHistory] = useState<PlacedOrder[]>([]);

  // Load cart and orders from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cravebite_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedCoupon = localStorage.getItem("cravebite_coupon");
      if (savedCoupon) setAppliedCoupon(savedCoupon);

      const savedOrders = localStorage.getItem("cravebite_orders");
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        setOrderHistory(parsed);
        if (parsed.length > 0) {
          setActiveOrder(parsed[0]);
        }
      }
    } catch (_) {}
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cravebite_cart", JSON.stringify(cart));
    } catch (_) {}
  }, [cart]);

  // Save active order to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cravebite_orders", JSON.stringify(orderHistory));
    } catch (_) {}
  }, [orderHistory]);

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    customizations?: Record<string, string>,
    instructions?: string
  ) => {
    const customKey = customizations ? JSON.stringify(customizations) : "";
    const cartItemId = `${item.id}-${customKey}`;

    // Calculate item unit price with customizations
    let unitPrice = item.price;
    if (customizations && item.customizations) {
      Object.entries(customizations).forEach(([groupName, selectedOption]) => {
        const group = item.customizations?.find((g) => g.name === groupName);
        const opt = group?.options.find((o) => o.label === selectedOption);
        if (opt) unitPrice += opt.extraPrice;
      });
    }

    setCart((prevCart) => {
      const existing = prevCart.find((ci) => ci.id === cartItemId);
      if (existing) {
        return prevCart.map((ci) =>
          ci.id === cartItemId
            ? {
                ...ci,
                quantity: ci.quantity + quantity,
                itemTotalPrice: (ci.quantity + quantity) * unitPrice,
              }
            : ci
        );
      }
      return [
        ...prevCart,
        {
          id: cartItemId,
          menuItem: item,
          quantity,
          selectedCustomizations: customizations,
          specialInstructions: instructions,
          itemTotalPrice: unitPrice * quantity,
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => {
        if (ci.id === cartItemId) {
          const unitPrice = ci.itemTotalPrice / ci.quantity;
          return {
            ...ci,
            quantity: newQuantity,
            itemTotalPrice: unitPrice * newQuantity,
          };
        }
        return ci;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem("cravebite_cart");
    localStorage.removeItem("cravebite_coupon");
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => sum + item.itemTotalPrice, 0);

  // Delivery fee logic
  let deliveryFee = subtotal > 0 && subtotal < FREE_DELIVERY_THRESHOLD ? STANDARD_DELIVERY_FEE : 0;
  if (appliedCoupon === "FREESHIP") {
    deliveryFee = 0;
  }

  // Discount calculation
  let discount = 0;
  if (appliedCoupon === "CRAVE20") {
    discount = subtotal * 0.2;
  } else if (appliedCoupon === "TASTY50") {
    discount = subtotal * 0.5;
  }

  const tax = (subtotal - discount) > 0 ? (subtotal - discount) * TAX_RATE : 0;
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee + tax);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "CRAVE20") {
      if (subtotal < 20) {
        setCouponError("Minimum order of Rs. 20 required for CRAVE20");
        return false;
      }
      setAppliedCoupon("CRAVE20");
      setCouponError(null);
      return true;
    }
    if (clean === "FREESHIP") {
      setAppliedCoupon("FREESHIP");
      setCouponError(null);
      return true;
    }
    if (clean === "TASTY50") {
      setAppliedCoupon("TASTY50");
      setCouponError(null);
      return true;
    }
    setCouponError("Invalid coupon code. Try CRAVE20 or FREESHIP");
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    localStorage.removeItem("cravebite_coupon");
  };

  const placeOrder = (
    deliveryDetails: PlacedOrder["deliveryAddress"],
    paymentMethod: PlacedOrder["paymentMethod"]
  ): PlacedOrder => {
    const newOrder: PlacedOrder = {
      orderId: `CB-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      subtotal,
      discount,
      deliveryFee,
      tax,
      total: grandTotal,
      appliedCoupon: appliedCoupon || undefined,
      deliveryAddress: deliveryDetails,
      paymentMethod,
      status: "Order Confirmed",
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: "25-35 mins",
    };

    // Send order to backend API to instantly appear in Admin Panel
    const itemsSummary = cart.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(", ") || "Gourmet Meal";
    fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        caseId: newOrder.orderId,
        title: itemsSummary,
        clientName: deliveryDetails.fullName,
        clientPhone: deliveryDetails.phone,
        clientEmail: "customer@cravebite.com",
        practiceArea: cart[0]?.menuItem.category || "Artisan Kitchen",
        status: "Active",
        priority: grandTotal > 50 ? "High" : "Medium",
        courtInstitution: `${deliveryDetails.street}, ${deliveryDetails.city}`,
        caseReferenceNumber: `Rs. ${grandTotal.toFixed(2)} (${paymentMethod.toUpperCase()})`,
        description: JSON.stringify({
          orderId: newOrder.orderId,
          items: cart.map((i) => ({
            name: i.menuItem.name,
            quantity: i.quantity,
            price: i.itemTotalPrice,
            customizations: i.selectedCustomizations,
          })),
          subtotal,
          deliveryFee,
          discount,
          tax,
          total: grandTotal,
          appliedCoupon: appliedCoupon || null,
          deliveryAddress: deliveryDetails,
          paymentMethod,
          placedAt: newOrder.createdAt,
        }),
      }),
    }).catch((err) => console.error("Admin order sync notification:", err));

    setActiveOrder(newOrder);
    setOrderHistory((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCheckoutOpen(false);
    setIsTrackingOpen(true);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        deliveryFee,
        tax,
        discount,
        grandTotal,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        activeOrder,
        setActiveOrder,
        orderHistory,
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
