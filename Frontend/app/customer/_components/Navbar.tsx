'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/authContext';
import { useCart } from '@/lib/context/CartContext';
import { useTheme } from 'next-themes';   // ← Add this import

const NAV_LINKS = [
  { href: '/customer', label: 'Home' },
  { href: '/customer/restaurants', label: 'Restaurants' },
  { href: '/customer/orders', label: 'Orders' },
  { href: '/customer/cart', label: 'Cart' },
  { href: '/customer/profile', label: 'Profile' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { cart } = useCart();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();   // ← Theme hook

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (href: string) => {
    if (href === '/customer') return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className={`sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-b border-zinc-200 dark:border-zinc-800 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => router.push('/customer')}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-orange-600 to-rose-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-inner transition-transform group-hover:rotate-12">
              🍔
            </div>
            <div className="font-bold text-2xl tracking-tighter text-zinc-900 dark:text-white">
              Grub<span className="text-orange-600">GO</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map(({ href, label }) => (
              <button
                key={href}
                onClick={() => router.push(href)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive(href)
                    ? 'bg-orange-50 dark:bg-orange-950 text-orange-600 dark:text-orange-400 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {label}
                {label === 'Cart' && cartCount > 0 && (
                  <span className="ml-2 bg-orange-600 text-white text-[10px] px-2 py-px rounded-full font-mono min-w-[18px] inline-flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-xl transition-all"
              title="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Cart */}
            <button
              onClick={() => router.push('/customer/cart')}
              className="relative w-9 h-9 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-xl transition-colors"
              title="Cart"
            >
              🛒
              {cartCount > 0 && (
                <div className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full shadow">
                  {cartCount}
                </div>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden w-10 h-10 flex items-center justify-center text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-zinc-900 py-6 px-6 space-y-2 shadow-xl">
          {NAV_LINKS.map(({ href, label }) => (
            <button
              key={href}
              onClick={() => {
                router.push(href);
                setMenuOpen(false);
              }}
              className="w-full text-left px-5 py-4 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-lg font-medium flex justify-between items-center transition-colors"
            >
              <span>{label}</span>
              {label === 'Cart' && cartCount > 0 && (
                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm">
                  {cartCount}
                </span>
              )}
            </button>
          ))}

          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            className="w-full text-left px-5 py-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl text-lg font-medium mt-4"
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}