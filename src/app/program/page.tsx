'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';

export default function ProgramPage() {
  const { t } = useTranslation();

  return (
    <>
      <Navigation />
      
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{t('program-title')}</h1>
          <p className="lead">{t('program-subtitle')}</p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="timeline">
            {/* Day 1 */}
            <div className="timeline-day">
              <div className="day-header">
                <div className="day-number">1</div>
                <div className="day-info">
                  <h2>{t('program-day1-title')}</h2>
                  <p className="day-subtitle">{t('program-day1-subtitle')}</p>
                </div>
              </div>
              
              <div className="timeline-events">
                <div className="timeline-event">
                  <div className="event-time">15:00 - 15:30</div>
                  <div className="event-content">
                    <h3>{t('program-event1-title')}</h3>
                    <p>{t('program-event1-desc')}</p>
                  </div>
                </div>
                
                <div className="timeline-event">
                  <div className="event-time">15:30 - 16:00</div>
                  <div className="event-content">
                    <h3>{t('program-event2-title')}</h3>
                    <p>{t('program-event2-desc')}</p>
                  </div>
                </div>
                
                <div className="timeline-event">
                  <div className="event-time">16:00 - 17:30</div>
                  <div className="event-content">
                    <h3>{t('program-event3-title')}</h3>
                    <p className="speaker">{t('program-event3-speaker')}</p>
                    <p>{t('program-event3-desc')}</p>
                  </div>
                </div>
                
                <div className="timeline-event">
                  <div className="event-time">17:30 - 21:00</div>
                  <div className="event-content">
                    <h3>{t('program-event4-title')}</h3>
                    <p>{t('program-event4-desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Day 2 */}
            <div className="timeline-day">
              <div className="day-header">
                <div className="day-number">2</div>
                <div className="day-info">
                  <h2>{t('program-day2-title')}</h2>
                  <p className="day-subtitle">{t('program-day2-subtitle')}</p>
                </div>
              </div>
              
              <div className="timeline-events">
                <div className="timeline-event">
                  <div className="event-time">14:00 - 14:30</div>
                  <div className="event-content">
                    <h3>{t('program-event5-title')}</h3>
                    <p>{t('program-event5-desc')}</p>
                  </div>
                </div>
                
                <div className="timeline-event">
                  <div className="event-time">15:00 - 18:00</div>
                  <div className="event-content">
                    <h3>{t('program-event6-title')}</h3>
                    <p>{t('program-event6-desc')}</p>
                  </div>
                </div>
                
                <div className="timeline-event">
                  <div className="event-time">18:00 - 18:30</div>
                  <div className="event-content">
                    <h3>{t('program-event7-title')}</h3>
                    <p>{t('program-event7-desc')}</p>
                  </div>
                </div>
                
                <div className="timeline-event">
                  <div className="event-time">18:30 - 20:00</div>
                  <div className="event-content">
                    <h3>{t('program-event8-title')}</h3>
                    <p className="speaker">{t('program-event8-speaker')}</p>
                    <p>{t('program-event8-desc')}</p>
                  </div>
                </div>
                
                <div className="timeline-event">
                  <div className="event-time">20:00 - 21:00</div>
                  <div className="event-content">
                    <h3>{t('program-event9-title')}</h3>
                    <p>{t('program-event9-desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="highlights-section">
        <div className="container">
          <h2 className="section-title">{t('program-highlights-title')}</h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <h3>{t('program-highlight1-title')}</h3>
              <p>{t('program-highlight1-desc')}</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">
                <i className="fas fa-user-friends"></i>
              </div>
              <h3>{t('program-highlight2-title')}</h3>
              <p>{t('program-highlight2-desc')}</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">
                <i className="fas fa-trophy"></i>
              </div>
              <h3>{t('program-highlight3-title')}</h3>
              <p>{t('program-highlight3-desc')}</p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>{t('program-highlight4-title')}</h3>
              <p>{t('program-highlight4-desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t('program-cta-title')}
        description={t('program-cta-desc')}
        buttonText={t('program-cta-button')}
        buttonHref="/apply"
      />

      <Footer />
    </>
  );
}
