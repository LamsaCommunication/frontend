"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  Box,
  Upload,
  AlertCircle,
  CheckCircle2,
  Coffee,
  Shirt,
  Disc,
  Sparkles,
  Loader2
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { CustomSelect } from "@/components/ui/custom-select";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { usePaginatedApi } from "@/lib/hooks/usePaginatedApi";
import { productsApi } from "@/lib/api/lamsa-api";
import { useCatalogStore, Product, Product3DModelType } from "@/lib/store/useCatalogStore";

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const initialAction = searchParams.get("action");

  const { categories } = useCatalogStore();

  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [selectedCatId, setSelectedCatId] = React.useState<string>("ALL");

  // Debounce search
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(id);
  }, [search]);

  // ── Server-side paginated products fetch ─────────────────────────────────
  const {
    data: products,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    refetch
  } = usePaginatedApi<Product>({
    url: "/api/v1/products/admin/all",
    limit: 15,
    params: {
      categoryId: selectedCatId !== "ALL" ? selectedCatId : undefined,
      search: debouncedSearch || undefined
    },
    deps: [selectedCatId, debouncedSearch]
  });

  // Drawer / Modal state for Add & Edit
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null);

  // Form states
  const [formName, setFormName] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formDescription, setFormDescription] = React.useState("");
  const [formCategoryId, setFormCategoryId] = React.useState(categories[0]?.id || "");
  const [formSubCategoryId, setFormSubCategoryId] = React.useState("");
  const [formPrice, setFormPrice] = React.useState<number>(3500);
  const [formStock, setFormStock] = React.useState<number>(100);
  const [formMinQuantity, setFormMinQuantity] = React.useState<number>(1);
  const [formDimensions, setFormDimensions] = React.useState("85 x 55 mm");
  const [formHas3D, setFormHas3D] = React.useState(false);
  const [formModelType, setFormModelType] = React.useState<Product3DModelType>("mug");
  const [formAvailableColors, setFormAvailableColors] = React.useState<string[]>([
    "#ffffff",
    "#141414",
    "#e30613"
  ]);
  const [customHexInput, setCustomHexInput] = React.useState("#2563eb");
  const [formImages, setFormImages] = React.useState<string[]>(["/lamsa2.png"]);
  const [formFeatured, setFormFeatured] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null);

  const [addedProductId, setAddedProductId] = React.useState<string | null>(null);

  // Sync default category when categories load from database
  React.useEffect(() => {
    if (!formCategoryId && categories.length > 0) {
      setFormCategoryId(categories[0].id);
    }
  }, [categories, formCategoryId]);

  // Open drawer if redirected with ?action=add or ?action=new
  React.useEffect(() => {
    if (initialAction === "add" || initialAction === "new") {
      handleOpenCreate();
    }
  }, [initialAction]);

  const selectedCategoryObj = categories.find((c) => c.id === formCategoryId);

  const handleOpenCreate = () => {
    setEditingProductId(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormCategoryId(categories[0]?.id || "");
    setFormSubCategoryId("");
    setFormPrice(3500);
    setFormStock(100);
    setFormMinQuantity(1);
    setFormDimensions("85 x 55 mm");
    setFormHas3D(false);
    setFormModelType("mug");
    setFormAvailableColors(["#ffffff", "#141414", "#e30613"]);
    setFormImages(["/lamsa2.png"]);
    setFormFeatured(false);
    setFormError(null);
    setFormSuccess(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProductId(product.id);
    setFormName(product.name);
    setFormSlug(product.slug);
    setFormDescription(product.description);
    setFormCategoryId(product.categoryId);
    setFormSubCategoryId(product.subCategoryId || "");
    setFormPrice(product.price);
    setFormStock(product.stock);
    setFormMinQuantity(product.minQuantity || 1);
    setFormDimensions(product.dimensions || "");
    const is3D = product.modelType && product.modelType !== "none";
    setFormHas3D(Boolean(is3D));
    setFormModelType(is3D ? (product.modelType as Product3DModelType) : "mug");
    setFormAvailableColors(
      product.availableColors && product.availableColors.length > 0
        ? product.availableColors
        : ["#ffffff", "#141414", "#e30613"]
    );
    setFormImages(
      product.images && product.images.length > 0 ? product.images : ["/lamsa2.png"]
    );
    setFormFeatured(Boolean(product.featured));
    setFormError(null);
    setFormSuccess(null);
    setIsDrawerOpen(true);
  };

  const toggleAvailableColor = (hex: string) => {
    setFormAvailableColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]
    );
  };

  const handleAddCustomColor = () => {
    if (customHexInput && !formAvailableColors.includes(customHexInput)) {
      setFormAvailableColors((prev) => [...prev, customHexInput]);
    }
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingProductId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormSlug(generatedSlug);
    }
  };

  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const promises = fileArray.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          resolve(uploadEvent.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((newImages) => {
      if (formHas3D) {
        // When 3D is active: only 1 image allowed
        setFormImages([newImages[0]]);
      } else {
        // When 3D is inactive: multiple images allowed
        setFormImages((prev) => {
          const filtered = prev.filter((img) => img !== "/lamsa2.png");
          return [...filtered, ...newImages];
        });
      }
    });
  };

  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      return updated.length > 0 ? updated : ["/lamsa2.png"];
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim()) {
      setFormError("Veuillez renseigner le nom du produit.");
      return;
    }
    if (!formSlug.trim()) {
      setFormError("Veuillez renseigner le slug unique du produit.");
      return;
    }
    if (formPrice <= 0) {
      setFormError("Le prix doit être supérieur à 0 DZD.");
      return;
    }

    const finalModelType: Product3DModelType = formHas3D ? formModelType : "none";
    const finalAvailableColors = formHas3D ? undefined : formAvailableColors;
    const finalImages = formHas3D
      ? [formImages[0] || "/lamsa2.png"]
      : (formImages.length > 0 ? formImages : ["/lamsa2.png"]);

    try {
      if (editingProductId) {
        await productsApi.update(editingProductId, {
          name: formName.trim(),
          slug: formSlug.trim(),
          description: formDescription.trim() || "Produit personnalisé de haute qualité.",
          categoryId: formCategoryId,
          subCategoryId: formSubCategoryId || undefined,
          price: Number(formPrice),
          stock: Number(formStock),
          minQuantity: Number(formMinQuantity),
          dimensions: formDimensions.trim() || undefined,
          modelType: finalModelType,
          availableColors: finalAvailableColors,
          images: finalImages,
          featured: formFeatured,
        });
        setFormSuccess("Produit mis à jour avec succès !");
      } else {
        await productsApi.create({
          name: formName.trim(),
          slug: formSlug.trim(),
          description: formDescription.trim() || "Produit personnalisé de haute qualité.",
          categoryId: formCategoryId,
          subCategoryId: formSubCategoryId || undefined,
          price: Number(formPrice),
          stock: Number(formStock),
          minQuantity: Number(formMinQuantity),
          dimensions: formDimensions.trim() || undefined,
          modelType: finalModelType,
          availableColors: finalAvailableColors,
          images: finalImages,
          isActive: true,
          featured: formFeatured,
        });
        setFormSuccess("Produit ajouté avec succès au catalogue !");
      }

      setTimeout(() => {
        setIsDrawerOpen(false);
        setFormSuccess(null);
        refetch(); // Refresh list from DB after save
      }, 800);
    } catch (err: any) {
      console.error("Save product error:", err);
      setFormError(err.response?.data?.message || "Erreur lors de la sauvegarde.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black text-brand-charcoal sm:text-3xl">
              Gestion du Catalogue Produits
            </h1>
            <p className="mt-1 text-xs text-brand-warm-gray">
              Créez, modifiez et gérez les articles, stocks, tarifs et modèles 3D directement ici.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-red-hover hover:shadow-[0_6px_20px_-6px_rgba(227,6,19,0.5)] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Ajouter un produit</span>
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-brand-light-gray bg-white p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-warm-gray" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher par nom, format..."
              className="w-full rounded-full border border-brand-light-gray bg-brand-soft-white/60 py-2 pl-9 pr-4 text-xs font-medium text-brand-charcoal placeholder-brand-warm-gray focus:border-brand-red focus:bg-white focus:outline-none"
            />
          </div>

          <div className="w-full sm:w-64">
            <CustomSelect
              value={selectedCatId}
              onChange={(e) => {
                setSelectedCatId(e.target.value);
                setPage(1);
              }}
              aria-label="Filtrer par catégorie"
              className="py-2 text-xs"
            >
              <option value="ALL">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </CustomSelect>
          </div>
        </div>

        {/* Products Table Container */}
        <div className="overflow-hidden rounded-3xl border border-brand-light-gray bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-brand-light-gray bg-brand-soft-white/60 text-brand-warm-gray uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-4">Produit & Visuel</th>
                  <th className="py-3.5 px-4">Catégorie</th>
                  <th className="py-3.5 px-4">Prix Unitaire</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Modèle 3D</th>
                  <th className="py-3.5 px-4">Statut</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light-gray/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-red" />
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-xs text-brand-red font-bold">
                      {error}
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-brand-warm-gray">
                      Aucun produit ne correspond à votre recherche.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => {
                    const cat = categories.find((c) => c.id === prod.categoryId);
                    const sub = cat?.subCategories.find((s) => s.id === prod.subCategoryId);
                    const has3DModel = prod.modelType && prod.modelType !== "none";

                    return (
                      <tr
                        key={prod.id}
                        className="hover:bg-brand-soft-white/50 transition-colors"
                      >
                        {/* Media & Title */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-brand-light-gray bg-brand-soft-white p-1">
                              <Image
                                src={prod.images[0] || "/lamsa2.png"}
                                alt={prod.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-brand-charcoal block line-clamp-1">
                                {prod.name}
                              </span>
                              <span className="text-[10px] text-brand-warm-gray font-mono">
                                slug: {prod.slug}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category & Sub-Category */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-brand-dark block">
                            {cat?.name || "Général"}
                          </span>
                          {sub && (
                            <span className="text-[10px] text-brand-warm-gray font-medium">
                              ↳ {sub.name}
                            </span>
                          )}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-black text-brand-charcoal">
                          {prod.price.toLocaleString()}{" "}
                          <span className="text-xs text-brand-red font-bold">DZD</span>
                        </td>

                        {/* Stock */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${prod.stock > 50
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                          >
                            {prod.stock} unités
                          </span>
                        </td>

                        {/* 3D Model Badge */}
                        <td className="py-3.5 px-4">
                          {has3DModel ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-red/10 border border-brand-red/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-red">
                              <Box className="h-3 w-3" />
                              {prod.modelType === "mug"
                                ? "Mug 3D"
                                : prod.modelType === "tshirt"
                                  ? "T-Shirt 3D"
                                  : prod.modelType === "cap"
                                    ? "Casquette 3D"
                                    : `${prod.modelType} 3D`}
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-brand-warm-gray">
                              2D Standard
                            </span>
                          )}
                        </td>

                        {/* Active Toggle Switch */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={async () => {
                              await productsApi.toggleStatus(prod.id, !prod.isActive);
                              refetch();
                            }}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${prod.isActive ? "bg-emerald-500" : "bg-gray-300"
                              }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${prod.isActive ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(prod)}
                              title="Modifier le produit"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-gray bg-white text-brand-charcoal hover:border-brand-red hover:text-brand-red transition-colors cursor-pointer"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            {/* View on Public Store */}
                            <Link
                              href={`/shop/${prod.slug}`}
                              target="_blank"
                              title="Voir sur la boutique"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-gray bg-white text-brand-charcoal hover:border-brand-red hover:text-brand-red transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>

                            {/* Delete Button — Hard Delete from DB */}
                            <button
                              type="button"
                              onClick={async () => {
                                if (confirm(`Supprimer "${prod.name}" définitivement ?`)) {
                                  try {
                                    await productsApi.delete(prod.id);
                                    refetch();
                                  } catch (err: any) {
                                    console.error("Erreur de suppression:", err);
                                    alert(err.response?.data?.message || "Impossible de supprimer ce produit. Il est peut-être lié à des commandes.");
                                  }
                                }
                              }}
                              title="Supprimer le produit"
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-light-gray bg-white text-brand-warm-gray hover:border-brand-red hover:text-brand-red transition-colors cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Server-side Pagination */}
          <PaginationBar
            pagination={pagination}
            page={page}
            setPage={setPage}
            label="produits"
          />
        </div>

        {/* ── Slide-Over Modal for Add & Edit Product ── */}
        <AnimatePresence>
          {isDrawerOpen && (
            <div className="fixed inset-0 z-50 overflow-hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              />

              <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 300 }}
                  className="flex w-screen max-w-2xl flex-col bg-white shadow-2xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-brand-light-gray px-6 py-5">
                    <div>
                      <h2 className="text-lg font-black text-brand-charcoal">
                        {editingProductId ? "Modifier le produit" : "Ajouter un nouveau produit"}
                      </h2>
                      <p className="text-xs text-brand-warm-gray">
                        Configurez les tarifs, modèle 3D et visuels du produit.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-brand-charcoal hover:bg-brand-soft-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Form Body */}
                  <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {formError && (
                      <div className="flex items-center gap-2 rounded-2xl border border-brand-red/30 bg-brand-red/10 p-3.5 text-xs font-bold text-brand-red">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {formSuccess && (
                      <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                        <span>{formSuccess}</span>
                      </div>
                    )}

                    {/* Section 1: Informations */}
                    <div className="rounded-2xl border border-brand-light-gray/80 bg-brand-soft-white/40 p-5 space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-brand-charcoal border-b border-brand-light-gray/60 pb-2">
                        1. Informations Générales
                      </h3>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                          Nom du produit *
                        </label>
                        <input
                          type="text"
                          value={formName}
                          onChange={(e) => handleNameChange(e.target.value)}
                          placeholder="Ex: Cartes de Visite Soft-Touch"
                          className="w-full rounded-xl border border-brand-light-gray bg-white py-2.5 px-4 text-xs font-bold text-brand-charcoal focus:border-brand-red focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                          Slug URL *
                        </label>
                        <input
                          type="text"
                          value={formSlug}
                          onChange={(e) => setFormSlug(e.target.value)}
                          placeholder="cartes-visite-soft-touch"
                          className="w-full rounded-xl border border-brand-light-gray bg-white py-2.5 px-4 text-xs font-mono text-brand-charcoal focus:border-brand-red focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CustomSelect
                          label="Catégorie Principale *"
                          value={formCategoryId}
                          onChange={(e) => {
                            setFormCategoryId(e.target.value);
                            setFormSubCategoryId("");
                          }}
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </CustomSelect>

                        <CustomSelect
                          label="Sous-Catégorie"
                          value={formSubCategoryId}
                          onChange={(e) => setFormSubCategoryId(e.target.value)}
                        >
                          <option value="">(Aucune sous-catégorie)</option>
                          {selectedCategoryObj?.subCategories.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        </CustomSelect>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Caractéristiques techniques, finitions..."
                          className="w-full rounded-xl border border-brand-light-gray bg-white py-2.5 px-4 text-xs font-medium text-brand-charcoal focus:border-brand-red focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    {/* Section 2: Tarification & Format */}
                    <div className="rounded-2xl border border-brand-light-gray/80 bg-brand-soft-white/40 p-5 space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-brand-charcoal border-b border-brand-light-gray/60 pb-2">
                        2. Tarifs & Inventaire
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                            Prix (DZD) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formPrice}
                            onChange={(e) => setFormPrice(Number(e.target.value))}
                            className="w-full rounded-xl border border-brand-light-gray bg-white py-2.5 px-4 text-xs font-black text-brand-charcoal focus:border-brand-red focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                            Quantité Min.
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={formMinQuantity}
                            onChange={(e) => setFormMinQuantity(Number(e.target.value))}
                            className="w-full rounded-xl border border-brand-light-gray bg-white py-2.5 px-4 text-xs font-bold text-brand-charcoal focus:border-brand-red focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                            Stock
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={formStock}
                            onChange={(e) => setFormStock(Number(e.target.value))}
                            className="w-full rounded-xl border border-brand-light-gray bg-white py-2.5 px-4 text-xs font-bold text-brand-charcoal focus:border-brand-red focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block mb-1">
                          Dimensions / Format
                        </label>
                        <input
                          type="text"
                          value={formDimensions}
                          onChange={(e) => setFormDimensions(e.target.value)}
                          placeholder="Ex: 85 x 55 mm, 20x30 cm..."
                          className="w-full rounded-xl border border-brand-light-gray bg-white py-2.5 px-4 text-xs font-medium text-brand-charcoal focus:border-brand-red focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Section 3: Modèle 3D Optionnel & Médias */}
                    <div className="rounded-2xl border border-brand-light-gray/80 bg-brand-soft-white/40 p-5 space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-wider text-brand-charcoal border-b border-brand-light-gray/60 pb-2">
                        3. Studio 3D (Optionnel) & Visuels
                      </h3>

                      {/* Optional 3D Toggle */}
                      <div className="flex items-center justify-between rounded-xl border border-brand-light-gray bg-white p-3.5 shadow-xs">
                        <div>
                          <span className="text-xs font-bold text-brand-charcoal block">
                            Activer la personnalisation 3D
                          </span>
                          <span className="text-[11px] text-brand-warm-gray">
                            Active le studio interactif 3D WebGL pour ce produit
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const nextVal = !formHas3D;
                            setFormHas3D(nextVal);
                            if (nextVal && formImages.length > 1) {
                              setFormImages([formImages[0]]);
                            }
                          }}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formHas3D ? "bg-brand-red" : "bg-gray-300"
                            }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formHas3D ? "translate-x-5" : "translate-x-0"
                              }`}
                          />
                        </button>
                      </div>

                      {/* 3D Mesh Type Visual Cards Selector */}
                      {formHas3D && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 pt-2"
                        >
                          <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                            Choisissez le modèle 3D exact :
                          </label>

                          <div className="grid grid-cols-3 gap-3">
                            {/* Option 1: Mug */}
                            <button
                              type="button"
                              onClick={() => setFormModelType("mug")}
                              className={`group relative flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${formModelType === "mug"
                                  ? "border-brand-red bg-brand-red/5 ring-2 ring-brand-red/20 shadow-xs"
                                  : "border-brand-light-gray bg-white hover:border-brand-charcoal/30 hover:bg-brand-soft-white"
                                }`}
                            >
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${formModelType === "mug"
                                    ? "bg-brand-red text-white"
                                    : "bg-brand-soft-white text-brand-charcoal group-hover:bg-white"
                                  }`}
                              >
                                <Coffee className="h-6 w-6" />
                              </div>
                              <span className="mt-2 text-xs font-bold text-brand-charcoal">
                                Mug / Tasse
                              </span>
                              <span className="text-[10px] text-brand-warm-gray">
                                Céramique 360°
                              </span>

                              {formModelType === "mug" && (
                                <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-white">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </div>
                              )}
                            </button>

                            {/* Option 2: T-Shirt */}
                            <button
                              type="button"
                              onClick={() => setFormModelType("tshirt")}
                              className={`group relative flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${formModelType === "tshirt"
                                  ? "border-brand-red bg-brand-red/5 ring-2 ring-brand-red/20 shadow-xs"
                                  : "border-brand-light-gray bg-white hover:border-brand-charcoal/30 hover:bg-brand-soft-white"
                                }`}
                            >
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${formModelType === "tshirt"
                                    ? "bg-brand-red text-white"
                                    : "bg-brand-soft-white text-brand-charcoal group-hover:bg-white"
                                  }`}
                              >
                                <Shirt className="h-6 w-6" />
                              </div>
                              <span className="mt-2 text-xs font-bold text-brand-charcoal">
                                T-Shirt
                              </span>
                              <span className="text-[10px] text-brand-warm-gray">
                                Textile Coton
                              </span>

                              {formModelType === "tshirt" && (
                                <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-white">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </div>
                              )}
                            </button>

                            {/* Option 3: Cap */}
                            <button
                              type="button"
                              onClick={() => setFormModelType("cap")}
                              className={`group relative flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all cursor-pointer ${formModelType === "cap"
                                  ? "border-brand-red bg-brand-red/5 ring-2 ring-brand-red/20 shadow-xs"
                                  : "border-brand-light-gray bg-white hover:border-brand-charcoal/30 hover:bg-brand-soft-white"
                                }`}
                            >
                              <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${formModelType === "cap"
                                    ? "bg-brand-red text-white"
                                    : "bg-brand-soft-white text-brand-charcoal group-hover:bg-white"
                                  }`}
                              >
                                <Disc className="h-6 w-6" />
                              </div>
                              <span className="mt-2 text-xs font-bold text-brand-charcoal">
                                Casquette
                              </span>
                              <span className="text-[10px] text-brand-warm-gray">
                                Baseball 3D
                              </span>

                              {formModelType === "cap" && (
                                <div className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-white">
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                </div>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* Mode 2D: Available Colors Manager */}
                      {!formHas3D && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3 pt-2"
                        >
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                              Couleurs Disponibles pour la Page Produit :
                            </label>
                            <span className="text-[10px] font-bold text-brand-warm-gray">
                              {formAvailableColors.length} sélectionnée{formAvailableColors.length > 1 ? "s" : ""}
                            </span>
                          </div>
                          <p className="text-[11px] text-brand-warm-gray leading-relaxed">
                            Sélectionnez les déclinaisons de couleurs proposées aux clients sur la page produit standard.
                          </p>

                          {/* Preset Palette Swatches */}
                          <div className="flex flex-wrap items-center gap-2">
                            {[
                              { name: "Blanc", hex: "#ffffff" },
                              { name: "Noir", hex: "#141414" },
                              { name: "Rouge Lamsa", hex: "#e30613" },
                              { name: "Bleu Marine", hex: "#1e3a8a" },
                              { name: "Bleu Royal", hex: "#2563eb" },
                              { name: "Vert Émeraude", hex: "#10b981" },
                              { name: "Or / Jaune", hex: "#f59e0b" },
                              { name: "Gris", hex: "#9ca3af" },
                              { name: "Kraft", hex: "#d97706" },
                              { name: "Rose", hex: "#ec4899" },
                            ].map((swatch) => {
                              const isSelected = formAvailableColors.some(
                                (c) => c.toLowerCase() === swatch.hex.toLowerCase()
                              );
                              return (
                                <button
                                  key={swatch.hex}
                                  type="button"
                                  onClick={() => toggleAvailableColor(swatch.hex)}
                                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${isSelected
                                      ? "border-brand-charcoal bg-brand-charcoal text-white shadow-xs"
                                      : "border-brand-light-gray bg-white text-brand-charcoal hover:border-brand-red/40"
                                    }`}
                                >
                                  <span
                                    className="h-3 w-3 rounded-full border border-black/20"
                                    style={{ backgroundColor: swatch.hex }}
                                  />
                                  <span>{swatch.name}</span>
                                  {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                </button>
                              );
                            })}
                          </div>

                          {/* Custom Color Input */}
                          <div className="flex items-center gap-2 pt-1">
                            <div className="flex items-center gap-2 rounded-xl border border-brand-light-gray bg-white px-3 py-1.5 shadow-2xs">
                              <input
                                type="color"
                                value={customHexInput}
                                onChange={(e) => setCustomHexInput(e.target.value)}
                                className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent"
                              />
                              <input
                                type="text"
                                value={customHexInput}
                                onChange={(e) => setCustomHexInput(e.target.value)}
                                placeholder="#HEX"
                                className="w-20 text-xs font-mono font-bold uppercase text-brand-charcoal focus:outline-none"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={handleAddCustomColor}
                              className="rounded-xl bg-brand-charcoal px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-red transition-colors cursor-pointer"
                            >
                              + Ajouter cette couleur
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {/* ── Image Upload: Single if 3D is ON, Multiple if 3D is OFF ── */}
                      <div className="pt-2 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal block">
                            {formHas3D
                              ? "Visuel Produit 3D (1 seule image principale)"
                              : "Galerie Photos Produit (Multiples images)"}
                          </label>
                          <span className="rounded-full bg-brand-soft-white px-2.5 py-0.5 text-[10px] font-bold text-brand-charcoal border border-brand-light-gray">
                            {formHas3D
                              ? "Mode 3D : 1 Image max"
                              : `${formImages.length} image${formImages.length > 1 ? "s" : ""}`}
                          </span>
                        </div>

                        <p className="text-[11px] text-brand-warm-gray leading-relaxed">
                          {formHas3D
                            ? "Ce produit dispose d'une personnalisation 3D interactive. Une seule photo principale est requise pour la miniature du catalogue."
                            : "Ce produit standard (sans 3D) peut comporter plusieurs photos. Vous pouvez téléverser plusieurs angles et détails."}
                        </p>

                        {formHas3D ? (
                          /* ── 3D Mode: Single Image Upload ── */
                          <div className="flex items-center gap-3 pt-1">
                            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-brand-light-gray bg-white p-1.5 shadow-sm">
                              <img
                                src={formImages[0] || "/lamsa2.png"}
                                alt="Aperçu 3D"
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="inline-flex items-center gap-1.5 rounded-full border border-brand-light-gray bg-white px-3.5 py-1.5 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white transition-colors cursor-pointer shadow-2xs">
                                <Upload className="h-3.5 w-3.5 text-brand-red" />
                                <span>Changer l&apos;image 3D</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImagesUpload}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-[10px] text-brand-warm-gray font-medium">
                                PNG, JPG ou WebP (1 seule image)
                              </span>
                            </div>
                          </div>
                        ) : (
                          /* ── Standard 2D Mode: Multiple Images Gallery ── */
                          <div className="space-y-3 pt-1">
                            <div className="grid grid-cols-4 gap-2.5">
                              {formImages.map((imgUrl, idx) => (
                                <div
                                  key={idx}
                                  className="group relative aspect-square rounded-2xl border border-brand-light-gray bg-white p-1.5 overflow-hidden shadow-2xs"
                                >
                                  <img
                                    src={imgUrl}
                                    alt={`Photo ${idx + 1}`}
                                    className="h-full w-full object-contain"
                                  />
                                  {idx === 0 && (
                                    <span className="absolute bottom-1 left-1 rounded bg-brand-charcoal/80 px-1 py-0.2 text-[8px] font-bold text-white uppercase">
                                      Principale
                                    </span>
                                  )}
                                  {formImages.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(idx)}
                                      title="Supprimer cette photo"
                                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-charcoal text-white hover:bg-brand-red opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              ))}

                              {/* Add more images box */}
                              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-light-gray hover:border-brand-red bg-white hover:bg-brand-soft-white text-brand-warm-gray hover:text-brand-red transition-all shadow-2xs p-2 text-center">
                                <Plus className="h-5 w-5 mb-1" />
                                <span className="text-[10px] font-bold">Ajouter photo</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={handleImagesUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                            <span className="text-[10px] text-brand-warm-gray block">
                              Vous pouvez sélectionner plusieurs images en même temps. La première image est la photo principale.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-brand-light-gray">
                      <button
                        type="button"
                        onClick={() => setIsDrawerOpen(false)}
                        className="rounded-full border border-brand-light-gray bg-white px-5 py-2.5 text-xs font-bold text-brand-charcoal hover:bg-brand-soft-white transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="rounded-full bg-brand-red px-6 py-2.5 text-xs font-extrabold text-white shadow-sm hover:bg-brand-red-hover hover:shadow-[0_6px_20px_-6px_rgba(227,6,19,0.5)] transition-all cursor-pointer"
                      >
                        {editingProductId ? "Enregistrer les modifications" : "Publier le produit"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
}

export default function AdminProductsPage() {
  return (
    <React.Suspense fallback={null}>
      <AdminProductsContent />
    </React.Suspense>
  );
}
