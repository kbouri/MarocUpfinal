'use client';

import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-logo">
              <h1>MarocUp</h1>
            </div>
            <h2 className="hero-tagline">{t('hero-tagline')}</h2>
            <p className="hero-date">{t('hero-date')}</p>
            <div className="hero-cta">
              <Link href="/apply" className="btn btn-primary">
                {t('hero-cta')}
              </Link>
            </div>
            <p className="hero-description">
              {t('hero-description')}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>{t('feature-mentoring-title')}</h3>
              <p>{t('feature-mentoring-desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-microphone"></i>
              </div>
              <h3>{t('feature-pitch-title')}</h3>
              <p>{t('feature-pitch-desc')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-network-wired"></i>
              </div>
              <h3>{t('feature-networking-title')}</h3>
              <p>{t('feature-networking-desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t('cta-title')}
        description={t('cta-description')}
        buttonText={t('cta-button')}
        buttonHref="/apply"
      />

      <Footer />
    </>
  );
}