import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const dmsans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "FemReset — Acompanhamento de Jejum Intermitente",
  description: "O aplicativo de jejum intermitente personalizado que entende o corpo de mulheres acima de 39 anos. Desenvolvido para sua jornada de bem-estar.",
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="pt-BR">
      <body className={`${playfair.variable} ${dmsans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
