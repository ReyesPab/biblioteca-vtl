import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, BookOpen, X, Check, ChevronDown, FileText, Upload, AlertCircle } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { STUDY_CATEGORIES, FICTION_CATEGORIES, COVER_COLORS } from '../types';
import { fileToBase64, formatFileSize, MAX_PDF_SIZE } from '../utils/pdfUtils';

export default function AdminDashboard() {
  const { books, isAdmin, addBook, deleteBook } = useLibrary();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500 mt-1">Gestiona los libros y archivos PDF de la biblioteca</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
        >
          <Plus size={20} />
          Agregar Libro
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {books.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={40} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">¡Bienvenido a tu biblioteca!</h3>
            <p className="text-gray-500 mb-6">Comienza agregando tu primer libro haciendo clic en el botón "Agregar Libro"</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-amber-800 text-sm font-medium mb-2">💡 Consejos:</p>
              <ul className="text-amber-700 text-xs text-left space-y-1">
                <li>• Puedes subir archivos PDF de hasta 30 MB</li>
                <li>• Organiza los libros por carreras o géneros</li>
                <li>• Los usuarios podrán leer, descargar e imprimir</li>
                <li>• Las vistas y descargas se cuentan automáticamente</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {books.map(book => (
              <div key={book.id} className="p-4 sm:p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div
                  className="w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: book.coverColor }}
                >
                  <BookOpen size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                    {(book.hasPdf || book.pdfData) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                        <FileText size={12} />
                        PDF
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{book.author} • {book.category === 'estudio' ? '📚 Estudio' : '✨ Ficción'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditingId(book.id); setShowForm(true); }}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => { if (confirm('¿Eliminar este libro?')) deleteBook(book.id); }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <BookForm
          editingId={editingId}
          onClose={() => { setShowForm(false); setEditingId(null); }}
        />
      )}
    </div>
  );
}

function BookForm({ editingId, onClose }: { editingId: string | null; onClose: () => void }) {
  const { books, addBook, updateBook } = useLibrary();
  const editingBook = editingId ? books.find(b => b.id === editingId) : null;

  const [title, setTitle] = useState(editingBook?.title || '');
  const [author, setAuthor] = useState(editingBook?.author || '');
  const [description, setDescription] = useState(editingBook?.description || '');
  const [category, setCategory] = useState<'estudio' | 'ficcion'>(editingBook?.category || 'estudio');
  const [subcategory, setSubcategory] = useState(editingBook?.subcategory || '');
  const [coverColor, setCoverColor] = useState(editingBook?.coverColor || COVER_COLORS[0]);
  const [content, setContent] = useState(editingBook?.content || '');
  const [pdfData, setPdfData] = useState<string | undefined>(editingBook?.pdfData);
  const [pdfName, setPdfName] = useState<string | undefined>(editingBook?.pdfName);
  const [pdfSize, setPdfSize] = useState<number>(0);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = category === 'estudio' ? STUDY_CATEGORIES : FICTION_CATEGORIES;

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    if (file.type !== 'application/pdf') {
      setUploadError('Solo se permiten archivos PDF');
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setUploadError(`El archivo es demasiado grande. Máximo: ${formatFileSize(MAX_PDF_SIZE)}`);
      return;
    }

    setUploading(true);
    try {
      const base64 = await fileToBase64(file);
      setPdfData(base64);
      setPdfName(file.name);
      setPdfSize(file.size);
    } catch (error) {
      setUploadError('Error al procesar el archivo PDF');
    }
    setUploading(false);
  };

  const removePdf = () => {
    setPdfData(undefined);
    setPdfName(undefined);
    setPdfSize(0);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !subcategory) return;
    if (!pdfData && !content) {
      setUploadError('Debes subir un PDF o escribir contenido de texto');
      return;
    }

    const bookData = {
      title,
      author,
      description,
      category,
      subcategory,
      coverColor,
      content,
      pdfData,
      pdfName,
    };

    if (editingId) {
      updateBook(editingId, bookData);
    } else {
      addBook(bookData);
    }
    setSuccess(true);
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {editingId ? 'Editar Libro' : 'Nuevo Libro'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <Check size={18} />
              <span className="font-medium">{editingId ? 'Libro actualizado' : 'Libro agregado'} exitosamente</span>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Nombre del libro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autor *</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Nombre del autor"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              placeholder="Breve descripción del libro"
            />
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 bg-gray-50">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={20} className="text-red-500" />
              <h3 className="font-bold text-gray-900">Archivo PDF</h3>
            </div>

            {!pdfData ? (
              <div className="text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer inline-flex flex-col items-center gap-2 p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all w-full"
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  ) : (
                    <Upload size={32} className="text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-600">
                    {uploading ? 'Procesando...' : 'Haz clic para subir un PDF'}
                  </span>
                  <span className="text-xs text-gray-400">
                    Máximo 30 MB • Solo archivos .pdf
                  </span>
                </label>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-green-200">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={20} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{pdfName || 'archivo.pdf'}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(pdfSize)}</p>
                </div>
                <button
                  type="button"
                  onClick={removePdf}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Eliminar PDF"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center gap-2 mt-3 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                <AlertCircle size={14} />
                {uploadError}
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría Principal *</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => { setCategory(e.target.value as 'estudio' | 'ficcion'); setSubcategory(''); }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                >
                  <option value="estudio">📚 Estudio / Carrera</option>
                  <option value="ficcion">✨ Ficción</option>
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {category === 'estudio' ? 'Carrera / Materia' : 'Género'} *
              </label>
              <div className="relative">
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Color de Portada</label>
            <div className="flex flex-wrap gap-2">
              {COVER_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setCoverColor(color)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    coverColor === color ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido de Texto (opcional si subes PDF)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-y font-mono text-sm"
              placeholder="Escribe el contenido del libro aquí. Si subes un PDF, este texto será la descripción extendida."
            />
            <p className="text-xs text-gray-400 mt-1">
              Si subes un PDF, los usuarios verán el PDF. Este texto es opcional como contenido adicional.
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
            >
              {editingId ? 'Guardar Cambios' : 'Publicar Libro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
