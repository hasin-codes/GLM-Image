"use client";

import { useState, useEffect } from "react";
import { History, Loader2 } from "lucide-react";
import Image from "next/image";

interface HistoryItem {
    id: string;
    imageUrl: string;
    originalPrompt: string;
    betterPrompt: string;
    aspectRatio: string;
    createdAt: string;
}

interface SidebarLeftProps {
    onSelectGeneration?: (item: HistoryItem) => void;
    currentGenerationId?: string;
}

export function SidebarLeft({ onSelectGeneration, currentGenerationId }: SidebarLeftProps) {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHistory() {
            try {
                setLoading(true);
                const res = await fetch('/api/history?limit=20');
                if (!res.ok) return;
                const data = await res.json();
                setItems(data.generations || []);
            } catch {
                // Silently fail - user might not be signed in
            } finally {
                setLoading(false);
            }
        }
        fetchHistory();
    }, []);

    // Refresh history when a new generation is created
    useEffect(() => {
        if (currentGenerationId) {
            // Refetch to include new generation
            fetch('/api/history?limit=20')
                .then(res => res.json())
                .then(data => setItems(data.generations || []))
                .catch(() => { });
        }
    }, [currentGenerationId]);

    return (
        <nav className="flex h-full flex-col items-center py-4 gap-4 bg-[#0a0a0a] overflow-hidden">
            {/* History Icon Header */}
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800">
                <History className="h-4 w-4 text-zinc-400" />
            </div>

            {/* History Thumbnails */}
            <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-2">
                {loading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-600" />
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-[10px] text-zinc-600 text-center px-2 py-4">
                        No history yet
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {items.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => onSelectGeneration?.(item)}
                                className={`
                                    relative w-full aspect-square rounded-lg overflow-hidden 
                                    border-2 transition-all duration-200 group
                                    ${currentGenerationId === item.id
                                        ? 'border-blue-500 shadow-lg shadow-blue-500/20'
                                        : 'border-transparent hover:border-zinc-700'
                                    }
                                `}
                            >
                                <Image
                                    src={item.imageUrl}
                                    alt={item.originalPrompt.slice(0, 50)}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    sizes="60px"
                                />
                                {/* Hover overlay with prompt preview */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1">
                                    <p className="text-[8px] text-white line-clamp-2 leading-tight">
                                        {item.originalPrompt.slice(0, 40)}...
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
