import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { createCustomer } from '../../../../actions/customer';

export default function NewCustomerPage() {
  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex items-center gap-3 mt-4">
        <Link href="/customers" className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Novo Cliente</h1>
        </div>
      </header>

      <form action={createCustomer} className="space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente *</label>
            <input type="text" name="name" required className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="Ex: João Silva" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Telemóvel</label>
            <input type="tel" name="phone" className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="(00) 90000-0000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail (opcional)</label>
            <input type="email" name="email" className="w-full h-11 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none" placeholder="joao@email.com" />
          </div>
        </div>

        <button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
          <Save className="w-5 h-5" />
          Guardar Cliente
        </button>
      </form>
    </div>
  );
}