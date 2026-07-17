'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

type QrCodeType = 'menu' | 'poster' | 'vcard' | 'wifi' | 'custom';

export default function QrCodePage() {
  const [activeTab, setActiveTab] = useState<QrCodeType>('menu');
  const [loading, setLoading] = useState(false);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Menu QR
  const [restaurantName, setRestaurantName] = useState('');
  const [menuUrl, setMenuUrl] = useState('');

  // Poster QR
  const [campaignName, setCampaignName] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  // VCard QR
  const [fullName, setFullName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  // WiFi QR
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiType, setWifiType] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  // Custom QR
  const [customContent, setCustomContent] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setQrCodeImage(null);

    try {
      let endpoint = '/qr-code/';
      let payload: Record<string, unknown> = {};

      switch (activeTab) {
        case 'menu':
          endpoint += 'menu';
          payload = { restaurantName, menuUrl, size: 300 };
          break;
        case 'poster':
          endpoint += 'poster';
          payload = { campaignName, posterUrl, size: 300 };
          break;
        case 'vcard':
          endpoint += 'vcard';
          payload = { fullName, jobTitle, company, phone, email, website, size: 300 };
          break;
        case 'wifi':
          endpoint += 'wifi';
          payload = { ssid: wifiSsid, password: wifiPassword, type: wifiType, size: 300 };
          break;
        case 'custom':
          endpoint += 'generate';
          payload = { content: customContent, size: 300 };
          break;
      }

      const response = await api.post(endpoint, payload);
      if (response.data.success && response.data.data) {
        setQrCodeImage(response.data.data.base64);
      } else {
        throw new Error(response.data.error || 'Erreur lors de la génération');
      }
    } catch (err) {
      setError('Erreur lors de la génération du code QR');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeImage) return;
    
    const link = document.createElement('a');
    link.href = qrCodeImage;
    link.download = `qrcode-${activeTab}.png`;
    link.click();
  };

  const tabs = [
    { id: 'menu', label: 'Menu Restaurant', icon: '🍽️' },
    { id: 'poster', label: 'Affiche', icon: '📄' },
    { id: 'vcard', label: 'vCard', icon: '👤' },
    { id: 'wifi', label: 'WiFi', icon: '📶' },
    { id: 'custom', label: 'Personnalisé', icon: '✏️' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Génération de Code QR</h1>
          <p className="text-gray-600 mt-2">
            Créez des codes QR personnalisés pour vos menus, affiches, cartes de visite et plus encore.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setQrCodeImage(null);
                  setError(null);
                }}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form */}
              <div className="space-y-4">
                {activeTab === 'menu' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du restaurant
                      </label>
                      <input
                        type="text"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                        placeholder="Mon Restaurant"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL du menu en ligne
                      </label>
                      <input
                        type="url"
                        value={menuUrl}
                        onChange={(e) => setMenuUrl(e.target.value)}
                        placeholder="https://menu.example.com/mon-restaurant"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'poster' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom de la campagne
                      </label>
                      <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Promo Été 2024"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL de l'affiche
                      </label>
                      <input
                        type="url"
                        value={posterUrl}
                        onChange={(e) => setPosterUrl(e.target.value)}
                        placeholder="https://example.com/affiche-promo"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'vcard' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Jean Dupont"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Poste
                        </label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="Directeur Marketing"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Entreprise
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Ma Société SARL"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
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
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="contact@exemple.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site web
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://www.masociete.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </>
                )}

                {activeTab === 'wifi' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom du réseau (SSID)
                      </label>
                      <input
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        placeholder="MonWiFi"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mot de passe
                      </label>
                      <input
                        type="text"
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        placeholder="Mot de passe WiFi"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type de sécurité
                      </label>
                      <select
                        value={wifiType}
                        onChange={(e) => setWifiType(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">Aucun</option>
                      </select>
                    </div>
                  </>
                )}

                {activeTab === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenu personnalisé
                    </label>
                    <textarea
                      value={customContent}
                      onChange={(e) => setCustomContent(e.target.value)}
                      placeholder="Entrez le contenu de votre code QR (URL, texte, etc.)"
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Génération en cours...
                    </span>
                  ) : (
                    'Générer le code QR'
                  )}
                </button>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-sm aspect-square bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                  {qrCodeImage ? (
                    <img
                      src={qrCodeImage}
                      alt="Code QR généré"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                      <p>Votre code QR apparaîtra ici</p>
                    </div>
                  )}
                </div>

                {qrCodeImage && (
                  <button
                    onClick={handleDownload}
                    className="mt-6 w-full max-w-sm py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Télécharger le code QR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}