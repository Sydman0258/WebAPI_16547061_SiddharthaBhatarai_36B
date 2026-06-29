'use client';

import './Navbar.css';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/authContext';
import { useCart } from '@/lib/context/CartContext'; // 1. Import your cart context hook

const NAV_LINKS = [
  { href: '/customer', label: 'Home', icon: '' },
  { href: '/customer/restaurants', label: 'Restaurants', icon: '' },
  { href: '/customer/orders', label: 'Orders', icon: '' },
  { href: '/customer/cart', label: 'Cart', icon: '🛒' },
  { href: '/customer/profile', label: 'Profile', icon: '' },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // 2. Consume global cart state instead of using static local state
  const { cart } = useCart(); 
  
  // 3. Compute total number of items dynamically based on quantity
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

 const { logout } = useAuth(); 
  const isActive = (href: string) => {
    if (href === '/customer') return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} ref={menuRef}>
        <div className="navbar-inner">
          {/* Brand */}
          <div className="brand" onClick={() => router.push('/dashboard')}>
            <div className="brand-icon"></div>
            <span className="brand-name">Grub<span>GO</span></span>
          </div>

          {/* Desktop links */}
          <ul className="nav-links">
            {NAV_LINKS.map(({ href, label, icon }) => (
              <li key={href}>
                {label === 'Cart' ? (
                  <button
                    className={`nav-link${isActive(href) ? ' active' : ''}`}
                    onClick={() => router.push(href)}
                  >
                    <span className="cart-badge">
                      <span className="nav-icon">{icon}</span>
                      {cartCount > 0 && <span className="badge-dot">{cartCount}</span>}
                    </span>
                    {label}
                  </button>
                ) : (
                  <button
                    className={`nav-link${isActive(href) ? ' active' : ''}`}
                    onClick={() => router.push(href)}
                  >
                    <span className="nav-icon">{icon}</span>
                    {label}
                  </button>
                )}
              </li>
            ))}

            <li><div className="nav-divider" /></li>

            <li>
              <button className="nav-link nav-logout" onClick={logout}>
                Log out
              </button>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
          {NAV_LINKS.map(({ href, label, icon }) => (
            <button
              key={href}
              className={`mobile-link${isActive(href) ? ' active' : ''}`}
              onClick={() => router.push(href)}
            >
              <span className="m-icon">{icon}</span>
              {label}
              {label === 'Cart' && cartCount > 0 && (
                <span style={{ marginLeft: 'auto', background: '#c2210a', color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '2px 7px', borderRadius: '20px' }}>
                  {cartCount}
                </span>
              )}
            </button>
          ))}
          <div className="mobile-divider" />
          <button className="mobile-link mobile-logout" onClick={logout}>
            Log out
          </button>
        </div>
      </nav>
    </>
  );
}