'use client';

import Image from 'next/image';
import { useTranslation } from '@/contexts/TranslationContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';

export default function InfoPage() {
  const { t } = useTranslation();

  const sponsors = [
    { name: 'Chari', image: '/images/partners/chari.png' },
    { name: 'TaptapSend', image: '/images/partners/taptapsend.jpeg' },
    { name: 'Intelcia', image: '/images/partners/intelcia.png.jpg' },
    { name: 'UM6P', image: '/images/partners/um6p.png' },
    { name: 'Tech Bridge Africa', image: '/images/partners/tech_bridge_africa_logo.jpeg' },
    { name: '212 Founders', image: '/images/partners/212-founders.png' },
    { name: 'Nest Accelerator', image: '/images/partners/nest-accelerator.png.jpg' },
    { name: 'MFounders', image: '/images/partners/mfounders.png.webp' },
  ];

  const partners = [
    { name: 'HEC Paris', image: '/images/partners/hec-paris.png' },
    { name: 'Polytechnique', image: '/images/partners/polytechnique.png' },
    { name: 'X HEC Entrepreneur', image: '/images/partners/x-hec-entrepreneur.png.jpg' },
    { name: 'ESSEC', image: '/images/partners/essec.png .jpg' },
    { name: 'EMLYON', image: '/images/partners/emlyon.png' },
    { name: 'ENSAE', image: '/images/partners/LOGO-ENSAE.png' },
    { name: 'Imperial College London', image: '/images/partners/imperialcollegelondon.png' },
    { name: 'University of Warwick', image: '/images/partners/University_of_Warwick_logo.png' },
    { name: 'Bocconi', image: '/images/partners/bocconi.jpeg' },
    { name: 'Earleads', image: '/images/partners/earleads.jpg' },
    { name: 'Next Wave', image: '/images/partners/next wave.jpg' },
    { name: 'Bladi', image: '/images/partners/bladi.jpg.png' },
  ];

  return (
    <>
      <Navigation />
      
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{t('info-title')}</h1>
          <p className="lead">{t('info-subtitle')}</p>
        </div>
      </section>

      {/* Event Details */}
      <section className="event-details">
        <div className="container">
          <div className="details-grid">
            <div className="detail-card">
              <div className="detail-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <h3>{t('info-dates-title')}</h3>
              <p dangerouslySetInnerHTML={{ __html: t('info-dates-date') }}></p>
              <p>{t('info-dates-desc')}</p>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>{t('info-location-title')}</h3>
              <p dangerouslySetInnerHTML={{ __html: t('info-location-place') }}></p>
              <p>{t('info-location-desc')}</p>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>{t('info-contact-title')}</h3>
              <p dangerouslySetInnerHTML={{ __html: t('info-contact-email') }}></p>
              <p>{t('info-contact-desc')}</p>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">
                <i className="fas fa-share-alt"></i>
              </div>
              <h3>{t('info-social-title')}</h3>
              <p>
                <a href="https://www.linkedin.com/company/marocup/" target="_blank" rel="noopener noreferrer" style={{ marginRight: '1rem' }}>
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
                <a href="https://www.instagram.com/marocup_?igsh=MW9mbWM1MWVhdHlhcg==" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </p>
              <p>{t('info-social-desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="partners-section" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <h2 className="section-title">Nos Sponsors</h2>
          <p className="section-subtitle">Ils soutiennent financièrement MarocUp et contribuent à son succès</p>
          
          <div className="partners-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', maxWidth: '100%' }}>
            {/* Ligne 1 Sponsors */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {sponsors.slice(0, 4).map((sponsor, index) => (
                <div key={index} style={{ width: '150px', height: '100px', border: '2px solid #C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', margin: '10px', borderRadius: '8px' }}>
                  <Image
                    src={sponsor.image}
                    alt={sponsor.name}
                    width={140}
                    height={80}
                    style={{ maxWidth: '140px', maxHeight: '80px', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
            
            {/* Ligne 2 Sponsors */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {sponsors.slice(4, 8).map((sponsor, index) => (
                <div key={index} style={{ width: '150px', height: '100px', border: '2px solid #C8102E', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', margin: '10px', borderRadius: '8px' }}>
                  <Image
                    src={sponsor.image}
                    alt={sponsor.name}
                    width={140}
                    height={80}
                    style={{ maxWidth: '140px', maxHeight: '80px', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners-section">
        <div className="container">
          <h2 className="section-title">{t('info-partners-title')}</h2>
          <p className="section-subtitle">{t('info-partners-desc')}</p>
          
          <div className="partners-grid" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', maxWidth: '100%' }}>
            {/* Ligne 1 Partenaires */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {partners.slice(0, 4).map((partner, index) => (
                <div key={index} style={{ width: '150px', height: '100px', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', margin: '10px' }}>
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    width={140}
                    height={80}
                    style={{ maxWidth: '140px', maxHeight: '80px', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
            
            {/* Ligne 2 Partenaires */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {partners.slice(4, 8).map((partner, index) => (
                <div key={index} style={{ width: '150px', height: '100px', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', margin: '10px' }}>
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    width={140}
                    height={80}
                    style={{ maxWidth: '140px', maxHeight: '80px', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
            
            {/* Ligne 3 Partenaires */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {partners.slice(8, 12).map((partner, index) => (
                <div key={index} style={{ width: '150px', height: '100px', border: '2px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', margin: '10px' }}>
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    width={140}
                    height={80}
                    style={{ maxWidth: '140px', maxHeight: '80px', objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section className="venue-section">
        <div className="container">
          <div className="venue-content">
            <h2>{t('info-venue-title')}</h2>
            <p>{t('info-venue-p1')}</p>
            <p>{t('info-venue-p2')}</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">{t('info-faq-title')}</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>{t('info-faq1-q')}</h3>
              <p>{t('info-faq1-a')}</p>
            </div>
            <div className="faq-item">
              <h3>{t('info-faq2-q')}</h3>
              <p>{t('info-faq2-a')}</p>
            </div>
            <div className="faq-item">
              <h3>{t('info-faq3-q')}</h3>
              <p>{t('info-faq3-a')}</p>
            </div>
            <div className="faq-item">
              <h3>{t('info-faq4-q')}</h3>
              <p>{t('info-faq4-a')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t('info-cta-title')}
        description={t('info-cta-desc')}
        buttonText={t('info-cta-button')}
        buttonHref="/apply"
      />

      <Footer />
    </>
  );
}
