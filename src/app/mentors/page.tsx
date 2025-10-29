'use client';

import { useTranslation } from '@/contexts/TranslationContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';

export default function MentorsPage() {
  const { t } = useTranslation();

  const mentors = [
    {
      id: 1,
      name: t('mentor1-name'),
      role: t('mentor1-role'),
      expertise: t('mentor1-expertise'),
      tags: ['tech', 'product'],
    },
    {
      id: 2,
      name: t('mentor2-name'),
      role: t('mentor2-role'),
      expertise: t('mentor2-expertise'),
      tags: ['tech', 'ai'],
    },
    {
      id: 3,
      name: t('mentor3-name'),
      role: t('mentor3-role'),
      expertise: t('mentor3-expertise'),
      tags: ['business', 'finance'],
    },
    {
      id: 4,
      name: t('mentor4-name'),
      role: t('mentor4-role'),
      expertise: t('mentor4-expertise'),
      tags: ['marketing', 'business'],
    },
    {
      id: 5,
      name: t('mentor5-name'),
      role: t('mentor5-role'),
      expertise: t('mentor5-expertise'),
      tags: ['legal', 'business'],
    },
    {
      id: 6,
      name: t('mentor6-name'),
      role: t('mentor6-role'),
      expertise: t('mentor6-expertise'),
      tags: ['tech', 'product'],
    },
    {
      id: 7,
      name: t('mentor7-name'),
      role: t('mentor7-role'),
      expertise: t('mentor7-expertise'),
      tags: ['agritech', 'tech'],
    },
    {
      id: 8,
      name: t('mentor8-name'),
      role: t('mentor8-role'),
      expertise: t('mentor8-expertise'),
      tags: ['marketplace', 'business'],
    },
    {
      id: 9,
      name: t('mentor9-name'),
      role: t('mentor9-role'),
      expertise: t('mentor9-expertise'),
      tags: ['ai', 'tech'],
    },
    {
      id: 10,
      name: t('mentor10-name'),
      role: t('mentor10-role'),
      expertise: t('mentor10-expertise'),
      tags: ['marketing', 'business'],
    },
    {
      id: 11,
      name: t('mentor11-name'),
      role: t('mentor11-role'),
      expertise: t('mentor11-expertise'),
      tags: ['fintech', 'business'],
    },
  ];

  const jury = [
    {
      id: 1,
      name: t('jury1-name'),
      role: t('jury1-role'),
      expertise: t('jury1-expertise'),
      tags: ['finance', 'business'],
    },
    {
      id: 2,
      name: t('jury2-name'),
      role: t('jury2-role'),
      expertise: t('jury2-expertise'),
      tags: ['tech', 'business'],
    },
    {
      id: 3,
      name: t('jury3-name'),
      role: t('jury3-role'),
      expertise: t('jury3-expertise'),
      tags: ['product', 'tech'],
    },
  ];

  return (
    <>
      <Navigation />
      
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{t('mentors-title')}</h1>
          <p className="lead">{t('mentors-subtitle')}</p>
        </div>
      </section>

      {/* Mentors Section */}
      <section className="mentors-section">
        <div className="container">
          <h2 className="section-title">{t('mentors-day1-title')}</h2>
          <p className="section-subtitle">{t('mentors-day1-subtitle')}</p>
          
          <div className="mentors-grid">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="mentor-card" data-expertise={mentor.tags.join(',')}>
                <div className="mentor-image">
                  <img 
                    src="/images/question-mark.svg" 
                    alt="Annonce imminente" 
                    className="mentor-avatar"
                  />
                </div>
                <div className="mentor-info">
                  <h3>{mentor.name}</h3>
                  <p className="mentor-role">{mentor.role}</p>
                  <p className="mentor-expertise">{mentor.expertise}</p>
                  <div className="mentor-tags">
                    {mentor.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jury Section */}
      <section className="jury-section">
        <div className="container">
          <h2 className="section-title">{t('jury-day2-title')}</h2>
          <p className="section-subtitle">{t('jury-day2-subtitle')}</p>
          
          <div className="jury-grid">
            {jury.map((member) => (
              <div key={member.id} className="jury-card" data-expertise={member.tags.join(',')}>
                <div className="jury-image">
                  <img 
                    src="/images/question-mark.svg" 
                    alt="Annonce imminente" 
                    className="jury-avatar"
                  />
                </div>
                <div className="jury-info">
                  <h3>{member.name}</h3>
                  <p className="jury-role">{member.role}</p>
                  <p className="jury-expertise">{member.expertise}</p>
                  <div className="jury-tags">
                    {member.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t('mentors-cta-title')}
        description={t('mentors-cta-desc')}
        buttonText={t('mentors-cta-button')}
        buttonHref="/apply"
      />

      <Footer />
    </>
  );
}
