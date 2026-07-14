import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";
import { GlobalModalContainer } from "@/components/common/GlobalModalContainer";
import { Providers } from "@/components/common/Providers";
import { FacebookPixel } from "@/components/common/FacebookPixel";
import Script from "next/script";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const sstArabic = localFont({
  src: [   
    {
      path: "../../public/fonts/sst-arabic-roman.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/sst-arabic-medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/sst-arabic-bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sst",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://hareera.vercel.app"),
  title: {
    default: "Hareera حريرة | ملابس نوم وبيتي حريمي - بيجامات وأطقم ساتان",
    template: "%s | Hareera",
  },
  description:
    "حريرة متجر ملابس نوم وبيتي حريمي: بيجامات، أطقم نوم ساتان، روبات، وقمصان نوم. راحتك وأناقتك أولويتنا. الدفع عند الاستلام وشحن لكل محافظات مصر مع استبدال خلال 14 يوم.",
  keywords: [
    "ملابس نوم",
    "بيجامات حريمي",
    "أطقم ساتان",
    "روب",
    "قميص نوم",
    "ملابس بيتي",
    "ملابس نوم حريمي",
    "بيجامة ساتان",
    "دفع عند الاستلام",
    "Hareera",
    "حريرة",
    "ملابس بيتي حريمي",
  ],
  authors: [{ name: "Hareera" }],
  creator: "Hareera",
  publisher: "Hareera",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL ?? "https://hareera.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "https://hareera.vercel.app",
    siteName: "Hareera",
    title: "Hareera حريرة | ملابس نوم وبيتي حريمي - بيجامات وأطقم ساتان",
    description:
      "حريرة متجر ملابس نوم وبيتي حريمي: بيجامات، أطقم نوم ساتان، روبات، وقمصان نوم. الدفع عند الاستلام وشحن لكل محافظات مصر.",
    images: [
      {
        url: "/images/hero-bg.webp",
        width: 1200,
        height: 630,
        alt: "Hareera حريرة - ملابس نوم وبيتي حريمي",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hareera حريرة | ملابس نوم وبيتي حريمي - بيجامات وأطقم ساتان",
    description:
      "حريرة متجر ملابس نوم وبيتي حريمي: بيجامات، أطقم نوم ساتان، روبات، وقمصان نوم. الدفع عند الاستلام وشحن لكل محافظات مصر.",
    images: ["/images/hero-bg.webp"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

  return (
    <html lang="ar" dir="rtl">
      <body className={`${sstArabic.variable} antialiased font-sst`}>
        {pixelId && (
          <>
            <Script
              id="fb-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${pixelId}');
                  fbq('track', 'PageView');
                `,
              }}
            />
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>
          <FacebookPixel />
          <GlobalModalContainer />
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}