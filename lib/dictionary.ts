export type Language = 
  | 'en' 
  | 'de' 
  | 'es' 
  | 'fr' 
  | 'it' 
  | 'pt' 
  | 'id' 
  | 'ja' 
  | 'ko' 
  | 'pl' 
  | 'ru' 
  | 'tr' 
  | 'uk' 
  | 'zh';

export interface LanguageOption {
  code: Language;
  name: string;
}

export const languageList: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'pl', name: 'Polski' },
  { code: 'ru', name: 'Русский' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'uk', name: 'Українська' },
  { code: 'zh', name: '中文' },
];

export interface Translation {
  title: string;
  subtitle: string;
  badge: string;
  inputPlaceholder: string;
  pasteBtn: string;
  downloadBtn: string;
  processing: string;
  analyzingPinterest: string;
  analyzingReddit?: string;
  resultsTitle: string;
  downloadHd: string;
  download720: string;
  download480: string;
  downloadMp3: string;
  audioIncluded: string;
  adDisclaimer: string;
  rewardedAdTitle: string;
  rewardedAdSubtitle: string;
  rewardedRewardWarning: string;
  rewardedCloseBtn: string;
  rewardedContinueBtn: string;
  downloadStarting: string;
  progressStep1: string;
  progressStep2: string;
  progressStep3: string;
  progressStep4: string;
  rewardCountdown: string;
  adSponsored: string;
  adDiscoverHow: string;
  adTechNotice: string;
  dashMergedNotice: string;
  videoBadge: string;
  foundBadge: string;
  withAudio: string;
  chooseResolution: string;
  bestQuality: string;
  tabWithAd: string;
  tabStandard: string;
  tabFast: string;
  adNotice: string;
  downloadAnother: string;
  downloadVideoGeneric: string;
  downloadAudioOnly: string;
  featuresTitle: string;
  featuresSubtitle: string;
  checklistGallery: string;
  checklistAudio: string;
  checklistUnlimited: string;
  cardNoWatermarkTitle: string;
  cardNoWatermarkDesc: string;
  card1080Title: string;
  card1080Desc: string;
  cardUltraFastTitle: string;
  cardUltraFastDesc: string;
  cardSecureTitle: string;
  cardSecureDesc: string;
  howItWorksTitle: string;
  howItWorksSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  allInOneTitle: string;
  allInOneSubtitle: string;
  aioVideoTitle: string;
  aioVideoDesc: string;
  aioGifTitle: string;
  aioGifDesc: string;
  aioGalleryTitle: string;
  aioGalleryDesc: string;
  aioAudioTitle: string;
  aioAudioDesc: string;
  devicesTitle: string;
  devicesSubtitle: string;
  deviceIosTitle: string;
  deviceIosDesc: string;
  deviceAndroidTitle: string;
  deviceAndroidDesc: string;
  devicePcTitle: string;
  devicePcDesc: string;
  faqTitle: string;
  faqs: {
    question: string;
    answer: string;
  }[];
  crossLinksTitle: string;
  toolPinterestToMp4: string;
  toolPinterestToMp3: string;
  toolPinterestImage: string;
  toolPinterestGif: string;
  toolPinterestReels?: string;
  disclaimerTitle: string;
  disclaimerP1: string;
  disclaimerP2: string;
  footerTerms: string;
  footerPrivacy: string;
  footerDmca: string;
  footerContact: string;
  footerRights: string;
  imageBadge: string;
  gifBadge: string;
  downloadImage: string;
  downloadGif: string;
  imageResolution: string;

  // Localized interaction & toast strings
  downloadProcessing?: string;
  downloadUnlockedTitle?: string;
  downloadUnlockedDesc?: string;
  rewardCompleted?: string;
  rewardCompletedAction?: string;
  waitTimer?: string;
  pastedSuccess?: string;
  downloadError?: string;
  connectionError?: string;
  networkFamilyTitle?: string;
  networkFamilyReddit?: string;
  networkFamilyTwitter?: string;
  networkFamilyTikTok?: string;
}

// Diccionarios completos para los 14 idiomas
import { allTranslations } from './translations';

export const dictionaries: Record<Language, Translation> = allTranslations;

