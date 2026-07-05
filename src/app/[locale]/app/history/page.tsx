import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { KanbanBoard } from "@/components/kanban-board";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      coverLetter: {
        select: {
          id: true,
          content: true,
          jobPost: true,
        }
      }
    }
  });

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-12 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">İş Başvuruları Pano</h1>
        <p className="mt-1.5 text-sm text-muted">
          Hazırladığınız cover letter'lar ve başvuru durumlarınızı sürükle-bırak ile takip edin.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <KanbanBoard initialApplications={applications} />
      </div>
    </div>
  );
}
