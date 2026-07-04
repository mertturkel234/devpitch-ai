import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CoverLetterCard } from "@/components/cover-letter-card";

export default async function HistoryPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const history = await prisma.coverLetter.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Geçmiş Başvurularınız</h1>
        <p className="mt-1.5 text-sm text-muted">
          Daha önce oluşturduğunuz kapak mektupları.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16 border rounded-xl border-dashed">
          <h3 className="font-medium text-foreground mb-1.5">Henüz mektup yok</h3>
          <p className="text-sm text-muted max-w-xs">
            Önce bir cover letter oluşturun, ardından burada listelenecektir.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {history.map((letter) => (
            <div key={letter.id} className="border rounded-xl p-6 bg-surface">
              <div className="flex justify-between items-start mb-4 border-b pb-4">
                <div>
                  <div className="font-medium">Hedef İlan:</div>
                  <div className="text-sm text-muted line-clamp-2 max-w-2xl mt-1">
                    {letter.jobPost}
                  </div>
                </div>
                <div className="text-xs text-muted">
                  {letter.createdAt.toLocaleDateString("tr-TR")}
                </div>
              </div>
              <CoverLetterCard content={letter.content} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
