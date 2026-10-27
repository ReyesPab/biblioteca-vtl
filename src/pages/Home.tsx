import { Link } from 'react-router-dom';
import { BookOpen, Search, Shield, QrCode, ArrowRight, Sparkles, FileText } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import BookCard from '../components/BookCard';

export default function Home() {
  const { books } = useLibrary();
  const recentBooks = books.slice(0, 6);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <BookOpen size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              BiblioVirtual
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Tu biblioteca digital. Lee, busca y descarga libros en PDF organizados por carreras, materias y géneros literarios.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/explorar"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Search size={20} />
                Explorar Biblioteca
              </Link>
              <Link
                to="/qr"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/30 transition-all border border-white/30"
              >
                <QrCode size={20} />
                Acceso por QR
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <FileText size={24} className="text-red-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Libros en PDF</h3>
              <p className="text-gray-600 text-sm">Sube y lee libros directamente en formato PDF. Visualización integrada con opción de descarga e impresión.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles size={24} className="text-pink-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Ficción y Entretenimiento</h3>
              <p className="text-gray-600 text-sm">Romance, terror, fantasía, ciencia ficción y más. Descubre mundos nuevos en cada página.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <QrCode size={24} className="text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Acceso por QR</h3>
              <p className="text-gray-600 text-sm">Comparte la biblioteca con un simple código QR. Ideal para aulas y espacios de estudio.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Libros Recientes</h2>
              <p className="text-gray-500 mt-1">Las últimas publicaciones de nuestra biblioteca</p>
            </div>
            {books.length > 0 && (
              <Link
                to="/explorar"
                className="hidden sm:flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
              >
                Ver todos
                <ArrowRight size={18} />
              </Link>
            )}
          </div>

          {books.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentBooks.map(book => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              <div className="sm:hidden text-center mt-8">
                <Link
                  to="/explorar"
                  className="inline-flex items-center gap-2 text-indigo-600 font-medium"
                >
                  Ver todos los libros
                  <ArrowRight size={18} />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <BookOpen size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg mb-2">La biblioteca está vacía</p>
              <p className="text-gray-400 text-sm mb-6">Comienza agregando libros desde el panel de administración</p>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
              >
                <Shield size={18} />
                Acceder como Administrador
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">{books.length}</div>
              <div className="text-indigo-200 mt-1">Libros</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                {books.filter(b => b.category === 'estudio').length}
              </div>
              <div className="text-indigo-200 mt-1">De Estudio</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                {books.filter(b => b.category === 'ficcion').length}
              </div>
              <div className="text-indigo-200 mt-1">Ficción</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                {books.reduce((acc, b) => acc + b.downloads, 0)}
              </div>
              <div className="text-indigo-200 mt-1">Descargas</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
