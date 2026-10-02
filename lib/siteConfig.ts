import fs from 'fs';
import path from 'path';

export interface SiteConfig {
  general: {
    siteName: string;
    siteUrl: string;
    adminPassword?: string;
    contactEmail?: string;
    announcementEnabled?: boolean;
    announcementText?: string;
  };
  monetization: {
    adsEnabled?: boolean;
    adsensePublisherId?: string;
    adsenseAutoAds?: boolean;
    mediavineScript?: string;
    rewardedAdCooldownSeconds?: number;
    rewardedAdTimerSeconds?: number;
    adsTxtContent?: string;
    slots?: {
      leftSkyscraper?: string;
      rightSkyscraper?: string;
      leaderboard?: string;
      rectangle?: string;
    };
    slotSkyscraperLeft?: string;
    slotSkyscraperRight?: string;
    slotLeaderboard?: string;
  };
  cloudflare: {
    zoneId?: string;
    apiToken?: string;
    turnstileSiteKey?: string;
    turnstileSecretKey?: string;
    analyticsToken?: string;
    hostingIp?: string;
  };
  github: {
    repoUrl?: string;
    deployWebhookUrl?: string;
  };
  codeInjection: {
    headScripts?: string;
    bodyScripts?: string;
    googleSearchConsoleTag?: string;
  };
  adminPassword?: string;
}

const CONFIG_PATH = path.join(process.cwd(), 'data', 'site-config.json');

const DEFAULT_CONFIG: SiteConfig = {
  general: {
    siteName: 'PinterClip',
    siteUrl: 'https://pinterclip.com',
    adminPassword: 'admin',
    announcementEnabled: false,
    announcementText: '¡Descargas de videos de Pinterest en 1080p y fotos en alta resolución!'
  },
  monetization: {
    adsEnabled: false,
    adsensePublisherId: '',
    adsenseAutoAds: true,
    mediavineScript: '',
    slotSkyscraperLeft: '',
    slotSkyscraperRight: '',
    slotLeaderboard: '',
    rewardedAdCooldownSeconds: 0,
    rewardedAdTimerSeconds: 0,
    adsTxtContent: '# PinterClip ads.txt\n# google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0',
    slots: {
      leftSkyscraper: '',
      rightSkyscraper: '',
      leaderboard: '',
      rectangle: ''
    }
  },
  cloudflare: {
    zoneId: '',
    apiToken: '',
    turnstileSiteKey: '',
    turnstileSecretKey: '',
    analyticsToken: '',
    hostingIp: ''
  },
  github: {
    repoUrl: '',
    deployWebhookUrl: ''
  },
  codeInjection: {
    headScripts: '',
    bodyScripts: '',
    googleSearchConsoleTag: ''
  },
  adminPassword: 'admin'
};

export function getSiteConfig(): SiteConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      const dir = path.dirname(CONFIG_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
      return DEFAULT_CONFIG;
    }
    const data = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return JSON.parse(data) as SiteConfig;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export function saveSiteConfig(newConfig: Partial<SiteConfig>): boolean {
  try {
    const current = getSiteConfig();
    const updated: SiteConfig = {
      ...current,
      ...newConfig,
      general: { ...current.general, ...(newConfig.general || {}) },
      monetization: { ...current.monetization, ...(newConfig.monetization || {}) },
      cloudflare: { ...current.cloudflare, ...(newConfig.cloudflare || {}) },
      github: { ...current.github, ...(newConfig.github || {}) },
      codeInjection: { ...current.codeInjection, ...(newConfig.codeInjection || {}) }
    };

    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving site config:', err);
    return false;
  }
}
