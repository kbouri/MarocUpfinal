'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
            <h2>MarocUp</h2>
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
