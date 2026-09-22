import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Package, Users, ArrowUpRight } from 'lucide-react';

export default async function HomePage() {
  const session = await getSession();

  // Validação estrita para evitar erros no servidor
  if (!session) redirect('/login');
  if (!session.storeId) redirect('/setup');

  // Procurar métricas no banco de dados com a garantia do storeId
  const [productsCount, customersCount, ordersCount] = await Promise.all([
    prisma.product.count({ where: { storeId: session.storeId } }),
    prisma.customer.count({ where: { storeId: session.storeId } }),
    prisma.order.count({ where: { storeId: session.storeId } }),
  ]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {session.name || 'Bem-vindo'} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Acompanhe o resumo da sua loja em tempo real.
        </p>
      </div>

      {/* Cards de Atalho/Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/orders/new"
          className="bg-blue-600 text-white p-5 rounded-2xl shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-blue-100 font-medium">Ação Rápida</p>
            <p className="text-lg font-bold mt-1">Nova Venda</p>
          </div>
          <div className="p-3 bg-white/10 rounded-xl">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </Link>

        <Link
          href="/products"
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Produtos</p>
            <p className="text-2xl font-bold text-gray-900">{productsCount}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
        </Link>

        <Link
          href="/customers"
          className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Clientes</p>
            <p className="text-2xl font-bold text-gray-900">{customersCount}</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Resumo de Vendas */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900">Total de Vendas Registadas</h2>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">{ordersCount}</p>
        </div>
        <Link
          href="/orders/new"
          className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          Registrar Venda <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}