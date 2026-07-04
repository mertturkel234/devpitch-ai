export type GithubRepo = {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
};

export type GithubProfile = {
  username: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  profileUrl: string;
  topRepos: GithubRepo[];
  languages: string[];
};

export type GithubProfileResult =
  | { success: true; data: GithubProfile }
  | { success: false; error: string };
