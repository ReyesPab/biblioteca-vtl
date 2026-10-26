import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, BookOpen, AlertCircle } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAdmin } = useLibrary();
  const navigate = useNavigate();

  if (isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('Contraseña incorrecta. Intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
            <p className="text-gray-500 mt-2">Ingresa la contraseña para gestionar la biblioteca</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-sm font-medium">🔑 Demo</p>
            <p className="text-amber-700 text-xs mt-1">
              Contraseña de administrador: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">admin123</code>
            </p>
          </div>

          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <BookOpen size={16} />
              <span>Los usuarios solo necesitan explorar la biblioteca</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
