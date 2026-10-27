import { Book, STUDY_CATEGORIES, FICTION_CATEGORIES } from '../types';
import { BookOpen, Download, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const allCategories = [...STUDY_CATEGORIES, ...FICTION_CATEGORIES];
  const subcategoryLabel = allCategories.find(c => c.value === book.subcategory)?.label || book.subcategory;
  const categoryLabel = book.category === 'estudio' ? '📚 Estudio' : '✨ Ficción';
  const hasPdf = book.hasPdf || !!book.pdfData;

  return (
    <Link
      to={`/libro/${book.id}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1"
    >
      <div
        className="h-48 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: book.coverColor + '15' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `linear-gradient(135deg, ${book.coverColor}, transparent)` }}
        />
        <div className="relative flex flex-col items-center gap-2">
          <div
            className="w-16 h-20 rounded-lg shadow-lg flex items-center justify-center"
            style={{ backgroundColor: book.coverColor }}
          >
            {hasPdf ? <FileText size={24} className="text-white" /> : <BookOpen size={24} className="text-white" />}
          </div>
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          {hasPdf && (
            <span className="px-2 py-1 bg-red-100/90 backdrop-blur-sm rounded-full text-xs font-medium text-red-700 flex items-center gap-1">
              <FileText size={10} />
              PDF
            </span>
          )}
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-1">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {subcategoryLabel}
          </span>
        </div>
        <h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{book.author}</p>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{book.description}</p>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Eye size={14} />
            {book.views}
          </span>
          <span className="flex items-center gap-1">
            <Download size={14} />
            {book.downloads}
          </span>
          {hasPdf && (
            <span className="ml-auto flex items-center gap-1 text-red-500 font-medium">
              <FileText size={12} />
              PDF
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
