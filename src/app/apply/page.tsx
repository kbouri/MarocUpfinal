'use client';

import { useState } from 'react';
import { useTranslation } from '@/contexts/TranslationContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CTASection from '@/components/CTASection';
import { supabase } from '@/lib/supabase';

export default function ApplyPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const fieldName = e.target.name as 'pitchDeck' | 'businessPlan';
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Validate required fields
      const requiredFields = ['startupName', 'founders', 'email', 'pitchDescription', 'sector', 'country'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData]) {
          throw new Error(`Le champ ${field} est obligatoire`);
        }
      }

      if (!formData.terms) {
        throw new Error('Vous devez accepter les conditions d\'utilisation');
      }

      if (!formData.pitchDeck) {
        throw new Error('Le pitch deck est obligatoire');
      }

      // Validate pitch deck file
      if (formData.pitchDeck.size > 10 * 1024 * 1024) {
        throw new Error('Le pitch deck ne doit pas dépasser 10MB');
      }

      if (formData.pitchDeck.type !== 'application/pdf') {
        throw new Error('Le pitch deck doit être un PDF');
      }

      // Validate "other" sector field if selected
      if (formData.sector === 'other' && !formData.otherSector.trim()) {
        throw new Error('Veuillez préciser votre secteur d\'activité');
      }

      // Validate business plan if provided
      if (formData.businessPlan) {
        if (formData.businessPlan.size > 10 * 1024 * 1024) {
          throw new Error('Le Business Plan ne doit pas dépasser 10MB');
        }
      }

      // Generate unique filename for pitch deck
      const timestamp = Date.now();
      const sanitizedStartupName = formData.startupName.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const pitchDeckPath = `pitch-decks/${sanitizedStartupName}_${timestamp}.pdf`;

      // Upload pitch deck to Supabase Storage
      const { data: pitchDeckUpload, error: pitchDeckError } = await supabase.storage
        .from('candidatures-files')
        .upload(pitchDeckPath, formData.pitchDeck, {
          contentType: formData.pitchDeck.type,
          upsert: false
        });

      if (pitchDeckError) {
        throw new Error(`Erreur d'upload du pitch deck: ${pitchDeckError.message}`);
      }

      // Get public URL for pitch deck
      const { data: pitchDeckUrlData } = supabase.storage
        .from('candidatures-files')
        .getPublicUrl(pitchDeckPath);

      let businessPlanUrl = null;

      // Upload business plan if provided
      if (formData.businessPlan) {
        const businessPlanExt = formData.businessPlan.name.split('.').pop();
        const businessPlanPath = `business-plans/${sanitizedStartupName}_${timestamp}.${businessPlanExt}`;

        const { data: businessPlanUpload, error: businessPlanError } = await supabase.storage
          .from('candidatures-files')
          .upload(businessPlanPath, formData.businessPlan, {
            contentType: formData.businessPlan.type,
            upsert: false
          });

        if (businessPlanError) {
          throw new Error(`Erreur d'upload du business plan: ${businessPlanError.message}`);
        }

        // Get public URL for business plan
        const { data: businessPlanUrlData } = supabase.storage
          .from('candidatures-files')
          .getPublicUrl(businessPlanPath);

        businessPlanUrl = businessPlanUrlData.publicUrl;
      }

      // Add business plan info to additional info if provided
      let additionalInfoText = formData.additionalInfo.trim();
      if (businessPlanUrl) {
        additionalInfoText += `\n\n[Business Plan URL: ${businessPlanUrl}]`;
      }

      // Prepare data for Supabase
      const applicationData = {
        nom_startup: formData.startupName.trim(),
        nom_fondateurs: formData.founders.trim(),
        email: formData.email.trim(),
        pitch_court: formData.pitchDescription.trim(),
        secteur: formData.sector === 'other' ? formData.otherSector.trim() : formData.sector,
        pays_residence: formData.country,
        lien_prototype: formData.prototypeLink.trim() || null,
        lien_video: formData.videoLink.trim() || null,
        informations_complementaires: additionalInfoText || null,
        pitch_deck_url: pitchDeckUrlData.publicUrl,
      };

      // Submit to Supabase
      const { error } = await supabase
        .from('candidatures')
        .insert([applicationData])
        .select();

      if (error) {
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      setSubmitStatus('success');
      setFormData({
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

  return (
    <>
      <Navigation />
      
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <h1>{t('apply-title')}</h1>
          <p className="lead">{t('apply-subtitle')}</p>
        </div>
      </section>

      {/* Call for Applications */}
      <section className="call-section">
        <div className="container">
          <div className="call-box">
            <div className="call-content">
              <h2 dangerouslySetInnerHTML={{ __html: t('apply-call-title') }}></h2>
              <p className="deadline" dangerouslySetInnerHTML={{ __html: t('apply-deadline') }}></p>
              <p>{t('apply-call-desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="eligibility-section">
        <div className="container">
          <h2 className="section-title">{t('apply-eligibility-title')}</h2>
          <div className="eligibility-grid">
            <div className="eligibility-item">
              <div className="eligibility-icon">
                <i className="fas fa-user-check"></i>
              </div>
              <h3>{t('apply-eligibility1-title')}</h3>
              <p>{t('apply-eligibility1-desc')}</p>
            </div>
            <div className="eligibility-item">
              <div className="eligibility-icon">
                <i className="fas fa-seedling"></i>
              </div>
              <h3>{t('apply-eligibility2-title')}</h3>
              <p>{t('apply-eligibility2-desc')}</p>
            </div>
            <div className="eligibility-item">
              <div className="eligibility-icon">
                <i className="fas fa-globe"></i>
              </div>
              <h3>{t('apply-eligibility3-title')}</h3>
              <p>{t('apply-eligibility3-desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="form-section">
        <div className="container">
          <h2 className="section-title">{t('apply-form-title')}</h2>
          
          {submitStatus === 'success' && (
            <div className="form-messages">
              <div className="alert alert-success">
                <i className="fas fa-check-circle"></i>
                <span>{t('apply-success')}</span>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="form-messages">
              <div className="alert alert-error">
                <i className="fas fa-exclamation-circle"></i>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="application-form">
            <div className="form-group">
              <label htmlFor="startupName">{t('apply-field-startup')}</label>
              <input
                type="text"
                id="startupName"
                name="startupName"
                value={formData.startupName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="founders">{t('apply-field-founders')}</label>
              <input
                type="text"
                id="founders"
                name="founders"
                value={formData.founders}
                onChange={handleInputChange}
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
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="pitchDescription">{t('apply-field-pitch')}</label>
              <textarea
                id="pitchDescription"
                name="pitchDescription"
                value={formData.pitchDescription}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                placeholder={t('apply-placeholder-pitch')}
                required
              />
              <div className="char-counter">
                {formData.pitchDescription.length}/500
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="sector">{t('apply-field-sector')}</label>
              <select
                id="sector"
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
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

            {formData.sector === 'other' && (
              <div className="form-group">
                <label htmlFor="otherSector">{t('apply-field-other-sector')}</label>
                <input
                  type="text"
                  id="otherSector"
                  name="otherSector"
                  value={formData.otherSector}
                  onChange={handleInputChange}
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
                value={formData.prototypeLink}
                onChange={handleInputChange}
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
                  onChange={handleFileChange}
                  required
                />
                <label htmlFor="pitchDeck" className="file-label">
                  <i className="fas fa-upload"></i>
                  <span>{formData.pitchDeck ? formData.pitchDeck.name : t('apply-file-choose')}</span>
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
                  onChange={handleFileChange}
                />
                <label htmlFor="businessPlan" className="file-label">
                  <i className="fas fa-upload"></i>
                  <span>{formData.businessPlan ? formData.businessPlan.name : t('apply-file-choose')}</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="videoLink">{t('apply-field-video')}</label>
              <input
                type="url"
                id="videoLink"
                name="videoLink"
                value={formData.videoLink}
                onChange={handleInputChange}
                placeholder={t('apply-placeholder-video')}
              />
            </div>

            <div className="form-group">
              <label htmlFor="country">{t('apply-field-country')}</label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
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
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={3}
                placeholder={t('apply-placeholder-additional')}
              />
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleInputChange}
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
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title={t('apply-cta-title')}
        description={t('apply-cta-desc')}
        buttonText={t('apply-cta-button')}
        buttonHref="mailto:contact@marocup.com"
      />

      <Footer />
    </>
  );
}
