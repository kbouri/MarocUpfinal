'use client';

import { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { uploadFile, submitStartupApplication, submitAttendeeRegistration } from '@/lib/api';

type ApplicationType = 'startup' | 'attendee' | null;

export default function ApplyPage() {
  const { t } = useTranslation();
  const [applicationType, setApplicationType] = useState<ApplicationType>(null);
  
  // État pour le formulaire startup
  const [startupFormData, setStartupFormData] = useState({
    startupName: '',
    founders: '',
    email: '',
    pitchDescription: '',
    sector: '',
    otherSector: '',
    prototypeLink: '',
    pitchDeck: null as File | null,
    businessPlan: null as File | null,
    videoLink: '',
    country: '',
    additionalInfo: '',
    terms: false,
  });

  // État pour le formulaire invité
  const [attendeeFormData, setAttendeeFormData] = useState({
    nomComplet: '',
    email: '',
    telephone: '',
    entreprise: '',
    poste: '',
    secteurActivite: '',
    raisonParticipation: '',
    message: '',
    terms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Handlers pour le formulaire startup
  const handleStartupInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setStartupFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setStartupFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStartupFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const fieldName = e.target.name as 'pitchDeck' | 'businessPlan';
    setStartupFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  // Handlers pour le formulaire invité
  const handleAttendeeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setAttendeeFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setAttendeeFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Soumission du formulaire startup
  const handleStartupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Validation des champs requis
      const requiredFields = ['startupName', 'founders', 'email', 'pitchDescription', 'sector', 'country'];
      for (const field of requiredFields) {
        if (!startupFormData[field as keyof typeof startupFormData]) {
          throw new Error(`Le champ ${field} est obligatoire`);
        }
      }

      if (!startupFormData.terms) {
        throw new Error('Vous devez accepter les conditions d\'utilisation');
      }

      if (!startupFormData.pitchDeck) {
        throw new Error('Le pitch deck est obligatoire');
      }

      // Validation du fichier pitch deck
      if (startupFormData.pitchDeck.size > 50 * 1024 * 1024) {
        throw new Error('Le pitch deck ne doit pas dépasser 50MB');
      }

      if (startupFormData.pitchDeck.type !== 'application/pdf') {
        throw new Error('Le pitch deck doit être un PDF');
      }

      // Validation secteur "autre"
      if (startupFormData.sector === 'other' && !startupFormData.otherSector.trim()) {
        throw new Error('Veuillez préciser votre secteur d\'activité');
      }

      // Validation business plan si fourni
      if (startupFormData.businessPlan) {
        if (startupFormData.businessPlan.size > 50 * 1024 * 1024) {
          throw new Error('Le Business Plan ne doit pas dépasser 50MB');
        }
      }

      // Upload du pitch deck vers Cloudinary
      const pitchDeckUrl = await uploadFile(startupFormData.pitchDeck);

      // Upload du business plan si fourni
      let businessPlanUrl = null;
      if (startupFormData.businessPlan) {
        businessPlanUrl = await uploadFile(startupFormData.businessPlan);
      }

      // Ajouter l'info du business plan dans les infos complémentaires
      let additionalInfoText = startupFormData.additionalInfo.trim();
      if (businessPlanUrl) {
        additionalInfoText += `\n\n[Business Plan URL: ${businessPlanUrl}]`;
      }

      // Préparer les données pour l'API
      const applicationData = {
        nom_startup: startupFormData.startupName.trim(),
        nom_fondateurs: startupFormData.founders.trim(),
        email: startupFormData.email.trim(),
        pitch_court: startupFormData.pitchDescription.trim(),
        secteur: startupFormData.sector === 'other' ? startupFormData.otherSector.trim() : startupFormData.sector,
        pays_residence: startupFormData.country,
        lien_prototype: startupFormData.prototypeLink.trim() || null,
        lien_video: startupFormData.videoLink.trim() || null,
        informations_complementaires: additionalInfoText || null,
        pitch_deck_url: pitchDeckUrl,
        business_plan_url: businessPlanUrl,
      };

      // Envoyer via API route
      await submitStartupApplication(applicationData);

      setSubmitStatus('success');
      setStartupFormData({
        startupName: '',
        founders: '',
        email: '',
        pitchDescription: '',
        sector: '',
        otherSector: '',
        prototypeLink: '',
        pitchDeck: null,
        businessPlan: null,
        videoLink: '',
        country: '',
        additionalInfo: '',
        terms: false,
      });

    } catch (error) {
      console.error('Erreur:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'envoi de votre candidature.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Soumission du formulaire invité
  const handleAttendeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Validation des champs requis
      if (!attendeeFormData.nomComplet.trim()) {
        throw new Error('Le nom complet est obligatoire');
      }
      if (!attendeeFormData.email.trim()) {
        throw new Error('L\'email est obligatoire');
      }
      if (!attendeeFormData.telephone.trim()) {
        throw new Error('Le téléphone est obligatoire');
      }
      if (!attendeeFormData.terms) {
        throw new Error('Vous devez accepter les conditions d\'utilisation');
      }

      // Préparer les données
      const attendeeData = {
        nomComplet: attendeeFormData.nomComplet.trim(),
        email: attendeeFormData.email.trim(),
        telephone: attendeeFormData.telephone.trim(),
        entreprise: attendeeFormData.entreprise.trim() || null,
        poste: attendeeFormData.poste.trim() || null,
        secteurActivite: attendeeFormData.secteurActivite || null,
        raisonParticipation: attendeeFormData.raisonParticipation.trim() || null,
        message: attendeeFormData.message.trim() || null,
      };

      // Envoyer via API route
      await submitAttendeeRegistration(attendeeData);

      setSubmitStatus('success');
      setAttendeeFormData({
        nomComplet: '',
        email: '',
        telephone: '',
        entreprise: '',
        poste: '',
        secteurActivite: '',
        raisonParticipation: '',
        message: '',
        terms: false,
      });

    } catch (error) {
      console.error('Erreur:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue lors de votre inscription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si aucun type n'est sélectionné, afficher le menu de sélection
  if (!applicationType) {
  return (
    <>
      <Navigation />
      
      <section className="page-header">
        <div className="container">
          <h1>{t('apply-title')}</h1>
          <p className="lead">{t('apply-subtitle')}</p>
        </div>
      </section>

        <section className="eligibility-section">
        <div className="container">
            <h2 className="section-title">{t('apply-select-type-title')}</h2>
            
            <div className="eligibility-grid" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Option Startup */}
              <div 
                className="eligibility-item" 
                onClick={() => setApplicationType('startup')}
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="eligibility-icon">
                  <i className="fas fa-rocket"></i>
                </div>
                <h3>{t('apply-startup-title')}</h3>
                <p>{t('apply-startup-desc')}</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  {t('apply-startup-button')}
                </button>
              </div>

              {/* Option Invité */}
              <div 
                className="eligibility-item"
                onClick={() => setApplicationType('attendee')}
                style={{ cursor: 'pointer', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div className="eligibility-icon">
                  <i className="fas fa-user"></i>
                </div>
                <h3>{t('apply-attendee-title')}</h3>
                <p>{t('apply-attendee-desc')}</p>
                <button className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  {t('apply-attendee-button')}
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </>
    );
  }

  // Formulaire Startup
  if (applicationType === 'startup') {
    return (
      <>
        <Navigation />
        
        <section className="page-header">
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <button 
                onClick={() => setApplicationType(null)}
                className="btn"
                style={{ background: '#f0f0f0', border: 'none' }}
              >
                <i className="fas fa-arrow-left"></i> {t('apply-back')}
              </button>
              <h1 style={{ margin: 0 }}>{t('apply-title')}</h1>
            </div>
            <p className="lead">{t('apply-startup-form-title')}</p>
        </div>
      </section>

      <section className="eligibility-section">
        <div className="container">
          <h2 className="section-title">{t('apply-eligibility-title')}</h2>
          <div className="eligibility-grid">
            <div className="eligibility-item">
                <div className="eligibility-icon"><i className="fas fa-user-check"></i></div>
              <h3>{t('apply-eligibility1-title')}</h3>
              <p>{t('apply-eligibility1-desc')}</p>
            </div>
            <div className="eligibility-item">
                <div className="eligibility-icon"><i className="fas fa-seedling"></i></div>
              <h3>{t('apply-eligibility2-title')}</h3>
              <p>{t('apply-eligibility2-desc')}</p>
            </div>
            <div className="eligibility-item">
                <div className="eligibility-icon"><i className="fas fa-globe"></i></div>
              <h3>{t('apply-eligibility3-title')}</h3>
              <p>{t('apply-eligibility3-desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="form-section">
        <div className="container">
          {submitStatus === 'success' ? (
            <div className="success-screen">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 className="success-title">{t('apply-success')}</h2>
              <p className="success-message-text">
                {t('apply-success-detail')}
              </p>
              <button 
                onClick={() => {
                  setApplicationType(null);
                  setSubmitStatus('idle');
                }}
                className="btn btn-primary"
                style={{ marginTop: '2rem' }}
              >
                {t('apply-back-to-home')}
              </button>
            </div>
          ) : (
            <>
              <h2 className="section-title">{t('apply-form-title')}</h2>
              
              {submitStatus === 'error' && (
                <div className="form-messages">
                  <div className="alert alert-error">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleStartupSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="startupName">{t('apply-field-startup')}</label>
              <input
                type="text"
                id="startupName"
                name="startupName"
                  value={startupFormData.startupName}
                  onChange={handleStartupInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="founders">{t('apply-field-founders')}</label>
              <input
                type="text"
                id="founders"
                name="founders"
                  value={startupFormData.founders}
                  onChange={handleStartupInputChange}
                placeholder={t('apply-placeholder-founders')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('apply-field-email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={startupFormData.email}
                onChange={handleStartupInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pitchDescription">{t('apply-field-pitch')}</label>
              <textarea
                id="pitchDescription"
                name="pitchDescription"
                  value={startupFormData.pitchDescription}
                  onChange={handleStartupInputChange}
                rows={4}
                maxLength={500}
                placeholder={t('apply-placeholder-pitch')}
                required
              />
              <div className="char-counter">
                  {startupFormData.pitchDescription.length}/500
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="sector">{t('apply-field-sector')}</label>
              <select
                id="sector"
                name="sector"
                  value={startupFormData.sector}
                  onChange={handleStartupInputChange}
                required
              >
                <option value="">{t('apply-select-sector')}</option>
                <option value="fintech">Fintech</option>
                <option value="edtech">Edtech</option>
                <option value="healthtech">Healthtech</option>
                <option value="legaltech">Legaltech</option>
                <option value="saas">SaaS</option>
                <option value="ai">Intelligence Artificielle</option>
                <option value="deeptech">Deeptech</option>
                <option value="foodtech">Foodtech</option>
                <option value="climate">Climate Tech</option>
                <option value="mobility">Mobilité</option>
                <option value="social-impact">Impact Social</option>
                <option value="marketplace">Marketplace</option>
                <option value="ecommerce">E-commerce</option>
                <option value="other">Autre</option>
              </select>
            </div>

              {startupFormData.sector === 'other' && (
              <div className="form-group">
                <label htmlFor="otherSector">{t('apply-field-other-sector')}</label>
                <input
                  type="text"
                  id="otherSector"
                  name="otherSector"
                    value={startupFormData.otherSector}
                    onChange={handleStartupInputChange}
                  placeholder={t('apply-placeholder-other-sector')}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="prototypeLink">{t('apply-field-prototype')}</label>
              <input
                type="url"
                id="prototypeLink"
                name="prototypeLink"
                  value={startupFormData.prototypeLink}
                  onChange={handleStartupInputChange}
                placeholder={t('apply-placeholder-prototype')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="pitchDeck">{t('apply-field-pitchdeck')}</label>
              <div className="file-upload">
                <input
                  type="file"
                  id="pitchDeck"
                  name="pitchDeck"
                  accept=".pdf"
                    onChange={handleStartupFileChange}
                  required
                />
                <label htmlFor="pitchDeck" className="file-label">
                  <i className="fas fa-upload"></i>
                    <span>{startupFormData.pitchDeck ? startupFormData.pitchDeck.name : t('apply-file-choose')}</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="businessPlan">{t('apply-field-businessplan')}</label>
              <div className="file-upload">
                <input
                  type="file"
                  id="businessPlan"
                  name="businessPlan"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleStartupFileChange}
                />
                <label htmlFor="businessPlan" className="file-label">
                  <i className="fas fa-upload"></i>
                    <span>{startupFormData.businessPlan ? startupFormData.businessPlan.name : t('apply-file-choose')}</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="videoLink">{t('apply-field-video')}</label>
              <input
                type="url"
                id="videoLink"
                name="videoLink"
                  value={startupFormData.videoLink}
                  onChange={handleStartupInputChange}
                placeholder={t('apply-placeholder-video')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">{t('apply-field-country')}</label>
              <select
                id="country"
                name="country"
                  value={startupFormData.country}
                  onChange={handleStartupInputChange}
                required
              >
                <option value="">{t('apply-select-country')}</option>
                <option value="morocco">Maroc</option>
                <option value="france">France</option>
                <option value="canada">Canada</option>
                <option value="belgium">Belgique</option>
                <option value="netherlands">Pays-Bas</option>
                <option value="germany">Allemagne</option>
                <option value="uk">Royaume-Uni</option>
                <option value="usa">États-Unis</option>
                <option value="uae">Émirats Arabes Unis</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="additionalInfo">{t('apply-field-additional')}</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                  value={startupFormData.additionalInfo}
                  onChange={handleStartupInputChange}
                rows={3}
                placeholder={t('apply-placeholder-additional')}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="terms"
                    checked={startupFormData.terms}
                    onChange={handleStartupInputChange}
                  required
                />
                <span dangerouslySetInnerHTML={{ __html: t('apply-terms') }}></span>
              </label>
            </div>

            <div className="form-submit">
              <button type="submit" className="btn btn-primary btn-large" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    <span>{t('apply-submit')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
            </>
          )}
        </div>
      </section>

        <Footer />
      </>
    );
  }

  // Formulaire Invité
  return (
    <>
      <Navigation />
      
      <section className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              onClick={() => setApplicationType(null)}
              className="btn"
              style={{ background: '#f0f0f0', border: 'none' }}
            >
                <i className="fas fa-arrow-left"></i> {t('apply-back')}
            </button>
            <h1 style={{ margin: 0 }}>{t('apply-attendee-page-title')}</h1>
          </div>
          <p className="lead">{t('apply-attendee-page-subtitle')}</p>
        </div>
      </section>

      <section className="call-section">
        <div className="container">
          <div className="call-box">
            <div className="call-content">
              <h2>{t('apply-attendee-call-title')}</h2>
              <p>{t('apply-attendee-call-desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="form-section">
        <div className="container">
          {submitStatus === 'success' ? (
            <div className="success-screen">
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 className="success-title">{t('apply-attendee-success')}</h2>
              <p className="success-message-text">
                {t('apply-attendee-success-detail')}
              </p>
              <button 
                onClick={() => {
                  setApplicationType(null);
                  setSubmitStatus('idle');
                }}
                className="btn btn-primary"
                style={{ marginTop: '2rem' }}
              >
                {t('apply-back-to-home')}
              </button>
            </div>
          ) : (
            <>
              <h2 className="section-title">{t('apply-attendee-form-title')}</h2>
              
              {submitStatus === 'error' && (
                <div className="form-messages">
                  <div className="alert alert-error">
                    <i className="fas fa-exclamation-circle"></i>
                    <span>{errorMessage}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleAttendeeSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="nomComplet">{t('apply-attendee-field-nom')}</label>
              <input
                type="text"
                id="nomComplet"
                name="nomComplet"
                value={attendeeFormData.nomComplet}
                onChange={handleAttendeeInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t('apply-attendee-field-email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={attendeeFormData.email}
                onChange={handleAttendeeInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="telephone">{t('apply-attendee-field-phone')}</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={attendeeFormData.telephone}
                onChange={handleAttendeeInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="entreprise">{t('apply-attendee-field-company')}</label>
              <input
                type="text"
                id="entreprise"
                name="entreprise"
                value={attendeeFormData.entreprise}
                onChange={handleAttendeeInputChange}
                placeholder={t('apply-attendee-placeholder-company')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="poste">{t('apply-attendee-field-poste')}</label>
              <input
                type="text"
                id="poste"
                name="poste"
                value={attendeeFormData.poste}
                onChange={handleAttendeeInputChange}
                placeholder={t('apply-attendee-placeholder-poste')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="secteurActivite">{t('apply-attendee-field-secteur')}</label>
              <select
                id="secteurActivite"
                name="secteurActivite"
                value={attendeeFormData.secteurActivite}
                onChange={handleAttendeeInputChange}
              >
                <option value="">{t('apply-attendee-select-secteur')}</option>
                <option value="tech">Tech</option>
                <option value="finance">Finance</option>
                <option value="education">Éducation</option>
                <option value="healthcare">Santé</option>
                <option value="consulting">Consulting</option>
                <option value="media">Média</option>
                <option value="investor">Investisseur</option>
                <option value="other">Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="raisonParticipation">{t('apply-attendee-field-raison')}</label>
              <textarea
                id="raisonParticipation"
                name="raisonParticipation"
                value={attendeeFormData.raisonParticipation}
                onChange={handleAttendeeInputChange}
                rows={3}
                placeholder={t('apply-attendee-placeholder-raison')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">{t('apply-attendee-field-message')}</label>
              <textarea
                id="message"
                name="message"
                value={attendeeFormData.message}
                onChange={handleAttendeeInputChange}
                rows={3}
                placeholder={t('apply-attendee-placeholder-message')}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="terms"
                  checked={attendeeFormData.terms}
                  onChange={handleAttendeeInputChange}
                  required
                />
                <span dangerouslySetInnerHTML={{ __html: t('apply-terms') }}></span>
              </label>
            </div>

            <div className="form-submit">
              <button type="submit" className="btn btn-primary btn-large" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    <span>{t('apply-attendee-submit')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
