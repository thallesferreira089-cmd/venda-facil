'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '../../../../actions/order';
import { ShoppingCart, Plus, Minus, X } from 'lucide-react';

type Product = { id: string; name: string; price: number; stock: number };
type Customer = { id: string; name: string };
type CartItem = Product & { quantity: number };

export default function POSClient({ products, customers }: { products: Product[], customers: Customer[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const decreaseQuantity = (productId: string) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          if (item.quantity > 1) return { ...item, quantity: item.quantity - 1 };
          return null; 
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const total = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    startTransition(async () => {
      const orderData = {
        customerId: customerId || undefined,
        total,
        items: cart.map(item => ({ id: item.id, quantity: item.quantity }))
      };
      const res = await createOrder(orderData);
      if (res?.success) {
        router.push('/');
      } else {
        alert('Erro ao fechar venda');
      }
    });
  };

  return (
    <div className="space-y-6 pb-48">
      {/* Seleção de Cliente */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente (Opcional)</label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
        >
          <option value="">Cliente Balcão (Anónimo)</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Grelha de Produtos */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Produtos Disponíveis</h2>
        <div className="grid grid-cols-2 gap-3">
          {products.map(product => {
            const cartItem = cart.find(item => item.id === product.id);
            return (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  product.stock <= 0 ? 'opacity-50 bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-blue-300 shadow-sm'
                } ${cartItem ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-100'}`}
              >
                <h3 className="font-bold text-gray-900">{product.name}</h3>
                <p className="text-xs text-gray-500 mb-2">Stock: {product.stock}</p>
                <p className="font-bold text-blue-600">R$ {Number(product.price).toFixed(2)}</p>

                {cartItem && (
                  <span className="absolute bottom-4 right-4 bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                    {cartItem.quantity}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resumo do Carrinho */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-gray-200 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)] z-40 pb-safe">
          <div className="p-4 max-h-48 overflow-y-auto space-y-2 bg-gray-50">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">R$ {Number(item.price).toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => decreaseQuantity(item.id)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 ml-2 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500">Total a pagar</p>
              <p className="text-xl font-bold text-gray-900">R$ {total.toFixed(2)}</p>
            </div>
            <button
              onClick={handleCheckout}
              disabled={isPending}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" />
              {isPending ? 'A processar...' : 'Fechar Venda'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}