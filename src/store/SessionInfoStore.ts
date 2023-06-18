import { create } from 'zustand';

export interface SessionInfo {
  id: string;
  lang: string;
  name: string;
}

type Store = {
  session: SessionInfo | null;
  setSession: (session: SessionInfo | null) => void;
};

export const useSessionInfo = create<Store>((set) => ({
  session: null,
  setSession: (session) => set({ session })
}));

export function updateSessionName(newName: string) {
  useSessionInfo.setState((prev) => {
    if (!prev.session) return prev; // do nothing if session is null
    return {
      ...prev,
      session: {
        ...prev.session,
        name: newName // update the name property
      }
    };
  });
}
