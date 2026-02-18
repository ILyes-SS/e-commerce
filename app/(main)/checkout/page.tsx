import React from "react";
import CheckoutForm from "@/components/CheckoutForm";
import { getUser } from "@/lib/supabase/server";
import { getWilayas } from "@/actions/order";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase securely.",
  robots: { index: false, follow: false },
};

const CheckoutPage = async () => {
  const user = await getUser();
  const wilayas = await getWilayas();

  return <CheckoutForm user={user} wilayas={wilayas} />;
};

export default CheckoutPage;
