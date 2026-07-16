'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

const templates = [
  { id: 'modern', name: 'Moderne', description: 'Design épuré avec animations subtiles', preview: '🎨' },
  { id: 'classic', name: 'Classique', description: 'Style traditionnel et professionnel', preview: '📋' },
  { id: 'minimal', name: 'Minimaliste', description: 'Ultra-simple avec focus sur le contenu', preview: '⬜' },
  { id: 'bold', name: 'Audacieux', description: 'Couleurs vives et typographie impactante', preview: '🔥' },
] as const;

const businessTypes = [
  'Restaurant',
  'Boutique',
  'Salon de coiffure',
  'Cabinet médical',
  'Avocat',
  'Architecte',
  'Agence immobilière',
  'Auto-école',
  'Fitness / Salle de sport',
  'Autre',
];

const colorPresets = [
  { name: 'Bleu Professionnel', primary: '#2563eb', secondary: '#1e40af', accent: '#60a5fa' },
  { name: 'Vert Nature', primary: '#16a34a', secondary: '#15803d', accent: '#4ade80' },
  { name: 'Rouge Énergique', primary: '#dc2626', secondary: '#b91c1c', accent: '#f87171' },
  { name: 'Violet Créatif', primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa' },
  { name: 'Orange Chaud', primary: '#ea580c', secondary: '#c2410c', accent: '#fb923c' },
  { name: 'Noir & Blanc', primary: '#171717', secondary: '#404040', accent: '#a3a3a3' },
];

export default function WebsitesPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedSite, setGeneratedSite] = useState<{
    id: string;
    subdomain: string;
    html: string;
    previewUrl: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [description, setDescription] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    address: '',
  });
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'classic' | 'minimal' | 'bold'>('modern');
  const [selectedColors, setSelectedColors] = useState(colorPresets[0]);

  const handleAddService = () => {
    if (newService.trim() && !services.includes(newService.trim())) {
      setServices([...services, newService.trim()]);
      setNewService('');
    }
  };

  const handleRemoveService = (service: string) => {
    setServices(services.filter((s) => s !== service));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/websites/generate', {
        businessName,
        businessType,
        description,
        services,
        contactInfo,
        colors: {
          primary: selectedColors.primary,
          secondary: selectedColors.secondary,
          accent: selectedColors.accent,
        },
        template: selectedTemplate,
      });

      setGeneratedSite(response.data);
      setStep(3);
    } catch (err) {
      setError('Erreur lors de la génération du site web');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedSite) return;

    try {
      await api.post(`/websites/${generatedSite.id}/publish`);
      alert('Site publié avec succès !');
    } catch (err) {
      setError('Erreur lors de la publication du site');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Génération de Site Web Vitrine</h1>
          <p className="text-gray-600 mt-2">
            Créez un site web professionnel pour votre entreprise en quelques minutes grâce à l'IA.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 ${
                      step > s ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-600">
              {step === 1 && 'Informations'}
              {step === 2 && 'Personnalisation'}
              {step === 3 && 'Résultat'}
            </span>
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Informations de votre entreprise</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'entreprise *
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ma Belle Entreprise"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d'activité *
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez un type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description de votre activité *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez votre entreprise en quelques phrases..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Services proposés
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
                    placeholder="Ajouter un service..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddService}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {service}
                      <button
                        onClick={() => handleRemoveService(service)}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    placeholder="contact@exemple.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                    placeholder="123 Rue Principale, 75001 Paris"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!businessName || !businessType || !description}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Customization */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Personnalisation du site</h2>
            
            <div className="space-y-8">
              {/* Template Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choisir un template
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 border-2 rounded-xl text-center transition-all ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{template.preview}</div>
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Palette de couleurs
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setSelectedColors(preset)}
                      className={`p-3 border-2 rounded-xl transition-all ${
                        selectedColors.name === preset.name
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex gap-1 mb-2">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.secondary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: preset.accent }}
                        />
                      </div>
                      <div className="text-xs font-medium text-gray-700">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Aperçu des couleurs
                </label>
                <div
                  className="h-24 rounded-xl flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: selectedColors.primary }}
                >
                  Couleur Primaire
                </div>
                <div className="flex gap-4 mt-4">
                  <div
                    className="flex-1 h-16 rounded-lg flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: selectedColors.secondary }}
                  >
                    Secondaire
                  </div>
                  <div
                    className="flex-1 h-16 rounded-lg flex items-center justify-center text-gray-800 font-medium"
                    style={{ backgroundColor: selectedColors.accent }}
                  >
                    Accent
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                >
                  ← Retour
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Génération en cours...
                    </span>
                  ) : (
                    'Générer le site'
                  )}
                </button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && generatedSite && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Votre site web est prêt !</h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                ✓ Généré
              </span>
            </div>

            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">Sous-domaine</div>
              <div className="text-lg font-mono text-blue-600">
                https://{generatedSite.subdomain}.marketingai.dev
              </div>
            </div>

            {/* Preview */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 mb-6">
              <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-96">
                <iframe
                  srcDoc={generatedSite.html}
                  className="w-full h-80 bg-white rounded border"
                  title="Website Preview"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePublish}
                className="flex-1 py-3 px-6 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                🚀 Publier le site
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setGeneratedSite(null);
                }}
                className="py-3 px-6 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Créer un autre site
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}