import { create } from "zustand";
import { Announcement, announcementsApi } from "@/lib/api/lamsa-api";

interface AnnouncementState {
  announcements: Announcement[];
  autoPlayInterval: number;
  isLoading: boolean;
  error: string | null;
  fetchAnnouncements: () => Promise<void>;
  setAnnouncements: (announcements: Announcement[]) => void;
  setAutoPlayInterval: (interval: number) => void;
}

const getInitialInterval = (): number => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("lamsa_announcement_interval");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 1000) return parsed;
    }
  }
  return 4000;
};

export const useAnnouncementStore = create<AnnouncementState>()((set, get) => ({
  announcements: [],
  autoPlayInterval: getInitialInterval(),
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

  setAnnouncements: (announcements) => set({ announcements }),

  setAutoPlayInterval: (interval: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lamsa_announcement_interval", String(interval));
    }
    set({ autoPlayInterval: interval });
  }
}));
