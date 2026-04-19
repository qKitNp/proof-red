import { create } from "zustand";

export type Route = "ledger" | "settings" | "account";

type UIState = {
  route: Route;
  setRoute: (r: Route) => void;
};

export const useUI = create<UIState>((set) => ({
  route: "ledger",
  setRoute: (route) => set({ route }),
}));
