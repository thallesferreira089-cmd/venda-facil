import { prisma } from '../../lib/prisma';
import { getSession } from '../../lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.storeId) redirect('/login');

  // Calcular datas para "Hoje" e "Este Mês"
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Ir buscar todos os pedidos do mês atual
  const monthOrders = await prisma.order.findMany({
    where: { 
      storeId: session.storeId,
      createdAt: { gte: startOfMonth }
    }
  });

  // Filtrar os pedidos que foram feitos apenas hoje
  const todayOrders = monthOrders.filter(order => order.createdAt >= startOfDay);

  // Fazer as contas
  const vendasHoje = todayOrders.reduce((sum, order) => sum + Number(order.total), 0);
  const pedidosHoje = todayOrders.length;
  const vendasMes = monthOrders.reduce((sum, order) => sum + Number(order.total), 0);
  
  // Como não guardámos o custo individual na venda, mostramos o Ticket Médio em vez de Lucro
  const ticketMedio = monthOrders.length > 0 ? (vendasMes / monthOrders.length) : 0;

  // Ir buscar os 5 pedidos mais recentes para a lista
  const recentOrders = await prisma.order.findMany({
    where: { storeId: session.storeId },
    include: { customer: true },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="mt-4">
        <h1 className="text-2xl font-bold text-gray-900">Olá! 👋</h1>
        <p className="text-gray-500 text-sm">Aqui está o resumo da sua loja hoje.</p>
      </header>

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-blue-600 font-semibold mb-1 flex items-center gap-1">
            <span>💰</span> Vendas Hoje
          </p>
          <p className="text-xl font-bold text-gray-900">R$ {vendasHoje.toFixed(2).replace('.', ',')}</p>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-blue-600 font-semibold mb-1 flex items-center gap-1">
            <span>📦</span> Pedidos Hoje
          </p>
          <p className="text-xl font-bold text-gray-900">{pedidosHoje}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
            <span>📅</span> Vendas Mês
          </p>
          <p className="text-xl font-bold text-gray-900">R$ {vendasMes.toFixed(2).replace('.', ',')}</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold mb-1 flex items-center gap-1">
            <span>📊</span> Ticket Médio
          </p>
          <p className="text-xl font-bold text-gray-900">R$ {ticketMedio.toFixed(2).replace('.', ',')}</p>
        </div>
      </div>

      {/* Lista de Pedidos Recentes */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Pedidos Recentes</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {recentOrders.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 text-center">Ainda sem vendas registadas.</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-sm text-gray-900">
                    {order.customer?.name || 'Cliente Balcão'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-gray-900">
                    R$ {Number(order.total).toFixed(2).replace('.', ',')}
                  </p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    Concluído
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}