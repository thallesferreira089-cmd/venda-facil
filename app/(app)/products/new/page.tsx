import Link from 'next/link';
import { Package, Plus, Search, Tag } from 'lucide-react';
import { prisma } from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';
import { redirect } from 'next/navigation';

export default async function ProductsPage() {
  // 1. Pega na sessão da loja atual
  const session = await getSession();
  if (!session?.storeId) redirect('/login');

  // 2. Procura os produtos desta loja específica na base de dados
  const products = await prisma.product.findMany({
    where: { storeId: session.storeId },
    orderBy: { createdAt: 'desc' } // Mostra os mais recentes primeiro
  });

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex justify-between items-center mt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-500 text-sm">Faça a gestão do seu stock.</p>
        </div>
        <Link href="/products/new" className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 flex items-center shadow-sm">
          <Plus className="w-5 h-5" />
        </Link>
      </header>

      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
        <input 
          type="text" 
          placeholder="Procurar produto..." 
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none bg-white shadow-sm"
        />
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center flex flex-col items-center shadow-sm">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhum produto</h3>
          <p className="text-gray-500 text-sm mb-4">Ainda não adicionou nada ao seu catálogo.</p>
          <Link href="/products/new" className="text-blue-600 font-semibold hover:underline">
            Adicionar o primeiro produto
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Tag className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Stock: {product.stock} unidades</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  R$ {Number(product.salePrice).toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}