import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gonzalo Arigos - Mis Propiedades",
  description: "Catálogo de propiedades para comprar",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
