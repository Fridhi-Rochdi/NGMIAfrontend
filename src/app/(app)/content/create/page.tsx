"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { SparklesIcon, CopyIcon, TrashIcon, CheckCircleIcon, CalendarIcon } from '@/components/icons';
import { useContentStore } from '@/lib/store/content-store';
import type { ContentItem } from '@/types';

const CONTENT_BUSINESS_PROFILES: Record<string, {
  label: string;
  topicLabel: string;
  topicPlaceholder: string;
  audience: string;
  tone: string;
  callToAction: string;
  hashtags: string;
  tip: string;
}> = {
  RESTAURANT: { label: 'Restaurant', topicLabel: 'Plat, expérience ou offre à promouvoir', topicPlaceholder: 'Ex. Nouveau menu méditerranéen de printemps, produits locaux et formule déjeuner à 29 €.', audience: 'Habitants locaux, amateurs de gastronomie et visiteurs', tone: 'friendly', callToAction: 'Réservez votre table', hashtags: '#restaurant #gastronomie #food', tip: 'Décrivez les saveurs, l’expérience et la raison concrète de réserver.' },
  CAFE: { label: 'Café', topicLabel: 'Boisson, gourmandise ou moment à promouvoir', topicPlaceholder: 'Ex. Nouveau latte pistache, brunch du dimanche et pâtisseries faites maison.', audience: 'Étudiants, actifs, amateurs de café et clients du quartier', tone: 'playful', callToAction: 'Venez le découvrir aujourd’hui', hashtags: '#cafe #coffeelover #brunch', tip: 'Vendez un moment et une ambiance, pas uniquement une boisson.' },
  RETAIL: { label: 'Commerce / Boutique', topicLabel: 'Produit, collection ou offre', topicPlaceholder: 'Ex. Nouvelle collection estivale responsable disponible en boutique.', audience: 'Clients recherchant des produits de qualité et des nouveautés', tone: 'friendly', callToAction: 'Découvrez la collection', hashtags: '#nouveaute #shopping #boutique', tip: 'Mettez le bénéfice produit avant les caractéristiques techniques.' },
  EVENT: { label: 'Événement', topicLabel: 'Événement ou temps fort', topicPlaceholder: 'Ex. Conférence NextGen, le 18 septembre à Tunis, avec 12 intervenants.', audience: 'Professionnels et personnes intéressées par la thématique', tone: 'authoritative', callToAction: 'Réservez votre place', hashtags: '#event #conference #networking', tip: 'Date, lieu, promesse et inscription doivent être immédiatement visibles.' },
  REAL_ESTATE: { label: 'Immobilier', topicLabel: 'Bien ou service immobilier', topicPlaceholder: 'Ex. Villa contemporaine de 240 m² à La Marsa avec piscine et vue mer.', audience: 'Acheteurs, investisseurs et familles en recherche active', tone: 'professional', callToAction: 'Planifiez une visite', hashtags: '#immobilier #avendre #investissement', tip: 'Restez factuel : localisation, surface, atouts et prochaine action.' },
  HEALTH: { label: 'Santé et bien-être', topicLabel: 'Service ou campagne informative', topicPlaceholder: 'Ex. Journée de dépistage sur rendez-vous avec notre équipe médicale.', audience: 'Patients et personnes concernées par ce service', tone: 'professional', callToAction: 'Prenez rendez-vous', hashtags: '#sante #bienetre #prevention', tip: 'Employez un ton rassurant sans inventer de résultat ou de promesse médicale.' },
  EDUCATION: { label: 'Éducation / Formation', topicLabel: 'Formation, programme ou inscription', topicPlaceholder: 'Ex. Formation pratique Data & IA de 12 semaines, inscriptions ouvertes.', audience: 'Étudiants, professionnels en reconversion et entreprises', tone: 'authoritative', callToAction: 'Consultez le programme', hashtags: '#formation #education #competences', tip: 'Précisez le public, les acquis, la durée et les modalités d’inscription.' },
  SERVICES: { label: 'Services professionnels', topicLabel: 'Service, expertise ou problème résolu', topicPlaceholder: 'Ex. Accompagnement comptable mensuel pour PME et indépendants.', audience: 'Entreprises et particuliers recherchant cette expertise', tone: 'professional', callToAction: 'Demandez votre devis', hashtags: '#services #expertise #entreprise', tip: 'Partez du problème client, expliquez votre méthode et terminez par une action simple.' },
};

export default function ContentPage() {
  const { 
    content, 
    updateContent, 
    generateContent, 
    loading,
    isGenerating,
    contentTypes,
    contentLengths,
    generatedContents,
    fetchContents,
    deleteContent
  } = useContentStore();
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('create');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const justGenerated = useRef(false);
  const businessProfile = CONTENT_BUSINESS_PROFILES[content.businessType] || CONTENT_BUSINESS_PROFILES.SERVICES;

  useEffect(() => {
    if (activeTab === 'manage' && !justGenerated.current) {
      fetchContents().catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to fetch content');
      });
    }
    // Reset the flag after the effect runs so future manual tab switches do fetch
    justGenerated.current = false;
  }, [activeTab, fetchContents]);

  const handleGenerate = async () => {
    if (!content.topic) {
      setError('Please provide a Topic or Product Description to generate content.');
      return;
    }
    setError('');
    try {
      await generateContent();
      justGenerated.current = true;
      setActiveTab('manage'); // Switch to manage tab to see the result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    }
  };

  const handleInputChange = (field: keyof typeof content, value: string) => {
    updateContent({ [field]: value });
  };

  const handleBusinessTypeChange = (value: string) => {
    const profile = CONTENT_BUSINESS_PROFILES[value];
    updateContent({
      businessType: value,
      targetAudience: profile.audience,
      tone: profile.tone,
      callToAction: profile.callToAction,
      hashtags: profile.hashtags,
    });
  };

  const handleCopyContent = (item: ContentItem) => {
    navigator.clipboard.writeText(item.body || '');
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteContent = async (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete content');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">AI Copywriter</h1>
          </div>
          <p className="text-gray-500 max-w-2xl text-sm md:text-base">
            Generate high-converting ads, engaging social media posts, and professional blogs instantly using advanced AI models.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="create" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Studio</TabsTrigger>
          <TabsTrigger value="manage" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Generated Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 bg-gray-50/50 px-8 py-5">
                <h2 className="text-lg font-bold text-gray-800">Content Parameters</h2>
                <p className="text-xs text-gray-500 mt-1">Configure exactly how you want the AI to write your copy.</p>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="space-y-2.5">
                  <Label htmlFor="businessType" className="text-sm font-semibold text-gray-700">Secteur d’activité</Label>
                  <Select
                    id="businessType"
                    value={content.businessType || 'SERVICES'}
                    onChange={(event) => handleBusinessTypeChange(event.target.value)}
                    className="h-11 rounded-xl border-gray-300 focus:ring-indigo-500"
                  >
                    {Object.entries(CONTENT_BUSINESS_PROFILES).map(([value, profile]) => (
                      <option key={value} value={value}>{profile.label}</option>
                    ))}
                  </Select>
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs leading-5 text-indigo-900">{businessProfile.tip}</div>
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="type" className="text-sm font-semibold text-gray-700">Format du contenu</Label>
                    <Select
                      id="type"
                      value={content.type || ''}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    >
                      <option value="">Sélectionnez un format…</option>
                      {contentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type === 'AD' ? 'Facebook / Google Ad' : type === 'POST' ? 'Social Media Post' : type.charAt(0) + type.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </Select>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="length" className="text-sm font-semibold text-gray-700">Longueur</Label>
                    <Select
                      id="length"
                      value={content.length || ''}
                      onChange={(e) => handleInputChange('length', e.target.value)}
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    >
                      <option value="">Sélectionnez une longueur…</option>
                      {contentLengths.map((length) => (
                        <option key={length} value={length}>
                          {length === 'SHORT' ? 'Short (Punchy)' : length === 'MEDIUM' ? 'Medium (Standard)' : 'Long (Detailed)'}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="space-y-2.5">
                  <Label htmlFor="topic" className="text-sm font-semibold text-gray-700">{businessProfile.topicLabel} *</Label>
                  <Textarea
                    id="topic"
                    value={content.topic || ''}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    placeholder={businessProfile.topicPlaceholder}
                    className="rounded-xl border-gray-300 focus:ring-indigo-500 resize-none h-24"
                  />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="targetAudience" className="text-sm font-semibold text-gray-700">Audience cible</Label>
                    <Input
                      id="targetAudience"
                      value={content.targetAudience || ''}
                      onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                      placeholder={businessProfile.audience}
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    />
                  </div>
                  
                  <div className="space-y-2.5">
                    <Label htmlFor="tone" className="text-sm font-semibold text-gray-700">Ton de communication</Label>
                    <Select
                      id="tone"
                      value={content.tone || ''}
                      onChange={(e) => handleInputChange('tone', e.target.value)}
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    >
                      <option value="professional">Professionnel</option>
                      <option value="casual">Décontracté</option>
                      <option value="friendly">Chaleureux</option>
                      <option value="authoritative">Expert</option>
                      <option value="playful">Créatif</option>
                    </Select>
                  </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="callToAction" className="text-sm font-semibold text-gray-700">Appel à l’action</Label>
                    <Input
                      id="callToAction"
                      value={content.callToAction || ''}
                      onChange={(e) => handleInputChange('callToAction', e.target.value)}
                      placeholder={businessProfile.callToAction}
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="hashtags" className="text-sm font-semibold text-gray-700">Hashtags facultatifs</Label>
                    <Input
                      id="hashtags"
                      value={content.hashtags || ''}
                      onChange={(e) => handleInputChange('hashtags', e.target.value)}
                      placeholder={businessProfile.hashtags}
                      className="rounded-xl border-gray-300 focus:ring-indigo-500 h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-8 py-5 flex justify-end">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md transition-all hover:shadow-lg w-full md:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <SparklesIcon className="h-5 w-5 animate-spin mr-2" />
                      Crafting Magic...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Side Panel / Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5 text-indigo-600" />
                  Pro Tips for Best Results
                </h3>
                <ul className="space-y-3 text-sm text-indigo-800/80">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span><strong>Be specific:</strong> The more details you provide in the topic, the better the AI can tailor the copy.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span><strong>Know your audience:</strong> Mentioning pain points for your target audience yields higher conversions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-500" />
                    <span><strong>Experiment with Tone:</strong> Don't be afraid to try "Sarcastic" or "Urgent" to see what grabs attention.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="mt-0">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4"></div>
              <p className="text-gray-500 font-medium">Generating your content...</p>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mb-4"></div>
              <p className="text-gray-500 font-medium">Loading your archive...</p>
            </div>
          ) : generatedContents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-2xl shadow-sm text-center px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <SparklesIcon className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No content generated yet</h3>
              <p className="text-gray-500 max-w-sm mb-6">Head over to the Studio tab to generate your first piece of high-converting AI marketing copy.</p>
              <Button onClick={() => setActiveTab('create')} className="rounded-xl h-10 px-6">Go to Studio</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {generatedContents.map((item, index) => (
                <ContentItemCard 
                  key={item.id || `content-${index}`} 
                  item={item} 
                  copiedId={copiedId} 
                  handleCopyContent={handleCopyContent} 
                  handleDeleteContent={handleDeleteContent} 
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentItemCard({ 
  item, 
  copiedId, 
  handleCopyContent, 
  handleDeleteContent 
}: { 
  item: ContentItem; 
  copiedId: string | null; 
  handleCopyContent: (item: ContentItem) => void; 
  handleDeleteContent: (id: string) => void; 
}) {
  const [viewMode, setViewMode] = useState<'text' | 'live'>('text');

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-indigo-200 transition-colors">
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider">
            {item.type}
          </span>
          <div className="flex items-center text-xs text-gray-500 font-medium">
            <CalendarIcon className="w-3.5 h-3.5 mr-1" />
            {new Date(item.createdAt || '').toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopyContent(item)}
            className="h-8 w-8 p-0 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
            title="Copy to clipboard"
          >
            {copiedId === item.id ? <CheckCircleIcon className="h-4 w-4 text-green-500" /> : <CopyIcon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteContent(item.id)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Delete"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-lg mb-4 line-clamp-1" title={item.title}>
          {item.title || 'Untitled Campaign'}
        </h3>

        {/* View Mode Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-lg mb-4 w-fit">
          <button
            onClick={() => setViewMode('text')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${viewMode === 'text' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Texte Brut
          </button>
          <button
            onClick={() => setViewMode('live')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${viewMode === 'live' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <span className="relative flex h-2 w-2">
              {viewMode === 'live' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${viewMode === 'live' ? 'bg-indigo-500' : 'bg-gray-400'}`}></span>
            </span>
            Mode Live
          </button>
        </div>

        {viewMode === 'text' ? (
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex-1 relative group overflow-hidden">
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {item.body}
            </p>
            
            {/* Copy Overlay */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button 
                onClick={() => handleCopyContent(item)}
                className="rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6"
              >
                {copiedId === item.id ? 'Copied!' : 'Copy Text'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 flex-1 flex justify-center items-center">
            {/* Social Post Mockup */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-sm w-full overflow-hidden">
              <div className="p-3 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm text-gray-900">NextGen Brand</div>
                  <div className="text-xs text-gray-500">Sponsored • 🌍</div>
                </div>
              </div>
              <div className="px-3 pb-3">
                <p className="text-sm text-gray-800 whitespace-pre-wrap line-clamp-6">{item.body}</p>
              </div>
              <div className="w-full h-48 bg-gray-100 border-y border-gray-100 flex items-center justify-center overflow-hidden relative group">
                 {/* Placeholder Image */}
                 <img src={`https://placehold.co/600x400/f3f4f6/a1a1aa?text=${encodeURIComponent(item.title || 'Ad Image')}`} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Mockup" />
              </div>
              <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">example.com</div>
                  <div className="font-bold text-sm text-gray-900">Learn More About This</div>
                </div>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                  Learn More
                </button>
              </div>
              <div className="p-2 flex justify-around text-gray-500">
                <button className="flex items-center gap-1.5 hover:bg-gray-100 p-2 rounded-lg flex-1 justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                  <span className="text-xs font-medium">Like</span>
                </button>
                <button className="flex items-center gap-1.5 hover:bg-gray-100 p-2 rounded-lg flex-1 justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  <span className="text-xs font-medium">Comment</span>
                </button>
                <button className="flex items-center gap-1.5 hover:bg-gray-100 p-2 rounded-lg flex-1 justify-center transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  <span className="text-xs font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-3 flex items-center gap-4 text-xs font-medium text-gray-500">
        {item.tone && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
            {item.tone}
          </span>
        )}
        {item.length && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            {item.length}
          </span>
        )}
      </div>
    </div>
  );
}
