'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
// Importamos a função que verifica quem está logado
import { getSession } from '../lib/auth'; 

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  costPrice: z.coerce.number().min(0).default(0),
  salePrice: z.coerce.number().positive('Preço de venda deve ser maior que zero'),
  stock: z.coerce.number().int().min(0).default(0),
});

export async function createProduct(formData: FormData) {
  // 1. Verifica qual é a loja do utilizador logado
  const session = await getSession();
  if (!session?.storeId) {
    redirect('/login');
  }

  // 2. Valida os dados do formulário
  const parsed = productSchema.safeParse({
    name: formData.get('name'),
    costPrice: formData.get('costPrice') || 0,
    salePrice: formData.get('salePrice'),
    stock: formData.get('stock') || 0,
  });

  if (!parsed.success) {
    // Se falhar, volta com erro (poderíamos exibir isto no ecrã depois)
    redirect('/products/new?error=DadosInvalidos');
  }

  // 3. Guarda na Base de Dados
  await prisma.product.create({
    data: {
      storeId: session.storeId,
      name: parsed.data.name,
      costPrice: parsed.data.costPrice,
      salePrice: parsed.data.salePrice,
      stock: parsed.data.stock,
      status: 'ACTIVE',
    }
  });

  // 4. Atualiza a lista e volta para a página de produtos
  revalidatePath('/products');
  redirect('/products');
}