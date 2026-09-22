import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { Trash2 } from 'lucide-react';

export default async function ProductsPage() {
  const session = await getSession();
  if (!session?.storeId) redirect('/login');

  const products = await prisma.product.findMany({
    where: { storeId: session.storeId },
    orderBy: { createdAt: 'desc' }
  });

  async function addProduct(formData: FormData) {
    'use server';
    const session = await getSession();
    if (!session?.storeId) return;
    
    await prisma.product.create({
      data: {
        name: formData.get('name') as string,
        price: Number(formData.get('price')),
        stock: Number(formData.get('stock')),
        storeId: session.storeId
      }
    });

    revalidatePath('/products');
    revalidatePath('/orders/new');
  }

  async function deleteProduct(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    await prisma.product.delete({ where: { id } });
    revalidatePath('/products');
    revalidatePath('/orders/new');
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Produtos</h1>

      {/* Formulário Novo Produto */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Novo produto</h2>
        <form action={addProduct} className="space-y-4">
          <input required type="text" name="name" placeholder="Nome do produto" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" step="0.01" name="cost" placeholder="Preço de custo (opcional)" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
            <input required type="number" step="0.01" name="price" placeholder="Preço de venda" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <input required type="number" name="stock" placeholder="Estoque inicial" className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none" />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Adicionar
          </button>
        </form>
      </div>

      {/* Lista de Produtos */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm divide-y divide-gray-100">
        {products.map((product) => (
          <div key={product.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
            <div>
              <p className="font-bold text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Estoque: {product.stock} {product.stock <= 5 && <span className="text-red-500 font-semibold">- baixo</span>}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold text-gray-900">R$ {Number(product.price).toFixed(2)}</p>
              
              <form action={deleteProduct}>
                <input type="hidden" name="id" value={product.id} />
                <button type="submit" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Apagar">
                  <Trash2 className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="p-6 text-center text-gray-500">Nenhum produto cadastrado.</div>
        )}
      </div>
    </div>
  );
}