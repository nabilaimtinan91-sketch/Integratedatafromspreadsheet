import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Trash2, RefreshCw, Download, Plus, Edit, FileText, Eye } from 'lucide-react';

interface PesertaMagang {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  institusi: string;
  jurusan: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  status: string;
  tanggalTerimaLaporan?: string;
  fileLaporan?: {
    name: string;
    type: string;
    data: string;
  };
  createdAt: string;
}

export function RekapData() {
  const navigate = useNavigate();
  const [pesertaList, setPesertaList] = useState<PesertaMagang[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ name: string; data: string; type: string } | null>(null);

  const loadData = () => {
    const existingData = localStorage.getItem('pesertaMagang');
    if (existingData) {
      const data = JSON.parse(existingData);
      setPesertaList(data);
    } else {
      setPesertaList([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const updatedList = pesertaList.filter(peserta => peserta.id !== id);
      localStorage.setItem('pesertaMagang', JSON.stringify(updatedList));
      setPesertaList(updatedList);
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit/${id}`);
  };

  const handleViewFile = (file: { name: string; type: string; data: string }) => {
    setSelectedFile(file);
  };

  const handleCloseModal = () => {
    setSelectedFile(null);
  };

  const handleDownloadFile = () => {
    if (!selectedFile) return;
    
    const link = document.createElement('a');
    link.href = selectedFile.data;
    link.download = selectedFile.name;
    link.click();
  };

  const handleExport = () => {
    if (pesertaList.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    // Convert to CSV
    const headers = ['Nama', 'Email', 'Telepon', 'Institusi', 'Jurusan', 'Tanggal Mulai', 'Tanggal Selesai', 'Status', 'Tanggal Terima Laporan', 'File Laporan'];
    const csvContent = [
      headers.join(','),
      ...pesertaList.map(p => 
        [
          p.nama, 
          p.email, 
          p.telepon, 
          p.institusi, 
          p.jurusan, 
          p.tanggalMulai, 
          p.tanggalSelesai, 
          p.status,
          p.tanggalTerimaLaporan || '-',
          p.fileLaporan ? p.fileLaporan.name : '-'
        ].join(',')
      )
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rekap-peserta-magang-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="mb-1">Rekap Data Peserta Magang</h2>
              <p className="text-gray-600">Total: {pesertaList.length} peserta terdaftar</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Data
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {pesertaList.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-gray-900 mb-1">Belum ada data</h3>
              <p className="text-gray-500 mb-4">Mulai dengan menambahkan data peserta magang pertama Anda</p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Data Peserta
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institusi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jurusan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periode</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Terima</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Laporan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pesertaList.map((peserta, index) => (
                  <tr key={peserta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{peserta.nama}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{peserta.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{peserta.telepon}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{peserta.institusi}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{peserta.jurusan}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(peserta.tanggalMulai)} - {formatDate(peserta.tanggalSelesai)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        peserta.status === 'Aktif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {peserta.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(peserta.tanggalTerimaLaporan || '')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {peserta.fileLaporan ? (
                        <button
                          onClick={() => handleViewFile(peserta.fileLaporan!)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-900"
                          title="Lihat file"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(peserta.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Laporan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(peserta.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal untuk melihat file */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadFile}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handleCloseModal}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {selectedFile.type === 'application/pdf' ? (
                <iframe
                  src={selectedFile.data}
                  className="w-full h-full min-h-[600px]"
                  title="PDF Viewer"
                />
              ) : (
                <img
                  src={selectedFile.data}
                  alt={selectedFile.name}
                  className="max-w-full h-auto mx-auto"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}