import { create } from 'zustand';

interface ModalStore {
  isOpen: boolean;
  view: string | null;
  /** حمولة المودال — كل مودال بيعرّف شكل الـ data بتاعته في الـ props بتاعته. */
  data: unknown;
  open: (view: string, data?: unknown) => void;
  close: () => void;
  setView: (view: string) => void;
  setData: (data: unknown) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  view: null,
  data: undefined,
  open: (view, data = undefined) =>
    set({
      view,
      isOpen: true,
      data,
    }),
  close: () => set({ 
    isOpen: false, 
    view: null, 
    data: undefined 
  }),
  setView: (view) => set({ view }),
  setData: (data) => set({ data }),
}));

/** يقرا حقل نصي من حمولة المودال (زي email أو token) من غير الرجوع لـ any. */
export const modalText = (data: unknown, key: string): string | undefined => {
  if (!data || typeof data !== "object") return undefined;
  const value = (data as Record<string, unknown>)[key];
  return typeof value === "string" ? value : undefined;
};