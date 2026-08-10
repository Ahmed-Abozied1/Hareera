"use client";

import { useSyncExternalStore } from "react";

/** مفيش مصدر خارجي نشترك فيه — إحنا بس عايزين قيمة مختلفة على السيرفر وعلى المتصفح. */
const subscribeToNothing = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * false على السيرفر وفي أول رندر، true بعد الـ hydration.
 * البديل الرسمي لنمط `useState(false)` + `useEffect(() => setMounted(true))`،
 * اللي بقى ممنوع لأنه بيعمل رندر زيادة لكل كومبوننت.
 */
export const useIsClient = () =>
  useSyncExternalStore(subscribeToNothing, onClient, onServer);
