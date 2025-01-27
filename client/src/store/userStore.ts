import { create } from "zustand";
import { User } from "../models/User";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (newUser) => set(() => ({ user: newUser })),
  logout: () => set(() => ({ user: null })),
}));

export default useUserStore;
