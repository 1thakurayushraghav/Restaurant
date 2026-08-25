import { Star } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import { formatPrice } from "../../utils/format";

export function ConfirmDialog({ isOpen, onClose, onConfirm, title = "Are you sure?", description, confirmLabel = "Confirm", danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      {description && <p className="text-brown/70 mb-6">{description}</p>}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          className={danger ? "!bg-nonveg hover:!bg-nonveg/90" : ""}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function Price({ amount, size = "md", strike }) {
  const sizes = { sm: "text-sm", md: "text-base font-semibold", lg: "text-2xl font-bold" };
  return (
    <span className={`${sizes[size]} ${strike ? "line-through text-brown/40 font-normal" : "text-maroon"}`}>
      {formatPrice(amount)}
    </span>
  );
}

export function Rating({ value, count, size = "sm" }) {
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <span className="inline-flex items-center gap-1">
      <Star className={`${starSize} fill-gold text-gold`} />
      <span className="font-semibold text-sm">{value}</span>
      {count !== undefined && <span className="text-sm text-brown/50">({count}+)</span>}
    </span>
  );
}
