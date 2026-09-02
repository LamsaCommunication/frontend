"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useAnnouncementStore } from "@/lib/store/useAnnouncementStore";
import { Announcement } from "@/lib/api/lamsa-api";

interface AnnouncementCarouselProps {
  autoPlayInterval?: number; // In milliseconds, default 4000ms (4s)
  className?: string;
  onSelectAction?: (url: string) => void;
}

export function AnnouncementCarousel({
  autoPlayInterval = 4000,
  className = "",
  onSelectAction
}: AnnouncementCarouselProps) {
  const { announcements, fetchAnnouncements, isLoading } = useAnnouncementStore();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const activeAnnouncements = React.useMemo(() => {
    return announcements.filter((a) => a.isActive);
  }, [announcements]);

  const total = activeAnnouncements.length;

  // Auto-slide effect
  React.useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [total, isPaused, autoPlayInterval]);

  if (total === 0) {
    return null;
  }

  const current: Announcement = activeAnnouncements[currentIndex] || activeAnnouncements[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative group w-full overflow-hidden rounded-2xl border border-brand-light-gray/40 shadow-sm bg-brand-soft-white ${className}`}
    >
      {/* The Image Container */}
      <div className="relative w-full h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px] flex items-center justify-center overflow-hidden bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id || currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <img
              src={current.image || "/lamsa2.png"}
              alt="Promo Image"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Overlay Controls */}
      {total > 1 && (
        <>
          {/* Prev / Next Buttons (Hidden by default, shown on group hover) */}
          <div className="absolute inset-0 flex items-center justify-between px-4 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Annonce précédente"
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-brand-charcoal hover:bg-white hover:text-brand-red shadow-md transition-all"
            >
              <ChevronLeft className="h-5 w-5 ml-0.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Annonce suivante"
              className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-brand-charcoal hover:bg-white hover:text-brand-red shadow-md transition-all"
            >
              <ChevronRight className="h-5 w-5 mr-0.5" />
            </button>
          </div>

          {/* Pagination Dots at Bottom */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
            <div className="flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md px-3 py-2 shadow-sm border border-white/20">
              {activeAnnouncements.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Aller à l'annonce ${idx + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? "w-6 bg-brand-red"
                      : "w-2 bg-brand-charcoal/30 hover:bg-brand-charcoal/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default AnnouncementCarousel;
