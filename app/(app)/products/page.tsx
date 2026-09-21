import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { createProduct } from '@/actions/product';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const session = await getSession();
  const products = await prisma.product.findMany({
    where: { storeId: session!.storeId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="p-4 max-w-3xl mx-auto pb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Produtos</h1>

      {searchParams.error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {searchParams.error}
        </div>
      )}

      <form action={createProduct} className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 space-y-3">
        <h2 className="font-semibold text-gray-900">Novo produto</h2>
        <input
          name="name"
          required
          placeholder="Nome do produto"
          className="w-full h-11 px-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600"
        />
        <input
          name="sku"
          placeholder="SKU (opcional)"
          className="w-full h-11 px-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            name="costPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="Preço de custo"
            className="h-11 px-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600"
          />
          <input
            name="salePrice"
            type="number"
            step="0.01"
            min="0.01"
            required
            placeholder="Preço de venda"
            className="h-11 px-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <input
          name="stock"
          type="number"
          min="0"
          placeholder="Estoque inicial"
          className="w-full h-11 px-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
          Adicionar
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
        {products.length === 0 && (
          <p className="p-4 text-sm text-gray-500">Nenhum produto cadastrado ainda.</p>
        )}
        {products.map((product) => (
          <div key={product.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-500">
                Estoque: {product.stock}
                {product.stock <= product.minimumStock && (
                  <span className="text-red-500 font-medium"> · baixo</span>
                )}
              </p>
            </div>
            <p className="font-semibold text-gray-900">R$ {Number(product.salePrice).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
