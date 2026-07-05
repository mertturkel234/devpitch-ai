import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { MotionProvider } from "@/components/motion/motion-provider";

const siteUrl = "https://devpitch.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DevPitch.ai — GitHub Profilinizi İş Teklifine Dönüştürün",
    template: "%s · DevPitch.ai",
  },
  description:
    "GitHub profilinizi ve hedef iş ilanını analiz eden yapay zeka, yurt dışı şirketlere gönderilecek profesyonel bir cover letter hazırlar. 3 başvuru ücretsiz.",
  keywords: [
    "cover letter oluşturucu",
    "GitHub cover letter",
    "yapay zeka iş başvurusu",
    "yurt dışı iş başvurusu",
    "developer job application",
    "AI cold email geliştirici",
  ],
  authors: [{ name: "DevPitch.ai" }],
  category: "technology",
  alternates: { canonical: siteUrl },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "DevPitch.ai",
    title: "GitHub Profilinizi Yurt Dışı İş Tekliflerine Dönüştürün",
    description:
      "GitHub'daki gerçek projelerinizden örnekler vererek, hedef iş ilanına özel profesyonel bir İngilizce cover letter oluşturun.",
  },
  twitter: {
    card: "summary",
    title: "DevPitch.ai — GitHub Profilinizi İş Teklifine Dönüştürün",
    description:
      "GitHub verilerinizi ve iş ilanını analiz eden yapay zeka ile saniyeler içinde profesyonel bir cover letter oluşturun.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Providers } from "@/components/providers";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <MotionProvider>
              {children}
              <Toaster position="bottom-right" />
            </MotionProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
