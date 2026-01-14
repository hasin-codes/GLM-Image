"use client";

import CreatePage from "../../create/page";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useHistory } from "@/store/generationHistory";

export default function CreateSessionPage() {
    const params = useParams();
    // In a real app, we might use the ID to load a specific session state
    // For now, we reuse the CreatePage. The ID in the URL allows deep linking.

    return <CreatePage sessionId={params.id as string} />;
}
