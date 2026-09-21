'use client';

import { Rocket } from 'lucide-react';
import { setupStoreAction } from '../../../actions/auth';

export default function SetupPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-blue-100 p-4 rounded-full mb-4">
            <Rocket className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Vamos configurar sua loja 🚀</h1>
          <p className="text-gray-500 text-sm mt-2">
            Só precisamos de mais alguns detalhes para deixar tudo pronto para você.
          </p>
        </div>

        <form action={setupStoreAction} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Segmento da Loja</label>
            <select
              name="segment"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
            >
              <option value="">Selecione um segmento</option>
              <option value="roupas">Roupas e Moda</option>
              <option value="cosmeticos">Cosméticos e Beleza</option>
              <option value="eletronicos">Eletrônicos</option>
              <option value="acessorios">Acessórios</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Moeda</label>
            <select
              name="currency"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
            >
              <option value="BRL">Real (R$)</option>
              <option value="USD">Dólar (US$)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Forma principal de venda</label>
            <select
              name="salesChannel"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none bg-white"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="instagram">Instagram</option>
              <option value="loja_fisica">Loja Física / Pessoalmente</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors mt-6"
          >
            Concluir configuração
          </button>
        </form>
      </div>
    </div>
  );
}
