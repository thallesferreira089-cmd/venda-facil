import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { setupStoreAction } from '@/actions/auth';
import { Store, ArrowRight } from 'lucide-react';

export default async function SetupPage() {
  const session = await getSession();

  // Se não houver sessão ativa, envia para login
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurar Loja</h1>
          <p className="text-sm text-gray-500 mt-1">
            Defina o segmento e moeda para começar a vender.
          </p>
        </div>

        <form action={setupStoreAction} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Segmento da Loja
            </label>
            <select
              name="segment"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 bg-white"
            >
              <option value="">Selecione um segmento (opcional)</option>
              <option value="roupas">Roupas e Vestuário</option>
              <option value="eletronicos">Eletrónicos e Tecnologia</option>
              <option value="cosmeticos">Cosméticos e Beleza</option>
              <option value="alimentacao">Alimentação / Restauração</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Moeda
            </label>
            <select
              name="currency"
              defaultValue="BRL"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-gray-900 bg-white"
            >
              <option value="BRL">BRL (R$)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Concluir Configuração <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}