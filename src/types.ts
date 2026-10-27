export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: 'estudio' | 'ficcion';
  subcategory: string;
  coverColor: string;
  content: string;
  pdfData?: string;
  pdfName?: string;
  hasPdf?: boolean; // Flag to know if PDF exists in IndexedDB
  createdAt: string;
  downloads: number;
  views: number;
}

export interface CategoryOption {
  value: string;
  label: string;
}

export const STUDY_CATEGORIES: CategoryOption[] = [
  { value: 'ingenieria', label: 'Ingeniería' },
  { value: 'medicina', label: 'Medicina' },
  { value: 'derecho', label: 'Derecho' },
  { value: 'administracion', label: 'Administración' },
  { value: 'psicologia', label: 'Psicología' },
  { value: 'educacion', label: 'Educación' },
  { value: 'contabilidad', label: 'Contabilidad' },
  { value: 'arquitectura', label: 'Arquitectura' },
  { value: 'matematicas', label: 'Matemáticas' },
  { value: 'programacion', label: 'Programación' },
  { value: 'ciencias', label: 'Ciencias Naturales' },
  { value: 'filosofia', label: 'Filosofía' },
  { value: 'historia', label: 'Historia' },
  { value: 'idiomas', label: 'Idiomas' },
  { value: 'otro_estudio', label: 'Otro' },
];

export const FICTION_CATEGORIES: CategoryOption[] = [
  { value: 'romance', label: 'Romance' },
  { value: 'terror', label: 'Terror / Horror' },
  { value: 'ciencia_ficcion', label: 'Ciencia Ficción' },
  { value: 'fantasia', label: 'Fantasía' },
  { value: 'misterio', label: 'Misterio / Suspenso' },
  { value: 'aventura', label: 'Aventura' },
  { value: 'drama', label: 'Drama' },
  { value: 'comedia', label: 'Comedia' },
  { value: 'poesia', label: 'Poesía' },
  { value: 'cuento', label: 'Cuento' },
  { value: 'novela', label: 'Novela' },
  { value: 'otro_ficcion', label: 'Otro' },
];

export const COVER_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#64748b', '#78716c',
];
