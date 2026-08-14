"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CONCEPT_CHATS_CHANGED_EVENT,
  loadConceptChats,
  type ConceptChatHistoryItem,
} from "@/lib/concept-chats-store";

export function useConceptChats() {
  const [chats, setChats] = useState<ConceptChatHistoryItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setChats(loadConceptChats());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(CONCEPT_CHATS_CHANGED_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(CONCEPT_CHATS_CHANGED_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  return { chats, ready, refresh };
}
