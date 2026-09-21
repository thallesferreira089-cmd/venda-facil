import { prisma } from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';
import { redirect } from 'next/navigation';
import POSClient from './POSClient';

export default async function NewOrderPage() {
  const session = await getSession();
  if (!session?.storeId) redirect('/login');

  // Vai buscar apenas os produtos que têm stock disponível
  const products = await prisma.product.findMany({
    where: { 
      storeId: session.storeId,
      stock: { gt: 0 } 
    },
  });

  const customers = await prisma.customer.findMany({
    where: { storeId: session.storeId },
  });

  return <POSClient products={products} customers={customers} />;
}