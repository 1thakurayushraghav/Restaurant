import { Banknote, Smartphone, CreditCard } from "lucide-react";

const OPTIONS = [
  { value: "COD", label: "Cash on Delivery", icon: Banknote },
  // { value: "UPI", label: "UPI (Pay on Delivery)", icon: Smartphone },
  // { value: "RAZORPAY", label: "Pay Online (Cards/UPI/Wallets)", icon: CreditCard },
];

export default function PaymentOptions({ value, onChange }) {
  return (
    <div className="space-y-2">
      {OPTIONS.map(({ value: v, label, icon: Icon }) => (
        <label
          key={v}
          className={`flex items-center gap-3 p-3 rounded-xl2 border cursor-pointer transition-colors ${
            value === v ? "border-maroon bg-maroon/5" : "border-brown/15 bg-white"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={v}
            checked={value === v}
            onChange={() => onChange(v)}
            className="accent-maroon"
          />
          <Icon className="w-5 h-5 text-brown/60" />
          <span className="text-sm font-medium">{label}</span>
        </label>
      ))}
    </div>
  );
}
