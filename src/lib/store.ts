import { create } from "zustand";

export type Route = "home" | "settings" | "account";

type UIState = {
  route: Route;
  setRoute: (r: Route) => void;
};

export const useUI = create<UIState>((set) => ({
  route: "home",
  setRoute: (route) => set({ route }),
}));
