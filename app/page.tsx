"use client";

import { FeaturedCard } from "@/components/FeaturedCard";
import { SideCard } from "@/components/SideCard";
import { LetsGoCard } from "@/components/LetsGoCard";
import { StatsCard } from "@/components/StatsCard";
import { AlphaCard } from "@/components/AlphaCard";
import { Navbar } from "@/components/Navbar";
import { View } from "@/types";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const handleViewChange = (view: View) => {
    if (view === View.GENERATE) router.push("/create");
    if (view === View.DISCOVER) router.push("/discover");
  };

  return (
    <main className="flex min-h-screen flex-col bg-background p-4 lg:p-8 font-outfit select-none pb-24 lg:pb-8">
      {/* Shared Navbar */}
      <div className="mb-6 lg:mb-6">
        <Navbar currentView={View.HOME} setCurrentView={handleViewChange} />
      </div>

      {/* Main Grid Content */}
      <div className="grid flex-1 grid-cols-2 lg:grid-cols-12 lg:grid-rows-12 gap-4 lg:gap-6 h-auto lg:h-full lg:min-h-0">
        <FeaturedCard />
        <SideCard />
        <LetsGoCard />
        <StatsCard />
        <AlphaCard />
      </div>

      <div className="py-4 text-center">
        <p className="text-zinc-600 text-sm font-sora">
          <a href="https://hasin.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition-colors">A Hasin Raiyan Creation</a>
        </p>
      </div>
    </main>
  );
}
