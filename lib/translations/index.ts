import { Language, Translation } from '../dictionary';
import { en } from './en';
import { es } from './es';
import { de } from './de';
import { fr } from './fr';
import { it } from './it';
import { pt } from './pt';
import { id } from './id';
import { ja } from './ja';
import { ko } from './ko';
import { pl } from './pl';
import { ru } from './ru';
import { tr } from './tr';
import { uk } from './uk';
import { zh } from './zh';

interface ExtraTranslations {
  downloadProcessing: string;
  downloadUnlockedTitle: string;
  downloadUnlockedDesc: string;
  rewardCompleted: string;
  rewardCompletedAction: string;
  waitTimer: string;
  pastedSuccess: string;
  downloadError: string;
  connectionError: string;
  networkFamilyTitle: string;
  networkFamilyReddit: string;
  networkFamilyTwitter: string;
}

const extraTranslations: Record<Language, ExtraTranslations> = {
  en: {
    downloadProcessing: "Processing download...",
    downloadUnlockedTitle: "Download Unlocked!",
    downloadUnlockedDesc: "Your file is ready to download.",
    rewardCompleted: "Reward Completed",
    rewardCompletedAction: "Click the button below to start your download immediately.",
    waitTimer: "Please wait for timer",
    pastedSuccess: "Pasted!",
    downloadError: "Error downloading file. Please try again.",
    connectionError: "Connection error with download engine.",
    networkFamilyTitle: "CLIP NETWORK FAMILY",
    networkFamilyReddit: "ReddClip.com - Reddit Video Downloader",
    networkFamilyTwitter: "TwitsClip.com - Twitter / X Video Downloader",
  },
  es: {
    downloadProcessing: "Procesando descarga...",
    downloadUnlockedTitle: "¡Descarga Desbloqueada!",
    downloadUnlockedDesc: "Tu archivo está listo para descargar.",
    rewardCompleted: "Recompensa completada",
    rewardCompletedAction: "Haz clic en el botón de abajo para iniciar la descarga inmediata.",
    waitTimer: "Espera el temporizador",
    pastedSuccess: "¡Pegado!",
    downloadError: "Error al descargar el archivo. Inténtalo de nuevo.",
    connectionError: "Error de conexión con el motor de descarga.",
    networkFamilyTitle: "FAMILIA CLIP NETWORK",
    networkFamilyReddit: "ReddClip.com - Descargador de Vídeos de Reddit",
    networkFamilyTwitter: "TwitsClip.com - Descargador de Vídeos de Twitter / X",
  },
  de: {
    downloadProcessing: "Download wird verarbeitet...",
    downloadUnlockedTitle: "Download freigeschaltet!",
    downloadUnlockedDesc: "Ihre Datei steht zum Download bereit.",
    rewardCompleted: "Belohnung abgeschlossen",
    rewardCompletedAction: "Klicken Sie unten auf den Button, um den Download sofort zu starten.",
    waitTimer: "Bitte Timer abwarten",
    pastedSuccess: "Eingefügt!",
    downloadError: "Fehler beim Herunterladen der Datei. Bitte versuchen Sie es erneut.",
    connectionError: "Verbindungsfehler mit der Download-Engine.",
    networkFamilyTitle: "CLIP-NETZWERKFAMILIE",
    networkFamilyReddit: "ReddClip.com - Reddit Video Downloader",
    networkFamilyTwitter: "TwitsClip.com - Twitter / X Video Downloader",
  },
  fr: {
    downloadProcessing: "Traitement du téléchargement...",
    downloadUnlockedTitle: "Téléchargement débloqué !",
    downloadUnlockedDesc: "Votre fichier est prêt à être téléchargé.",
    rewardCompleted: "Récompense terminée",
    rewardCompletedAction: "Cliquez sur le bouton ci-dessous pour lancer le téléchargement immédiat.",
    waitTimer: "Veuillez attendre la fin du minuteur",
    pastedSuccess: "Collé !",
    downloadError: "Erreur lors du téléchargement du fichier. Veuillez réessayer.",
    connectionError: "Erreur de connexion avec le moteur de téléchargement.",
    networkFamilyTitle: "FAMILLE DE RÉSEAUX CLIP",
    networkFamilyReddit: "ReddClip.com - Téléchargeur de Vidéos Reddit",
    networkFamilyTwitter: "TwitsClip.com - Téléchargeur de Vidéos Twitter / X",
  },
  it: {
    downloadProcessing: "Elaborazione del download...",
    downloadUnlockedTitle: "Download sbloccato!",
    downloadUnlockedDesc: "Il tuo file è pronto per il download.",
    rewardCompleted: "Ricompensa completata",
    rewardCompletedAction: "Clicca sul pulsante qui sotto per avviare subito il download.",
    waitTimer: "Attendi il timer",
    pastedSuccess: "Incollato!",
    downloadError: "Errore durante il download del file. Riprova.",
    connectionError: "Errore di connessione con il motore di download.",
    networkFamilyTitle: "FAMIGLIA CLIP NETWORK",
    networkFamilyReddit: "ReddClip.com - Scarica Video da Reddit",
    networkFamilyTwitter: "TwitsClip.com - Scarica Video da Twitter / X",
  },
  pt: {
    downloadProcessing: "Processando download...",
    downloadUnlockedTitle: "Download desbloqueado!",
    downloadUnlockedDesc: "Seu arquivo está pronto para download.",
    rewardCompleted: "Recompensa concluída",
    rewardCompletedAction: "Clique no botão abaixo para iniciar o download imediato.",
    waitTimer: "Aguarde o temporizador",
    pastedSuccess: "Colado!",
    downloadError: "Erro ao baixar o arquivo. Tente novamente.",
    connectionError: "Erro de conexão com o motor de download.",
    networkFamilyTitle: "FAMÍLIA CLIP NETWORK",
    networkFamilyReddit: "ReddClip.com - Baixar Vídeos do Reddit",
    networkFamilyTwitter: "TwitsClip.com - Baixar Vídeos do Twitter / X",
  },
  id: {
    downloadProcessing: "Memproses unduhan...",
    downloadUnlockedTitle: "Unduhan Terbuka!",
    downloadUnlockedDesc: "Berkas Anda siap diunduh.",
    rewardCompleted: "Hadiah selesai",
    rewardCompletedAction: "Klik tombol di bawah untuk segera memulai unduhan.",
    waitTimer: "Harap tunggu timer",
    pastedSuccess: "Ditempel!",
    downloadError: "Gagal mengunduh berkas. Silakan coba lagi.",
    connectionError: "Kesalahan koneksi dengan mesin pengunduh.",
    networkFamilyTitle: "KELUARGA JARINGAN CLIP",
    networkFamilyReddit: "ReddClip.com - Pengunduh Video Reddit",
    networkFamilyTwitter: "TwitsClip.com - Pengunduh Video Twitter / X",
  },
  ja: {
    downloadProcessing: "ダウンロードを処理中...",
    downloadUnlockedTitle: "ダウンロードのロックが解除されました！",
    downloadUnlockedDesc: "ファイルのダウンロード準備が整いました。",
    rewardCompleted: "リワード完了",
    rewardCompletedAction: "下のボタンをクリックして、すぐにダウンロードを開始してください。",
    waitTimer: "タイマーをお待ちください",
    pastedSuccess: "貼り付け完了!",
    downloadError: "ファイルのダウンロード中にエラーが発生しました。もう一度お試しください。",
    connectionError: "ダウンロードエンジンとの通信エラーが発生しました。",
    networkFamilyTitle: "CLIP ネットワークファミリー",
    networkFamilyReddit: "ReddClip.com - Reddit 動画ダウンローダー",
    networkFamilyTwitter: "TwitsClip.com - Twitter / X 動画ダウンローダー",
  },
  ko: {
    downloadProcessing: "다운로드 처리 중...",
    downloadUnlockedTitle: "다운로드 잠금 해제됨!",
    downloadUnlockedDesc: "파일이 다운로드 준비되었습니다.",
    rewardCompleted: "보상 완료",
    rewardCompletedAction: "즉시 다운로드를 시작하려면 아래 버튼을 클릭하세요.",
    waitTimer: "타이머를 기다려 주세요",
    pastedSuccess: "붙여넣기 완료!",
    downloadError: "파일을 다운로드하는 중 오류가 발생했습니다. 다시 시도해 주세요.",
    connectionError: "다운로드 엔진과의 연결 오류가 발생했습니다.",
    networkFamilyTitle: "클립 네트워크 패밀리",
    networkFamilyReddit: "ReddClip.com - 레딧 동영상 다운로더",
    networkFamilyTwitter: "TwitsClip.com - 트위터 / X 동영상 다운로더",
  },
  pl: {
    downloadProcessing: "Przetwarzanie pobierania...",
    downloadUnlockedTitle: "Pobieranie odblokowane!",
    downloadUnlockedDesc: "Twój plik jest gotowy do pobrania.",
    rewardCompleted: "Nagroda ukończona",
    rewardCompletedAction: "Kliknij poniższy przycisk, aby natychmiast rozpocząć pobieranie.",
    waitTimer: "Proszę poczekać na licznik",
    pastedSuccess: "Wklejono!",
    downloadError: "Błąd podczas pobierania pliku. Spróbuj ponownie.",
    connectionError: "Błąd połączenia z silnikiem pobierania.",
    networkFamilyTitle: "RODZINA SIECI CLIP",
    networkFamilyReddit: "ReddClip.com - Pobieranie filmów z Reddit",
    networkFamilyTwitter: "TwitsClip.com - Pobieranie filmów z Twitter / X",
  },
  ru: {
    downloadProcessing: "Обработка загрузки...",
    downloadUnlockedTitle: "Загрузка разблокирована!",
    downloadUnlockedDesc: "Ваш файл готов к загрузке.",
    rewardCompleted: "Награда получена",
    rewardCompletedAction: "Нажмите кнопку ниже, чтобы начать загрузку прямо сейчас.",
    waitTimer: "Пожалуйста, дождитесь таймера",
    pastedSuccess: "Вставлено!",
    downloadError: "Ошибка при загрузке файла. Пожалуйста, попробуйте еще раз.",
    connectionError: "Ошибка соединения с механизмом загрузки.",
    networkFamilyTitle: "СЕМЕЙСТВО CLIP NETWORK",
    networkFamilyReddit: "ReddClip.com - Скачать видео с Reddit",
    networkFamilyTwitter: "TwitsClip.com - Скачать видео с Twitter / X",
  },
  tr: {
    downloadProcessing: "İndirme işleniyor...",
    downloadUnlockedTitle: "İndirme Kilidi Açıldı!",
    downloadUnlockedDesc: "Dosyanız indirilmeye hazır.",
    rewardCompleted: "Ödül tamamlandı",
    rewardCompletedAction: "İndirmeyi hemen başlatmak için aşağıdaki düğmeye tıklayın.",
    waitTimer: "Lütfen zamanlayıcıyı bekleyin",
    pastedSuccess: "Yapıştırıldı!",
    downloadError: "Dosya indirilirken hata oluştu. Lütfen tekrar deneyin.",
    connectionError: "İndirme motoruyla bağlantı hatası.",
    networkFamilyTitle: "CLIP AĞ AİLESİ",
    networkFamilyReddit: "ReddClip.com - Reddit Video İndirici",
    networkFamilyTwitter: "TwitsClip.com - Twitter / X Video İndirici",
  },
  uk: {
    downloadProcessing: "Обробка завантаження...",
    downloadUnlockedTitle: "Завантаження розблоковано!",
    downloadUnlockedDesc: "Ваш файл готовий до завантаження.",
    rewardCompleted: "Винагорода отримана",
    rewardCompletedAction: "Натисніть кнопку нижче, щоб негайно розпочати завантаження.",
    waitTimer: "Будь ласка, зачекайте таймер",
    pastedSuccess: "Вставлено!",
    downloadError: "Помилка під час завантаження файлу. Спробуйте ще раз.",
    connectionError: "Помилка з'єднання з механізмом завантаження.",
    networkFamilyTitle: "СІМЕЙСТВО CLIP NETWORK",
    networkFamilyReddit: "ReddClip.com - Завантажити відео з Reddit",
    networkFamilyTwitter: "TwitsClip.com - Завантажити відео з Twitter / X",
  },
  zh: {
    downloadProcessing: "正在处理下载...",
    downloadUnlockedTitle: "下载已解锁！",
    downloadUnlockedDesc: "您的文件已准备好下载。",
    rewardCompleted: "奖励已完成",
    rewardCompletedAction: "点击下方按钮立即开始下载。",
    waitTimer: "请等待计时器",
    pastedSuccess: "已粘贴！",
    downloadError: "下载文件时出错，请重试。",
    connectionError: "与下载引擎的连接错误。",
    networkFamilyTitle: "CLIP 家族系列工具",
    networkFamilyReddit: "ReddClip.com - Reddit 视频下载器",
    networkFamilyTwitter: "TwitsClip.com - Twitter / X 视频下载器",
  },
};

const baseTranslations: Record<Language, Translation> = {
  en,
  es,
  de,
  fr,
  it,
  pt,
  id,
  ja,
  ko,
  pl,
  ru,
  tr,
  uk,
  zh,
};

export const allTranslations: Record<Language, Translation> = (
  Object.keys(baseTranslations) as Language[]
).reduce((acc, lang) => {
  acc[lang] = {
    ...baseTranslations[lang],
    ...(extraTranslations[lang] || extraTranslations.en),
  };
  return acc;
}, {} as Record<Language, Translation>);
