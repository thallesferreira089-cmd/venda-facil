import Link from 'next/link';
import { ShoppingBag, Plus, Search, Receipt } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  const session = await getSession();
  if (!session?.storeId) redirect('/login');

  // Vai buscar as vendas à base de dados e inclui os dados do cliente
  const orders = await prisma.order.findMany({
    where: { storeId: session.storeId },
    include: {
      customer: true, 
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex justify-between items-center mt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 text-sm">Histórico de vendas da sua loja.</p>
        </div>
        <Link href="/orders/new" className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 flex items-center shadow-sm">
          <Plus className="w-5 h-5" />
        </Link>
      </header>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
        <input 
          type="text" 
          placeholder="Procurar pedido..." 
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-white shadow-sm"
        />
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center flex flex-col items-center shadow-sm">
          <div className="bg-green-50 p-4 rounded-full mb-4">
            <ShoppingBag className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhuma venda</h3>
          <p className="text-gray-500 text-sm mb-4">Ainda não registou nenhuma venda no sistema.</p>
          <Link href="/orders/new" className="text-blue-600 font-semibold hover:underline">
            Registar a primeira venda
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Receipt className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    {order.customer?.name || 'Cliente Balcão'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  R$ {Number(order.total).toFixed(2).replace('.', ',')}
                </p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 bg-green-100 text-green-700 inline-block">
                  Concluído
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}