import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface LibraryContextType {
  books: Book[];
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'downloads' | 'views'>) => void;
  deleteBook: (id: string) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  incrementViews: (id: string) => void;
  incrementDownloads: (id: string) => void;
  searchBooks: (query: string) => Book[];
}

const LibraryContext = createContext<LibraryContextType | null>(null);

// Maximum PDF size in bytes (4MB to stay within localStorage limits)
const MAX_PDF_SIZE = 4 * 1024 * 1024;

export function getMaxPdfSize() {
  return MAX_PDF_SIZE;
}

const SAMPLE_BOOKS: Book[] = [
  {
    id: uuidv4(),
    title: 'Introducción a la Programación',
    author: 'Dr. Carlos Mendoza',
    description: 'Una guía completa para aprender los fundamentos de la programación desde cero.',
    category: 'estudio',
    subcategory: 'programacion',
    coverColor: '#6366f1',
    content: `# Introducción a la Programación

## Capítulo 1: ¿Qué es programar?

Programar es el arte de darle instrucciones a una computadora para que realice tareas específicas.

## Capítulo 2: Variables y tipos de datos

Las variables son como cajas donde guardamos información.

\`\`\`
let nombre = "María";
let edad = 25;
\`\`\`

## Ejercicios

1. Crea un programa que imprima tu nombre 10 veces
2. Escribe una función que calcule el área de un rectángulo`,
    createdAt: '2024-01-15',
    downloads: 145,
    views: 892,
  },
  {
    id: uuidv4(),
    title: 'El Jardín de las Sombras',
    author: 'Ana Lucía Ríos',
    description: 'Una novela de terror psicológico que te mantendrá despierto toda la noche.',
    category: 'ficcion',
    subcategory: 'terror',
    coverColor: '#f43f5e',
    content: `# El Jardín de las Sombras

## Prólogo

La casa llevaba abandonada más de veinte años cuando Elena la descubrió.

## Capítulo 1

No debería haber entrado. Lo sabía. Las voces del pueblo habían sido claras: "Nadie vuelve igual de esa casa."

Pero Elena no creía en supersticiones. Era periodista, investigadora, una mujer de ciencia.`,
    createdAt: '2024-02-20',
    downloads: 234,
    views: 1203,
  },
  {
    id: uuidv4(),
    title: 'Fundamentos de Derecho Civil',
    author: 'Dr. Roberto Sánchez',
    description: 'Manual completo de derecho civil para estudiantes universitarios.',
    category: 'estudio',
    subcategory: 'derecho',
    coverColor: '#3b82f6',
    content: `# Fundamentos de Derecho Civil

## Unidad 1: Introducción al Derecho Civil

El Derecho Civil es la rama del derecho privado que regula las relaciones entre personas.

## Unidad 2: Personas y Capacidad Jurídica

### Persona Natural
Toda persona humana es sujeto de derecho desde su nacimiento.`,
    createdAt: '2024-03-10',
    downloads: 89,
    views: 456,
  },
  {
    id: uuidv4(),
    title: 'Estrellas de Medianoche',
    author: 'Valentina Torres',
    description: 'Una historia de romance entre dos astrónomos que descubren el amor bajo las estrellas.',
    category: 'ficcion',
    subcategory: 'romance',
    coverColor: '#ec4899',
    content: `# Estrellas de Medianoche

## Capítulo 1

El observatorio siempre olía a café viejo y papel. A Sofía le encantaba ese aroma.

Esa noche, sin embargo, algo era diferente. Había alguien nuevo en el turno nocturno.

—¿Eres la nueva? —preguntó ella sin levantar la vista de su telescopio.`,
    createdAt: '2024-04-05',
    downloads: 312,
    views: 1567,
  },
  {
    id: uuidv4(),
    title: 'Anatomía Humana Esencial',
    author: 'Dra. Patricia Vega',
    description: 'Guía visual de anatomía humana para estudiantes de medicina.',
    category: 'estudio',
    subcategory: 'medicina',
    coverColor: '#22c55e',
    content: `# Anatomía Humana Esencial

## Sistema Óseo

El cuerpo humano adulto tiene 206 huesos.

## Sistema Muscular

El cuerpo humano tiene más de 600 músculos.

## Sistema Cardiovascular

El corazón tiene 4 cámaras.`,
    createdAt: '2024-05-12',
    downloads: 178,
    views: 934,
  },
  {
    id: uuidv4(),
    title: 'El Último Dragón',
    author: 'Miguel Ángel Fuentes',
    description: 'Una épica historia de fantasía donde un joven descubre que es el último heredero de los domadores de dragones.',
    category: 'ficcion',
    subcategory: 'fantasia',
    coverColor: '#f97316',
    content: `# El Último Dragón

## Prólogo

En un tiempo antes del tiempo, cuando los ríos hablaban y las montañas cantaban, existían los Domadores.

## Capítulo 1

Kael tenía diecisiete años y una marca en el hombro que nadie podía explicar.

Esa noche, mientras dormía, soñó con fuego. No un fuego que quema, sino uno que habla.`,
    createdAt: '2024-06-18',
    downloads: 267,
    views: 1389,
  },
];

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('biblioteca_books');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error loading books from localStorage, using defaults');
    }
    return SAMPLE_BOOKS;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('biblioteca_admin') === 'true';
  });

  useEffect(() => {
    try {
      localStorage.setItem('biblioteca_books', JSON.stringify(books));
    } catch (e) {
      console.warn('localStorage full, PDF data may not persist');
      const booksWithoutPdf = books.map(b => ({ ...b, pdfData: undefined }));
      localStorage.setItem('biblioteca_books', JSON.stringify(booksWithoutPdf));
    }
  }, [books]);

  useEffect(() => {
    localStorage.setItem('biblioteca_admin', String(isAdmin));
  }, [isAdmin]);

  const login = (password: string): boolean => {
    if (password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const addBook = (bookData: Omit<Book, 'id' | 'createdAt' | 'downloads' | 'views'>) => {
    const newBook: Book = {
      ...bookData,
      id: uuidv4(),
      createdAt: new Date().toISOString().split('T')[0],
      downloads: 0,
      views: 0,
    };
    setBooks(prev => [newBook, ...prev]);
  };

  const deleteBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const incrementViews = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, views: b.views + 1 } : b));
  };

  const incrementDownloads = (id: string) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, downloads: b.downloads + 1 } : b));
  };

  const searchBooks = (query: string): Book[] => {
    const q = query.toLowerCase();
    return books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.subcategory.toLowerCase().includes(q)
    );
  };

  return (
    <LibraryContext.Provider value={{
      books, isAdmin, login, logout, addBook, deleteBook, updateBook,
      incrementViews, incrementDownloads, searchBooks
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
}
