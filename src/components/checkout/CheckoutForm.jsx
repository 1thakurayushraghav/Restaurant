import { useForm } from "react-hook-form";
import { Input } from "../ui/FormElements";

export default function CheckoutForm({ onSubmit, defaultValues, orderType, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" id="checkout-form">
      <Input
        label="Full Name"
        {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })}
        error={errors.name?.message}
      />
      <Input
        label="Mobile Number"
        type="tel"
        inputMode="numeric"
        {...register("phone", {
          required: "Mobile number is required",
          pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit mobile number" },
        })}
        error={errors.phone?.message}
      />

      {orderType === "DELIVERY" && (
        <>
          <Input
            label="Address"
            {...register("addressLine", { required: "Address is required" })}
            error={errors.addressLine?.message}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Area" {...register("area")} />
            <Input label="Pincode" {...register("pincode")} />
          </div>
          <Input label="Landmark (optional)" {...register("landmark")} />
        </>
      )}

      <Input label="Order Notes (optional)" {...register("notes")} placeholder="Any special instructions?" />
    </form>
  );
}
