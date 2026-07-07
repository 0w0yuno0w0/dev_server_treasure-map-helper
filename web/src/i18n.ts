/**
 * UI 文言と言語設定の中枢。
 * - 対応言語は FF14 クライアントの提供言語（日英独仏韓・簡体字中国語）
 * - UI 表示言語・地名表示・OCR モデルは単一の言語設定に連動する
 * - 地名/地図名はゲームデータ由来（maps.json の zoneNames/gradeNames）で、ここには持たない
 */

import type { MapEntry } from "./matcher/mapDatabase";

export const APP_LANGS = ["ja", "en", "de", "fr", "ko", "zh"] as const;
export type AppLang = (typeof APP_LANGS)[number];

/** 言語設定の localStorage キー。 */
export const LANG_STORAGE_KEY = "lang";

/** OCR（tesseract）の言語データ名。public/ocr/lang/<名前>.traineddata.gz に対応する。 */
export const TESS_LANG: Record<AppLang, string> = {
  ja: "jpn",
  en: "eng",
  de: "deu",
  fr: "fra",
  ko: "kor",
  zh: "chi_sim",
};

/** OCR テキスト正規化に使う文字体系。en/de/fr はラテン文字として共通処理する。 */
export type Script = "ja" | "latin" | "ko" | "zh";
export function scriptOf(lang: AppLang): Script {
  return lang === "en" || lang === "de" || lang === "fr" ? "latin" : lang;
}

const ja = {
  appTitle: "FF14 宝の地図 照合",
  guideHintInitial: "地図をこの枠に合わせてください",
  defaultHint: "地図がこの枠内に入るようにカメラを向けてください（離れていてもOK）",
  hintAdjust:
    "認識できないときは、距離や角度を少し変えてみてください（画面の縞模様が消える位置があります）",
  hintEnableOcr: "誤認識が続く場合は「OCR認識を必須にする」をオンにしてください",
  hintZoneLocked: "ゾーン認識: {zone} — そのまま少し静止してください",
  hintTooSmall: "地図が小さすぎます。もう少し寄ってください",
  candidatesTitle: "候補（タップで採用）",
  rescan: "再スキャン",
  retry: "再試行",
  requireOcr: "OCR認識を必須にする",
  captureAlt: "認識した地図画像",
  dbLoading: "DB を読み込み中…",
  dbLoadFailed: "DB の読み込みに失敗しました: {message}",
  cameraNotAllowed:
    "カメラの使用が許可されていません。下の「画像を選択」、またはスクリーンショットの貼り付け（Ctrl+V）でも判定できます。",
  cameraNotFound:
    "利用できる背面カメラが見つかりませんでした。下の「画像を選択」、またはスクリーンショットの貼り付け（Ctrl+V）でも判定できます。",
  cameraUnavailable:
    "カメラを利用できません（{message}）。下の「画像を選択」、またはスクリーンショットの貼り付け（Ctrl+V）でも判定できます。",
  ocrLoading: "OCR読込中…",
  ocrZone: "ゾーン: {zone}",
  ocrSearching: "ゾーン名を探しています",
  ocrDisabled: "OCR無効",
  confidence: "信頼度 {pct}%",
  confidenceOcrStable: "信頼度 {pct}%（OCR安定）",
  matchDegree: "一致度 {pct}%",
  selectImage: "画像を選択",
  selectImageTitle: "スクリーンショット画像から判定します。Ctrl+V での貼り付けや、画面へのドラッグ＆ドロップにも対応しています。",
  analyzingImage: "画像を解析中…",
  staticAnalyzeFailed: "画像を解析できませんでした。別の画像でお試しください。",
  copyHint: "タップして座標をコピー",
  copied: "コピーしました",
  copyFailed: "コピーできませんでした",
} as const;

export type MsgKey = keyof typeof ja;

const en: Record<MsgKey, string> = {
  appTitle: "FFXIV Treasure Map Finder",
  guideHintInitial: "Align the map within this frame",
  defaultHint: "Point your camera so the map fits inside this frame (distance doesn't matter)",
  hintAdjust:
    "If it isn't recognized, try changing the distance or angle slightly (the on-screen moiré disappears at some position)",
  hintEnableOcr: 'If it keeps being misidentified, turn on "Require OCR zone match".',
  hintZoneLocked: "Zone detected: {zone} — hold still for a moment",
  hintTooSmall: "The map is too small. Move a little closer",
  candidatesTitle: "Candidates (tap to select)",
  rescan: "Rescan",
  retry: "Retry",
  requireOcr: "Require OCR zone match",
  captureAlt: "Recognized map image",
  dbLoading: "Loading database…",
  dbLoadFailed: "Failed to load the database: {message}",
  cameraNotAllowed:
    'Camera access was denied. You can still use "Select image" below, or paste a screenshot (Ctrl+V).',
  cameraNotFound:
    'No usable rear camera was found. You can still use "Select image" below, or paste a screenshot (Ctrl+V).',
  cameraUnavailable:
    'The camera is unavailable ({message}). You can still use "Select image" below, or paste a screenshot (Ctrl+V).',
  ocrLoading: "Loading OCR…",
  ocrZone: "Zone: {zone}",
  ocrSearching: "Looking for the zone name",
  ocrDisabled: "OCR unavailable",
  confidence: "Confidence {pct}%",
  confidenceOcrStable: "Confidence {pct}% (OCR stable)",
  matchDegree: "Match {pct}%",
  selectImage: "Select image",
  selectImageTitle:
    "Identify from a screenshot image. Pasting (Ctrl+V) and drag-and-drop onto the screen are also supported.",
  analyzingImage: "Analyzing image…",
  staticAnalyzeFailed: "Couldn't analyze the image. Please try a different one.",
  copyHint: "Tap to copy the coordinates",
  copied: "Copied",
  copyFailed: "Couldn't copy",
};

const de: Record<MsgKey, string> = {
  appTitle: "FFXIV Schatzkarten-Erkennung",
  guideHintInitial: "Richte die Karte in diesem Rahmen aus",
  defaultHint:
    "Richte die Kamera so aus, dass die Karte in diesen Rahmen passt (Abstand egal)",
  hintAdjust:
    "Wird die Karte nicht erkannt, ändere leicht Abstand oder Winkel (in einer bestimmten Position verschwindet das Moiré-Muster)",
  hintEnableOcr: "Bei anhaltenden Fehlerkennungen aktiviere „OCR-Gebietsabgleich erforderlich“.",
  hintZoneLocked: "Gebiet erkannt: {zone} — bitte kurz stillhalten",
  hintTooSmall: "Die Karte ist zu klein. Geh etwas näher heran",
  candidatesTitle: "Kandidaten (zum Übernehmen tippen)",
  rescan: "Neu scannen",
  retry: "Erneut versuchen",
  requireOcr: "OCR-Gebietsabgleich erforderlich",
  captureAlt: "Erkanntes Kartenbild",
  dbLoading: "Datenbank wird geladen…",
  dbLoadFailed: "Datenbank konnte nicht geladen werden: {message}",
  cameraNotAllowed:
    'Kamerazugriff wurde verweigert. Du kannst unten „Bild auswählen" nutzen oder einen Screenshot einfügen (Strg+V).',
  cameraNotFound:
    'Keine nutzbare Rückkamera gefunden. Du kannst unten „Bild auswählen" nutzen oder einen Screenshot einfügen (Strg+V).',
  cameraUnavailable:
    'Kamera nicht verfügbar ({message}). Du kannst unten „Bild auswählen" nutzen oder einen Screenshot einfügen (Strg+V).',
  ocrLoading: "OCR wird geladen…",
  ocrZone: "Gebiet: {zone}",
  ocrSearching: "Suche nach dem Gebietsnamen",
  ocrDisabled: "OCR nicht verfügbar",
  confidence: "Konfidenz {pct}%",
  confidenceOcrStable: "Konfidenz {pct}% (OCR stabil)",
  matchDegree: "Übereinstimmung {pct}%",
  selectImage: "Bild auswählen",
  selectImageTitle:
    "Erkennung anhand eines Screenshot-Bildes. Einfügen (Strg+V) und Drag & Drop auf den Bildschirm werden ebenfalls unterstützt.",
  analyzingImage: "Bild wird analysiert…",
  staticAnalyzeFailed: "Bild konnte nicht analysiert werden. Bitte ein anderes Bild versuchen.",
  copyHint: "Tippen, um die Koordinaten zu kopieren",
  copied: "Kopiert",
  copyFailed: "Kopieren fehlgeschlagen",
};

const fr: Record<MsgKey, string> = {
  appTitle: "FFXIV Identification de cartes au trésor",
  guideHintInitial: "Alignez la carte dans ce cadre",
  defaultHint:
    "Orientez la caméra pour que la carte tienne dans ce cadre (peu importe la distance)",
  hintAdjust:
    "Si la carte n'est pas reconnue, modifiez légèrement la distance ou l'angle (le moiré à l'écran disparaît à une certaine position)",
  hintEnableOcr:
    "En cas d'erreurs répétées, activez « Exiger la correspondance OCR de la zone ».",
  hintZoneLocked: "Zone détectée : {zone} — restez immobile un instant",
  hintTooSmall: "La carte est trop petite. Rapprochez-vous un peu",
  candidatesTitle: "Candidats (touchez pour choisir)",
  rescan: "Rescanner",
  retry: "Réessayer",
  requireOcr: "Exiger la correspondance OCR de la zone",
  captureAlt: "Image de carte reconnue",
  dbLoading: "Chargement de la base de données…",
  dbLoadFailed: "Échec du chargement de la base de données : {message}",
  cameraNotAllowed:
    "L'accès à la caméra a été refusé. Vous pouvez utiliser « Choisir une image » ci-dessous, ou coller une capture d'écran (Ctrl+V).",
  cameraNotFound:
    "Aucune caméra arrière utilisable n'a été trouvée. Vous pouvez utiliser « Choisir une image » ci-dessous, ou coller une capture d'écran (Ctrl+V).",
  cameraUnavailable:
    "Caméra indisponible ({message}). Vous pouvez utiliser « Choisir une image » ci-dessous, ou coller une capture d'écran (Ctrl+V).",
  ocrLoading: "Chargement de l'OCR…",
  ocrZone: "Zone : {zone}",
  ocrSearching: "Recherche du nom de la zone",
  ocrDisabled: "OCR indisponible",
  confidence: "Confiance {pct} %",
  confidenceOcrStable: "Confiance {pct} % (OCR stable)",
  matchDegree: "Correspondance {pct} %",
  selectImage: "Choisir une image",
  selectImageTitle:
    "Identification à partir d'une capture d'écran. Le collage (Ctrl+V) et le glisser-déposer sur l'écran sont aussi pris en charge.",
  analyzingImage: "Analyse de l'image…",
  staticAnalyzeFailed: "Impossible d'analyser l'image. Essayez une autre image.",
  copyHint: "Touchez pour copier les coordonnées",
  copied: "Copié",
  copyFailed: "Échec de la copie",
};

const ko: Record<MsgKey, string> = {
  appTitle: "FF14 보물지도 판별",
  guideHintInitial: "지도를 이 틀에 맞춰 주세요",
  defaultHint: "지도가 이 틀 안에 들어오도록 카메라를 향해 주세요 (멀어도 괜찮습니다)",
  hintAdjust:
    "인식되지 않으면 거리나 각도를 조금 바꿔 보세요 (화면의 줄무늬가 사라지는 위치가 있습니다)",
  hintEnableOcr: '오인식이 계속되면 "OCR 지역 인식 필수"를 켜 주세요.',
  hintZoneLocked: "지역 인식: {zone} — 잠시 그대로 멈춰 주세요",
  hintTooSmall: "지도가 너무 작습니다. 조금 더 가까이 가 주세요",
  candidatesTitle: "후보 (탭하여 선택)",
  rescan: "다시 스캔",
  retry: "다시 시도",
  requireOcr: "OCR 지역 인식 필수",
  captureAlt: "인식된 지도 이미지",
  dbLoading: "DB 불러오는 중…",
  dbLoadFailed: "DB 불러오기에 실패했습니다: {message}",
  cameraNotAllowed:
    "카메라 사용이 허용되지 않았습니다. 아래의 '이미지 선택'을 이용하거나 스크린샷을 붙여넣어도(Ctrl+V) 판별할 수 있습니다.",
  cameraNotFound:
    "사용 가능한 후면 카메라를 찾을 수 없습니다. 아래의 '이미지 선택'을 이용하거나 스크린샷을 붙여넣어도(Ctrl+V) 판별할 수 있습니다.",
  cameraUnavailable:
    "카메라를 사용할 수 없습니다({message}). 아래의 '이미지 선택'을 이용하거나 스크린샷을 붙여넣어도(Ctrl+V) 판별할 수 있습니다.",
  ocrLoading: "OCR 로딩 중…",
  ocrZone: "지역: {zone}",
  ocrSearching: "지역명을 찾는 중",
  ocrDisabled: "OCR 사용 불가",
  confidence: "신뢰도 {pct}%",
  confidenceOcrStable: "신뢰도 {pct}% (OCR 안정)",
  matchDegree: "일치도 {pct}%",
  selectImage: "이미지 선택",
  selectImageTitle:
    "스크린샷 이미지로 판별합니다. 붙여넣기(Ctrl+V)와 화면으로 드래그 앤 드롭도 지원합니다.",
  analyzingImage: "이미지 분석 중…",
  staticAnalyzeFailed: "이미지를 분석할 수 없습니다. 다른 이미지로 시도해 주세요.",
  copyHint: "탭하여 좌표 복사",
  copied: "복사했습니다",
  copyFailed: "복사하지 못했습니다",
};

const zh: Record<MsgKey, string> = {
  appTitle: "FF14 宝物地图识别",
  guideHintInitial: "请将地图对准此框",
  defaultHint: "请将相机对准地图，使其进入此框内（距离远也可以）",
  hintAdjust: "无法识别时，请稍微调整距离或角度（在某个位置屏幕上的条纹会消失）",
  hintEnableOcr: "若持续识别错误，请开启“必须通过 OCR 识别区域”。",
  hintZoneLocked: "已识别区域: {zone} — 请保持静止片刻",
  hintTooSmall: "地图太小了，请再靠近一些",
  candidatesTitle: "候选（点按选用）",
  rescan: "重新扫描",
  retry: "重试",
  requireOcr: "必须通过 OCR 识别区域",
  captureAlt: "已识别的地图图像",
  dbLoading: "正在加载数据库…",
  dbLoadFailed: "数据库加载失败: {message}",
  cameraNotAllowed:
    "相机使用未被允许。您也可以使用下方的“选择图片”，或粘贴截图（Ctrl+V）来进行识别。",
  cameraNotFound:
    "未找到可用的后置相机。您也可以使用下方的“选择图片”，或粘贴截图（Ctrl+V）来进行识别。",
  cameraUnavailable:
    "无法使用相机（{message}）。您也可以使用下方的“选择图片”，或粘贴截图（Ctrl+V）来进行识别。",
  ocrLoading: "正在加载 OCR…",
  ocrZone: "区域: {zone}",
  ocrSearching: "正在寻找区域名称",
  ocrDisabled: "OCR 不可用",
  confidence: "可信度 {pct}%",
  confidenceOcrStable: "可信度 {pct}%（OCR 稳定）",
  matchDegree: "匹配度 {pct}%",
  selectImage: "选择图片",
  selectImageTitle: "通过截图图片进行识别。也支持粘贴（Ctrl+V）以及拖放到屏幕上。",
  analyzingImage: "正在解析图片…",
  staticAnalyzeFailed: "无法解析该图片，请尝试其他图片。",
  copyHint: "点按可复制坐标",
  copied: "已复制",
  copyFailed: "复制失败",
};

export const MESSAGES: Record<AppLang, Record<MsgKey, string>> = { ja, en, de, fr, ko, zh };

/** 文言を取得する。{name} プレースホルダを params で置換する。 */
export function t(
  lang: AppLang,
  key: MsgKey,
  params?: Record<string, string | number>,
): string {
  let text: string = MESSAGES[lang][key];
  if (params) {
    for (const [name, value] of Object.entries(params)) {
      text = text.split(`{${name}}`).join(String(value));
    }
  }
  return text;
}

function isAppLang(value: string | null): value is AppLang {
  return value !== null && (APP_LANGS as readonly string[]).includes(value);
}

/**
 * 表示言語を決める。優先順: 保存済み設定 → ブラウザ言語（zh-CN/zh-TW/zh-Hant は zh に集約）→ en。
 * ブラウザ言語が対応外なら海外ユーザーの公算が高いので en に倒す。
 */
export function detectLang(): AppLang {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  if (isAppLang(saved)) return saved;
  for (const raw of navigator.languages ?? [navigator.language]) {
    const prefix = raw.toLowerCase().slice(0, 2);
    if (isAppLang(prefix)) return prefix;
  }
  return "en";
}

/**
 * index.html の静的文言を差し替える。
 * data-i18n=キー → textContent、data-i18n-alt=キー → alt 属性。title と <html lang> も設定する。
 */
export function applyStatic(lang: AppLang): void {
  document.documentElement.lang = lang;
  document.title = t(lang, "appTitle");
  for (const el of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
    el.textContent = t(lang, el.dataset.i18n as MsgKey);
  }
  for (const el of document.querySelectorAll<HTMLImageElement>("[data-i18n-alt]")) {
    el.alt = t(lang, el.dataset.i18nAlt as MsgKey);
  }
  for (const el of document.querySelectorAll<HTMLElement>("[data-i18n-title]")) {
    el.title = t(lang, el.dataset.i18nTitle as MsgKey);
  }
}

/**
 * ゾーンの照合キー（言語非依存）。OCR ゲートと確定判定はこのキーで比較する。
 * 多言語表を持たない旧DB（Service Worker キャッシュ由来）では ja 地名がキーになる。
 */
export function zoneKeyOf(entry: Pick<MapEntry, "zone" | "zoneId">): string {
  return entry.zoneId !== undefined ? String(entry.zoneId) : entry.zone;
}
