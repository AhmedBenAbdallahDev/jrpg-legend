import Image from "next/image";
import Search from "@/components/Search";
import MobileNav from "@/components/MobileNav";
import { Cog8ToothIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="px-4 flex h-14 shrink-0 items-center gap-4">
      <a href="/" className="flex items-center gap-2">
        <Logo />
      </a>

      <Search />

      <nav className="flex gap-4 md:gap-6">
        <Link href="/settings">
          <Cog8ToothIcon className="w-6 h-6 hover:text-accent transition-colors" />
        </Link>

        <MobileNav />
      </nav>

      <Link
        href="/game/add"
        className="flex items-center gap-1 text-black font-medium bg-accent py-1.5 px-3 rounded-lg transition-colors"
      >
        <PlusCircleIcon className="w-4 h-4" />
        <span>Add Game</span>
      </Link>
    </header>
  );
}
