"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface PrintItem {
  uid             :  string;
  id              :  number;
  name            :  string;
  type            :  "product" | "location";
  code            :  string;
  last_sequence   :  number;
  qty             :  number;
  newRangeCount   :  number;
  missedNumbers   :  Array<{ number: number; qty: number }>;
  customQtys      :  Record<number, number>;
  showCustomList  :  boolean;
}

interface PrintQrContextInterface {
  cartItems   :  PrintItem[];
  addItem     :  (item: Pick<PrintItem, "uid" | "id" | "name" | "type" | "code" | "last_sequence">) => void;
  removeItem  :  (uid: string) => void;
  updateItem  :  (uid: string, updates: Partial<PrintItem>) => void;
  toggleItem  :  (item: Pick<PrintItem, "uid" | "id" | "name" | "type" | "code" | "last_sequence">) => void;
  clearCart   :  () => void;
  isInCart    :  (uid: string) => boolean;
}

const PrintQrContext = createContext<PrintQrContextInterface | null>(null);

const STORAGE_KEY = "sohs_print_cart";

export const PrintQrContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems]      =  useState<PrintItem[]>([]);
  const [initialized, setInitialized]  =  useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCartItems(parsed.map(item => ({
            ...item,
            customQtys     :  item.customQtys || {},
            missedNumbers  :  item.missedNumbers || []
          })));
        }
      } catch {}
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, initialized]);

  const addItem = useCallback((base: Pick<PrintItem, "uid" | "id" | "name" | "type" | "code" | "last_sequence">) => {
    setCartItems(prev => {
      if (prev.some(i => i.id === base.id)) return prev;
      return [...prev, {
        ...base,
        qty             :  base.type === "location" ? 1  :  0,
        newRangeCount   :  base.type === "product" ? 1   :  0,
        missedNumbers   :  [],
        customQtys      :  {},
        showCustomList  :  false
      }];
    });
  }, []);

  const removeItem = useCallback((uid: string) => {
    setCartItems(prev => prev.filter(i => i.uid !== uid));
  }, []);

  const toggleItem = useCallback((base: Pick<PrintItem, "uid" | "id" | "name" | "type" | "code" | "last_sequence">) => {
    setCartItems(prev => {
      const exists = prev.some(i => i.uid === base.uid);
      if (exists) {
        return prev.filter(i => i.id !== base.id);
      } else {
        return [...prev, {
          ...base,
          qty             :  base.type === "location" ? 1  :  0,
          newRangeCount   :  base.type === "product" ? 1   :  0,
          missedNumbers   :  [],
          customQtys      :  {},
          showCustomList  :  false
        }];
      }
    });
  }, []);

  const updateItem = useCallback((uid: string, updates: Partial<PrintItem>) => {
    setCartItems(prev => {
      return prev.map(item => item.uid === uid ? { ...item, ...updates } : item)
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const isInCart = useCallback((uid: string) => {
    return cartItems.some(i => i.uid === uid);
  }, [cartItems]);

  return (
    <PrintQrContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        toggleItem,
        updateItem,
        clearCart,
        isInCart
      }}
    >
      {children}
    </PrintQrContext.Provider>
  );
};

export const usePrintQrContext = () => {
  const ctx = useContext(PrintQrContext);
  if (!ctx) throw new Error("usePrintQrContext must be used inside PrintQrContextProvider");

  return ctx;
};
