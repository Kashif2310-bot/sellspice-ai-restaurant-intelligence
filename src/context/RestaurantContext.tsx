import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Bill, RestaurantSnapshot } from "@/lib/types";
import {
  loadState,
  saveState,
  addBill,
  addBillFromOcr,
  buildSnapshot,
  type RestaurantState,
} from "@/lib/restaurantStore";

interface RestaurantContextValue {
  snapshot: RestaurantSnapshot;
  addBill: (bill: Bill) => void;
  processOcrBill: (items: {
    name: string;
    qty: number;
    price: number;
    menuItemId?: string | null;
    resolvedName?: string;
  }[]) => Bill;
  refresh: () => void;
}

const RestaurantContext = createContext<RestaurantContextValue | null>(null);

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RestaurantState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const snapshot = useMemo(() => buildSnapshot(state), [state]);

  const handleAddBill = useCallback((bill: Bill) => {
    setState((prev) => addBill(prev, bill));
  }, []);

  const processOcrBill = useCallback(
    (items: {
      name: string;
      qty: number;
      price: number;
      menuItemId?: string | null;
      resolvedName?: string;
    }[]) => {
    let newBill!: Bill;
    setState((prev) => {
      const result = addBillFromOcr(prev, items);
      newBill = result.bill;
      return result.state;
    });
    return newBill;
  }, []);

  const refresh = useCallback(() => {
    setState(loadState());
  }, []);

  const value = useMemo(
    () => ({ snapshot, addBill: handleAddBill, processOcrBill, refresh }),
    [snapshot, handleAddBill, processOcrBill, refresh]
  );

  return (
    <RestaurantContext.Provider value={value}>{children}</RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error("useRestaurant must be used within RestaurantProvider");
  return ctx;
}
