"use client";

import * as React from "react";
import Image from "next/image";
import {
  Megaphone,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  ArrowRight,
  Clock,
  Check,
  ImageIcon
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Announcement, ClientLogo, announcementsApi, clientLogosApi } from "@/lib/api/lamsa-api";
import { useAnnouncementStore } from "@/lib/store/useAnnouncementStore";

type Tab = "banners" | "logos";

export default function AdminAnnouncementsPage() {
  const { fetchAnnouncements, autoPlayInterval, setAutoPlayInterval } = useAnnouncementStore();
  const [activeTab, setActiveTab] = React.useState<Tab>("banners");

  const [announcements, setAnnouncements] = React.useState<Announcement[]>([]);
  const [clientLogos, setClientLogos] = React.useState<ClientLogo[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [notification, setNotification] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  // Transition Delay Editing State (Banners only)
  const [isEditingInterval, setIsEditingInterval] = React.useState(false);
  const [tempSeconds, setTempSeconds] = React.useState(Math.round(autoPlayInterval / 1000) || 4);

  React.useEffect(() => {
    setTempSeconds(Math.round(autoPlayInterval / 1000) || 4);
  }, [autoPlayInterval]);

  const handleSaveInterval = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = Number(tempSeconds);
    if (isNaN(val) || val < 1) {
      showNotification("Le délai doit être d'au moins 1 seconde.", "error");
      return;
    }
    const ms = Math.min(Math.max(val, 1), 60) * 1000;
    setAutoPlayInterval(ms);
    setIsEditingInterval(false);
    showNotification(`Délai de transition mis à jour (${val}s) !`);
  };

  const handleQuickSetInterval = (sec: number) => {
    setAutoPlayInterval(sec * 1000);
    setTempSeconds(sec);
    setIsEditingInterval(false);
    showNotification(`Délai de transition réglé sur ${sec} secondes !`);
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Announcement | ClientLogo | null>(null);

  // Form Fields
  const [formImage, setFormImage] = React.useState("");
  const [formIsActive, setFormIsActive] = React.useState(true);
  const [formOrder, setFormOrder] = React.useState(0);
  const [formName, setFormName] = React.useState(""); // For logos
  const [formError, setFormError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [imageDimensions, setImageDimensions] = React.useState<{ width: number; height: number } | null>(null);

  React.useEffect(() => {
    if (!formImage) {
      setImageDimensions(null);
      return;
    }
    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = formImage;
  }, [formImage]);

  // Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = React.useState<{ isOpen: boolean; item: Announcement | ClientLogo | null }>({
    isOpen: false,
    item: null
  });

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeTab === "banners") {
        const data = await announcementsApi.getAllAdmin();
        setAnnouncements(data);
      } else {
        const data = await clientLogosApi.getAllAdmin();
        setClientLogos(data);
      }
    } catch (err: any) {
      console.error(`Failed to load ${activeTab}:`, err);
      showNotification("Impossible de charger les données.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormImage("");
    setFormIsActive(true);
    setFormName("");
    setFormOrder(activeTab === "banners" ? announcements.length + 1 : clientLogos.length + 1);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setFormImage(item.image);
    setFormIsActive(item.isActive);
    setFormOrder(item.order);
    if (activeTab === "logos") {
      setFormName(item.name || "");
    }
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImage.trim()) {
      setFormError("Veuillez saisir ou téléverser une image valide.");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      if (activeTab === "banners") {
        const payload = { image: formImage.trim(), isActive: formIsActive, order: formOrder };
        if (editingItem) {
          await announcementsApi.update(editingItem.id, payload);
          showNotification(`Annonce mise à jour !`);
        } else {
          await announcementsApi.create(payload);
          showNotification(`Nouvelle annonce créée !`);
        }
        await fetchAnnouncements();
      } else {
        const payload = { image: formImage.trim(), isActive: formIsActive, order: formOrder, name: formName.trim() || "Logo" };
        if (editingItem) {
          await clientLogosApi.update(editingItem.id, payload);
          showNotification(`Logo mis à jour !`);
        } else {
          await clientLogosApi.create(payload);
          showNotification(`Nouveau logo créé !`);
        }
      }

      await loadData();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Save error:", err);
      setFormError(err.response?.data?.message || err.message || "Erreur lors de la sauvegarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (item: any) => {
    try {
      if (activeTab === "banners") {
        await announcementsApi.update(item.id, { isActive: !item.isActive });
        setAnnouncements((prev) => prev.map((a) => (a.id === item.id ? { ...a, isActive: !a.isActive } : a)));
        await fetchAnnouncements();
      } else {
        await clientLogosApi.update(item.id, { isActive: !item.isActive });
        setClientLogos((prev) => prev.map((a) => (a.id === item.id ? { ...a, isActive: !a.isActive } : a)));
      }
      showNotification(`Statut mis à jour.`);
    } catch (err: any) {
      console.error("Toggle active error:", err);
      showNotification("Erreur lors de la mise à jour du statut.", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.item) return;

    try {
      if (activeTab === "banners") {
        await announcementsApi.delete(deleteModal.item.id);
        setAnnouncements((prev) => prev.filter((a) => a.id !== deleteModal.item!.id));
        await fetchAnnouncements();
      } else {
        await clientLogosApi.delete(deleteModal.item.id);
        setClientLogos((prev) => prev.filter((a) => a.id !== deleteModal.item!.id));
      }
      showNotification(`Élément supprimé.`);
      setDeleteModal({ isOpen: false, item: null });
    } catch (err: any) {
      console.error("Delete error:", err);
      showNotification("Erreur lors de la suppression.", "error");
    }
  };

  const activeCountBanners = announcements.filter((a) => a.isActive).length;
  const activeCountLogos = clientLogos.filter((a) => a.isActive).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Toast Notification */}
        {notification && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl p-4 shadow-xl text-xs font-bold ${notification.type === "success"
              ? "bg-brand-charcoal text-white border border-white/10"
              : "bg-brand-red text-white"
              }`}
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{notification.text}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-brand-charcoal sm:text-3xl flex items-center gap-2.5">
              <Megaphone className="h-7 w-7 text-brand-red" />
              <span>Bannières & Logos Partenaires</span>
            </h1>
            <p className="mt-1 text-xs text-brand-warm-gray">
              Gérez les images promotionnelles et le carrousel des logos partenaires.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-red-hover hover:shadow-[0_6px_20px_-6px_rgba(227,6,19,0.5)] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{activeTab === "banners" ? "Nouvelle Annonce" : "Nouveau Logo"}</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-brand-light-gray">
          <button
            onClick={() => setActiveTab("banners")}
            className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors ${activeTab === "banners" ? "border-brand-red text-brand-red" : "border-transparent text-brand-warm-gray hover:text-brand-charcoal"}`}
          >
            Bannières Promo (Méga Menu)
          </button>
          <button
            onClick={() => setActiveTab("logos")}
            className={`pb-3 px-1 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "logos" ? "border-brand-red text-brand-red" : "border-transparent text-brand-warm-gray hover:text-brand-charcoal"}`}
          >
            Logos Partenaires (Marquee)
          </button>
        </div>

        {/* KPI Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-brand-light-gray bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray block">
              Total {activeTab === "banners" ? "des Annonces" : "des Logos"}
            </span>
            <span className="mt-2 text-2xl font-black text-brand-charcoal block">
              {activeTab === "banners" ? announcements.length : clientLogos.length}
            </span>
          </div>

          <div className="rounded-3xl border border-brand-light-gray bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">
              {activeTab === "banners" ? "Annonces Actives (En rotation)" : "Logos Actifs"}
            </span>
            <span className="mt-2 text-2xl font-black text-emerald-600 block">
              {activeTab === "banners" ? activeCountBanners : activeCountLogos}
            </span>
          </div>

          {activeTab === "banners" ? (
            <div className="rounded-3xl border border-brand-light-gray bg-white p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray block">
                  Délai de Transition
                </span>
                <Clock className="h-3.5 w-3.5 text-brand-warm-gray" />
              </div>

              {!isEditingInterval ? (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl font-black text-brand-charcoal">
                    {Math.round(autoPlayInterval / 1000)} secondes
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingInterval(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-brand-light-gray bg-white px-3 py-1 text-xs font-bold text-brand-charcoal shadow-2xs hover:border-brand-red/40 hover:bg-brand-red/5 hover:text-brand-red transition-all cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3" />
                    <span>Modifier</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveInterval} className="mt-2 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={tempSeconds}
                      onChange={(e) => setTempSeconds(Number(e.target.value))}
                      className="w-full h-9 rounded-xl border border-brand-red/50 bg-brand-soft-white/60 px-3 text-sm font-bold text-brand-charcoal focus:border-brand-red focus:bg-white focus:outline-none"
                      autoFocus
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-warm-gray pointer-events-none">
                      sec
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="h-9 px-3 rounded-xl bg-brand-red text-white text-xs font-bold hover:bg-brand-red-hover transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>OK</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTempSeconds(Math.round(autoPlayInterval / 1000));
                      setIsEditingInterval(false);
                    }}
                    className="h-9 px-2.5 rounded-xl border border-brand-light-gray text-xs font-bold text-brand-warm-gray hover:bg-brand-soft-white transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </form>
              )}

              <div className="mt-3 flex items-center gap-1.5 pt-2 border-t border-brand-light-gray/60">
                <span className="text-[10px] text-brand-warm-gray font-bold">Raccourcis :</span>
                {[3, 4, 5, 8].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleQuickSetInterval(sec)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${Math.round(autoPlayInterval / 1000) === sec
                      ? "bg-brand-charcoal text-white shadow-2xs"
                      : "bg-brand-soft-white text-brand-warm-gray hover:bg-brand-light-gray/60 hover:text-brand-charcoal"
                      }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-brand-light-gray bg-brand-soft-white p-5 shadow-sm flex flex-col justify-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray block mb-1">
                Format Recommandé
              </span>
              <span className="text-sm font-bold text-brand-charcoal flex items-center gap-2">
                <ImageIcon className="h-4 w-4" /> 80x80 px (Carré)
              </span>
              <span className="text-xs text-brand-warm-gray mt-1">
                SVG ou PNG avec fond transparent pour un meilleur rendu.
              </span>
            </div>
          )}
        </div>

        {/* List Items */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-3xl border border-brand-light-gray bg-white p-6 animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-28 bg-gray-100 rounded-2xl" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (activeTab === "banners" ? announcements : clientLogos).length === 0 ? (
          <div className="rounded-3xl border border-dashed border-brand-light-gray bg-white p-12 text-center">
            <Megaphone className="mx-auto h-10 w-10 text-brand-warm-gray" />
            <p className="mt-3 text-sm font-bold text-brand-charcoal">
              Aucun{activeTab === "banners" ? "e annonce configurée" : " logo configuré"}
            </p>
            <p className="mt-1 text-xs text-brand-warm-gray">
              {activeTab === "banners"
                ? "Créez votre première annonce pour la diffuser en rotation sur la méga-navigation."
                : "Ajoutez un logo partenaire pour l'afficher sur le défilement de la page d'accueil."}
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-xs font-bold text-white hover:bg-brand-red-hover cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Créer {activeTab === "banners" ? "une annonce" : "un logo"}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === "banners" ? announcements : clientLogos).map((item: any) => (
              <div
                key={item.id}
                className={`relative flex flex-col justify-between rounded-3xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${item.isActive ? "border-brand-light-gray" : "border-gray-200 opacity-60 bg-gray-50/50"
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-brand-light-gray/60 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-brand-soft-white border border-brand-light-gray px-2 py-0.5 text-[10px] font-mono text-brand-warm-gray">
                        Ordre: #{item.order}
                      </span>
                      {activeTab === "logos" && item.name && (
                        <span className="text-xs font-bold text-brand-charcoal">{item.name}</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item)}
                        title={item.isActive ? "Désactiver" : "Activer"}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold cursor-pointer transition-colors ${item.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-500 border border-gray-300"
                          }`}
                      >
                        {item.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{item.isActive ? "Actif" : "Inactif"}</span>
                      </button>
                    </div>
                  </div>

                  <div className={`relative mt-4 w-full overflow-hidden rounded-2xl border border-brand-light-gray/60 flex items-center justify-center ${activeTab === "banners" ? "aspect-[1920/600] bg-neutral-900" : "aspect-square max-w-[140px] mx-auto bg-gray-50"}`}>
                    <img
                      src={item.image || "/placeholder.png"}
                      alt="Preview"
                      className={`object-contain ${activeTab === "banners" ? "w-full h-full" : "w-16 h-16 sm:w-20 sm:h-20"}`}
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2 border-t border-brand-light-gray/60 pt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-light-gray px-3.5 py-1.5 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3 text-brand-warm-gray" />
                    <span>Modifier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteModal({ isOpen: true, item })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-red/20 bg-brand-red/5 px-3.5 py-1.5 text-xs font-bold text-brand-red hover:bg-brand-red hover:text-white transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Create / Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-brand-light-gray pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-black text-brand-charcoal">
                    {editingItem ? "Modifier" : "Créer"} {activeTab === "banners" ? "l'Annonce Promo" : "le Logo Partenaire"}
                  </h2>
                  <p className="text-xs text-brand-warm-gray mt-0.5">
                    Configurez le visuel et les informations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-brand-warm-gray hover:bg-brand-soft-white hover:text-brand-charcoal"
                >
                  ✕
                </button>
              </div>

              {formError && (
                <div className="mb-4 rounded-2xl border border-brand-red/20 bg-brand-red/5 p-3 text-xs font-bold text-brand-red flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                {activeTab === "logos" && (
                  <div className="flex flex-col mb-4">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-brand-charcoal mb-2">
                      Nom du Partenaire / Marque
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex: Adhesive, Cosidar..."
                      className="flex h-11 w-full items-center rounded-xl border border-brand-light-gray bg-brand-soft-white/60 px-3.5 text-xs font-bold text-brand-charcoal transition-all focus:border-brand-red focus:bg-white focus:outline-none"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <label className="block text-[11px] font-black uppercase tracking-wider text-brand-charcoal">
                    Visuel {activeTab === "banners" ? "de la Bannière" : "du Logo"} *
                  </label>

                  <div className="relative w-full rounded-2xl border-2 border-dashed border-brand-light-gray bg-brand-soft-white/30 p-2 transition-colors hover:border-brand-red/30 hover:bg-brand-red/5">
                    {formImage ? (
                      <div>
                        <div className={`relative group w-full rounded-xl overflow-hidden flex items-center justify-center shadow-sm ${activeTab === "banners" ? "aspect-[1920/600] bg-neutral-900 border border-brand-light-gray/50" : "aspect-video bg-gray-50 border border-gray-200 py-4"}`}>
                          <img
                            src={formImage}
                            alt="Preview"
                            className={`object-contain ${activeTab === "banners" ? "w-full h-full" : "w-20 h-20 sm:w-24 sm:h-24"}`}
                          />
                          <div className="absolute inset-0 bg-brand-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                            <label className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-brand-charcoal hover:text-brand-red cursor-pointer shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                              <Upload className="h-4 w-4" />
                              <span>Changer</span>
                              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                            <button
                              type="button"
                              onClick={() => setFormImage("")}
                              className="inline-flex items-center justify-center rounded-full bg-white p-2.5 text-brand-charcoal hover:text-brand-red shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75 cursor-pointer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {imageDimensions && (
                          <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-brand-warm-gray px-1">
                            <span>
                              Résolution : <strong className="text-brand-charcoal font-mono">{imageDimensions.width} x {imageDimensions.height} px</strong>
                            </span>
                            {activeTab === "banners" ? (
                              imageDimensions.width === 1920 && imageDimensions.height === 600 ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <Check className="h-3.5 w-3.5" /> 1920x600px Parfait
                                </span>
                              ) : Math.abs(imageDimensions.width / imageDimensions.height - 3.2) < 0.08 ? (
                                <span className="text-blue-600 font-bold flex items-center gap-1">
                                  <Check className="h-3.5 w-3.5" /> Ratio 3.2:1 Conforme
                                </span>
                              ) : (
                                <span className="text-amber-600 font-medium">
                                  Ratio recommandé : 1920x600 (3.2:1)
                                </span>
                              )
                            ) : (
                              Math.abs(imageDimensions.width / imageDimensions.height - 1) < 0.1 ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <Check className="h-3.5 w-3.5" /> Carré Parfait
                                </span>
                              ) : (
                                <span className="text-amber-600 font-medium">
                                  Taille exacte recommandée : 80x80 (Carré)
                                </span>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center py-10 px-6 cursor-pointer">
                        <div className="h-12 w-12 rounded-full bg-brand-red/10 flex items-center justify-center mb-3 transition-transform hover:scale-110">
                          <Upload className="h-5 w-5 text-brand-red" />
                        </div>
                        <span className="text-sm font-bold text-brand-charcoal">
                          Cliquez pour téléverser
                        </span>
                        <span className="text-xs text-brand-warm-gray mt-1 text-center max-w-xs">
                          {activeTab === "banners" ? "Format recommandé : 1920x600px. PNG, JPG ou SVG (max 50MB)." : "Taille exacte recommandée : 80x80 pixels. Format SVG ou PNG avec fond transparent."}
                        </span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex flex-col">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-brand-charcoal mb-2">
                      Ordre d&apos;affichage
                    </label>
                    <div className="relative flex h-11 w-full items-center rounded-xl border border-brand-light-gray bg-brand-soft-white/60 px-3.5 transition-all focus-within:border-brand-red focus-within:bg-white focus-within:shadow-2xs">
                      <input
                        type="number"
                        min="0"
                        value={formOrder}
                        onChange={(e) => setFormOrder(Number(e.target.value))}
                        className="h-full w-full bg-transparent text-xs font-bold text-brand-charcoal focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-[10px] font-bold text-brand-warm-gray shrink-0 uppercase tracking-wider">
                        Position
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-[11px] font-black uppercase tracking-wider text-brand-charcoal mb-2">
                      Visibilité
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormIsActive(!formIsActive)}
                      className={`group flex h-11 w-full items-center gap-3 rounded-xl border px-3.5 transition-all duration-200 cursor-pointer ${formIsActive
                        ? "border-brand-red/40 bg-brand-red/5 shadow-2xs"
                        : "border-brand-light-gray bg-brand-soft-white/60 hover:bg-white hover:border-brand-red/30 hover:shadow-2xs"
                        }`}
                    >
                      <div
                        className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-all duration-200 ${formIsActive
                          ? "border-brand-red bg-brand-red"
                          : "border-brand-light-gray bg-white group-hover:border-brand-red/50"
                          }`}
                      >
                        <Check
                          className={`h-3.5 w-3.5 text-white transition-transform duration-200 ${formIsActive ? "scale-100 opacity-100" : "scale-50 opacity-0"
                            }`}
                          strokeWidth={3}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold transition-colors line-clamp-1 text-left ${formIsActive ? "text-brand-red" : "text-brand-charcoal"
                          }`}
                      >
                        {activeTab === "banners" ? "Actif dans le carrousel" : "Actif dans le marquee"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-light-gray">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full border border-brand-light-gray px-5 py-2.5 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white cursor-pointer"
                  >
                    Annuler
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-brand-red-hover hover:shadow-[0_6px_20px_-6px_rgba(227,6,19,0.5)] cursor-pointer disabled:opacity-50"
                  >
                    <span>{editingItem ? "Mettre à jour" : "Enregistrer"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal.isOpen && deleteModal.item && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-sm rounded-3xl border border-brand-light-gray bg-white p-6 shadow-2xl text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/10 text-brand-red mb-4">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-brand-charcoal">Supprimer ?</h3>
              <p className="mt-1 text-xs text-brand-warm-gray">
                Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
              </p>

              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteModal({ isOpen: false, item: null })}
                  className="rounded-full border border-brand-light-gray px-4 py-2 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-full bg-brand-red px-5 py-2 text-xs font-bold text-white hover:bg-brand-red-hover cursor-pointer"
                >
                  Confirmer la suppression
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
