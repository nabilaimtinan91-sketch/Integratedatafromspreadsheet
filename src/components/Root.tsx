import { Outlet, Link, useLocation } from 'react-router';
import { ClipboardList, FileSpreadsheet } from 'lucide-react';

export function Root() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-center">Sistem Data Peserta Magang</h1>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-1">
            <Link
              to="/"
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                location.pathname === '/'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              <span>Input Data Peserta Magang</span>
            </Link>
            <Link
              to="/rekap"
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-colors ${
                location.pathname === '/rekap'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span>Rekap Data Peserta</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
