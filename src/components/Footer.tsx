'use client';

import { useTranslation } from '@/contexts/TranslationContext';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MarocUp</h3>
            <p>{t('footer-tagline')}</p>
          </div>
          <div className="footer-section">
            <h4>{t('footer-contact')}</h4>
            <p><i className="fas fa-envelope"></i> contact@marocup.com</p>
            <p><i className="fas fa-map-marker-alt"></i> Rabat, Maroc</p>
          </div>
          <div className="footer-section">
            <h4>{t('footer-follow')}</h4>
            <div className="social-links">
              <a href="https://www.linkedin.com/company/marocup/" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://www.instagram.com/marocup_?igsh=MW9mbWM1MWVhdHlhcg==" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MarocUp. <span>{t('footer-copyright')}</span></p>
        </div>
      </div>
    </footer>
  );
}
