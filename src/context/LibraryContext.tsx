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

Programar es el arte de darle instrucciones a una computadora para que realice tareas específicas. Es como escribir una receta de cocina, pero para una máquina.

## Capítulo 2: Variables y tipos de datos

Las variables son como cajas donde guardamos información. Cada caja tiene un nombre y contiene un valor.

\`\`\`
let nombre = "María";
let edad = 25;
let esEstudiante = true;
\`\`\`

## Capítulo 3: Estructuras de control

Las estructuras de control nos permiten tomar decisiones en nuestro código.

\`\`\`
if (edad >= 18) {
  console.log("Es mayor de edad");
} else {
  console.log("Es menor de edad");
}
\`\`\`

## Capítulo 4: Funciones

Las funciones son bloques de código reutilizables.

\`\`\`
function saludar(nombre) {
  return "Hola, " + nombre + "!";
}
\`\`\`

## Ejercicios

1. Crea un programa que imprima tu nombre 10 veces
2. Escribe una función que calcule el área de un rectángulo
3. Crea un programa que determine si un número es par o impar`,
    createdAt: '2024-01-15',
    downloads: 0,
    views: 0,
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

La casa llevaba abandonada más de veinte años cuando Elena la descubrió por casualidad. Las enredaderas cubrían cada centímetro de la fachada, y el portón de hierro chirrió como un lamento al empujarlo.

## Capítulo 1

No debería haber entrado. Lo sabía. Las voces del pueblo habían sido claras: "Nadie vuelve igual de esa casa." Pero Elena no creía en supersticiones. Era periodista, investigadora, una mujer de ciencia.

El jardín estaba exactamente como lo describían las crónicas antiguas. Flores que no deberían existir, con pétalos negros como la noche más oscura. Y en el centro, una fuente de piedra con un ángel decapitado.

—¿Quién anda ahí? —susurró, aunque sabía que no había nadie.

O eso quería creer.

Porque esa noche, cuando el reloj marcó las tres de la mañana, Elena escuchó los pasos en el jardín. Lentos. Deliberados. Acercándose a su ventana.

## Capítulo 2

Los diarios de la familia Montenegro contaban una historia diferente a la oficial. No fue un incendio lo que destruyó la mansión. Fue algo mucho peor.

Elena pasó tres días leyendo aquellos papeles amarillentos, y cada página la hundía más en una verdad que no quería aceptar: la casa no estaba embrujada. La casa estaba viva.

Y tenía hambre.`,
    createdAt: '2024-02-20',
    downloads: 0,
    views: 0,
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

El Derecho Civil es la rama del derecho privado que regula las relaciones entre personas, abarcando aspectos como la personalidad jurídica, la familia, la propiedad y las obligaciones.

## Unidad 2: Personas y Capacidad Jurídica

### Persona Natural
Toda persona humana es sujeto de derecho desde su nacimiento. La capacidad jurídica es la aptitud para ser titular de derechos y obligaciones.

### Persona Jurídica
Son entidades abstractas creadas por el derecho que tienen capacidad para adquirir derechos y contraer obligaciones.

## Unidad 3: Los Bienes

Los bienes se clasifican en:
- Bienes muebles e inmuebles
- Bienes fungibles y no fungibles
- Bienes consumibles y no consumibles
- Bienes divisibles e indivisibles

## Unidad 4: Las Obligaciones

La obligación es un vínculo jurídico entre dos personas, por el cual una (deudor) se compromete a dar, hacer o no hacer algo en favor de otra (acreedor).

### Fuentes de las obligaciones:
1. El contrato
2. El cuasicontrato
3. El delito civil
4. La ley`,
    createdAt: '2024-03-10',
    downloads: 0,
    views: 0,
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

El observatorio siempre olía a café viejo y papel. A Sofía le encantaba ese aroma porque le recordaba por qué había dedicado su vida a estudiar las estrellas.

Esa noche, sin embargo, algo era diferente. Había alguien nuevo en el turno nocturno.

—¿Eres la nueva? —preguntó ella sin levantar la vista de su telescopio.

—No exactamente. Soy el nuevo director del departamento de astrofísica —respondió una voz masculina, cálida como una noche de verano.

Sofía giró lentamente. Lo que vio la dejó sin palabras: ojos del color del cielo nocturno, una sonrisa que prometía aventuras, y una chaqueta que había visto días mejores.

—Diego Morales —dijo, extendiendo la mano—. Encantado de, finalmente, conocer a la persona que ha mantenido este observatorio funcionando durante los últimos cinco años.

Sofía sintió que algo en su pecho se movió. Algo que no había sentido desde que era adolescente y miraba las estrellas soñando con el futuro.

—Sofía Herrera —respondió, tomando su mano.

Y en ese momento, bajo la bóveda infinita del cielo, comenzó una historia que cambiaría todo.`,
    createdAt: '2024-04-05',
    downloads: 0,
    views: 0,
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

El cuerpo humano adulto tiene 206 huesos. Estos se dividen en:
- Esqueleto axial (80 huesos): cráneo, columna vertebral, costillas y esternón
- Esqueleto apendicular (126 huesos): extremidades superiores e inferiores, cinturas escapular y pélvica

## Sistema Muscular

El cuerpo humano tiene más de 600 músculos. Los principales grupos son:

1. **Músculos de la cabeza y cuello**
   - Frontal, orbicular del ojo, masetero, esternocleidomastoideo

2. **Músculos del tronco**
   - Pectoral mayor, recto abdominal, dorsal ancho, trapecio

3. **Músculos de las extremidades**
   - Bíceps braquial, tríceps braquial, cuádriceps, gastrocnemio

## Sistema Cardiovascular

El corazón tiene 4 cámaras:
- Aurícula derecha
- Aurícula izquierda
- Ventrículo derecho
- Ventrículo izquierdo

El ciclo cardíaco consta de sístole (contracción) y diástole (relajación).

## Sistema Nervioso

Dividido en:
- Sistema nervioso central (cerebro y médula espinal)
- Sistema nervioso periférico (nervios craneales y espinales)`,
    createdAt: '2024-05-12',
    downloads: 0,
    views: 0,
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

En un tiempo antes del tiempo, cuando los ríos hablaban y las montañas cantaban, existían los Domadores. Hombres y mujeres capaces de comunicarse con los dragones, las criaturas más antiguas del mundo.

Pero los dragones desaparecieron. O eso creía todo el mundo.

## Capítulo 1

Kael tenía diecisiete años y una marca en el hombro que nadie podía explicar. Era un dibujo extraño, como un dragón enrollado sobre sí mismo, que apareció la noche de su decimotercer cumpleaños.

—No es normal, muchacho —le decía su abuela cada vez que se lo pedía que se cubriera—. La gente habla.

Pero Kael no podía evitarlo. La marca pulsaba, especialmente cuando miraba hacia las montañas del norte, donde las nubes siempre parecían tener formas de alas.

Esa noche, mientras dormía, soñó con fuego. No un fuego que quema, sino uno que habla. Y el fuego le dijo:

"Ven a buscarme. He esperado mil años."

Kael despertó con el corazón latiendo como un tambor de guerra. Sabía que su vida estaba a punto de cambiar para siempre.

Tomó su capa, su espada heredada de su padre, y se dirigió hacia las montañas. Hacia el último dragón.`,
    createdAt: '2024-06-18',
    downloads: 0,
    views: 0,
  },
];

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
          setBooks(SAMPLE_BOOKS);
          localStorage.setItem('biblioteca_books', JSON.stringify(SAMPLE_BOOKS));
        }
      } catch (e) {
        console.warn('Error loading books, using defaults');
        setBooks(SAMPLE_BOOKS);
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
