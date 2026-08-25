export default function StatCard({ label, value, icon: Icon, tone = "maroon" }) {
  const tones = {
    maroon: "bg-maroon/10 text-maroon",
    saffron: "bg-saffron/10 text-saffron",
    veg: "bg-veg/10 text-veg",
    gold: "bg-gold/10 text-gold",
  };
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-brown/50">{label}</p>
        <p className="text-xl font-bold text-brown">{value}</p>
      </div>
    </div>
  );
}
