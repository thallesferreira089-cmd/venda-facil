import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VendaFácil',
  description: 'Sistema de Gestão e Vendas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}