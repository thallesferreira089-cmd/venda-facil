import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Importa o menu que estava no ficheiro 7 do código anterior
import { MobileNav } from "../components/mobile-nav"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VendaFácil",
  description: "Controle as suas vendas num só lugar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      {/* pb-20 garante que o conteúdo não fica escondido atrás do menu no telemóvel */}
      <body className={`${inter.className} bg-gray-50 pb-20 md:pb-0`}>
        <main className="max-w-5xl mx-auto min-h-screen">
          {children}
        </main>
        
        {/* O Menu Inferior fixo */}
        <MobileNav />
      </body>
    </html>
  );
}