"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductCategory } from "../constants/size-charts";
import type { SizeProfile } from "../lib/recommend";
import {
  HEIGHT_RANGE,
  WEIGHT_RANGE,
} from "../constants/size-charts";

interface SizeProfileStore {
  profile: SizeProfile | null;
  setProfile: (profile: SizeProfile) => void;
  /** المقاس اللي العميلة اختارته بنفسها — بيغلب التوصية بعد كده */
  confirmSize: (category: ProductCategory, size: string) => void;
  clear: () => void;
}

export const DEFAULT_PROFILE: SizeProfile = {
  height: HEIGHT_RANGE.default,
  weight: WEIGHT_RANGE.default,
  shape: "hourglass",
  fit: "regular",
};

export const useSizeProfile = create<SizeProfileStore>()(
  persist(
    (set) => ({
      profile: null,

      setProfile: (profile) => set({ profile }),

      confirmSize: (category, size) =>
        set((state) =>
          state.profile
            ? {
                profile: {
                  ...state.profile,
                  confirmed: { ...state.profile.confirmed, [category]: size },
                },
              }
            : state
        ),

      clear: () => set({ profile: null }),
    }),
    {
      name: "hareera-size-profile",
      storage: createJSONStorage(() => localStorage),
      // السيرفر مش شايف localStorage، فلو رطّبنا وقت إنشاء الستور الرندر
      // الأول هيختلف عن السيرفر ويحصل hydration mismatch. بنرطّب بعد المونت.
      skipHydration: true,
    }
  )
);
