import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Providers from "@/src/components/Providers";

export const metadata: Metadata = {
  title: "Generic Landing Page",
  description: "Landing page",
};

// Inline script to apply persisted theme color before paint (avoids flash)
const themeScript = `
(function () {
  try {
    var primary = localStorage.getItem("theme-primary-color");
    if (primary && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(primary)) {
      var adjust = function (hex, amount) {
        var r = parseInt(hex.slice(1, 3), 16),
          g = parseInt(hex.slice(3, 5), 16),
          b = parseInt(hex.slice(5, 7), 16);
        if (amount > 0) {
          r = Math.round(r + (255 - r) * amount);
          g = Math.round(g + (255 - g) * amount);
          b = Math.round(b + (255 - b) * amount);
        } else {
          r = Math.round(r * (1 + amount));
          g = Math.round(g * (1 + amount));
          b = Math.round(b * (1 + amount));
        }
        return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
      };
      var root = document.documentElement;
      root.style.setProperty("--color-brand-50", adjust(primary, 0.92));
      root.style.setProperty("--color-brand-100", adjust(primary, 0.85));
      root.style.setProperty("--color-brand-200", adjust(primary, 0.7));
      root.style.setProperty("--color-brand-300", adjust(primary, 0.5));
      root.style.setProperty("--color-brand-400", adjust(primary, 0.25));
      root.style.setProperty("--color-brand-500", primary);
      root.style.setProperty("--color-brand-600", adjust(primary, -0.15));
      root.style.setProperty("--color-brand-700", adjust(primary, -0.3));
      root.style.setProperty("--color-brand-800", adjust(primary, -0.45));
      root.style.setProperty("--color-brand-900", adjust(primary, -0.6));
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
