import Script from "next/script";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { MotionProvider } from "./motion/MotionProvider";
import { THEME_BOOT_SCRIPT } from "./theme/boot";
import { WeatherProvider } from "./weather/WeatherProvider";

import "@/styles/main.css";
import "@/styles/app.css";
import "@/styles/home.css";
import "@/styles/print.css";
import "@/styles/transitions.css";

const GOOGLE_FONTS = [
  "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
  "https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap",
  "https://fonts.googleapis.com/css2?family=Rubik+Scribble&display=swap",
  "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
];

/** <html>/<body> shared by the English and French root layouts. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    // Boot scripts add classes to <html>/<body> before hydration (theme, intro loader, page classes).
    <html lang={locale} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router root layout owns <head> */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {GOOGLE_FONTS.map((font) => (
          <link key={font} rel="stylesheet" href={font} />
        ))}
        <script src="https://kit.fontawesome.com/cbf2b0968a.js" crossOrigin="anonymous" async></script>
        <meta name="msapplication-TileColor" content="#ffffff" />
      </head>
      <body className="loaded" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
        <MotionProvider>
          <WeatherProvider>{children}</WeatherProvider>
        </MotionProvider>
        {/*
          Ionicons upgrades every <ion-icon> by adding attributes to it, so it must
          only run after React has hydrated — otherwise React reports a mismatch.
        */}
        <Script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
