"use client";

import { useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth-client";

/** شكل الرد بتاع better-auth — بنشتقه من العميل نفسه بدل ما نكتبه بإيدنا. */
type SessionResult = Awaited<ReturnType<typeof authClient.getSession>>;

export const useSession = () => {
  const [data, setData] = useState<SessionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await authClient.getSession();
      setData(res);
      return res;
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, refetch };
};