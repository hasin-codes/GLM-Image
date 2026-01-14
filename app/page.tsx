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
    <main className="flex min-h-screen flex-col bg-background p-4 md:p-6 lg:p-8 font-outfit select-none">
      {/* Shared Navbar */}
      <div className="mb-6">
        <Navbar currentView={View.HOME} setCurrentView={handleViewChange} />
      </div>

      {/* Main Grid Content */}
      <div className="grid flex-1 grid-cols-12 grid-rows-12 gap-6 h-full min-h-0">
        <FeaturedCard />
        <SideCard />
        <LetsGoCard />
        <StatsCard />
        <AlphaCard />
      </div>
    </main>
  );
}
