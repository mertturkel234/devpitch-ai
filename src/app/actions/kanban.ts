"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function updateApplicationStatus(applicationId: string, newStatus: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Giriş yapmanız gerekiyor." };
  }

  try {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!app || app.userId !== session.user.id) {
      return { success: false, error: "Yetkisiz işlem veya başvuru bulunamadı." };
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { status: newStatus },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update application status", error);
    return { success: false, error: "Veritabanı güncellenirken bir hata oluştu." };
  }
}
