"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navBase = "rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:text-panda-primary md:px-4 md:text-base";
const navActive = "font-bold text-panda-primary";

export default function Gnb() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 top-0 z-50 h-[60px] w-full border-b border-gray-200 bg-white md:h-[70px]">
      <div className="mx-auto flex h-full max-w-[1200px] items-center px-4 md:px-6">
        <Link href="/" className="shrink-0">
          <img className="block h-10 md:h-[50px]" src="/image/panda.png" alt="판다마켓" />
        </Link>

        <nav className="ml-3 flex gap-0 md:ml-6 md:gap-2">
          <Link
            href="/community"
            className={`${navBase} ${pathname.startsWith("/community") || pathname.startsWith("/articles") ? navActive : ""}`}
          >
            자유게시판
          </Link>
          <Link
            href="/items"
            className={`${navBase} ${pathname.startsWith("/items") ? navActive : ""}`}
          >
            중고마켓
          </Link>
        </nav>

        <button
          className="ml-auto flex h-10 w-20 items-center justify-center rounded-lg bg-panda-primary text-sm font-semibold text-white transition hover:bg-panda-hover active:bg-panda-active md:h-12 md:w-32 md:text-base"
          type="button"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
