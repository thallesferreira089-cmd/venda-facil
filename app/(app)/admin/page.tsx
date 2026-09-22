import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Store, Users, ShoppingBag, Calendar } from 'lucide-react';

// ✉️ COLOQUE AQUI O SEU E-MAIL DE ADMINISTRADOR
const ADMIN_EMAIL = "thallesferreira089@gmail.com";

export default async function AdminDashboardPage() {
  const session = await getSession();

  // Bloqueia a entrada se não estiver logado ou se o e-mail não for o do admin
  if (!session || session.email !== ADMIN_EMAIL) {
    redirect('/');
  }

  const stores = await prisma.store.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          products: true,
          orders: true,
          customers: true
        }
      }
    }
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Painel de Administração</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gestão e acompanhamento das contas cadastradas na plataforma.
        </p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total de Lojas</p>
            <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total de Produtos Cadastrados</p>
            <p className="text-2xl font-bold text-gray-900">
              {stores.reduce((sum, s) => sum + s._count.products, 0)}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total de Clientes Registrados</p>
            <p className="text-2xl font-bold text-gray-900">
              {stores.reduce((sum, s) => sum + s._count.customers, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Contas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Contas Criadas ({stores.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Loja / Conta</th>
                <th className="p-4">ID da Loja</th>
                <th className="p-4 text-center">Produtos</th>
                <th className="p-4 text-center">Vendas</th>
                <th className="p-4 text-center">Clientes</th>
                <th className="p-4">Data de Criação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-bold text-gray-900 flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-400" />
                    {store.name}
                  </td>
                  <td className="p-4 font-mono text-xs text-gray-500">{store.id}</td>
                  <td className="p-4 text-center font-semibold text-gray-700">{store._count.products}</td>
                  <td className="p-4 text-center font-semibold text-gray-700">{store._count.orders}</td>
                  <td className="p-4 text-center font-semibold text-gray-700">{store._count.customers}</td>
                  <td className="p-4 text-xs text-gray-500 flex items-center gap-1.5 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {new Date(store.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}