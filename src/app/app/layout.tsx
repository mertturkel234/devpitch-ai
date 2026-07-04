import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "GitHub kullanıcı adınızı ve hedef iş ilanını girin; yapay zeka sizin için profesyonel bir cover letter hazırlasın.",
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
