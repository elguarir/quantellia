import { create } from "zustand";

interface SidebarState {
   isOpen: boolean;
   toggle: () => void;
   close: () => void;
   open: () => void;
}

export const useSidebar = create<SidebarState>((set) => ({
   isOpen: false,
   toggle: () => set((state) => ({ isOpen: !state.isOpen })),
   close: () => set({ isOpen: false }),
   open: () => set({ isOpen: true }),
}));
