'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { getSession } from '../lib/auth';

const customerSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  phone: z.string().optional(),
  email: z.string().optional(),
});

export async function createCustomer(formData: FormData) {
  const session = await getSession();
  if (!session?.storeId) redirect('/login');

  const parsed = customerSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone') || undefined,
    email: formData.get('email') || undefined,
  });

  if (!parsed.success) {
    redirect('/customers/new?error=DadosInvalidos');
  }

  await prisma.customer.create({
    data: {
      storeId: session.storeId,
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
    }
  });

  revalidatePath('/customers');
  redirect('/customers');
}