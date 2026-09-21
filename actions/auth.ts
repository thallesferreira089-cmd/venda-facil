'use server';

import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createSession, destroySession, getSession } from '@/lib/auth';

 const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
});

 const registerSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  storeName: z.string().min(2, 'Nome da loja é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    redirectWithError('/login', parsed.error.issues[0]?.message ?? 'Dados inválidos');
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { stores: { take: 1, orderBy: { createdAt: 'asc' } } },
  });

  // Mensagem genérica de propósito: não revelar se o e-mail existe ou não.
  if (!user) {
    redirectWithError('/login', 'E-mail ou senha incorretos');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    redirectWithError('/login', 'E-mail ou senha incorretos');
  }

  const store = user.stores[0];

  await createSession({
    userId: user.id,
    storeId: store?.id ?? '',
    email: user.email,
    name: user.name,
  });

  redirect(store ? '/' : '/setup');
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get('name'),
    storeName: formData.get('storeName'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    redirectWithError('/register', parsed.error.issues[0]?.message ?? 'Dados inválidos');
  }

  const { name, storeName, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirectWithError('/register', 'Este e-mail já está cadastrado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      stores: {
        create: { name: storeName },
      },
    },
    include: { stores: true },
  });

  const store = user.stores[0];

  await createSession({
    userId: user.id,
    storeId: store.id,
    email: user.email,
    name: user.name,
  });

  redirect('/setup');
}

export async function setupStoreAction(formData: FormData) {
  const session = await getSession();
  if (!session?.storeId) redirect('/login');

  const segment = formData.get('segment')?.toString() || null;
  const currency = formData.get('currency')?.toString() || 'BRL';

  await prisma.store.update({
    where: { id: session.storeId },
    data: { segment, currency },
  });

  redirect('/');
}

export async function logoutAction() {
  await destroySession();
  redirect('/login');
}
