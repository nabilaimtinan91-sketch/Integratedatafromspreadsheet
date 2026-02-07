import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Save, Eye, Upload, X } from 'lucide-react';

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

export function InputData() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    institusi: '',
    jurusan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    status: '',
    tanggalTerimaLaporan: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validasi tipe file
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Hanya file PDF dan JPG yang diperbolehkan!');
        e.target.value = '';
        return;
      }
      // Validasi ukuran file (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!');
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    const fileInput = document.getElementById('fileLaporan') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Konversi file ke base64 jika ada
    let fileData = undefined;
    if (file) {
      const reader = new FileReader();
      fileData = await new Promise((resolve) => {
        reader.onload = () => {
          resolve({
            name: file.name,
            type: file.type,
            data: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      });
    }

    // Buat data peserta baru
    const newPeserta: PesertaMagang = {
      id: Date.now().toString(),
      ...formData,
      tanggalTerimaLaporan: formData.tanggalTerimaLaporan || undefined,
      fileLaporan: fileData,
      createdAt: new Date().toISOString(),
    };

    // Ambil data yang sudah ada dari localStorage
    const existingData = localStorage.getItem('pesertaMagang');
    const pesertaList: PesertaMagang[] = existingData ? JSON.parse(existingData) : [];
    
    // Tambahkan data baru
    pesertaList.push(newPeserta);
    
    // Simpan kembali ke localStorage
    localStorage.setItem('pesertaMagang', JSON.stringify(pesertaList));
    
    // Reset form
    setFormData({
      nama: '',
      email: '',
      telepon: '',
      institusi: '',
      jurusan: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      status: '',
      tanggalTerimaLaporan: '',
    });
    setFile(null);
    
    // Tampilkan notifikasi sukses
    alert('Data peserta magang berhasil disimpan!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <h2 className="mb-2">Input Data Peserta Magang</h2>
          <p className="text-gray-600">Isi formulir di bawah ini untuk menambahkan data peserta magang baru</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama Lengkap */}
          <div>
            <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nama"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contoh@email.com"
            />
          </div>

          {/* Telepon */}
          <div>
            <label htmlFor="telepon" className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="telepon"
              name="telepon"
              value={formData.telepon}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          {/* Institusi */}
          <div>
            <label htmlFor="institusi" className="block text-sm font-medium text-gray-700 mb-1">
              Institusi/Universitas <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="institusi"
              name="institusi"
              value={formData.institusi}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama universitas/sekolah"
            />
          </div>

          {/* Jurusan */}
          <div>
            <label htmlFor="jurusan" className="block text-sm font-medium text-gray-700 mb-1">
              Jurusan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jurusan"
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama jurusan"
            />
          </div>

          {/* Tanggal Mulai & Selesai */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tanggalMulai" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="tanggalMulai"
                name="tanggalMulai"
                value={formData.tanggalMulai}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="tanggalSelesai" className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="tanggalSelesai"
                name="tanggalSelesai"
                value={formData.tanggalSelesai}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih status</option>
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          {/* Tanggal Terima Laporan (Opsional) */}
          <div>
            <label htmlFor="tanggalTerimaLaporan" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Terima Laporan <span className="text-gray-400 text-xs">(Opsional)</span>
            </label>
            <input
              type="date"
              id="tanggalTerimaLaporan"
              name="tanggalTerimaLaporan"
              value={formData.tanggalTerimaLaporan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Upload File Laporan (Opsional) */}
          <div>
            <label htmlFor="fileLaporan" className="block text-sm font-medium text-gray-700 mb-1">
              File Laporan <span className="text-gray-400 text-xs">(Opsional - PDF/JPG, Max 5MB)</span>
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="fileLaporan"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih File</span>
              </label>
              <input
                type="file"
                id="fileLaporan"
                accept=".pdf,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
                  <span className="text-sm text-blue-900">{file.name}</span>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              Simpan Data
            </button>
            <button
              type="button"
              onClick={() => navigate('/rekap')}
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              <Eye className="w-5 h-5" />
              Lihat Rekap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}