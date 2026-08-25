import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { bulkOrderApi } from "../services/miscApi";
import { Input, Select } from "../components/ui/FormElements";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/Toast";

const EVENT_TYPES = [
  { value: "WEDDING", label: "Wedding" },
  { value: "BIRTHDAY", label: "Birthday" },
  { value: "PARTY", label: "Party" },
  { value: "CORPORATE", label: "Corporate" },
  { value: "FESTIVAL", label: "Festival" },
  { value: "RELIGIOUS", label: "Religious Event" },
  { value: "RETURN_GIFTS", label: "Return Gifts" },
  { value: "OTHER", label: "Other" },
];

export default function BulkOrders() {
  const [form, setForm] = useState({
    name: "", phone: "", eventType: "WEDDING", eventDate: "", peopleCount: "",
    products: "", quantity: "", location: "", budget: "", message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bulkOrderApi.create({
        ...form,
        peopleCount: form.peopleCount ? Number(form.peopleCount) : undefined,
      });
      setSubmitted(true);
      showToast("Enquiry submitted! We'll get back to you shortly.", "success");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Bulk & Event Orders — Shree Munnalal</title>
        <meta name="description" content="Order sweets and food in bulk for weddings, birthdays, corporate events, and festivals." />
      </Helmet>
      <div className="container-app py-8 max-w-xl">
        <h1 className="text-2xl sm:text-3xl mb-2">Bulk & Event Orders</h1>
        <p className="text-brown/60 mb-6">
          Weddings, birthdays, parties, corporate events, festivals, religious events, and return gifts.
        </p>

        {submitted ? (
          <div className="card p-6 text-center">
            <h2 className="font-semibold text-lg mb-2">Thank you!</h2>
            <p className="text-brown/70">Your enquiry has been received. We'll contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-5 space-y-4">
            <Input label="Your Name" required value={form.name} onChange={update("name")} />
            <Input label="Mobile Number" required type="tel" value={form.phone} onChange={update("phone")} />
            <Select label="Event Type" value={form.eventType} onChange={update("eventType")}>
              {EVENT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </Select>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Event Date" type="date" value={form.eventDate} onChange={update("eventDate")} />
              <Input label="Number of People" type="number" value={form.peopleCount} onChange={update("peopleCount")} />
            </div>
            <Input label="Products Interested In" value={form.products} onChange={update("products")} placeholder="e.g. Kaju Katli, Motichoor Laddu" />
            <Input label="Approximate Quantity" value={form.quantity} onChange={update("quantity")} placeholder="e.g. 50kg" />
            <Input label="Delivery Location" value={form.location} onChange={update("location")} />
            <Input label="Budget (optional)" value={form.budget} onChange={update("budget")} />
            <Input label="Additional Message" value={form.message} onChange={update("message")} />
            <Button type="submit" loading={submitting} className="w-full">
              Submit Enquiry
            </Button>
          </form>
        )}
      </div>
    </>
  );
}
