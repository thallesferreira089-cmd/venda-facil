'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { loginAction } from '../../../actions/auth';

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-blue-600 p-3 rounded-xl mb-4">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bem-vindo ao VendaFácil</h1>
        <p className="text-gray-500 text-sm mt-1">Gerencie suas vendas na palma da mão.</p>
      </div>

      {error && (
        <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <form action={loginAction} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Senha</label>
            <Link href="/recuperar" className="text-xs text-blue-600 font-medium">
              Esqueceu a senha?
            </Link>
          </div>
          <input
            type="password"
            name="password"
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors mt-2"
        >
          Entrar
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-8">
        Não tem uma conta?{' '}
        <Link href="/register" className="text-blue-600 font-semibold hover:underline">
          Criar minha conta
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
