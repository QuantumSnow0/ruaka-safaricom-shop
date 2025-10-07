"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "../lipamdogomdogo/components/ChatWidget";

// ===== CONDITIONAL CHAT WIDGET =====
// This component conditionally renders the chat widget
// It excludes the widget from agent dashboard pages to avoid UI conflicts

export default function ConditionalChatWidget() {
  const pathname = usePathname();

  // Don't render chat widget on agent pages
  if (pathname?.startsWith("/agent-")) {
    return null;
  }

  return <ChatWidget />;
}

