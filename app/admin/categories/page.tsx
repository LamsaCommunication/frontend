"use client";

import * as React from "react";
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Package,
  Layers,
  Sparkles,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
  Pencil,
  Palette,
  Printer,
  Zap,
  Shirt,
  HelpCircle,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { CustomSelect } from "@/components/ui/custom-select";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { useCatalogStore, Category, SubCategory, CategoryService } from "@/lib/store/useCatalogStore";
import { categoriesApi } from "@/lib/api/lamsa-api";

const ICON_OPTIONS = [
  { label: "Pencil (Graphisme & Print)", value: "Pencil" },
  { label: "Palette (Branding & Logo)", value: "Palette" },
  { label: "Printer (Impression & Packaging)", value: "Printer" },
  { label: "Zap (Signalétique & LED)", value: "Zap" },
  { label: "Shirt (Textile & Broderie)", value: "Shirt" },
  { label: "Sparkles (Sur Mesure & Luxe)", value: "Sparkles" },
];

export default function AdminCategoriesPage() {
  const {
    categories,
    products,
    fetchCatalog,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory
  } = useCatalogStore();

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);

  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = React.useState(false);
  const [parentCategoryIdForSub, setParentCategoryIdForSub] = React.useState<string>("");
  const [editingSubCategory, setEditingSubCategory] = React.useState<SubCategory | null>(null);

  // Category Form State
  const [catName, setCatName] = React.useState("");
  const [catSlug, setCatSlug] = React.useState("");
  const [catDescription, setCatDescription] = React.useState("");
  const [catIcon, setCatIcon] = React.useState("Sparkles");
  const [catImage, setCatImage] = React.useState("");
  const [catServices, setCatServices] = React.useState<CategoryService[]>([]);
  const [catError, setCatError] = React.useState<string | null>(null);

  // Sub-Category Form State
  const [subName, setSubName] = React.useState("");
  const [subSlug, setSubSlug] = React.useState("");
  const [subDescription, setSubDescription] = React.useState("");
  const [subError, setSubError] = React.useState<string | null>(null);

  // Notification Toast
  const [notification, setNotification] = React.useState<{ text: string; type: "success" | "error" } | null>(null);

  // Delete Confirmation Modal State
  const [deleteModalState, setDeleteModalState] = React.useState<{
    isOpen: boolean;
    title: string;
    itemName?: string;
    description?: string;
    blockedReason?: string | null;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
  });

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Open Create Category Modal
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCatName("");
    setCatSlug("");
    setCatDescription("");
    setCatIcon("Sparkles");
    setCatImage("");
    setCatServices([]);
    setCatError(null);
    setIsCategoryModalOpen(true);
  };

  // Open Edit Category Modal
  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDescription(cat.description || "");
    setCatIcon(cat.icon || "Sparkles");
    setCatImage(cat.image || cat.images?.[0] || "");
    setCatServices(cat.services || []);
    setCatError(null);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySingleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCatImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddServiceItem = () => {
    setCatServices((prev) => [
      ...prev,
      {
        id: `srv-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        name: "",
        description: ""
      }
    ]);
  };

  const handleUpdateServiceItem = (
    index: number,
    field: "name" | "description",
    val: string
  ) => {
    setCatServices((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, [field]: val } : s))
    );
  };

  const handleRemoveServiceItem = (index: number) => {
    setCatServices((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Handle Category Name Change with auto-slug
  const handleCatNameChange = (val: string) => {
    setCatName(val);
    if (!editingCategory) {
      setCatSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  // Submit Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatError(null);

    if (!catName.trim()) {
      setCatError("Veuillez renseigner le nom de la catégorie.");
      return;
    }
    if (!catSlug.trim()) {
      setCatError("Veuillez renseigner le slug unique.");
      return;
    }

    const sanitizedServices = catServices.filter((s) => s.name.trim().length > 0);
    const finalImage = catImage.trim() || undefined;
    const finalImages = finalImage ? [finalImage] : [];

    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, {
          name: catName.trim(),
          slug: catSlug.trim(),
          description: catDescription.trim(),
          icon: catIcon,
          image: finalImage,
          images: finalImages,
          services: sanitizedServices,
        });
        showNotification(`Catégorie "${catName}" mise à jour avec succès !`);
      } else {
        await categoriesApi.create({
          name: catName.trim(),
          slug: catSlug.trim(),
          description: catDescription.trim() || "Catégorie de services et produits Lamsa.",
          icon: catIcon,
          tags: ["Nouveau", "Sur Mesure"],
          image: finalImage,
          images: finalImages,
          services: sanitizedServices,
          subCategories: []
        });
        showNotification(`Nouvelle catégorie "${catName}" créée avec succès !`);
      }

      await fetchCatalog();
      setIsCategoryModalOpen(false);
    } catch (err: any) {
      console.error("Erreur save category:", err);
      setCatError(err.response?.data?.message || "Erreur serveur.");
    }
  };

  // Open Create Sub-Category Modal
  const handleOpenCreateSubCategory = (parentCatId?: string) => {
    setEditingSubCategory(null);
    setParentCategoryIdForSub(parentCatId || categories[0]?.id || "");
    setSubName("");
    setSubSlug("");
    setSubDescription("");
    setSubError(null);
    setIsSubCategoryModalOpen(true);
  };

  // Open Edit Sub-Category Modal
  const handleOpenEditSubCategory = (parentCatId: string, sub: SubCategory) => {
    setEditingSubCategory(sub);
    setParentCategoryIdForSub(parentCatId);
    setSubName(sub.name);
    setSubSlug(sub.slug);
    setSubDescription(sub.description || "");
    setSubError(null);
    setIsSubCategoryModalOpen(true);
  };

  // Handle Sub-Category Name Change with auto-slug
  const handleSubNameChange = (val: string) => {
    setSubName(val);
    if (!editingSubCategory) {
      setSubSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      );
    }
  };

  // Submit Sub-Category
  const handleSaveSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubError(null);

    if (!parentCategoryIdForSub) {
      setSubError("Veuillez sélectionner la catégorie parente.");
      return;
    }
    if (!subName.trim()) {
      setSubError("Veuillez renseigner le nom de la sous-catégorie.");
      return;
    }
    if (!subSlug.trim()) {
      setSubError("Veuillez renseigner le slug unique.");
      return;
    }

    if (editingSubCategory) {
    try {
      if (editingSubCategory) {
        await categoriesApi.update(editingSubCategory.id, {
          name: subName.trim(),
          slug: subSlug.trim(),
          description: subDescription.trim() || undefined,
          parentId: parentCategoryIdForSub,
        });
        showNotification("Sous-catégorie modifiée avec succès.");
      } else {
        await categoriesApi.create({
          name: subName.trim(),
          slug: subSlug.trim(),
          description: subDescription.trim() || undefined,
          parentId: parentCategoryIdForSub,
        });
        showNotification("Sous-catégorie ajoutée avec succès.");
      }
      
      await fetchCatalog();
      setIsSubCategoryModalOpen(false);
    } catch (err: any) {
      console.error("Save sub-category error:", err);
      setSubError(err.response?.data?.message || "Erreur lors de la sauvegarde.");
    }
  };
  };

  // Handle Category Delete with Safeguards
  const handleDeleteCategory = (cat: Category) => {
    // Safeguard 1: Cannot delete a main category if it still has sub-categories!
    if (cat.subCategories && cat.subCategories.length > 0) {
      setDeleteModalState({
        isOpen: true,
        title: "Suppression Impossible",
        itemName: cat.name,
        blockedReason: `Cette catégorie principale contient encore ${cat.subCategories.length} sous-catégorie(s). Pour la supprimer, vous devez d'abord supprimer ou déplacer toutes ses sous-catégories.`,
      });
      return;
    }

    // Safeguard 2: Cannot delete if it has assigned products
    const linkedProducts = products.filter((p) => p.categoryId === cat.id);
    if (linkedProducts.length > 0) {
      setDeleteModalState({
        isOpen: true,
        title: "Suppression Impossible",
        itemName: cat.name,
        blockedReason: `Cette catégorie contient encore ${linkedProducts.length} produit(s) associé(s). Veuillez d'abord réassigner ou supprimer ces produits.`,
      });
      return;
    }

    // Clean confirmation modal
    setDeleteModalState({
      isOpen: true,
      title: "Supprimer la catégorie ?",
      itemName: cat.name,
      description: `Êtes-vous sûr de vouloir supprimer définitivement la catégorie « ${cat.name} » ? Cette action est irréversible.`,
      blockedReason: null,
      onConfirm: async () => {
        try {
          await categoriesApi.delete(cat.id);
          showNotification(`Catégorie "${cat.name}" supprimée.`);
          await fetchCatalog();
        } catch (err: any) {
          console.error("Delete category error:", err);
          showNotification(err.response?.data?.message || "Erreur lors de la suppression.", "error");
        }
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Handle Sub-Category Delete with Safeguard
  const handleDeleteSubCategory = (parentCatId: string, sub: SubCategory) => {
    const linkedProducts = products.filter((p) => p.subCategoryId === sub.id);
    if (linkedProducts.length > 0) {
      setDeleteModalState({
        isOpen: true,
        title: "Suppression Impossible",
        itemName: sub.name,
        blockedReason: `Cette sous-catégorie est actuellement assignée à ${linkedProducts.length} produit(s). Veuillez d'abord réassigner ou supprimer ces produits.`,
      });
      return;
    }

    setDeleteModalState({
      isOpen: true,
      title: "Supprimer la sous-catégorie ?",
      itemName: sub.name,
      description: `Êtes-vous sûr de vouloir supprimer définitivement la sous-catégorie « ${sub.name} » ?`,
      blockedReason: null,
      onConfirm: async () => {
        try {
          await categoriesApi.delete(sub.id);
          showNotification(`Sous-catégorie "${sub.name}" supprimée.`);
          await fetchCatalog();
        } catch (err: any) {
          console.error("Delete sub-category error:", err);
          showNotification(err.response?.data?.message || "Erreur lors de la suppression de la sous-catégorie.", "error");
        }
        setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

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
            <h1 className="text-2xl font-black text-brand-charcoal sm:text-3xl">
              Gestionnaire des Catégories & Rayons
            </h1>
            <p className="mt-1 text-xs text-brand-warm-gray">
              Organisez l&apos;arborescence hiérarchique des catégories principales et sous-catégories de la boutique.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleOpenCreateSubCategory()}
              className="inline-flex items-center gap-2 rounded-full border border-brand-light-gray bg-white px-4 py-2.5 text-xs font-bold text-brand-charcoal shadow-sm transition-all hover:bg-brand-soft-white cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-brand-red" />
              <span>Sous-Catégorie</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreateCategory}
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-red-hover hover:shadow-[0_6px_20px_-6px_rgba(227,6,19,0.5)] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle Catégorie</span>
            </button>
          </div>
        </div>

        {/* Categories Hierarchy Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => {
            const productCount = products.filter((p) => p.categoryId === cat.id).length;

            return (
              <div
                key={cat.id}
                className="flex flex-col justify-between rounded-3xl border border-brand-light-gray bg-white p-6 shadow-sm transition-all hover:border-brand-red/20"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {cat.image || (cat.images && cat.images.length > 0) ? (
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-brand-light-gray bg-white p-1 shadow-xs">
                          <img
                            src={cat.image || cat.images?.[0]}
                            alt={cat.name}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft-white text-brand-red shadow-xs">
                          <FolderTree className="h-6 w-6" />
                        </div>
                      )}
                      <div>
                        <h2 className="text-base font-black text-brand-charcoal">
                          {cat.name}
                        </h2>
                        <span className="text-[11px] font-mono text-brand-warm-gray">
                          /{cat.slug}
                        </span>
                      </div>
                    </div>

                    <span className="rounded-full bg-brand-charcoal px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      {productCount} produit{productCount > 1 ? "s" : ""}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-brand-dark/70 line-clamp-2 leading-relaxed">
                    {cat.description || "Aucune description renseignée."}
                  </p>

                  {/* Sub-categories List Box */}
                  <div className="mt-5 rounded-2xl border border-brand-light-gray/80 bg-brand-soft-white/40 p-4">
                    <div className="flex items-center justify-between border-b border-brand-light-gray/60 pb-2 mb-3">
                      <span className="text-[11px] font-black uppercase tracking-wider text-brand-charcoal">
                        Sous-catégories ({cat.subCategories.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenCreateSubCategory(cat.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-red hover:underline cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Ajouter</span>
                      </button>
                    </div>

                    {cat.subCategories.length === 0 ? (
                      <p className="text-center py-2 text-[11px] text-brand-warm-gray italic">
                        Aucune sous-catégorie configurée.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {cat.subCategories.map((sub) => {
                          const subProductCount = products.filter(
                            (p) => p.subCategoryId === sub.id
                          ).length;

                          return (
                            <div
                              key={sub.id}
                              className="group flex items-center justify-between rounded-xl border border-brand-light-gray/70 bg-white px-3 py-2 text-xs transition-all hover:border-brand-red/30"
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="font-bold text-brand-charcoal truncate">
                                  {sub.name}
                                </span>
                                {subProductCount > 0 && (
                                  <span className="rounded bg-brand-soft-white px-1.5 py-0.2 text-[9px] font-bold text-brand-warm-gray">
                                    {subProductCount}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditSubCategory(cat.id, sub)}
                                  title="Modifier la sous-catégorie"
                                  className="flex h-6 w-6 items-center justify-center rounded text-brand-warm-gray hover:text-brand-charcoal hover:bg-brand-soft-white cursor-pointer"
                                >
                                  <Edit2 className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubCategory(cat.id, sub)}
                                  title="Supprimer la sous-catégorie"
                                  className="flex h-6 w-6 items-center justify-center rounded text-brand-warm-gray hover:text-brand-red hover:bg-brand-soft-white cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-brand-light-gray/60 pt-4">
                  <button
                    type="button"
                    onClick={() => handleOpenEditCategory(cat)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white transition-colors cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-brand-warm-gray" />
                    <span>Modifier la catégorie</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-warm-gray hover:text-brand-red hover:bg-brand-soft-white transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Modal: Create / Edit Main Category ──────────────────────── */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-brand-light-gray/70 pb-4 mb-4">
                <h2 className="text-base font-black text-brand-charcoal">
                  {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie principale"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand-warm-gray hover:bg-brand-soft-white hover:text-brand-charcoal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {catError && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-brand-red/30 bg-brand-red/10 p-3 text-xs font-bold text-brand-red">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{catError}</span>
                </div>
              )}

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                    Nom de la catégorie *
                  </label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => handleCatNameChange(e.target.value)}
                    placeholder="Ex: Signalétique & Enseignes LED"
                    className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/60 py-2.5 px-4 text-xs font-bold text-brand-charcoal focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    value={catSlug}
                    onChange={(e) => setCatSlug(e.target.value)}
                    placeholder="signaletique-led"
                    className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/60 py-2.5 px-4 text-xs font-mono text-brand-charcoal focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>

                <CustomSelect
                  label="Icône Thématique"
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </CustomSelect>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    placeholder="Courte description pour la boutique..."
                    className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/60 py-2 px-4 text-xs font-medium text-brand-charcoal focus:border-brand-red focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                {/* ── Main Category Single Image Upload ── */}
                <div className="rounded-2xl border border-brand-light-gray/80 bg-brand-soft-white/40 p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                      Image de la catégorie
                    </label>
                    {catImage && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="h-3 w-3" /> Image configurée
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-brand-warm-gray leading-relaxed">
                    Téléversez une image représentative pour cette catégorie principale (1 seule image).
                  </p>

                  {catImage ? (
                    <div className="flex items-center gap-3 pt-1">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-brand-light-gray bg-white p-1.5 shadow-sm">
                        <img
                          src={catImage}
                          alt="Aperçu de la catégorie"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="inline-flex items-center gap-1.5 rounded-full border border-brand-light-gray bg-white px-3.5 py-1.5 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white transition-colors cursor-pointer shadow-2xs">
                          <Upload className="h-3.5 w-3.5 text-brand-red" />
                          <span>Changer l&apos;image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCategorySingleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setCatImage("")}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-warm-gray hover:text-brand-red transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Supprimer l&apos;image</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="mt-1 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-light-gray hover:border-brand-red bg-white hover:bg-brand-soft-white/80 p-5 text-center transition-all cursor-pointer shadow-2xs">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft-white text-brand-red mb-2">
                        <Upload className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-brand-charcoal">
                        Cliquez pour choisir une image
                      </span>
                      <span className="text-[10px] text-brand-warm-gray mt-0.5">
                        PNG, JPG, WebP ou SVG (1 seule image)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCategorySingleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* ── Main Category Engagements & Livrables (for /agence) ── */}
                <div className="rounded-2xl border border-brand-light-gray/70 bg-brand-soft-white/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                      Nos engagements & livrables (/agence)
                    </label>
                    <button
                      type="button"
                      onClick={handleAddServiceItem}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-red hover:text-brand-red-hover cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Ajouter un livrable</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-brand-warm-gray leading-relaxed">
                    Ces points détaillent vos engagements sous forme de cartes cochées sur la page Agence.
                  </p>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {catServices.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-brand-light-gray bg-white/70 p-3 text-center text-xs text-brand-warm-gray">
                        Aucun livrable configuré. Cliquez sur &quot;Ajouter un livrable&quot; pour en créer.
                      </div>
                    ) : (
                      catServices.map((srv, idx) => (
                        <div
                          key={srv.id || idx}
                          className="flex items-start gap-2 rounded-xl border border-brand-light-gray bg-white p-2.5 shadow-2xs"
                        >
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={srv.name}
                              onChange={(e) => handleUpdateServiceItem(idx, "name", e.target.value)}
                              placeholder="Titre du livrable (Ex: Affiches & Flyers)"
                              className="w-full rounded-lg border border-brand-light-gray/80 bg-brand-soft-white/40 py-1 px-2.5 text-xs font-bold text-brand-charcoal focus:border-brand-red focus:bg-white focus:outline-none"
                            />
                            <input
                              type="text"
                              value={srv.description}
                              onChange={(e) => handleUpdateServiceItem(idx, "description", e.target.value)}
                              placeholder="Description (Ex: Supports promotionnels percutants...)"
                              className="w-full rounded-lg border border-brand-light-gray/80 bg-brand-soft-white/40 py-1 px-2.5 text-xs text-brand-dark/70 focus:border-brand-red focus:bg-white focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveServiceItem(idx)}
                            title="Supprimer ce livrable"
                            className="mt-1 flex h-7 w-7 items-center justify-center rounded-lg text-brand-warm-gray hover:bg-brand-red/10 hover:text-brand-red transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-brand-light-gray/70">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="rounded-full border border-brand-light-gray px-5 py-2 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-red px-6 py-2 text-xs font-extrabold text-white hover:bg-brand-red-hover shadow-sm"
                  >
                    {editingCategory ? "Enregistrer" : "Créer la catégorie"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Modal: Create / Edit Sub-Category ───────────────────────── */}
        {isSubCategoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-3xl border border-brand-light-gray bg-white p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-brand-light-gray/70 pb-4 mb-4">
                <h2 className="text-base font-black text-brand-charcoal">
                  {editingSubCategory ? "Modifier la sous-catégorie" : "Nouvelle sous-catégorie"}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsSubCategoryModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brand-warm-gray hover:bg-brand-soft-white hover:text-brand-charcoal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {subError && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-brand-red/30 bg-brand-red/10 p-3 text-xs font-bold text-brand-red">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{subError}</span>
                </div>
              )}

              <form onSubmit={handleSaveSubCategory} className="space-y-4">
                <CustomSelect
                  label="Catégorie Parente *"
                  value={parentCategoryIdForSub}
                  onChange={(e) => setParentCategoryIdForSub(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </CustomSelect>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                    Nom de la sous-catégorie *
                  </label>
                  <input
                    type="text"
                    value={subName}
                    onChange={(e) => handleSubNameChange(e.target.value)}
                    placeholder="Ex: Cartes de Visite Soft-Touch"
                    className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/60 py-2.5 px-4 text-xs font-bold text-brand-charcoal focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    value={subSlug}
                    onChange={(e) => setSubSlug(e.target.value)}
                    placeholder="cartes-visite-soft-touch"
                    className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/60 py-2.5 px-4 text-xs font-mono text-brand-charcoal focus:border-brand-red focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                    Description (optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={subDescription}
                    onChange={(e) => setSubDescription(e.target.value)}
                    placeholder="Détails du rayon / sous-catégorie..."
                    className="w-full rounded-xl border border-brand-light-gray bg-brand-soft-white/60 py-2 px-4 text-xs font-medium text-brand-charcoal focus:border-brand-red focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-brand-light-gray/70">
                  <button
                    type="button"
                    onClick={() => setIsSubCategoryModalOpen(false)}
                    className="rounded-full border border-brand-light-gray px-5 py-2 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-red px-6 py-2 text-xs font-extrabold text-white hover:bg-brand-red-hover shadow-sm"
                  >
                    {editingSubCategory ? "Enregistrer" : "Ajouter la sous-catégorie"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Premium Delete Confirmation Modal ──────────────────────── */}
        <DeleteConfirmModal
          isOpen={deleteModalState.isOpen}
          onClose={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={deleteModalState.onConfirm}
          title={deleteModalState.title}
          itemName={deleteModalState.itemName}
          description={deleteModalState.description}
          blockedReason={deleteModalState.blockedReason}
        />
      </div>
    </AdminLayout>
  );
}
