"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import {
  VideoIcon,
  SparklesIcon,
  PlusIcon,
  TrashIcon,
  RefreshIcon,
  CopyIcon,
  MusicIcon,
  TextIcon,
  ImageIcon,
} from '@/components/icons';
import { useReelsStore } from '@/lib/store/reels-store';
import type { MediaType } from '@/types';

export default function ReelsPage() {
  const {
    form,
    result,
    loading,
    themes,
    tones,
    durations,
    platforms,
    musicMoods,
    styles,
    updateForm,
    addMedia,
    removeMedia,
    updateMedia,
    generateReels,
    clearResult,
    resetForm,
  } = useReelsStore();

  const [error, setError] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaDesc, setNewMediaDesc] = useState('');
  const [newMediaType, setNewMediaType] = useState<MediaType>('photo');
  const [hashtagInput, setHashtagInput] = useState('');
  const [copied, setCopied] = useState<string>('');

  const handleGenerate = async () => {
    setError('');
    if (form.media.length === 0) {
      setError('Please add at least one media item (photo or video)');
      return;
    }
    if (!form.textContent.title.trim()) {
      setError('Please provide a title for your reel');
      return;
    }
    try {
      await generateReels();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate reels');
    }
  };

  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    addMedia({
      type: newMediaType,
      url: newMediaUrl.trim(),
      description: newMediaDesc.trim(),
    });
    setNewMediaUrl('');
    setNewMediaDesc('');
  };

  const handleAddHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, '');
    if (!tag) return;
    if (!form.textContent.hashtags.includes(tag)) {
      updateForm({
        textContent: { ...form.textContent, hashtags: [...form.textContent.hashtags, tag] },
      });
    }
    setHashtagInput('');
  };

  const handleRemoveHashtag = (tag: string) => {
    updateForm({
      textContent: {
        ...form.textContent,
        hashtags: form.textContent.hashtags.filter((t) => t !== tag),
      },
    });
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <VideoIcon className="h-8 w-8" />
            Reels Generation
          </h1>
          <p className="text-gray-600">Create AI-powered reels from your photos and text</p>
        </div>
        <div className="flex gap-2">
          {result && (
            <Button variant="outline" onClick={clearResult} className="flex items-center gap-2">
              <RefreshIcon className="h-4 w-4" />
              New Reel
            </Button>
          )}
          <Button onClick={handleGenerate} disabled={loading} className="flex items-center gap-2">
            {loading ? (
              <>
                <SparklesIcon className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4" />
                Generate Reel
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue={result ? "result" : "create"} className="space-y-6">
        <TabsList>
          <TabsTrigger value="create">Create Reel</TabsTrigger>
          <TabsTrigger value="result" disabled={!result}>Result</TabsTrigger>
        </TabsList>

        {/* CREATE TAB */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Media Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Media Assets
                </CardTitle>
                <CardDescription>Add photos and videos for your reel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add new media */}
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="mediaType">Type</Label>
                      <Select
                        id="mediaType"
                        value={newMediaType}
                        onChange={(e) => setNewMediaType(e.target.value as MediaType)}
                      >
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="mediaUrl">URL</Label>
                      <Input
                        id="mediaUrl"
                        placeholder="https://..."
                        value={newMediaUrl}
                        onChange={(e) => setNewMediaUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="mediaDesc">Description (optional)</Label>
                    <Input
                      id="mediaDesc"
                      placeholder="Describe this media..."
                      value={newMediaDesc}
                      onChange={(e) => setNewMediaDesc(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddMedia} variant="outline" className="w-full flex items-center gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Add Media
                  </Button>
                </div>

                {/* Media list */}
                <div className="space-y-2">
                  {form.media.length === 0 ? (
                    <p className="text-center text-sm text-gray-500 py-4">No media added yet</p>
                  ) : (
                    form.media.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                        <Badge variant={m.type === 'photo' ? 'secondary' : 'default'}>
                          {m.type}
                        </Badge>
                        <div className="flex-1 truncate">
                          <p className="text-sm font-medium truncate">{m.url}</p>
                          {m.description && (
                            <p className="text-xs text-gray-500 truncate">{m.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMedia(i)}
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Text Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TextIcon className="h-5 w-5" />
                  Text Content
                </CardTitle>
                <CardDescription>Provide the text for your reel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter reel title..."
                    value={form.textContent.title}
                    onChange={(e) => updateForm({ textContent: { ...form.textContent, title: e.target.value } })}
                  />
                </div>
                <div>
                  <Label htmlFor="body">Body / Script Content</Label>
                  <Textarea
                    id="body"
                    placeholder="Describe what your reel is about..."
                    rows={4}
                    value={form.textContent.body}
                    onChange={(e) => updateForm({ textContent: { ...form.textContent, body: e.target.value } })}
                  />
                </div>
                <div>
                  <Label htmlFor="cta">Call to Action</Label>
                  <Input
                    id="cta"
                    placeholder="e.g. Follow for more tips!"
                    value={form.textContent.cta}
                    onChange={(e) => updateForm({ textContent: { ...form.textContent, cta: e.target.value } })}
                  />
                </div>
                <div>
                  <Label>Hashtags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add hashtag..."
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddHashtag();
                        }
                      }}
                    />
                    <Button onClick={handleAddHashtag} variant="outline" size="sm">
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  {form.textContent.hashtags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {form.textContent.hashtags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="cursor-pointer" >
                          <span onClick={() => handleRemoveHashtag(tag)}>
                            #{tag} ✕
                          </span>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Options */}
          <Card>
            <CardHeader>
              <CardTitle>Reel Configuration</CardTitle>
              <CardDescription>Customize your reel generation options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    id="theme"
                    value={form.theme}
                    onChange={(e) => updateForm({ theme: e.target.value as typeof form.theme })}
                  >
                    {themes.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    id="tone"
                    value={form.tone}
                    onChange={(e) => updateForm({ tone: e.target.value as typeof form.tone })}
                  >
                    {tones.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Select
                    id="duration"
                    value={form.duration}
                    onChange={(e) => updateForm({ duration: e.target.value as typeof form.duration })}
                  >
                    {durations.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    id="platform"
                    value={form.platform}
                    onChange={(e) => updateForm({ platform: e.target.value as typeof form.platform })}
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="musicMood">Music Mood</Label>
                  <Select
                    id="musicMood"
                    value={form.musicMood}
                    onChange={(e) => updateForm({ musicMood: e.target.value as typeof form.musicMood })}
                  >
                    {musicMoods.map((m) => (
                      <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="style">Style</Label>
                  <Select
                    id="style"
                    value={form.style}
                    onChange={(e) => updateForm({ style: e.target.value as typeof form.style })}
                  >
                    {styles.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>Reset</Button>
              <Button onClick={handleGenerate} disabled={loading} className="flex items-center gap-2">
                {loading ? 'Generating...' : 'Generate Reel'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* RESULT TAB */}
        {result && (
          <TabsContent value="result" className="space-y-6">
            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <VideoIcon className="h-5 w-5" />
                  Reel Overview
                </CardTitle>
                <CardDescription>
                  {result.reel_metadata.platform.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} • {result.reel_metadata.duration_seconds}s • {result.reel_metadata.style}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Theme: {result.reel_metadata.theme}</Badge>
                  <Badge variant="secondary">Tone: {result.reel_metadata.tone}</Badge>
                  <Badge variant="secondary">Style: {result.reel_metadata.style}</Badge>
                  <Badge>{result.script.total_duration}s total</Badge>
                  <Badge>{result.script.scenes.length} scenes</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Script / Scenes */}
            <Card>
              <CardHeader>
                <CardTitle>Scene-by-Scene Script</CardTitle>
                <CardDescription>Detailed breakdown of each scene</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.script.scenes.map((scene) => (
                  <div key={scene.scene_number} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Scene {scene.scene_number}</h4>
                      <Badge variant="outline">
                        {formatTime(scene.start_time)} - {formatTime(scene.end_time)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                      <div>
                        <span className="font-medium text-gray-600">Shot Type:</span> {scene.shot_type}
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Transition:</span> {scene.transition}
                      </div>
                      {scene.media_index !== null && (
                        <div>
                          <span className="font-medium text-gray-600">Media:</span> #{scene.media_index + 1}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-gray-600">Music Cue:</span> {scene.music_cue}
                      </div>
                    </div>
                    <div className="mt-2 rounded bg-gray-50 p-2 text-sm">
                      <span className="font-medium text-gray-600">Voiceover:</span> {scene.voiceover}
                    </div>
                    <div className="mt-1 rounded bg-blue-50 p-2 text-sm">
                      <span className="font-medium text-gray-600">Caption:</span> {scene.caption_overlay.text}
                      <span className="text-xs text-gray-400 ml-2">({scene.caption_overlay.position}, {scene.caption_overlay.animation})</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Voiceover Script */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Voiceover Script</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(result.voiceover_script.full_text, 'vo')}
                  >
                    {copied === 'vo' ? 'Copied!' : <CopyIcon className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm leading-relaxed">{result.voiceover_script.full_text}</p>
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold">Segments:</h5>
                  {result.voiceover_script.segments.map((seg, i) => (
                    <div key={i} className="rounded border p-2 text-sm">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{formatTime(seg.start_time)} - {formatTime(seg.end_time)}</span>
                        <span>Pace: {seg.pace}</span>
                      </div>
                      {seg.text}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Music */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MusicIcon className="h-5 w-5" />
                  Music Suggestions
                </CardTitle>
                <CardDescription>Mood: {result.music.mood}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold">Suggested Tracks:</h5>
                  {result.music.suggested_tracks.map((track, i) => (
                    <div key={i} className="flex items-center justify-between rounded border p-2 text-sm">
                      <div>
                        <span className="font-medium">{track.name}</span> by {track.artist}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{track.mood}</Badge>
                        <Badge variant="outline">{track.bpm} BPM</Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-semibold">Cue Points:</h5>
                  {result.music.cue_points.map((cue, i) => (
                    <div key={i} className="flex gap-2 text-sm">
                      <Badge variant="secondary">{formatTime(cue.time)}</Badge>
                      <span>{cue.action}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Text Overlays */}
            <Card>
              <CardHeader>
                <CardTitle>Text Overlays</CardTitle>
                <CardDescription>On-screen text for each scene</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.text_overlays.map((overlay, i) => (
                  <div key={i} className="rounded border p-3 text-sm">
                    <div className="flex justify-between mb-1">
                      <Badge variant="outline">Scene {overlay.scene_number}</Badge>
                      <span className="text-xs text-gray-500">
                        {formatTime(overlay.start_time)} - {formatTime(overlay.end_time)}
                      </span>
                    </div>
                    <p className="font-medium">{overlay.text}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span>Position: {overlay.position}</span>
                      <span>Size: {overlay.font_size}</span>
                      <span>Color: {overlay.color}</span>
                      <span>Animation: {overlay.animation}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Captions */}
            <Card>
              <CardHeader>
                <CardTitle>Captions</CardTitle>
                <CardDescription>Subtitle-style captions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {result.captions.map((cap, i) => (
                  <div key={i} className="rounded border p-2 text-sm">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{formatTime(cap.start_time)} - {formatTime(cap.end_time)}</span>
                      <span>Style: {cap.style}</span>
                    </div>
                    {cap.text}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Final Caption & Hashtags */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Final Caption</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.caption_final, 'cap')}
                    >
                      {copied === 'cap' ? 'Copied!' : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{result.caption_final}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Hashtags</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(result.hashtags.map(h => `#${h}`).join(' '), 'tags')}
                    >
                      {copied === 'tags' ? 'Copied!' : <CopyIcon className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary">#{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <Card>
              <CardHeader>
                <CardTitle>Call to Action</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">{result.cta_final}</p>
              </CardContent>
            </Card>

            {/* Thumbnail Suggestion */}
            <Card>
              <CardHeader>
                <CardTitle>Thumbnail Suggestion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-4">
                  <Badge variant="outline" className="mb-2">Scene {result.thumbnail_suggestion.scene_number}</Badge>
                  <p className="text-sm">{result.thumbnail_suggestion.description}</p>
                  <p className="mt-2 text-sm font-medium">Text overlay: {result.thumbnail_suggestion.text_overlay}</p>
                </div>
              </CardContent>
            </Card>

            {/* Production Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Production Notes</CardTitle>
                <CardDescription>Tips for filming and editing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h5 className="mb-1 text-sm font-semibold">Equipment Needed:</h5>
                  <ul className="list-inside list-disc text-sm text-gray-600">
                    {result.production_notes.equipment_needed.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="mb-1 text-sm font-semibold">Lighting Tips:</h5>
                  <ul className="list-inside list-disc text-sm text-gray-600">
                    {result.production_notes.lighting_tips.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="mb-1 text-sm font-semibold">Filming Tips:</h5>
                  <ul className="list-inside list-disc text-sm text-gray-600">
                    {result.production_notes.filming_tips.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="mb-1 text-sm font-semibold">Editing Suggestions:</h5>
                  <ul className="list-inside list-disc text-sm text-gray-600">
                    {result.production_notes.editing_suggestions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
