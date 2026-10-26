import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Download, Eye, BookOpen, Printer, Calendar, User, FileText, File } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { STUDY_CATEGORIES, FICTION_CATEGORIES } from '../types';
import { base64ToBlobUrl, downloadPdf } from '../utils/pdfUtils';

export default function BookReader() {
  const { id } = useParams<{ id: string }>();
  const { books, incrementViews, incrementDownloads } = useLibrary();
  const navigate = useNavigate();
  const [fontSize, setFontSize] = useState(16);
  const [activeTab, setActiveTab] = useState<'pdf' | 'text'>('pdf');

  const book = books.find(b => b.id === id);

  const pdfUrl = useMemo(() => {
    if (book?.pdfData) {
      return base64ToBlobUrl(book.pdfData);
    }
    return null;
  }, [book?.pdfData]);

  useEffect(() => {
    if (book) {
      incrementViews(book.id);
    }
  }, [book?.id]);

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Libro no encontrado</h2>
        <p className="text-gray-500 mb-6">El libro que buscas no existe o fue eliminado.</p>
        <Link to="/explorar" className="text-indigo-600 font-medium hover:text-indigo-700">
          ← Volver a la biblioteca
        </Link>
      </div>
    );
  }

  const allCategories = [...STUDY_CATEGORIES, ...FICTION_CATEGORIES];
  const subcategoryLabel = allCategories.find(c => c.value === book.subcategory)?.label || book.subcategory;
  const hasPdf = !!book.pdfData;
  const hasText = !!book.content;

  const handleDownload = () => {
    incrementDownloads(book.id);
    if (hasPdf) {
      downloadPdf(book.pdfData!, book.pdfName || `${book.title}.pdf`);
    } else {
      const blob = new Blob([book.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book.title.replace(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ ]/g, '')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = () => {
    incrementDownloads(book.id);
    if (hasPdf && pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          printWindow.print();
        });
      }
    } else {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>${book.title}</title>
            <style>
              body { font-family: Georgia, serif; max-width: 700px; margin: 40px auto; padding: 20px; line-height: 1.8; color: #333; }
              h1 { color: #1a1a1a; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
              h2 { color: #4f46e5; margin-top: 30px; }
              .meta { color: #666; font-size: 14px; margin-bottom: 30px; }
              pre { background: #f5f5f5; padding: 15px; border-radius: 8px; overflow-x: auto; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${book.title}</h1>
            <div class="meta">
              <p><strong>Autor:</strong> ${book.author}</p>
              <p><strong>Categoría:</strong> ${book.category === 'estudio' ? 'Estudio' : 'Ficción'} - ${subcategoryLabel}</p>
            </div>
            <pre>${book.content}</pre>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div
          className="h-32 sm:h-40 relative"
          style={{
            background: `linear-gradient(135deg, ${book.coverColor}40, ${book.coverColor}10)`
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-4">
            <div
              className="w-20 h-28 rounded-lg shadow-lg flex items-center justify-center flex-shrink-0 border-2 border-white"
              style={{ backgroundColor: book.coverColor }}
            >
              {hasPdf ? <FileText size={32} className="text-white" /> : <BookOpen size={32} className="text-white" />}
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="inline-block px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                  {book.category === 'estudio' ? '📚 Estudio' : '✨ Ficción'} • {subcategoryLabel}
                </span>
                {hasPdf && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100/80 backdrop-blur-sm rounded-full text-xs font-medium text-red-700">
                    <FileText size={10} />
                    PDF
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{book.title}</h1>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <User size={14} />
              {book.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {book.createdAt}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {book.views} vistas
            </span>
            <span className="flex items-center gap-1">
              <Download size={14} />
              {book.downloads} descargas
            </span>
          </div>

          {book.description && (
            <p className="text-gray-600 mb-6">{book.description}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
            >
              <Download size={18} />
              {hasPdf ? 'Descargar PDF' : 'Descargar'}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              <Printer size={18} />
              Imprimir
            </button>
            {hasText && !hasPdf && (
              <div className="flex items-center gap-1 ml-auto border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  A-
                </button>
                <span className="px-2 text-xs text-gray-400">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="px-3 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  A+
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {hasPdf && hasText && (
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'pdf'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText size={16} />
            PDF
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'text'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <File size={16} />
            Texto
          </button>
        </div>
      )}

      {hasPdf && (activeTab === 'pdf' || !hasText) && pdfUrl && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 px-4 py-2 flex items-center gap-2">
            <FileText size={16} className="text-red-400" />
            <span className="text-white text-sm font-medium">{book.pdfName || 'documento.pdf'}</span>
          </div>
          <iframe
            src={pdfUrl}
            className="w-full h-[70vh] min-h-[500px] border-0"
            title={book.title}
          />
        </div>
      )}

      {hasText && (activeTab === 'text' || !hasPdf) && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 md:p-12">
          <div
            className="prose prose-indigo max-w-none book-content"
            style={{ fontSize: `${fontSize}px` }}
          >
            {renderMarkdown(book.content)}
          </div>
        </div>
      )}

      {!hasPdf && !hasText && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Este libro no tiene contenido disponible</p>
        </div>
      )}
    </div>
  );
}

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let inCodeBlock = false;
  let codeContent = '';
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={key++} className="bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto my-4 text-sm">
            <code>{codeContent.trim()}</code>
          </pre>
        );
        codeContent = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="text-3xl font-bold text-gray-900 mt-8 mb-4 first:mt-0">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="text-2xl font-bold text-indigo-700 mt-6 mb-3">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-xl font-bold text-gray-800 mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="text-gray-700 ml-4 mb-1 list-disc">
          {line.slice(2)}
        </li>
      );
    } else if (/^\d+\. /.test(line)) {
      elements.push(
        <li key={key++} className="text-gray-700 ml-4 mb-1 list-decimal">
          {line.replace(/^\d+\. /, '')}
        </li>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-3" />);
    } else {
      elements.push(
        <p key={key++} className="text-gray-700 leading-relaxed mb-2">
          {line}
        </p>
      );
    }
  }

  return elements;
}
