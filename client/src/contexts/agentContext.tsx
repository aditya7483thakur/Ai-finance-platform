import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type AgentContextValue = {
  isOpen: boolean;
  draftPrompt: string;
  openAgent: (prompt?: string) => void;
  closeAgent: () => void;
  consumeDraft: () => string;
  setOpen: (open: boolean) => void;
};

const AgentContext = createContext<AgentContextValue | null>(null);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setOpen] = useState(false);
  const [draftPrompt, setDraftPrompt] = useState("");

  const value = useMemo<AgentContextValue>(
    () => ({
      isOpen,
      draftPrompt,
      setOpen,
      openAgent: (prompt = "") => {
        setDraftPrompt(prompt);
        setOpen(true);
      },
      consumeDraft: () => {
        const prompt = draftPrompt;
        setDraftPrompt("");
        return prompt;
      },
      closeAgent: () => {
        setOpen(false);
      },
    }),
    [isOpen, draftPrompt],
  );

  return (
    <AgentContext.Provider value={value}>{children}</AgentContext.Provider>
  );
};

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};
