"use client";

import { useEffect, useState } from "react";
import { AppButton } from "@/components/common/AppButton";
import { Bell, BellOff } from "lucide-react";
import { useIsClient } from "@/hooks/useIsClient";

export function PushNotificationButton() {
  const isClient = useIsClient();
  const [subscription, setSubscription] = useState<
    "loading" | "subscribed" | "unsubscribed"
  >("loading");

  // دعم المتصفح حاجة نقدر نقراها وقت الرندر، مش حالة محتاجة effect
  const supported =
    isClient && "serviceWorker" in navigator && "PushManager" in window;
  const status = supported ? subscription : "unsupported";

  useEffect(() => {
    if (!supported) return;
    navigator.serviceWorker.register("/sw.js").then(async (reg) => {
      const sub = await reg.pushManager.getSubscription();
      setSubscription(sub ? "subscribed" : "unsubscribed");
    });
  }, [supported]);

  async function subscribe() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sub),
    });
    setSubscription("subscribed");
  }

  async function unsubscribe() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: sub.endpoint }),
      });
      await sub.unsubscribe();
    }
    setSubscription("unsubscribed");
  }

  if (status === "unsupported" || status === "loading") return null;

  return (
    <AppButton
      appVariant={status === "subscribed" ? "secondary" : "primary"}
      onClick={status === "subscribed" ? unsubscribe : subscribe}
      className="gap-2"
    >
      {status === "subscribed" ? (
        <>
          <BellOff className="w-4 h-4" />
          إيقاف الإشعارات
        </>
      ) : (
        <>
          <Bell className="w-4 h-4" />
          تفعيل إشعارات الطلبات
        </>
      )}
    </AppButton>
  );
}
