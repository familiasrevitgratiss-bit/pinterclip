'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface SiteConfig {
  general: {
    siteName: string;
    siteUrl: string;
    contactEmail: string;
    adminPassword?: string;
  };
  monetization: {
    adsEnabled?: boolean;
    adsensePublisherId: string;
    adsenseAutoAds: boolean;
    slots: {
      leftSkyscraper: string;
      rightSkyscraper: string;
      leaderboard: string;
      rectangle: string;
    };
    mediavineScript: string;
    rewardedAdCooldownSeconds: number;
    adsTxtContent: string;
  };
  cloudflare: {
    zoneId: string;
    apiToken: string;
    turnstileSiteKey: string;
    turnstileSecretKey: string;
    analyticsToken: string;
  };
  github: {
    repoUrl: string;
    deployWebhookUrl: string;
  };
  codeInjection: {
    headScripts: string;
    bodyScripts: string;
    googleSearchConsoleTag?: string;
    googleAnalyticsId?: string;
  };
  adminPassword?: string;
}

interface SystemInfo {
  ytdlpVersion: string;
  downloads: {
    count: number;
    sizeMb: number;
  };
  git: {
    branch: string;
    lastCommit: string;
    status: string;
  };
}

export default function AdminPinterClipPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'monetization' | 'cloudflare' | 'github' | 'injection' | 'system' | 'security'>('monetization');

  // Config State
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // System Stats
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoadingSystem, setIsLoadingSystem] = useState(false);
  const [systemActionMsg, setSystemActionMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [systemActionLoading, setSystemActionLoading] = useState<string | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Check initial auth status
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          loadConfig();
          loadSystemInfo();
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  async function loadConfig() {
    try {
      const res = await fetch('/api/admin/config');
      if (res.ok) {
        const data = await res.json();
        const base = data.config || data;
        // ensure slots object exists
        if (!base.monetization) base.monetization = {};
        if (!base.monetization.slots) {
          base.monetization.slots = {
            leftSkyscraper: '',
            rightSkyscraper: '',
            leaderboard: '',
            rectangle: ''
          };
        }
        if (!base.cloudflare) base.cloudflare = {};
        if (!base.github) base.github = {};
        if (!base.codeInjection) base.codeInjection = {};
        setConfig(base);
      }
    } catch (err) {
      console.error('Error cargando configuración:', err);
    }
  }

  async function loadSystemInfo() {
    setIsLoadingSystem(true);
    try {
      const res = await fetch('/api/admin/system');
      if (res.ok) {
        const data = await res.json();
        setSystemInfo(data);
      }
    } catch (err) {
      console.error('Error cargando stats de sistema:', err);
    } finally {
      setIsLoadingSystem(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: loginPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        loadConfig();
        loadSystemInfo();
      } else {
        setLoginError(data.error || 'Contraseña incorrecta');
      }
    } catch {
      setLoginError('Error de red al conectar');
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setLoginPassword('');
  }

  async function handleSaveConfig() {
    if (!config) return;
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();

      if (data.success) {
        setSaveStatus({ type: 'success', message: '¡Configuración de PinterClip guardada correctamente!' });
        setTimeout(() => setSaveStatus(null), 4000);
      } else {
        setSaveStatus({ type: 'error', message: data.error || 'Error al guardar configuración.' });
      }
    } catch {
      setSaveStatus({ type: 'error', message: 'Error de conexión al guardar.' });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSystemAction(action: 'update-ytdlp' | 'clean-downloads' | 'purge-cloudflare' | 'trigger-deploy') {
    setSystemActionLoading(action);
    setSystemActionMsg(null);

    try {
      const res = await fetch('/api/admin/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();

      if (data.success) {
        setSystemActionMsg({ type: 'success', message: data.message });
        loadSystemInfo();
      } else {
        setSystemActionMsg({ type: 'error', message: data.message || 'Error al ejecutar acción.' });
      }
    } catch (err: any) {
      setSystemActionMsg({ type: 'error', message: err.message || 'Error de red.' });
    } finally {
      setSystemActionLoading(null);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword.length < 4) {
      setPasswordMsg({ type: 'error', message: 'La nueva contraseña debe tener al menos 4 caracteres.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          adminPassword: newPassword,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setPasswordMsg({ type: 'success', message: '¡Contraseña de PinterClip actualizada con éxito!' });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', message: data.error || 'Error al cambiar contraseña.' });
      }
    } catch {
      setPasswordMsg({ type: 'error', message: 'Error al comunicarse con el servidor.' });
    }
  }

  // 1. Loading screen while checking initial auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0e1117] flex items-center justify-center text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin" />
          <p className="text-sm font-medium">Iniciando panel de administración de PinterClip...</p>
        </div>
      </div>
    );
  }

  // 2. Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#161b22] border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-rose-500" />
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 bg-red-600/10 border border-red-600/30 rounded-2xl flex items-center justify-center mb-3 text-red-500">
              <span className="text-2xl font-black">P</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100">PinterClip Admin</h1>
            <p className="text-xs text-slate-400 mt-1">Panel de control, monetización y servidor</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Contraseña de Acceso
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Ingresa la contraseña..."
                required
                className="w-full px-4 py-3 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition text-sm"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-center gap-2">
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Verificando...
                </>
              ) : (
                'Entrar al Panel PinterClip →'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
            <span>Contraseña por defecto: </span>
            <code className="px-1.5 py-0.5 bg-slate-800 text-red-400 rounded font-mono">admin</code>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Dashboard
  return (
    <div className="min-h-screen bg-[#0e1117] text-slate-100">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#161b22]/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30 font-black text-white text-lg">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-100">PinterClip Admin</span>
                <span className="text-[10px] bg-red-600/10 text-red-400 border border-red-600/30 px-2 py-0.5 rounded-full font-mono">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Centro de configuración de Pinterest Video & Photo Downloader</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700/60 hover:border-slate-600 transition flex items-center gap-1.5"
            >
              <span>Ver Sitio</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>

            <button
              onClick={handleSaveConfig}
              disabled={isSaving || !config}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-lg shadow-md shadow-red-600/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Guardar Cambios
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition"
              title="Cerrar sesión"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global Save Alert */}
        {saveStatus && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-sm ${
              saveStatus.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{saveStatus.type === 'success' ? '✅' : '❌'}</span>
              <span>{saveStatus.message}</span>
            </div>
            <button onClick={() => setSaveStatus(null)} className="text-xs opacity-75 hover:opacity-100">
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-800">
          <button
            onClick={() => setActiveTab('monetization')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'monetization'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-[#161b22] text-slate-400 hover:text-slate-200 hover:bg-[#1f2631]'
            }`}
          >
            💰 Monetización & Anuncios
          </button>
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'cloudflare'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-[#161b22] text-slate-400 hover:text-slate-200 hover:bg-[#1f2631]'
            }`}
          >
            ☁️ Cloudflare & Hosting
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'github'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-[#161b22] text-slate-400 hover:text-slate-200 hover:bg-[#1f2631]'
            }`}
          >
            🐙 GitHub & Despliegue
          </button>
          <button
            onClick={() => setActiveTab('injection')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'injection'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-[#161b22] text-slate-400 hover:text-slate-200 hover:bg-[#1f2631]'
            }`}
          >
            💻 Inyección de Código
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'system'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-[#161b22] text-slate-400 hover:text-slate-200 hover:bg-[#1f2631]'
            }`}
          >
            ⚡ Salud & Pinterest Engine
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'bg-[#161b22] text-slate-400 hover:text-slate-200 hover:bg-[#1f2631]'
            }`}
          >
            🔒 Seguridad
          </button>
        </div>

        {/* Tab 1: Monetización & Ads */}
        {activeTab === 'monetization' && config && (
          <div className="space-y-6">
            {/* Google AdSense Card */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                  G
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Google AdSense para PinterClip</h2>
                  <p className="text-xs text-slate-400">Configuración global y script automático de anuncios</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Publisher ID (ca-pub-xxxxxxxx)
                  </label>
                  <input
                    type="text"
                    value={config.monetization.adsensePublisherId || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        monetization: { ...config.monetization, adsensePublisherId: e.target.value },
                      })
                    }
                    placeholder="ca-pub-1234567890123456"
                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Se inyectará automáticamente en el <code>&lt;head&gt;</code> de toda la web.
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-[#0d1117] border border-slate-700/60 rounded-xl">
                    <input
                      type="checkbox"
                      checked={config.monetization.adsenseAutoAds}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          monetization: { ...config.monetization, adsenseAutoAds: e.target.checked },
                        })
                      }
                      className="w-4 h-4 text-red-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-200">Activar Auto-Ads de Google</span>
                      <p className="text-[11px] text-slate-500">Google ubica anuncios automáticamente en el flujo</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Slot IDs */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Espacios de Anuncios Específicos (Slot IDs de AdSense)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Skyscraper Izquierdo (160x600)
                    </label>
                    <input
                      type="text"
                      value={config.monetization.slots?.leftSkyscraper || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          monetization: {
                            ...config.monetization,
                            slots: { ...config.monetization.slots, leftSkyscraper: e.target.value },
                          },
                        })
                      }
                      placeholder="Slot ID: 1234567890"
                      className="w-full px-3 py-2 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Skyscraper Derecho (160x600)
                    </label>
                    <input
                      type="text"
                      value={config.monetization.slots?.rightSkyscraper || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          monetization: {
                            ...config.monetization,
                            slots: { ...config.monetization.slots, rightSkyscraper: e.target.value },
                          },
                        })
                      }
                      placeholder="Slot ID: 1234567890"
                      className="w-full px-3 py-2 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Leaderboard Horizontal (728x90)
                    </label>
                    <input
                      type="text"
                      value={config.monetization.slots?.leaderboard || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          monetization: {
                            ...config.monetization,
                            slots: { ...config.monetization.slots, leaderboard: e.target.value },
                          },
                        })
                      }
                      placeholder="Slot ID: 1234567890"
                      className="w-full px-3 py-2 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Rectángulo Medio (300x250)
                    </label>
                    <input
                      type="text"
                      value={config.monetization.slots?.rectangle || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          monetization: {
                            ...config.monetization,
                            slots: { ...config.monetization.slots, rectangle: e.target.value },
                          },
                        })
                      }
                      placeholder="Slot ID: 1234567890"
                      className="w-full px-3 py-2 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 text-xs focus:border-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mediavine / Ezoic / Monetag Script */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                  M
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Mediavine / Ezoic / Redes Alternativas</h2>
                  <p className="text-xs text-slate-400">Pega aquí el tag script de Mediavine, Monetag o PropellerAds</p>
                </div>
              </div>

              <textarea
                rows={3}
                value={config.monetization.mediavineScript || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    monetization: { ...config.monetization, mediavineScript: e.target.value },
                  })
                }
                placeholder="<script async src='https://...'></script>"
                className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-xs font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Rewarded Ad Cooldown */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-100 mb-1">
                ⏳ Temporizador de Anuncio Recompensado (1080p / Original HD)
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Segundos que el usuario debe esperar para desbloquear la máxima resolución (genera impresiones de alto CPM).
              </p>
              <div className="max-w-xs flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={config.monetization.rewardedAdCooldownSeconds || 0}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      monetization: {
                        ...config.monetization,
                        rewardedAdCooldownSeconds: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-24 px-3 py-2 bg-[#0d1117] border border-slate-700 rounded-lg text-slate-100 text-sm focus:border-red-500 focus:outline-none"
                />
                <span className="text-xs text-slate-400">segundos (0 = sin espera)</span>
              </div>
            </div>

            {/* Live ads.txt Editor */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-100">Editor de ads.txt en Vivo</h2>
                  <p className="text-xs text-slate-400">
                    Se publica automáticamente en{' '}
                    <a
                      href="/ads.txt"
                      target="_blank"
                      className="text-red-400 hover:underline"
                    >
                      pinterclip.com/ads.txt ↗
                    </a>
                  </p>
                </div>
                <a
                  href="/ads.txt"
                  target="_blank"
                  className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  Abrir ads.txt ↗
                </a>
              </div>

              <textarea
                rows={5}
                value={config.monetization.adsTxtContent || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    monetization: { ...config.monetization, adsTxtContent: e.target.value },
                  })
                }
                placeholder="google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0"
                className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-xs font-mono focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Cloudflare & Hosting */}
        {activeTab === 'cloudflare' && config && (
          <div className="space-y-6">
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold">
                  ☁️
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Cloudflare Purge Cache (1-Click)</h2>
                  <p className="text-xs text-slate-400">
                    Limpia toda la caché de borde (Edge CDN) al instante cuando hagas cambios de diseño o código.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Cloudflare Zone ID
                  </label>
                  <input
                    type="text"
                    value={config.cloudflare.zoneId || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cloudflare: { ...config.cloudflare, zoneId: e.target.value },
                      })
                    }
                    placeholder="Ej. d41d8cd98f00b204e9800998ecf8427e"
                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Cloudflare API Token (Permiso: Zone.Cache Purge)
                  </label>
                  <input
                    type="password"
                    value={config.cloudflare.apiToken || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cloudflare: { ...config.cloudflare, apiToken: e.target.value },
                      })
                    }
                    placeholder="API Token secreto de Cloudflare"
                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => handleSystemAction('purge-cloudflare')}
                  disabled={systemActionLoading === 'purge-cloudflare' || !config.cloudflare.zoneId || !config.cloudflare.apiToken}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition shadow-md shadow-amber-500/10 flex items-center gap-2 disabled:opacity-40"
                >
                  {systemActionLoading === 'purge-cloudflare' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                      Purgando CDN global...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Purgar Toda la Caché de Cloudflare Ahora
                    </>
                  )}
                </button>
              </div>

              {systemActionMsg && (
                <div
                  className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
                    systemActionMsg.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  <span>{systemActionMsg.type === 'success' ? '✅' : '❌'}</span>
                  <span>{systemActionMsg.message}</span>
                </div>
              )}
            </div>

            {/* Cloudflare Turnstile & Web Analytics */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-100 mb-1">
                🛡️ Cloudflare Turnstile & Web Analytics
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Protección anti-bot gratuita y métricas de visitantes de privacidad total sin cookies.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Turnstile Site Key (Pública)
                  </label>
                  <input
                    type="text"
                    value={config.cloudflare.turnstileSiteKey || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cloudflare: { ...config.cloudflare, turnstileSiteKey: e.target.value },
                      })
                    }
                    placeholder="0x4AAAAAA..."
                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Cloudflare Web Analytics Token
                  </label>
                  <input
                    type="text"
                    value={config.cloudflare.analyticsToken || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        cloudflare: { ...config.cloudflare, analyticsToken: e.target.value },
                      })
                    }
                    placeholder="Token del beacon de analíticas"
                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Inserta el beacon oficial de Cloudflare Insights automáticamente.
                  </p>
                </div>
              </div>
            </div>

            {/* DNS & Hosting Checklist */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-100 mb-2">📋 Guía de Vinculación de pinterclip.com & VPS Contabo</h2>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 bg-[#0d1117] border border-slate-800 rounded-xl flex items-start gap-3">
                  <span className="font-bold text-red-500">1.</span>
                  <div>
                    <p className="font-semibold text-slate-200">Apuntar Nameservers a Cloudflare</p>
                    <p className="text-slate-400 mt-0.5">En tu registrador de dominios cambia los DNS por los que te asigne Cloudflare.</p>
                  </div>
                </div>

                <div className="p-3 bg-[#0d1117] border border-slate-800 rounded-xl flex items-start gap-3">
                  <span className="font-bold text-red-500">2.</span>
                  <div>
                    <p className="font-semibold text-slate-200">Configurar Registros DNS A en Cloudflare</p>
                    <p className="text-slate-400 mt-0.5">Crea un registro <code className="text-red-400 font-mono">A</code> con nombre <code className="text-red-400 font-mono">@</code> apuntando a la IP pública de Contabo (<code>169.58.16.90</code>), con el proxy activado (nube naranja).</p>
                  </div>
                </div>

                <div className="p-3 bg-[#0d1117] border border-slate-800 rounded-xl flex items-start gap-3">
                  <span className="font-bold text-red-500">3.</span>
                  <div>
                    <p className="font-semibold text-slate-200">SSL / TLS en Modo Full (Strict)</p>
                    <p className="text-slate-400 mt-0.5">En Cloudflare SSL/TLS, selecciona &quot;Full&quot; o &quot;Full (Strict)&quot; para encriptación de extremo a extremo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: GitHub & Despliegue */}
        {activeTab === 'github' && config && (
          <div className="space-y-6">
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Repositorio GitHub de PinterClip</h2>
                  <p className="text-xs text-slate-400">Guarda el código fuente de PinterClip y sincroniza con el VPS Contabo</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    URL del Repositorio de GitHub
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={config.github?.repoUrl || ''}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          github: { ...config.github, repoUrl: e.target.value },
                        })
                      }
                      placeholder="https://github.com/familiasrevitgratiss-bit/pinterclip"
                      className="flex-1 px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-red-500 focus:outline-none"
                    />
                    {config.github?.repoUrl && (
                      <a
                        href={config.github.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <span>Abrir Repo ↗</span>
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Webhook de Despliegue Automático (Deploy Webhook)
                  </label>
                  <input
                    type="text"
                    value={config.github?.deployWebhookUrl || ''}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        github: { ...config.github, deployWebhookUrl: e.target.value },
                      })
                    }
                    placeholder="https://api.render.com/deploy/srv-xxxx / webhook VPS..."
                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-red-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Al presionar &quot;Desplegar a Producción&quot;, se enviará una petición POST a este webhook para actualizar el código en el VPS.
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSystemAction('trigger-deploy')}
                    disabled={systemActionLoading === 'trigger-deploy' || !config.github?.deployWebhookUrl}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-40"
                  >
                    {systemActionLoading === 'trigger-deploy' ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Enviando señal de despliegue...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        🚀 Desplegar PinterClip a Producción
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Git Status Widget */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-200">Estado de Git en el Servidor</h3>
                <button
                  onClick={loadSystemInfo}
                  className="text-xs text-red-400 hover:underline flex items-center gap-1"
                >
                  ↻ Refrescar
                </button>
              </div>

              {systemInfo?.git ? (
                <div className="space-y-2 text-xs bg-[#0d1117] border border-slate-800 rounded-xl p-4 font-mono">
                  <div className="flex justify-between border-b border-slate-800/80 pb-2">
                    <span className="text-slate-400">Rama activa:</span>
                    <span className="text-emerald-400 font-bold">{systemInfo.git.branch}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800/80 py-2">
                    <span className="text-slate-400">Último Commit:</span>
                    <span className="text-slate-200 text-right">{systemInfo.git.lastCommit}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">Estado de archivos:</span>
                    <span className="text-amber-400">{systemInfo.git.status}</span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">Cargando estado de Git...</p>
              )}

              {/* Useful Git Commands snippet */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-xs font-semibold text-slate-300 mb-2">Comandos para subir cambios a GitHub:</p>
                <div className="bg-[#090c10] border border-slate-800 rounded-xl p-3 text-xs font-mono text-red-300/90 select-all overflow-x-auto">
                  git add .<br />
                  git commit -m &quot;Actualización de PinterClip&quot;<br />
                  git push origin main
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Inyección de Código */}
        {activeTab === 'injection' && config && (
          <div className="space-y-6">
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">⚡</span>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Inyección de Código Global</h2>
                  <p className="text-xs text-slate-400">
                    Inserta Google Analytics 4, verificación de Google Search Console, scripts personalizados o widgets sin tocar el servidor.
                  </p>
                </div>
              </div>
            </div>

            {/* Google Analytics 4 */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span>📊</span> Google Analytics 4 (Measurement ID)
                </label>
                {config.codeInjection?.googleAnalyticsId ? (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Activo
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400">
                    No configurado
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Ingresa tu ID de medición de flujo web de GA4 (comienza con <code>G-</code>). El script oficial de gtag.js se inyectará automáticamente en todas las páginas.
              </p>
              <input
                type="text"
                value={config.codeInjection?.googleAnalyticsId || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    codeInjection: { ...config.codeInjection, googleAnalyticsId: e.target.value.trim() },
                  })
                }
                placeholder="G-XXXXXXXXXX"
                className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Google Search Console */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <span>🔍</span> Google Search Console (Meta Tag)
                </label>
                {config.codeInjection?.googleSearchConsoleTag ? (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Configurado
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400">
                    Opcional
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Ingresa el código de verificación o la etiqueta completa <code>&lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot; /&gt;</code>.
              </p>
              <input
                type="text"
                value={config.codeInjection?.googleSearchConsoleTag || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    codeInjection: { ...config.codeInjection, googleSearchConsoleTag: e.target.value.trim() },
                  })
                }
                placeholder="google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Head Scripts */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                Scripts en el &lt;head&gt;
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Ideal para Google Search Console <code>&lt;meta name=&quot;google-site-verification&quot; ...&gt;</code>, Google Tag Manager o Google Analytics.
              </p>
              <textarea
                rows={6}
                value={config.codeInjection?.headScripts || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    codeInjection: { ...config.codeInjection, headScripts: e.target.value },
                  })
                }
                placeholder="<meta name='google-site-verification' content='...' />&#10;<!-- Google tag (gtag.js) -->"
                className="w-full px-4 py-3 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-xs font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            {/* Body Scripts */}
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                Scripts antes del cierre del &lt;/body&gt;
              </label>
              <p className="text-xs text-slate-400 mb-3">
                Ideal para chats en vivo (Tawk.to, Crisp), Popunders de monetización o widgets flotantes.
              </p>
              <textarea
                rows={6}
                value={config.codeInjection?.bodyScripts || ''}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    codeInjection: { ...config.codeInjection, bodyScripts: e.target.value },
                  })
                }
                placeholder="<script>/* Widget o popunder */</script>"
                className="w-full px-4 py-3 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-xs font-mono focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Tab 5: Mantenimiento & Salud */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* Status Feedback */}
            {systemActionMsg && (
              <div
                className={`p-4 rounded-xl border flex items-center justify-between text-sm ${
                  systemActionMsg.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{systemActionMsg.type === 'success' ? '✅' : '❌'}</span>
                  <span>{systemActionMsg.message}</span>
                </div>
                <button onClick={() => setSystemActionMsg(null)} className="text-xs opacity-75 hover:opacity-100">
                  ✕
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* yt-dlp Card */}
              <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 font-bold">
                      ⚡
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-100">Motor de Descarga yt-dlp (Fallback)</h2>
                      <p className="text-xs text-slate-400">Extracción de videos y respaldo para Pinterest</p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0d1117] border border-slate-800 rounded-xl my-4">
                    <span className="text-xs text-slate-400">Versión instalada:</span>
                    <p className="text-base font-mono font-bold text-slate-100 mt-1">
                      {systemInfo?.ytdlpVersion || 'Cargando...'}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 mb-4">
                    PinterClip utiliza el extractor nativo ultra-rápido PinResource (~200ms) y usa <code>yt-dlp</code> como motor de respaldo.
                  </p>
                </div>

                <button
                  onClick={() => handleSystemAction('update-ytdlp')}
                  disabled={systemActionLoading === 'update-ytdlp'}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {systemActionLoading === 'update-ytdlp' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Actualizando yt-dlp...
                    </>
                  ) : (
                    'Actualizar yt-dlp ahora (yt-dlp -U)'
                  )}
                </button>
              </div>

              {/* Storage & Temp Clean Card */}
              <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                      💾
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-100">Archivos Temporales en Disco</h2>
                      <p className="text-xs text-slate-400">Carpeta pública de descargas y clips generados</p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0d1117] border border-slate-800 rounded-xl my-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-400">Espacio ocupado:</span>
                      <span className="text-xs font-mono font-bold text-red-400">
                        {systemInfo ? `${systemInfo.downloads.sizeMb} MB` : '...'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Archivos acumulados:</span>
                      <span className="text-xs font-mono text-slate-200">
                        {systemInfo ? `${systemInfo.downloads.count} archivos` : '...'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-4">
                    Libera espacio en el servidor eliminando descargas pasadas sin afectar a los nuevos usuarios.
                  </p>
                </div>

                <button
                  onClick={() => handleSystemAction('clean-downloads')}
                  disabled={systemActionLoading === 'clean-downloads'}
                  className="w-full py-2.5 bg-slate-800 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 border border-slate-700 text-slate-300 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {systemActionLoading === 'clean-downloads' ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Limpiando archivos...
                    </>
                  ) : (
                    '🗑️ Vaciar Carpeta de Descargas'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Seguridad */}
        {activeTab === 'security' && (
          <div className="max-w-md mx-auto">
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
                  🔒
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-100">Cambiar Contraseña de PinterClip Admin</h2>
                  <p className="text-xs text-slate-400">Actualiza la clave para acceder a este panel</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Mínimo 4 caracteres"
                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repite la contraseña"
                    className="w-full px-4 py-2.5 bg-[#0d1117] border border-slate-700 rounded-xl text-slate-100 text-sm focus:border-red-500 focus:outline-none"
                  />
                </div>

                {passwordMsg && (
                  <div
                    className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                      passwordMsg.type === 'success'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/10 border border-red-500/30 text-red-400'
                    }`}
                  >
                    <span>{passwordMsg.type === 'success' ? '✅' : '❌'}</span>
                    <span>{passwordMsg.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-red-600/20"
                >
                  Actualizar Contraseña
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
