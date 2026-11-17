import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Cupcake Gourmet",
    template: "%s | Cupcake Gourmet",
  },
  description:
    "Cupcakes artesanais gourmet para todos os momentos. Sabores clássicos, especiais, veganos e sem glúten.",
  keywords: ["cupcake", "gourmet", "artesanal", "encomenda", "confeitaria"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
