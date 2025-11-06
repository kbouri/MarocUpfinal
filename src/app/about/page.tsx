'use client';

import Image from 'next/image';
import { useTranslation } from '@/contexts/TranslationContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      <Navigation />
      
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{t('about-title')}</h1>
          <p className="lead">{t('about-subtitle')}</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>{t('about-story-title')}</h2>
              <p>{t('about-story-p1')}</p>
              <p>{t('about-story-p2')}</p>
              <p>{t('about-story-p3')}</p>
              <p>{t('about-story-p4')}</p>
              <p>{t('about-story-p5')}</p>
              
              {/* Partners Logos */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '2rem', 
                marginTop: '1rem',
                marginBottom: '1rem',
                flexWrap: 'wrap'
              }}>
                <a 
                  href="https://linktr.ee/nextjeel_?utm_source=linktree_profile_share&ltsid=27fc7101-7170-4df2-8766-8a56425eb23d" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', cursor: 'pointer' }}
                >
                  <Image
                    src="/images/logonextjeelnew .jpeg"
                    alt="Next Jeel"
                    width={240}
                    height={60}
                    style={{ objectFit: 'contain' }}
                  />
                </a>
                <Image
                  src="/images/Tech Bridge logo.jpeg"
                  alt="Tech Bridge Africa"
                  width={160}
                  height={160}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
            <div className="mission-image">
              <div className="team-grid">
                {/* Top Row: Karim and Mohamed */}
                <a 
                  href="https://www.linkedin.com/in/karim-bouri-7a570824a/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="team-member" 
                  style={{ gridColumn: 1, gridRow: 1, textDecoration: 'none', cursor: 'pointer' }}
                >
                  <div className="member-photo">
                    <Image
                      src="/images/team/karim-bouri.jpg"
                      alt="Karim BOURI"
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="member-info">
                    <h4>Karim BOURI</h4>
                    <div className="member-schools">
                      <p className="member-school">X-HEC Entrepreneur</p>
                      <p className="member-school">ENSAE-HEC Paris</p>
                    </div>
                    <div className="member-linkedin">
                      <i className="fab fa-linkedin"></i>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/mohamed-afeilal/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="team-member" 
                  style={{ gridColumn: 2, gridRow: 1, textDecoration: 'none', cursor: 'pointer' }}
                >
                  <div className="member-photo">
                    <Image
                      src="/images/team/mohamed-afeilal.jpg"
                      alt="Mohamed AFEILAL"
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="member-info">
                    <h4>Mohamed AFEILAL</h4>
                    <p className="member-school">ESSEC Business</p>
                    <div className="member-linkedin">
                      <i className="fab fa-linkedin"></i>
                    </div>
                  </div>
                </a>
                
                {/* Bottom Row: Yasmine and Paul */}
                <a 
                  href="https://www.linkedin.com/in/yasmine-bouri/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="team-member" 
                  style={{ gridColumn: 1, gridRow: 2, textDecoration: 'none', cursor: 'pointer' }}
                >
                  <div className="member-photo">
                    <Image
                      src="/images/team/Yasmine Bouri.jpg"
                      alt="Yasmine BOURI"
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="member-info">
                    <h4>Yasmine BOURI</h4>
                    <div className="member-schools">
                      <p className="member-school">Ex Imperial College</p>
                      <p className="member-school">& NextJeel Founder</p>
                    </div>
                    <div className="member-linkedin">
                      <i className="fab fa-linkedin"></i>
                    </div>
                  </div>
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/paul-mathieu-foata-26a884280/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="team-member" 
                  style={{ gridColumn: 2, gridRow: 2, textDecoration: 'none', cursor: 'pointer' }}
                >
                  <div className="member-photo">
                    <Image
                      src="/images/team/paul-mathieu-foata.jpg"
                      alt="Paul Mathieu FOATA"
                      width={100}
                      height={100}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="member-info">
                    <h4>Paul Mathieu<br/>FOATA</h4>
                    <p className="member-school">ESSEC Business</p>
                    <div className="member-linkedin">
                      <i className="fab fa-linkedin"></i>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">{t('about-values-title')}</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3>{t('about-inspire-title')}</h3>
              <p>{t('about-inspire-content')}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-hands-helping"></i>
              </div>
              <h3>{t('about-connect-title')}</h3>
              <p>{t('about-connect-content')}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <i className="fas fa-cogs"></i>
              </div>
              <h3>{t('about-innovate-title')}</h3>
              <p>{t('about-innovate-content')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>{t('about-mission-title')}</h2>
              <p className="mission-description">{t('about-mission-p1')}</p>
              <p style={{ color: '#000000' }}>{t('about-mission-p2')}</p>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                <i className="fas fa-rocket"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="container">
          <h2 className="section-title">{t('about-impact-title')}</h2>
          <div className="impact-grid">
            <div className="impact-item">
              <div className="impact-number">10+</div>
              <div className="impact-label">{t('about-startups')}</div>
            </div>
            <div className="impact-item">
              <div className="impact-number">+10</div>
              <div className="impact-label">{t('about-mentors')}</div>
            </div>
            <div className="impact-item">
              <div className="impact-number">+200</div>
              <div className="impact-label">{t('about-connections')}</div>
            </div>
            <div className="impact-item">
              <div className="impact-number">+15</div>
              <div className="impact-label">{t('about-partners')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t('about-join-title')}
        description={t('about-join-content')}
        buttonText={t('cta-button')}
        buttonHref="/apply"
      />

      <Footer />
    </>
  );
}
