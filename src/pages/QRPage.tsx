import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Link as LinkIcon, Copy, Check, Download, ExternalLink } from 'lucide-react';

export default function QRPage() {
  const currentUrl = window.location.origin + window.location.pathname;
  const [copied, setCopied] = useState(false);
  const [customPath, setCustomPath] = useState('');

  const fullUrl = customPath ? `${currentUrl}${customPath}` : currentUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector('#qr-code svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      canvas.width = 512;
      canvas.height = 512;
      img.onload = () => {
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, 512, 512);
          ctx.drawImage(img, 0, 0, 512, 512);
          const pngUrl = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = pngUrl;
          a.download = 'biblioteca-qr.png';
          a.click();
        }
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  const quickLinks = [
    { label: '🏠 Página Principal', path: '#/' },
    { label: '📚 Explorar Libros', path: '#/explorar' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Código QR de Acceso</h1>
        <p className="text-gray-500 mt-1">Genera un código QR para compartir el acceso a la biblioteca</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div id="qr-code" className="inline-block p-6 bg-white rounded-2xl border-2 border-dashed border-indigo-200 mb-6">
            <QRCodeSVG
              value={fullUrl}
              size={220}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#4f46e5"
            />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">BiblioVirtual</h3>
          <p className="text-sm text-gray-500 mb-4">Escanea para acceder a la biblioteca</p>

          <button
            onClick={handleDownloadQR}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
          >
            <Download size={18} />
            Descargar QR
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon size={20} className="text-indigo-600" />
              <h3 className="font-bold text-gray-900">Enlace Directo</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={fullUrl}
                readOnly
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600 outline-none"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                }`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <QrCode size={20} className="text-indigo-600" />
              <h3 className="font-bold text-gray-900">Enlaces Rápidos</h3>
            </div>
            <div className="space-y-2">
              {quickLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => setCustomPath(link.path)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between ${
                    customPath === link.path
                      ? 'bg-indigo-50 border border-indigo-200 text-indigo-700'
                      : 'hover:bg-gray-50 border border-transparent text-gray-700'
                  }`}
                >
                  <span className="font-medium text-sm">{link.label}</span>
                  <ExternalLink size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-6">
            <h3 className="font-bold text-gray-900 mb-3">📋 Instrucciones</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="font-bold text-indigo-600">1.</span>
                Selecciona el enlace que quieras compartir
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-indigo-600">2.</span>
                Descarga el código QR o copia el enlace
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-indigo-600">3.</span>
                Imprímelo o compártelo en tu aula/espacio
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-indigo-600">4.</span>
                Los usuarios escanean con su teléfono para acceder
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
