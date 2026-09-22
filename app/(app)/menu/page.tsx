import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { updateStoreSettings } from '@/actions/store';
import { logoutAction } from '@/actions/auth';
import { Store, Tag, Save, LogOut, User } from 'lucide-react';

export default async function MenuPage() {
  const session = await getSession();

  if (!session?.storeId) {
    redirect('/login');
  }

  const store = await prisma.store.findUnique({
    where: { id: session.storeId },
  });

  if (!store) {
    redirect('/login');
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mais opções</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie os dados da sua loja e da sua conta.
        </p>
      </div>

      {/* DADOS DO UTILIZADOR */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <User className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-gray-900">{session.name || 'Utilizador'}</p>
          <p className="text-sm text-gray-500">{session.email || ''}</p>
        </div>
      </div>

      {/* FORMULÁRIO DE DADOS DA LOJA */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Dados da Loja
        </h2>

        <form action={updateStoreSettings} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Store className="w-4 h-4 text-blue-600" />
              Nome da Loja
            </label>
            <input
              required
              type="text"
              name="name"
              defaultValue={store.name}
              placeholder="Ex: Minha Loja"
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" />
              Tipo / Segmento da Loja
            </label>
            <select
              name="segment"
              defaultValue={store.segment || ''}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all text-gray-900 bg-white"
            >
              <option value="">Selecione um segmento (opcional)</option>
              <option value="roupas">Roupas e Vestuário</option>
              <option value="eletronicos">Eletrónicos e Tecnologia</option>
              <option value="cosmeticos">Cosméticos e Beleza</option>
              <option value="alimentacao">Alimentação / Restauração</option>
              <option value="calcados">Calçados</option>
              <option value="acessorios">Acessórios e Bijuteria</option>
              <option value="outro">Outro / Geral</option>
            </select>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-400">ID da sua conta:</p>
            <p className="text-xs font-mono text-gray-600 bg-gray-50 p-2 rounded-lg mt-1 inline-block select-all">
              {store.id}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Save className="w-5 h-5" />
            Guardar Alterações
          </button>
        </form>
      </div>

      {/* BOTÃO DE LOGOUT USANDO A SUA ACTION */}
      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </button>
      </form>
    </div>
  );
}