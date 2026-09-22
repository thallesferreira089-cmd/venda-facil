'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateStoreSettings(formData: FormData) {
  const session = await getSession();
  if (!session?.storeId) return { success: false, error: 'Não autorizado' };

  const name = formData.get('name') as string;
  const segment = formData.get('segment') as string;

  if (!name || name.trim() === '') {
    return { success: false, error: 'O nome da loja é obrigatório.' };
  }

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
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar configurações da loja:', error);
    return { success: false, error: 'Erro ao guardar as alterações.' };
  }
}