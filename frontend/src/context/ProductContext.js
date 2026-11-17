import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

const ProductContext = createContext();

// Product Provider
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    priceRange: [0, 1000],
    rating: 0,
    search: "",
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(`/api/products`);
        const items = data.products || data;
        if (!mounted) return;
        setProducts(items);
        const uniqueCategories = [...new Set(items.map((p) => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // For local editing or optimistic updates we keep state only in memory

  const getProduct = (id) => {
    return products.find(
      (product) => String(product._id || product.id) === String(id)
    );
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      const matchesCategory =
        !filters.category || product.category === filters.category;
      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      const matchesRating = product.rating >= filters.rating;
      const matchesSearch =
        product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description
          .toLowerCase()
          .includes(filters.search.toLowerCase());

      return matchesCategory && matchesPrice && matchesRating && matchesSearch;
    });
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const addProduct = async (product) => {
    const data = await apiFetch(`/api/products`, {
      method: "POST",
      body: product,
    });
    const created = data.product || data;
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const updateProduct = async (productId, updates) => {
    const data = await apiFetch(`/api/products/${productId}`, {
      method: "PUT",
      body: updates,
    });
    const updated = data.product || data;
    setProducts((prev) =>
      prev.map((p) =>
        String(p._id || p.id) === String(productId) ? updated : p
      )
    );
    return updated;
  };

  const deleteProduct = async (productId) => {
    await apiFetch(`/api/products/${productId}`, { method: "DELETE" });
    setProducts((prev) =>
      prev.filter((p) => String(p._id || p.id) !== String(productId))
    );
    return true;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        filters,
        getProduct,
        getFilteredProducts,
        updateFilters,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Product Hook
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
