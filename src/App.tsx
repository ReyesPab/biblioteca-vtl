import { HashRouter, Routes, Route } from 'react-router-dom';
import { LibraryProvider } from './context/LibraryContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BrowseBooks from './pages/BrowseBooks';
import BookReader from './pages/BookReader';
import QRPage from './pages/QRPage';

function App() {
  return (
    <HashRouter>
      <LibraryProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/explorar" element={<BrowseBooks />} />
              <Route path="/libro/:id" element={<BookReader />} />
              <Route path="/qr" element={<QRPage />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-gray-100 py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2024 BiblioVirtual — Biblioteca Digital. Todos los derechos reservados.
              </p>
            </div>
          </footer>
        </div>
      </LibraryProvider>
    </HashRouter>
  );
}

export default App;
