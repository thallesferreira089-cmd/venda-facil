'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateStoreSettings(formData: FormData): Promise<void> {
  const session = await getSession();
  if (!session?.storeId) return;

  const name = formData.get('name') as string;
  const segment = formData.get('segment') as string;

  if (!name || name.trim() === '') return;

  try {
    await prisma.store.update({
      where: { id: session.storeId },
      data: {
        name: name.trim(),
        segment: segment ? segment.trim() : null,
      },
    });

    revalidatePath('/menu');
    revalidatePath('/admin');
  } catch (error) {
    console.error('Erro ao atualizar loja:', error);
  }
}