import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

const OrderContext = createContext();

// Order Provider
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const raw = localStorage.getItem("orderHistory");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  });
  const [orderEvents, setOrderEvents] = useState(() => {
    try {
      const raw = localStorage.getItem("orderEvents");
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (err) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));
    } catch (err) {}
  }, [orderHistory]);

  useEffect(() => {
    try {
      localStorage.setItem("orderEvents", JSON.stringify(orderEvents));
    } catch (err) {}
  }, [orderEvents]);

  const createOrder = async (orderData) => {
    const data = await apiFetch(`/api/orders`, {
      method: "POST",
      body: orderData,
    });
    const order = data.order || data;
    // optionally refresh user's orders
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = async (orderId, status) => {
    const data = await apiFetch(`/api/orders/${orderId}/status`, {
      method: "PUT",
      body: { status },
    });
    const updated = data.order || data;
    setOrders((prev) =>
      prev.map((o) => (String(o._id || o.id) === String(orderId) ? updated : o))
    );
    setOrderEvents((h) => [
      ...h,
      {
        id: `${orderId}-evt-${Date.now()}`,
        orderId,
        from: null,
        to: status,
        timestamp: new Date().toISOString(),
      },
    ]);
    return updated;
  };

  const getOrderById = (orderId) => {
    return orders.find(
      (order) => String(order._id || order.id) === String(orderId)
    );
  };

  const getUserOrders = async () => {
    try {
      const data = await apiFetch(`/api/orders/myorders`);
      const items = data.orders || data;
      setOrders(items);
      return items;
    } catch (err) {
      return [];
    }
  };

  const completeOrder = (orderId) => {
    const completedOrder = orders.find((order) => order.id === orderId);
    if (completedOrder) {
      const finished = {
        ...completedOrder,
        status: "Completed",
        completedAt: new Date().toISOString(),
      };
      setOrderHistory((prev) => [...prev, finished]);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } else {
      setOrderHistory((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Completed" } : o))
      );
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        orderHistory,
        orderEvents,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getUserOrders,
        completeOrder,
        setActiveOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Order Hook
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
};
