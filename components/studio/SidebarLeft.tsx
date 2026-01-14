import { Home, History } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SidebarLeft() {
    return (
        <nav className="flex h-full flex-col items-center py-6 gap-8 bg-[#0a0a0a]">
            {/* Home Link Removed */}

            {/* Tools / History */}
            <div className="flex flex-col gap-4">
                <NavButton icon={History} active />
            </div>
        </nav>
    );
}

function NavButton({ icon: Icon, active }: { icon: any; active?: boolean }) {
    return (
        <button
            className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300",
                active
                    ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-white"
            )}
        >
            <Icon className="h-5 w-5" />
        </button>
    );
}
