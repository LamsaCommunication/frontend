import { create } from "zustand";
import { Announcement, announcementsApi } from "@/lib/api/lamsa-api";

interface AnnouncementState {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  fetchAnnouncements: () => Promise<void>;
  setAnnouncements: (announcements: Announcement[]) => void;
}

export const useAnnouncementStore = create<AnnouncementState>()((set, get) => ({
  announcements: [],
  isLoading: false,
  error: null,

  fetchAnnouncements: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const data = await announcementsApi.getActive();
      set({ announcements: Array.isArray(data) ? data : [], isLoading: false });
    } catch (err: any) {
      console.warn("Could not load announcements from backend:", err.message);
      set({ isLoading: false });
    }
  },

  setAnnouncements: (announcements) => set({ announcements })
}));
