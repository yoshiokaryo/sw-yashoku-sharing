"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cartCount } from "@/lib/cart";

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

/** 検索フォーム（URL の q と同期）。useSearchParams 利用のため Suspense でラップして使用 */
function SearchForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const isProductsPage = pathname === "/app/products";
  const qFromUrl = isProductsPage ? (searchParams.get("q") ?? "") : "";

  useEffect(() => {
    setSearchQuery(qFromUrl);
  }, [qFromUrl]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/app/products?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/app/products");
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2 max-w-md">
      <span className="text-gray-400 shrink-0" aria-hidden>
        <SearchIcon />
      </span>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="商品を検索"
        className="flex-1 min-w-0 py-2 px-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lp-accent focus:border-transparent"
        aria-label="商品を検索"
      />
    </form>
  );
}

function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cartCount());
    const interval = setInterval(() => setCount(cartCount()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-gray-200 py-2 px-4">
      <nav className="flex items-center gap-3">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center gap-2 max-w-md py-2 px-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-400">
              <SearchIcon />
              <span className="text-sm">商品を検索</span>
            </div>
          }
        >
          <SearchForm />
        </Suspense>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/app/cart" className="inline-flex items-center justify-center w-10 h-10 text-gray-700 relative" aria-label="カート">
            <CartIcon />
            {count > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-blue-600 text-white text-[0.7rem] min-w-[1.2em] h-5 rounded-full flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </Link>
          <button type="button" onClick={() => setMenuOpen((o) => !o)} className="inline-flex items-center justify-center w-10 h-10 border-none bg-transparent cursor-pointer text-gray-700" aria-label="メニュー">
            <MenuIcon />
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div className="flex flex-col gap-2 py-4 px-4 bg-gray-50 rounded-lg mt-2">
          <Link href="/app/products" className="py-2 text-gray-900 no-underline hover:bg-gray-200 rounded px-2" onClick={() => setMenuOpen(false)}>商品一覧</Link>
          <Link href="/app/suggest" className="py-2 text-gray-900 no-underline hover:bg-gray-200 rounded px-2" onClick={() => setMenuOpen(false)}>AI提案</Link>
          <Link href="/app/cart" className="py-2 text-gray-900 no-underline hover:bg-gray-200 rounded px-2" onClick={() => setMenuOpen(false)}>カート</Link>
          <Link href="/app/account" className="py-2 text-gray-900 no-underline hover:bg-gray-200 rounded px-2" onClick={() => setMenuOpen(false)}>アカウント</Link>
          <Link href="/" className="py-2 text-gray-900 no-underline hover:bg-gray-200 rounded px-2" onClick={() => setMenuOpen(false)}>
            ログアウト
          </Link>
        </div>
      )}
    </header>
  );
}
