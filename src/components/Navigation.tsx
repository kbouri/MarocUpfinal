'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
import { translations } from '@/lib/translations';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { t, currentLanguage, switchLanguage } = useTranslation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking on a link
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { href: '/', key: 'nav-home' },
    { href: '/about', key: 'nav-about' },
    { href: '/program', key: 'nav-program' },
    { href: '/apply', key: 'nav-apply' },
    { href: '/mentors', key: 'nav-mentors' },
    { href: '/info', key: 'nav-info' },
  ];

  return (
    <nav 
      className="navbar"
      style={{
        background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
        boxShadow: isScrolled ? '0 2px 20px rgba(0, 0, 0, 0.15)' : '0 2px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="nav-container">
        <div className="nav-logo">
          <Link href="/">
            <div style={{ position: 'relative', width: '200px', height: '65px', display: 'flex', alignItems: 'center' }}>
              <Image 
                src="/images/marocup-v2.png" 
                alt="MarocUp Logo" 
                width={200} 
                height={65}
                priority
                style={{ objectFit: 'contain', height: '100%', width: 'auto', display: 'block' }}
                onError={(e) => {
                  // Si l'image ne charge pas, on affiche le texte
                  const img = e.target as HTMLImageElement;
                  if (img && img.parentElement) {
                    img.style.display = 'none';
                    const fallback = document.createElement('h2');
                    fallback.textContent = 'MarocUp';
                    fallback.style.cssText = 'color: var(--primary-red); font-weight: 700; font-size: 1.8rem; margin: 0; display: block;';
                    img.parentElement.appendChild(fallback);
                  }
                }}
              />
            </div>
          </Link>
        </div>
        
        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`nav-link ${pathname === item.href ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {t(item.key as keyof typeof translations.fr)}
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="language-switcher">
          <button 
            className={`language-btn ${currentLanguage === 'fr' ? 'active' : ''}`}
            onClick={() => switchLanguage('fr')}
          >
            🇫🇷
          </button>
          <button 
            className={`language-btn ${currentLanguage === 'en' ? 'active' : ''}`}
            onClick={() => switchLanguage('en')}
          >
            🇬🇧
          </button>
        </div>
        
        <div className="nav-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
}
