import { useEffect } from "react";
import { X } from "lucide-react";

export default function Drawer({ isOpen, onClose, title, children, side = "right" }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const sideClasses = side === "right" ? "right-0" : "left-0";
  const translateClosed = side === "right" ? "translate-x-full" : "-translate-x-full";

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        className={`absolute inset-0 bg-brown/50 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute top-0 ${sideClasses} h-full w-full max-w-md bg-cream shadow-cardHover flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : translateClosed
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-brown/10 bg-white">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 rounded-full hover:bg-brown/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
