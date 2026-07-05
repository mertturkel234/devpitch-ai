"use server";

import { auth } from "@/app/api/auth/[...nextauth]/route";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-06-24.dahlia",
});

export async function createCheckoutSession() {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Giriş yapmanız gerekiyor." };
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "DevPitch.ai Pro - 10 Credits",
              description: "10 adet profesyonel cover letter oluşturma hakkı.",
            },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/app?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/app?canceled=true`,
      client_reference_id: session.user.id,
      metadata: {
        userId: session.user.id,
        credits: "10",
      },
    });

    return { success: true, url: checkoutSession.url };
  } catch (err: any) {
    return { success: false, error: err.message || "Ödeme oturumu başlatılamadı." };
  }
}
