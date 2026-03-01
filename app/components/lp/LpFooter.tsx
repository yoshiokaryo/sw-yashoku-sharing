import Link from "next/link";

export function LpFooter() {
  return (
    <footer className="mt-12 pt-8 border-t border-gray-700 flex flex-wrap justify-between items-start gap-6">
      <nav className="[&>a]:block [&>a]:text-gray-400 [&>a]:no-underline [&>a]:mb-1.5 [&>a]:text-[0.95rem] [&>a:hover]:text-lp-accent" aria-label="フッターナビ">
        <Link href="/">トップ.</Link>
        <a href="#">お店の皆さまへ.</a>
        <a href="#">お問いあわせ</a>
      </nav>
      <div className="[&>a]:block [&>a]:text-gray-400 [&>a]:no-underline [&>a]:mb-1.5 [&>a]:text-[0.95rem] [&>a:hover]:text-lp-accent">
        <a href="#">運営会社.</a>
        <a href="#">FAQ</a>
      </div>
      <div className="flex gap-3">
        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-300 no-underline font-bold text-sm hover:bg-gray-700" aria-label="X">X</a>
        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-300 no-underline font-bold text-sm hover:bg-gray-700" aria-label="Instagram">@</a>
        <a href="#" className="w-10 h-10 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center text-gray-300 no-underline font-bold text-sm hover:bg-gray-700" aria-label="Facebook">f</a>
      </div>
      <div className="w-full text-center font-bold text-2xl mt-4 text-gray-200" style={{ fontFamily: "var(--font-rounded), sans-serif" }}>レス飯。</div>
    </footer>
  );
}
