"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getMe } from "@/lib/api";

type Profile = { display_name?: string; allergies?: string[] };

export default function AccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    getMe()
      .then((res: unknown) => {
        if (res && typeof res === "object" && "_unauthorized" in res) {
          router.replace("/auth/login");
          return;
        }
        setProfile(res as Profile);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "取得に失敗しました"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <p className="text-gray-600">読み込み中…</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-[600px] mx-auto">
      <h1 className="text-xl font-bold mb-4">アカウント</h1>
      {profile && (
        <div className="space-y-2 mb-6">
          <p><strong>表示名</strong> <span>{profile.display_name ?? "-"}</span></p>
          <p><strong>アレルギー</strong> <span>{Array.isArray(profile.allergies) && profile.allergies.length ? profile.allergies.join(", ") : "-"}</span></p>
        </div>
      )}
      <Link href="/" className="inline-block py-2 px-4 bg-gray-500 text-white rounded-lg no-underline">
        ログアウト
      </Link>
    </div>
  );
}
