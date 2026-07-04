"use server";

import OpenAI from "openai";
import type { GithubProfile } from "@/types/github";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export type GeneratePitchResult =
  | { success: true; data: string }
  | { success: false; error: string };

const MODEL = "gpt-4o-mini";

function getSystemPrompt(language: string, tone: string) {
  return `Sen profesyonel bir teknik işe alım ve kariyer danışmanısın. Verilen GitHub profil verilerini ve hedef iş ilanını analiz et. Geliştiricinin GitHub'daki gerçek projelerinden örnekler vererek, iş ilanındaki şartları nasıl karşıladığını anlatan, ${language} dilinde ve ${tone} bir tonda profesyonel bir Cold Email / Cover Letter yaz.`;
}

function buildUserPrompt(profile: GithubProfile, jobPost: string, language: string, tone: string): string {
  const repoLines = profile.topRepos
    .map(
      (r) =>
        `- ${r.name} (${r.language ?? "dil belirtilmemiş"}, ${r.stars} ⭐)${
          r.description ? `: ${r.description}` : ""
        }`
    )
    .join("\n");

  return `GITHUB PROFİLİ
Kullanıcı adı: ${profile.username}
İsim: ${profile.name ?? "belirtilmemiş"}
Bio: ${profile.bio ?? "belirtilmemiş"}
Öne çıkan diller: ${profile.languages.join(", ") || "belirtilmemiş"}

EN POPÜLER PROJELER
${repoLines}

HEDEF İŞ İLANI
${jobPost}

Yukarıdaki verileri kullanarak, sistem talimatında belirtilen formatta ${language} dilinde ve ${tone} bir tonda Cold Email / Cover Letter yaz. Markdown formatı kullanabilirsin (kısa paragraflar, gerekirse madde işaretleri). Uydurma proje veya deneyim ekleme; sadece verilen repoları referans al.`;
}

export async function generateCoverLetter(
  profile: GithubProfile,
  jobPost: string,
  language: string = "İngilizce",
  tone: string = "Profesyonel ve İkna Edici"
): Promise<GeneratePitchResult> {
  if (!jobPost.trim()) {
    return { success: false, error: "Lütfen bir iş ilanı metni girin." };
  }

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Giriş yapmanız gerekiyor." };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.credits <= 0) {
    return { success: false, error: "Yeterli krediniz bulunmuyor." };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      error: "OPENAI_API_KEY tanımlı değil.",
    };
  }

  try {
    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: MODEL,
      temperature: 0.7,
      messages: [
        { role: "system", content: getSystemPrompt(language, tone) },
        { role: "user", content: buildUserPrompt(profile, jobPost, language, tone) },
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "Yapay zeka bir yanıt üretemedi. Lütfen tekrar deneyin.",
      };
    }

    // Başarılı olursa krediyi düş ve geçmişi kaydet
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { decrement: 1 } },
      }),
      prisma.coverLetter.create({
        data: {
          userId: session.user.id,
          username: profile.username,
          jobPost,
          content,
        },
      }),
    ]);

    return { success: true, data: content };
  } catch (err) {
    const message =
      err instanceof OpenAI.APIError
        ? mapOpenAiError(err)
        : "Yapay zeka servisine bağlanırken bir hata oluştu.";
    return { success: false, error: message };
  }
}

function mapOpenAiError(err: InstanceType<typeof OpenAI.APIError>): string {
  if (err.status === 401) {
    return "OpenAI API anahtarı geçersiz.";
  }
  if (err.status === 429) {
    return "OpenAI kullanım limitine ulaşıldı.";
  }
  return `OpenAI hatası: ${err.message}`;
}
