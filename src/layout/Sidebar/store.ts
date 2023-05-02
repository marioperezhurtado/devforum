import { create } from "zustand"

type State = {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

export const useSidebarStore = create<State>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  close: () => set({ isOpen: false }),
}))
