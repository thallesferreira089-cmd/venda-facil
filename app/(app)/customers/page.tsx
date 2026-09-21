import Link from 'next/link';
import { Users, Plus, Search, User } from 'lucide-react';
import { prisma } from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';
import { redirect } from 'next/navigation';

export default async function CustomersPage() {
  const session = await getSession();
  if (!session?.storeId) redirect('/login');

  const customers = await prisma.customer.findMany({
    where: { storeId: session.storeId },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-4 space-y-6 pb-24">
      <header className="flex justify-between items-center mt-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 text-sm">Faça a gestão dos seus contactos.</p>
        </div>
        <Link href="/customers/new" className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 flex items-center shadow-sm">
          <Plus className="w-5 h-5" />
        </Link>
      </header>

      {customers.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center flex flex-col items-center shadow-sm">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <Users className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Nenhum cliente</h3>
          <p className="text-gray-500 text-sm mb-4">Ainda não tem clientes registados na sua base de dados.</p>
          <Link href="/customers/new" className="text-blue-600 font-semibold hover:underline">
            Registar primeiro cliente
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{customer.name}</h3>
                  {customer.phone && <p className="text-xs text-gray-500 mt-0.5">{customer.phone}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}