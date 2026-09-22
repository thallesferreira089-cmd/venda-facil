import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Package, Users, ArrowUpRight, DollarSign, Calendar, TrendingUp } from 'lucide-react';

export default async function HomePage() {
  const session = await getSession();

  if (!session) redirect('/login');
  if (!session.storeId) redirect('/setup');

  const now = new Date();
  
  // Início do dia atual (00:00:00)
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Início do mês atual (1º dia às 00:00:00)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Consultas ao banco de dados em paralelo
  const [
    productsCount,
    customersCount,
    ordersCount,
    salesToday,
    salesMonth,
    totalRevenueAggregate,
  ] = await Promise.all([
    prisma.product.count({ where: { storeId: session.storeId } }),
    prisma.customer.count({ where: { storeId: session.storeId } }),
    prisma.order.count({ where: { storeId: session.storeId } }),
    
    // Vendas realizadas hoje
    prisma.order.aggregate({
      where: {
        storeId: session.storeId,
        createdAt: { gte: startOfDay },
      },
      _sum: { total: true },
      _count: { id: true },
    }),

    // Vendas realizadas este mês
    prisma.order.aggregate({
      where: {
        storeId: session.storeId,
        createdAt: { gte: startOfMonth },
      },
      _sum: { total: true },
      _count: { id: true },
    }),

    // Faturamento total acumulado
    prisma.order.aggregate({
      where: { storeId: session.storeId },
      _sum: { total: true },
    }),
  ]);

  const formatCurrency = (val: any) => {
    const numericValue = val ? Number(val) : 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);
  };

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

      {/* Ações Rápidas e Resumo Principal */}
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

      {/* Métricas Financeiras e Períodos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Vendas de Hoje */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendas Hoje</span>
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {formatCurrency(salesToday._sum.total)}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {salesToday._count.id} {salesToday._count.id === 1 ? 'venda realizada' : 'vendas realizadas'}
          </p>
        </div>

        {/* Vendas do Mês */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendas no Mês</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {formatCurrency(salesMonth._sum.total)}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            {salesMonth._count.id} {salesMonth._count.id === 1 ? 'venda este mês' : 'vendas este mês'}
          </p>
        </div>

        {/* Faturamento Total */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Acumulado</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">
            {formatCurrency(totalRevenueAggregate._sum.total)}
          </p>
          <p className="text-xs text-gray-500 font-medium">
            Em {ordersCount} {ordersCount === 1 ? 'pedido total' : 'pedidos totais'}
          </p>
        </div>
      </div>

      {/* Resumo e Acesso Rápido a Pedidos */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900">Total de Pedidos Registados</h2>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">{ordersCount}</p>
        </div>
        <Link
          href="/orders/new"
          className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700"
        >
          Registar Venda <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}