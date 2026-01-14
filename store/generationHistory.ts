import { GenerationResult } from "@/types";
import { useState, useEffect } from "react";

export interface HistoryItem extends GenerationResult {
    id: string;
}

class HistoryStore {
    private items: HistoryItem[] = [];
    private listeners: Set<() => void> = new Set();

    constructor() {
        // Load from localStorage if available (client-side only)
        if (typeof window !== 'undefined') {
            /* 
            // Uncomment for persistence
            const saved = localStorage.getItem('glm_history');
            if (saved) {
                this.items = JSON.parse(saved);
            }
            */
        }
    }

    getItems() {
        return this.items;
    }

    getItem(id: string) {
        return this.items.find(item => item.id === id);
    }

    addItem(item: HistoryItem) {
        this.items = [item, ...this.items];
        this.notify();
    }

    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notify() {
        this.listeners.forEach(listener => listener());
        // localStorage.setItem('glm_history', JSON.stringify(this.items));
    }
}

export const historyStore = new HistoryStore();

export function useHistory() {
    const [items, setItems] = useState<HistoryItem[]>(historyStore.getItems());

    useEffect(() => {
        const unsubscribe = historyStore.subscribe(() => {
            setItems(historyStore.getItems());
        });
        return () => { unsubscribe(); };
    }, []);

    return {
        items,
        addGeneration: (item: HistoryItem) => historyStore.addItem(item),
        getGeneration: (id: string) => historyStore.getItem(id),
    };
}
