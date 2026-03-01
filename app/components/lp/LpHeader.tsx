import Link from "next/link";
import Image from "next/image";

export function LpHeader() {
  return (
    <header className="mb-2 flex justify-between items-center gap-4">
      <Link href="/" className="flex items-center shrink-0" aria-label="レス飯 トップへ">
        <Image
          src="/レス飯.svg"
          alt="レス飯"
          width={360}
          height={90}
          className="h-14 w-auto md:h-20"
          priority
        />
      </Link>
      <nav className="flex items-center gap-2 flex-wrap justify-end" aria-label="メニュー">
        <Link
          href="/auth/login"
          className="inline-block py-2.5 px-5 rounded-lg bg-lp-accent text-white no-underline font-bold text-sm hover:opacity-90"
        >
          ログイン
        </Link>
      </nav>
    </header>
  );
}
