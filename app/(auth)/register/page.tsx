'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { registerAction } from '../../../actions/auth';

function RegisterForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="flex flex-col items-center mb-6">
        <div className="bg-blue-600 p-2 rounded-xl mb-3">
          <Package className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>
        <p className="text-gray-500 text-sm mt-1">É rápido e fácil começar.</p>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <form action={registerAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
          <input
            type="text"
            name="name"
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="João Silva"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Loja</label>
          <input
            type="text"
            name="storeName"
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Minha Loja"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="seu@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            type="password"
            name="password"
            required
            className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600 outline-none"
            placeholder="Mínimo 6 caracteres"
          />
        </div>
        <button
          type="submit"
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors mt-4"
        >
          Criar minha conta
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Já possui conta?{' '}
        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
          Faça login
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4 py-8">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
