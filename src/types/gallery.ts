// Counter types for multi-counter functionality
// NOTE: Type aliases maintained for backward compatibility with "Gallery" naming

export interface PDF {
  id: string;
  title: string;
  date: string;
  pdfUrl: string;
  thumbnail: string;
  fileType?: 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'xls' | 'xlsx' | 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp' | 'odt' | 'ods' | 'odp' | 'rtf' | 'txt' | 'csv' | 'svg' | 'ico' | 'zip' | 'rar' | '7z' | 'epub' | 'mobi' | 'mp3' | 'wav' | 'ogg' | 'mp4' | 'mov' | 'webm' | 'youtube';
}

export interface Divider {
  id: string;
  type: 'divider';
  text: string;
}

export type CounterItem = PDF | Divider;
export type GalleryItem = CounterItem; // backward compat

export interface Counter {
  id: string;
  name: string;
  items: CounterItem[];
  createdAt: string;
}
export type Gallery = Counter; // backward compat

export interface CounterState {
  counters: Counter[];
  currentCounterId: string;
}
export type GalleryState = CounterState; // backward compat
