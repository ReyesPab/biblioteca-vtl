import { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, X, ChevronDown } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { STUDY_CATEGORIES, FICTION_CATEGORIES } from '../types';
import BookCard from '../components/BookCard';

export default function BrowseBooks() {
  const { books, searchBooks } = useLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'estudio' | 'ficcion'>('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredBooks = useMemo(() => {
    let result = searchQuery ? searchBooks(searchQuery) : books;

    if (categoryFilter !== 'all') {
      result = result.filter(b => b.category === categoryFilter);
    }

    if (subcategoryFilter) {
      result = result.filter(b => b.subcategory === subcategoryFilter);
    }

    return result;
  }, [books, searchQuery, categoryFilter, subcategoryFilter, searchBooks]);

  const subcategories = categoryFilter === 'estudio'
    ? STUDY_CATEGORIES
    : categoryFilter === 'ficcion'
    ? FICTION_CATEGORIES
    : [...STUDY_CATEGORIES, ...FICTION_CATEGORIES];

  const clearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setSubcategoryFilter('');
  };

  const hasFilters = searchQuery || categoryFilter !== 'all' || subcategoryFilter;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Explorar Biblioteca</h1>
        <p className="text-gray-500 mt-1">Busca y filtra libros por categoría, carrera o género</p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, autor o tema..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all shadow-sm ${
              showFilters || hasFilters
                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter size={20} />
            <span className="hidden sm:inline">Filtros</span>
          </button>
        </div>

        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Categoría</label>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => { setCategoryFilter(e.target.value as 'all' | 'estudio' | 'ficcion'); setSubcategoryFilter(''); }}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                  >
                    <option value="all">Todas las categorías</option>
                    <option value="estudio">📚 Estudio / Carreras</option>
                    <option value="ficcion">✨ Ficción</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {categoryFilter === 'estudio' ? 'Carrera / Materia' : categoryFilter === 'ficcion' ? 'Género' : 'Subcategoría'}
                </label>
                <div className="relative">
                  <select
                    value={subcategoryFilter}
                    onChange={(e) => setSubcategoryFilter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                  >
                    <option value="">Todas</option>
                    {subcategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
              >
                <X size={14} />
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {filteredBooks.length} {filteredBooks.length === 1 ? 'libro encontrado' : 'libros encontrados'}
        </p>
      </div>

      {filteredBooks.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron libros</p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 text-indigo-600 font-medium hover:text-indigo-700"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
