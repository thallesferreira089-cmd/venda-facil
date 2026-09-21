'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../lib/prisma';
import { getSession } from '../lib/auth';

// Esta função recebe os dados do carrinho de compras
export async function createOrder(orderData: { customerId?: string; total: number; items: { id: string; quantity: number }[] }) {
  const session = await getSession();
  if (!session?.storeId) return { error: 'Não autorizado' };

  try {
    // 1. Regista a venda na base de dados
    await prisma.order.create({
      data: {
        storeId: session.storeId,
        customerId: orderData.customerId || null, // Associa ao cliente (se houver)
        total: orderData.total,
        status: 'COMPLETED',
      }
    });

    // 2. Abate o stock de cada produto vendido automaticamente
    for (const item of orderData.items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    // 3. Atualiza o Histórico, os Produtos e o Dashboard
    revalidatePath('/orders');
    revalidatePath('/products');
    revalidatePath('/'); 
    
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Erro ao registar a venda.' };
  }
}