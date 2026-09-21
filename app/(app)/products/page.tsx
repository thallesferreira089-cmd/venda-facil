import Link from 'next/link';
import { Plus, Package, Trash2 } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function ProductsPage() {
  const session = await getSession();
  if (!session?.storeId) redirect('/login');

  const products = await prisma.product.findMany({
    where: { storeId: session.storeId },
    orderBy: { createdAt: 'desc' }
  });

  // Função para apagar o produto diretamente na base de dados
  async function deleteProduct(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await prisma.product.delete({ where: { id } });
    revalidatePath('/products');
    revalidatePath('/orders/new');
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex justify-between items-center mt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-500 text-sm">Faça a gestão do seu stock.</p>
        </div>
        <Link href="/products/new" className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 shadow-sm">
          <Plus className="w-5 h-5" />
        </Link>
      </header>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:border-blue-200 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                <Package className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <div className="flex gap-3 text-xs mt-1">
                  <span className="text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Stock: {product.stock}</span>
                  <span className="font-bold text-green-600">R$ {Number(product.price).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Botão de Eliminar Produto */}
            <form action={deleteProduct}>
              <input type="hidden" name="id" value={product.id} />
              <button type="submit" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </form>

          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Nenhum produto registado.</p>
          </div>
        )}
      </div>
    </div>
  );
}