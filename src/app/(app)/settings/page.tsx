"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { SettingsIcon, UserIcon, BellIcon, ShieldIcon, PaletteIcon, SaveIcon, LogOutIcon } from '@/components/icons';
import { useAuth } from '@/hooks/useAuth';
import { useAppearance } from '@/hooks/useAppearance';
import { put, post } from '@/lib/api';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const { appearance, setAppearance } = useAppearance();

  // Profile State
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Notification State (persisted in localStorage for now)
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    contentReady: true,
    weeklyReport: false,
    marketing: true,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  const [appearanceSaved, setAppearanceSaved] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
    // Load persisted notification preferences
    const savedNotif = localStorage.getItem('notif-preferences');
    if (savedNotif) setNotifications(JSON.parse(savedNotif));
  }, [user]);

  const getInitials = () => {
    const first = profile.firstName?.[0] || '';
    const last = profile.lastName?.[0] || '';
    return (first + last).toUpperCase() || profile.email?.[0]?.toUpperCase() || '?';
  };

  // Save Profile (calls PUT /auth/profile via backend)
  const handleSaveProfile = async () => {
    setProfileLoading(true);
    setProfileMsg(null);
    try {
      await put('/auth/profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
      await refreshUser();
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err?.message || 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
      setTimeout(() => setProfileMsg(null), 3000);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPassword.length < 8) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    setPasswordLoading(true);
    setPasswordMsg(null);
    try {
      await post('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err?.message || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
      setTimeout(() => setPasswordMsg(null), 4000);
    }
  };

  // Save Notifications
  const handleSaveNotifications = () => {
    localStorage.setItem('notif-preferences', JSON.stringify(notifications));
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2000);
  };

  // Save Appearance — applies instantly via context
  const handleSaveAppearance = (newSettings: typeof appearance) => {
    setAppearance(newSettings);
    setAppearanceSaved(true);
    setTimeout(() => setAppearanceSaved(false), 2000);
  };

  // Logout
  const handleLogout = () => {
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <UserIcon className="mr-2 h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellIcon className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <PaletteIcon className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldIcon className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* ===== PROFILE TAB ===== */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details. Email cannot be changed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {profileMsg && (
                <Alert variant={profileMsg.type === 'error' ? 'destructive' : 'default'}>
                  <AlertDescription>{profileMsg.text}</AlertDescription>
                </Alert>
              )}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-800">{profile.firstName} {profile.lastName}</p>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  <Badge variant="outline" className="mt-1">{(user as any)?.role || 'ADMIN'}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email (read-only)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-50 text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile} disabled={profileLoading}>
                <SaveIcon className="mr-2 h-4 w-4" />
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ===== NOTIFICATIONS TAB ===== */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what notifications you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive email notifications for important updates' },
                { key: 'contentReady', label: 'Content Ready', desc: 'Get notified when AI content generation is complete' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a weekly summary of your marketing activities' },
                { key: 'marketing', label: 'Marketing Tips', desc: 'Get tips and best practices for your campaigns' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                  <button
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        [item.key]: !notifications[item.key as keyof typeof notifications],
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications]
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>
                <SaveIcon className="mr-2 h-4 w-4" />
                {notifSaved ? '✓ Saved!' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ===== APPEARANCE TAB ===== */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the application looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="flex space-x-3">
                  {[
                    { value: 'light', label: '☀️ Light' },
                    { value: 'dark', label: '🌙 Dark' },
                    { value: 'system', label: '💻 System' },
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setAppearance({ ...appearance, theme: value as 'light' | 'dark' | 'system' })}
                      className={`flex items-center space-x-2 rounded-lg border px-4 py-3 text-sm transition-colors ${
                        appearance.theme === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Font Size</Label>
                <div className="flex space-x-3">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setAppearance({ ...appearance, fontSize: size.toLowerCase() as 'small' | 'medium' | 'large' })}
                      className={`rounded-lg border px-4 py-3 text-sm capitalize transition-colors ${
                        appearance.fontSize === size.toLowerCase()
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border rounded-lg px-4">
                <div>
                  <p className="font-medium text-sm">Compact Mode</p>
                  <p className="text-xs text-gray-500">Reduce spacing for a denser layout</p>
                </div>
                <button
                  onClick={() =>
                    setAppearance({ ...appearance, compactMode: !appearance.compactMode })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    appearance.compactMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      appearance.compactMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => { setAppearanceSaved(true); setTimeout(() => setAppearanceSaved(false), 2000); }}>
                <SaveIcon className="mr-2 h-4 w-4" />
                {appearanceSaved ? '✓ Applied!' : 'Save Appearance'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ===== SECURITY TAB ===== */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {passwordMsg && (
                <Alert variant={passwordMsg.type === 'error' ? 'destructive' : 'default'}>
                  <AlertDescription>{passwordMsg.text}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="At least 8 characters"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat new password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword} disabled={passwordLoading}>
                <ShieldIcon className="mr-2 h-4 w-4" />
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Enable 2FA for added security</p>
                  <p className="text-xs text-gray-500">Protect your account with authenticator app</p>
                </div>
                <Badge variant="outline" className="text-gray-500">Coming Soon</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-100">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions for your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Sign Out</p>
                  <p className="text-xs text-gray-500">Sign out of your account on this device</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                <div>
                  <p className="text-sm font-medium text-red-700">Delete Account</p>
                  <p className="text-xs text-red-500">Permanently delete your account and all associated data</p>
                </div>
                <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-100">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}