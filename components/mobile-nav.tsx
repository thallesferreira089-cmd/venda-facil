'use client';

import Link from 'next/link';
import { Home, ShoppingBag, Package, Users, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function MobileNav() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/orders', label: 'Pedidos', icon: ShoppingBag },
    { href: '/products', label: 'Produtos', icon: Package },
    { href: '/customers', label: 'Clientes', icon: Users },
    { href: '/menu', label: 'Mais', icon: Menu },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe md:hidden">
      <div className="flex justify-around items-center h-16">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="flex flex-col items-center justify-center w-full h-full">
              <Icon className={`h-6 w-6 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className={`text-xs mt-1 ${isActive ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
