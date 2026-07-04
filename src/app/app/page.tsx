import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./client-page";

export default async function DashboardPage() {
  const session = await auth();
  let initialCredits = 0;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    });
    initialCredits = user?.credits ?? 0;
  }

  return <DashboardClient initialCredits={initialCredits} />;
}
