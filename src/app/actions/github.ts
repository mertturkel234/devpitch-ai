"use server";

import type { GithubProfileResult, GithubRepo } from "@/types/github";

const GITHUB_API = "https://api.github.com";
const HEADERS: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "DevPitch.ai",
  "X-GitHub-Api-Version": "2022-11-28",
};

// Opsiyonel: .env dosyasına GITHUB_TOKEN eklenirse limit 60/saat'ten 5000/saat'e çıkar.
if (process.env.GITHUB_TOKEN) {
  HEADERS.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

type GithubUserResponse = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
};

type GithubRepoResponse = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  archived: boolean;
};

export async function getGithubProfile(
  rawUsername: string
): Promise<GithubProfileResult> {
  const username = rawUsername.trim().replace(/^@/, "");

  if (!username) {
    return { success: false, error: "Lütfen bir GitHub kullanıcı adı girin." };
  }

  // Basit format doğrulaması: GitHub kullanıcı adları harf, rakam ve tire içerir.
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return {
      success: false,
      error: "Geçerli bir GitHub kullanıcı adı girin (özel karakter kullanmayın).",
    };
  }

  try {
    const userRes = await fetch(`${GITHUB_API}/users/${username}`, {
      headers: HEADERS,
      cache: "no-store",
    });

    if (userRes.status === 404) {
      return {
        success: false,
        error: `"${username}" adında bir GitHub kullanıcısı bulunamadı. Kullanıcı adını kontrol edip tekrar deneyin.`,
      };
    }

    if (userRes.status === 403) {
      return {
        success: false,
        error: "GitHub API istek limitine ulaşıldı. Lütfen birkaç dakika sonra tekrar deneyin.",
      };
    }

    if (!userRes.ok) {
      return {
        success: false,
        error: "GitHub profili alınırken beklenmeyen bir hata oluştu.",
      };
    }

    const user = (await userRes.json()) as GithubUserResponse;

    const reposRes = await fetch(
      `${GITHUB_API}/users/${username}/repos?per_page=100&sort=pushed&direction=desc`,
      { headers: HEADERS, cache: "no-store" }
    );

    if (reposRes.status === 403) {
      return {
        success: false,
        error: "GitHub API istek limitine ulaşıldı. Lütfen birkaç dakika sonra tekrar deneyin.",
      };
    }

    if (!reposRes.ok) {
      return {
        success: false,
        error: "Kullanıcının repoları alınırken bir hata oluştu.",
      };
    }

    const repos = (await reposRes.json()) as GithubRepoResponse[];

    // Fork'lanmış ve arşivlenmiş repoları eleyip gerçek/özgün projelere odaklan.
    const originalRepos = repos.filter((r) => !r.fork && !r.archived);
    const pool = originalRepos.length > 0 ? originalRepos : repos;

    const topRepos: GithubRepo[] = [...pool]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 5)
      .map((r) => ({
        name: r.name,
        description: r.description,
        url: r.html_url,
        stars: r.stargazers_count,
        language: r.language,
      }));

    // Kullanılan dillerin sıklığına göre en öne çıkan dilleri belirle.
    const languageCounts = new Map<string, number>();
    for (const r of pool) {
      if (!r.language) continue;
      languageCounts.set(r.language, (languageCounts.get(r.language) ?? 0) + 1);
    }
    const languages = [...languageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([lang]) => lang);

    if (topRepos.length === 0) {
      return {
        success: false,
        error: `"${username}" kullanıcısının herkese açık bir reposu bulunmuyor. Analiz için en az bir repo gerekiyor.`,
      };
    }

    return {
      success: true,
      data: {
        username: user.login,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url,
        topRepos,
        languages,
      },
    };
  } catch {
    return {
      success: false,
      error: "GitHub'a bağlanırken bir sorun oluştu. İnternet bağlantınızı kontrol edin.",
    };
  }
}
