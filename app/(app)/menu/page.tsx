import { LogOut } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { logoutAction } from '@/actions/auth';

export default async function MenuPage() {
  const session = await getSession();

  return (
    <main className="p-4 max-w-3xl mx-auto pb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Mais opções</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4">
        <p className="font-medium text-gray-900">{session?.name}</p>
        <p className="text-sm text-gray-500">{session?.email}</p>
      </div>

      <form action={logoutAction}>
        <button
          type="submit"
          className="w-full h-11 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </button>
      </form>
    </main>
  );
}
