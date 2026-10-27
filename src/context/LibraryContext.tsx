import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { savePdfToIndexedDB, getPdfFromIndexedDB, deletePdfFromIndexedDB } from '../utils/indexedDB';

interface LibraryContextType {
  books: Book[];
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addBook: (book: Omit<Book, 'id' | 'createdAt' | 'downloads' | 'views'>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  incrementViews: (id: string) => void;
  incrementDownloads: (id: string) => void;
  searchBooks: (query: string) => Book[];
}

const LibraryContext = createContext<LibraryContextType | null>(null);

// Biblioteca inicia vacía - solo con los libros que agregue el administrador

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('biblioteca_admin') === 'true';
  });

  // Load books from localStorage on mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const saved = localStorage.getItem('biblioteca_books');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Load PDFs from IndexedDB for books that have them
          const booksWithPdfs = await Promise.all(
            parsed.map(async (book: Book) => {
              if (book.hasPdf) {
                const pdfData = await getPdfFromIndexedDB(book.id);
                return { ...book, pdfData };
              }
              return book;
            })
          );
          setBooks(booksWithPdfs);
        } else {
          setBooks([]); // Biblioteca inicia vacía
          localStorage.setItem('biblioteca_books', JSON.stringify([]));
        }
      } catch (e) {
        console.warn('Error loading books');
        setBooks([]);
      }
      setLoading(false);
    };
    loadBooks();
  }, []);

  useEffect(() => {
    localStorage.setItem('biblioteca_admin', String(isAdmin));
  }, [isAdmin]);

  // Save books to localStorage (without PDF data) whenever books change
  useEffect(() => {
    if (loading) return;
    const booksWithoutPdf = books.map(b => {
      const { pdfData, ...rest } = b;
      return { ...rest, hasPdf: !!pdfData };
    });
    localStorage.setItem('biblioteca_books', JSON.stringify(booksWithoutPdf));
  }, [books, loading]);

  const login = (password: string): boolean => {
    if (password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsAdmin(false);

  const addBook = async (bookData: Omit<Book, 'id' | 'createdAt' | 'downloads' | 'views'>) => {
    const id = uuidv4();
    const newBook: Book = {
      ...bookData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
      downloads: 0,
      views: 0,
    };
    
    // Save PDF to IndexedDB if present
    if (bookData.pdfData) {
      await savePdfToIndexedDB(id, bookData.pdfData);
    }
    
    setBooks(prev => [newBook, ...prev]);
  };

  const deleteBook = async (id: string) => {
    // Delete PDF from IndexedDB if present
    await deletePdfFromIndexedDB(id);
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    // Handle PDF update
    if (updates.pdfData !== undefined) {
      if (updates.pdfData) {
        await savePdfToIndexedDB(id, updates.pdfData);
      } else {
        await deletePdfFromIndexedDB(id);
      }
    }
    
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando biblioteca...</p>
        </div>
      </div>
    );
  }

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
