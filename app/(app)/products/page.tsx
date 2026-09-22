import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';

export default async function ProductsPage() {
  const session = await getSession();

  if (!session) redirect('/login');
  if (!session.storeId) redirect('/setup');

  const products = await prisma.product.findMany({
    where: { storeId: session.storeId },
    orderBy: { createdAt: 'desc' },
  });

  const formatCurrency = (val: any) => {
    const numericValue = val ? Number(val) : 0;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-sm text-gray-500">
            Gerencie o catálogo de produtos da sua loja.
          </p>
        </div>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Novo Produto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900">Nenhum produto cadastrado</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Adicione os seus produtos para começar a registar vendas e controlar o seu stock.
          </p>
          <Link
            href="/products/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors mt-2"
          >
            <Plus className="w-4 h-4" /> Criar Primeiro Produto
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4">Produto</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{product.name}</td>
                  <td className="p-4 text-gray-700 font-semibold">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 5
                          ? 'bg-green-50 text-green-700'
                          : product.stock > 0
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {product.stock} em stock
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="p-2 text-gray-400 hover:text-blue-600 inline-block transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}