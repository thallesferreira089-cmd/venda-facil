'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import { createOrder } from '../../../../actions/order';

type Product = { id: string; name: string; salePrice: any; stock: number };
type Customer = { id: string; name: string };
type CartItem = Product & { quantity: number };

export default function POSClient({ products, customers }: { products: Product[], customers: Customer[] }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcula o total do carrinho
  const total = cart.reduce((sum, item) => sum + (Number(item.salePrice) * item.quantity), 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Não deixa vender mais do que o stock
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing?.quantity === 1) {
        return prev.filter(item => item.id !== productId);
      }
      return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    const items = cart.map(item => ({ id: item.id, quantity: item.quantity }));
    const result = await createOrder({ customerId, total, items });
    
    if (result.success) {
      router.push('/orders');
    } else {
      alert(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-6 pb-32">
      <header className="flex items-center gap-3 mt-4">
        <Link href="/orders" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Nova Venda</h1>
      </header>

      {/* Seleção de Cliente */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Cliente (Opcional)</label>
        <select 
          value={customerId} 
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">Cliente Balcão (Anónimo)</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Lista de Produtos */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Produtos Disponíveis</h2>
        <div className="grid grid-cols-2 gap-3">
          {products.map(product => {
            const inCart = cart.find(item => item.id === product.id)?.quantity || 0;
            return (
              <div key={product.id} onClick={() => addToCart(product)} className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-blue-300 active:scale-95 transition-all flex flex-col justify-between h-28">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">Stock: {product.stock - inCart}</p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-blue-600 text-sm">R$ {Number(product.salePrice).toFixed(2)}</span>
                  {inCart > 0 && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                      {inCart}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barra de Checkout Fixa no Fundo */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Total a cobrar</p>
              <p className="text-2xl font-bold text-gray-900">R$ {total.toFixed(2).replace('.', ',')}</p>
            </div>
            <button 
              onClick={handleCheckout} 
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600 text-white h-12 px-6 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'A processar...' : <><Check className="w-5 h-5" /> Fechar Venda</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}