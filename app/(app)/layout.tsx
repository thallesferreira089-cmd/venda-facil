import Link from 'next/link';
import { Home, Package, Users, ShoppingCart, Menu, ShieldCheck } from 'lucide-react';
import { getSession } from '@/lib/auth';

// 🔑 ID DA SUA LOJA ADMIN
const ADMIN_STORE_ID = "cmu73km7a000127eluyfhqmfw";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const isAdmin = session?.storeId === ADMIN_STORE_ID;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* 🖥️ MENU LATERAL FIXO À ESQUERDA (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4 fixed left-0 top-0 bottom-0 h-full z-40">
        <div className="mb-8 p-2">
          <h1 className="text-2xl font-bold text-blue-600">VendaFácil</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">
            <Home className="w-5 h-5" /> Início
          </Link>
          <Link href="/orders/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">
            <ShoppingCart className="w-5 h-5" /> Nova Venda
          </Link>
          <Link href="/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">
            <Package className="w-5 h-5" /> Produtos
          </Link>
          <Link href="/customers" className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-medium transition-colors">
            <Users className="w-5 h-5" /> Clientes
          </Link>

          {isAdmin && (
            <Link href="/admin" className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-purple-700 font-bold transition-colors">
              <ShieldCheck className="w-5 h-5 text-purple-600" /> Painel Admin
            </Link>
          )}
        </nav>

        <div className="mt-auto">
           <Link href="/menu" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors">
             <Menu className="w-5 h-5" /> Definições
           </Link>
        </div>
      </aside>

      {/* 📄 ÁREA PRINCIPAL DAS PÁGINAS (Com margem esquerda idêntica à largura da sidebar) */}
      <main className="flex-1 md:pl-64 w-full min-h-screen pb-24 md:pb-8">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* 📱 MENU DE FUNDO PARA TELEMÓVEL */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-2 pb-safe z-50">
        <Link href="/" className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <Home className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Início</span>
        </Link>
        <Link href="/products" className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <Package className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Produtos</span>
        </Link>
        
        <div className="relative -top-6">
          <Link href="/orders/new" className="flex items-center justify-center w-14 h-14 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-200 border-4 border-gray-50 hover:bg-blue-700 transition-colors">
            <ShoppingCart className="w-6 h-6" />
          </Link>
        </div>

        <Link href="/customers" className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
          <Users className="w-6 h-6" />
          <span className="text-[10px] mt-1 font-medium">Clientes</span>
        </Link>

        {isAdmin ? (
          <Link href="/admin" className="flex flex-col items-center p-2 text-purple-600 font-bold">
            <ShieldCheck className="w-6 h-6" />
            <span className="text-[10px] mt-1">Admin</span>
          </Link>
        ) : (
          <Link href="/menu" className="flex flex-col items-center p-2 text-gray-500 hover:text-blue-600">
            <Menu className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-medium">Menu</span>
          </Link>
        )}
      </nav>

    </div>
  );
}