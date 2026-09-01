"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

export interface OptionItem {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  options?: OptionItem[];
  children?: React.ReactNode;
  placeholder?: string;
  error?: string;
  helperText?: string;
  className?: string;
  wrapperClassName?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export function CustomSelect({
  label,
  value,
  onChange,
  options,
  children,
  placeholder = "Sélectionner...",
  error,
  helperText,
  className = "",
  wrapperClassName = "",
  disabled = false,
  "aria-label": ariaLabel,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Extract options from either options prop or React <option> children
  const parsedOptions = React.useMemo<OptionItem[]>(() => {
    if (options && options.length > 0) return options;

    const items: OptionItem[] = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child) && (child.type === "option" || typeof child.type === "string")) {
        const props = child.props as { value?: string | number; children?: React.ReactNode };
        const val = props.value !== undefined ? String(props.value) : "";
        const lbl = props.children?.toString() ?? val;
        items.push({ value: val, label: lbl });
      }
    });
    return items;
  }, [options, children]);

  // Find currently selected label
  const selectedOption = parsedOptions.find((opt) => opt.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;

  // Handle click outside to close dropdown
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange({ target: { value: val } });
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full text-left ${wrapperClassName}`}
    >
      {label && (
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-brand-charcoal">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        aria-label={ariaLabel || label}
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`group flex w-full items-center justify-between rounded-xl border bg-white py-2.5 pl-4 pr-3 text-xs font-bold text-brand-charcoal transition-all duration-200 cursor-pointer shadow-xs ${
          isOpen
            ? "border-brand-red ring-2 ring-brand-red/20 shadow-md"
            : "border-brand-light-gray hover:border-brand-charcoal/40 hover:bg-brand-soft-white/40"
        } ${error ? "border-brand-red ring-2 ring-brand-red/20" : ""} ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${className}`}
      >
        <span className="truncate pr-2">{displayLabel}</span>
        <div
          className={`flex h-5 w-5 items-center justify-center rounded-md transition-transform duration-200 ${
            isOpen ? "rotate-180 text-brand-red" : "text-brand-warm-gray"
          }`}
        >
          <ChevronDown className="h-4 w-4 stroke-[2.2]" />
        </div>
      </button>

      {/* Floating Animated Custom Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-2xl border border-brand-light-gray bg-white p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.14)]"
          >
            {parsedOptions.length === 0 ? (
              <div className="py-2.5 px-3 text-center text-xs text-brand-warm-gray">
                Aucune option disponible
              </div>
            ) : (
              parsedOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-brand-charcoal text-white font-bold"
                        : "text-brand-charcoal/80 hover:bg-brand-soft-white hover:text-brand-charcoal"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="h-3.5 w-3.5 text-brand-red flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-1 text-[11px] font-bold text-brand-red">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-[11px] text-brand-warm-gray">{helperText}</p>
      )}
    </div>
  );
}
