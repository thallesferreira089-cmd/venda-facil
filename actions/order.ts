'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createOrder(data: { customerId?: string; total: number; items: { id: string; quantity: number }[] }) {
  const session = await getSession();
  if (!session?.storeId) return { success: false, error: 'Não autorizado' };

  try {
    // 1. Buscar os produtos no banco para pegar os preços (salePrice e costPrice) atualizados
    const productIds = data.items.map(item => item.id);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds }, storeId: session.storeId }
    });

    let totalCost = 0;

    // 2. Mapear cada item com os campos exigidos pelo schema (unitPrice, unitCost, total)
    const orderItemsData = data.items.map(item => {
      const product = dbProducts.find(p => p.id === item.id);
      const unitPrice = product ? Number(product.salePrice) : 0;
      const unitCost = product ? Number(product.costPrice) : 0;
      const itemTotal = unitPrice * item.quantity;

      totalCost += unitCost * item.quantity;

      return {
        productId: item.id,
        quantity: item.quantity,
        unitPrice,
        unitCost,
        total: itemTotal
      };
    });

    const calculatedProfit = data.total - totalCost;

    // 3. Executar transação no Prisma
    await prisma.$transaction(async (tx) => {
      // Criar a Ordem de Venda
      await tx.order.create({
        data: {
          storeId: session.storeId,
          customerId: data.customerId || null,
          subtotal: data.total,
          total: data.total,
          totalCost,
          profit: calculatedProfit,
          items: {
            create: orderItemsData
          }
        }
      });

      // Abater o estoque de cada produto vendido
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
    console.error('Erro detalhado ao fechar venda:', error);
    return { success: false, error: 'Erro ao fechar venda' };
  }
}