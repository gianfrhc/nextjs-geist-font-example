import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Plataforma de Visualización de Datos",
  description: "Visualiza datos desde archivos TXT con formato CSV de manera rápida y eficiente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="w-full">
      <body className={`${inter.className} w-full p-0 m-0`}>
        <div className="w-full min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
