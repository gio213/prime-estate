import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CanListProperty {
  canList: boolean;
  credit: number;
  canListProperty: () => void;
}
export const useCreditStore = create<CanListProperty>()(
  persist(
    (set) => ({
      canList: false,
      credit: 0,
      canListProperty: () => {
        return set((state) => ({
          canList: state.credit > 0,
        }));
      },
    }),
    {
      name: "credit-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // Use localStorage as the storage
    }
  )
);
