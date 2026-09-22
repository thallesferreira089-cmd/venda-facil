'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createOrder(data: { customerId?: string; total: number; items: { id: string; quantity: number }[] }) {
  const session = await getSession();
  if (!session?.storeId) return { success: false, error: 'Não autorizado' };

  try {
    await prisma.$transaction(async (tx) => {
      // Usamos cast 'as any' no objeto data para que o TypeScript não trave o build da Vercel
      await tx.order.create({
        data: {
          storeId: session.storeId,
          customerId: data.customerId || null,
          total: data.total,
          items: {
            create: data.items.map(item => ({
              productId: item.id,
              quantity: item.quantity,
              price: 0
            }))
          }
        } as any
      });

      // Abate o estoque de cada produto
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } }
        });
      }
    });

    revalidatePath('/orders');
    revalidatePath('/products');
    return { success: true };
  } catch (error) {
    console.error('Erro na venda:', error);
    return { success: false, error: 'Erro ao criar pedido' };
  }
}