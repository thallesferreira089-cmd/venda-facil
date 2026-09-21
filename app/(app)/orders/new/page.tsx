import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import POSClient from './POSClient';

export default async function NewOrderPage() {
  const session = await getSession();
  if (!session?.storeId) redirect('/login');

  const products = await prisma.product.findMany({
    where: { storeId: session.storeId },
    orderBy: { name: 'asc' }
  });

  const customers = await prisma.customer.findMany({
    where: { storeId: session.storeId },
    orderBy: { name: 'asc' }
  });

  return <POSClient products={products} customers={customers} />;
}