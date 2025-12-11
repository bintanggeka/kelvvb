# 📘 Manual Book SmartSaver AI

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Instalasi dan Setup](#instalasi-dan-setup)
3. [Konfigurasi](#konfigurasi)
4. [Struktur Project](#struktur-project)
5. [Fitur-Fitur Utama](#fitur-fitur-utama)
6. [Cara Penggunaan](#cara-penggunaan)
7. [Arsitektur Teknis](#arsitektur-teknis)
8. [Troubleshooting](#troubleshooting)
9. [Pengembangan Lebih Lanjut](#pengembangan-lebih-lanjut)

---

## Pendahuluan

### Tentang SmartSaver AI

**SmartSaver AI** adalah aplikasi manajemen keuangan pribadi berbasis web yang menggunakan teknologi Artificial Intelligence (AI) untuk membantu pengguna mengelola keuangan mereka dengan lebih efektif. Aplikasi ini dibangun menggunakan React dan Vite dengan integrasi AI melalui OpenRouter API.

### Fitur Utama

- 📊 **Dashboard Keuangan**: Ringkasan saldo, pemasukan, dan pengeluaran
- 🤖 **AI-Powered Features**:
  - Kategorisasi transaksi otomatis
  - Parsing nominal dari teks natural language
  - Audit keuangan dengan saran penghematan
  - Prediksi pengeluaran
  - Perencanaan keuangan 7 hari
- 💾 **Penyimpanan Lokal**: Data tersimpan di IndexedDB dan localStorage
- 📱 **Responsive Design**: Dapat diakses dari berbagai perangkat

### Teknologi yang Digunakan

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Storage**: IndexedDB + localStorage
- **AI Integration**: OpenRouter API
- **Styling**: CSS Modules
- **Date Handling**: date-fns
- **Utilities**: classnames, uuid, react-markdown

---

## Instalasi dan Setup

### Prasyarat

Pastikan Anda telah menginstall:
- **Node.js** (versi 16 atau lebih baru)
- **npm** atau **yarn** (package manager)

### Langkah Instalasi

1. **Clone atau download project**
   ```bash
   git clone https://github.com/bintanggeka/tugassistemcerdas.git
   cd tugassistemcerdas/bunuraini-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Buat file `.env` di root project dengan isi:
   ```env
   VITE_OPENROUTER_API_KEY=your_api_key_here
   # atau untuk multiple keys (pisahkan dengan koma):
   VITE_OPENROUTER_API_KEYS=key1,key2,key3
   ```
   
   > **Catatan**: Dapatkan API key gratis di [OpenRouter.ai](https://openrouter.ai/)

4. **Jalankan development server**
   ```bash
   npm run dev
   ```

5. **Buka browser**
   
   Aplikasi akan berjalan di `http://localhost:5173` (atau port yang ditampilkan di terminal)

### Build untuk Production

```bash
npm run build
```

File hasil build akan berada di folder `dist/`. Untuk preview hasil build:

```bash
npm run preview
```

---

## Konfigurasi

### Environment Variables

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `VITE_OPENROUTER_API_KEY` | Single API key untuk OpenRouter | `sk-or-v1-...` |
| `VITE_OPENROUTER_API_KEYS` | Multiple API keys (pisahkan dengan koma) | `key1,key2,key3` |

### Model AI yang Digunakan

Aplikasi menggunakan model AI gratis dari OpenRouter dengan urutan prioritas:

1. `alibaba/tongyi-deepresearch-30b-a3b:free`
2. `meta-llama/llama-3.2-3b-instruct:free`
3. `qwen/qwen-2.5-7b-instruct:free`

Jika semua model gagal atau kuota habis, aplikasi akan menggunakan mode fallback (offline mode).

---

## Struktur Project

```
bunuraini-master/
├── public/                 # Static assets
│   └── vite.svg
├── src/
│   ├── components/         # Komponen React
│   │   ├── common/         # Komponen reusable
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── Modal.jsx
│   │   ├── AIAuditor.jsx   # Komponen audit AI
│   │   ├── AIPlanner.jsx   # Komponen perencanaan AI
│   │   ├── BudgetGoals.jsx # Komponen target budget
│   │   ├── DashboardStats.jsx # Statistik dashboard
│   │   ├── Onboarding.jsx  # Form onboarding
│   │   ├── TransactionForm.jsx # Form transaksi
│   │   └── TransactionList.jsx # Daftar transaksi
│   ├── context/
│   │   └── FinanceContext.jsx # Context untuk state management
│   ├── hooks/
│   │   ├── useAI.js        # Hook untuk integrasi AI
│   │   └── useIndexedDB.js # Hook untuk IndexedDB
│   ├── App.jsx             # Komponen utama
│   ├── App.module.css      # Styling App
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js         # Konfigurasi Vite
└── eslint.config.js       # Konfigurasi ESLint
```

---

## Fitur-Fitur Utama

### 1. Dashboard Statistik

Menampilkan ringkasan keuangan:
- **Saldo Saat Ini**: Pemasukan dikurangi pengeluaran
- **Total Pemasukan**: Jumlah semua transaksi pemasukan
- **Total Pengeluaran**: Jumlah semua transaksi pengeluaran
- **Expense Predictor**: Prediksi apakah saldo cukup untuk sisa hari di bulan ini

### 2. Manajemen Transaksi

- **Tambah Transaksi**: Input manual dengan form
- **Edit Transaksi**: Ubah data transaksi yang sudah ada
- **Hapus Transaksi**: Hapus transaksi yang tidak diperlukan
- **Kategorisasi Otomatis**: AI akan mengkategorikan transaksi secara otomatis

### 3. AI-Powered Features

#### a. Parsing Nominal (parseAmount)
- Mengkonversi teks natural language menjadi nominal uang
- Contoh input: "15k", "15000", "lima belas ribu", "15rb"
- Output: `{ amount: 15000, category: "Makanan" }`

#### b. Kategorisasi (categorize)
- Mengkategorikan transaksi ke dalam:
  - Makanan
  - Transport
  - Tagihan
  - Hiburan
  - Belanja
  - Kesehatan
  - Lainnya

#### c. Audit Keuangan (audit)
- Menganalisis 50 transaksi terakhir
- Memberikan:
  - Ringkasan pengeluaran per kategori
  - 3 langkah konkret penghematan dengan estimasi nominal
  - Skor kesehatan finansial (0-100)

#### d. Prediksi Pengeluaran (predict)
- Memprediksi apakah saldo cukup untuk sisa hari di bulan
- Memberikan verdict: "Aman" atau "Bahaya"
- Alasan singkat untuk prediksi

#### e. Perencanaan 7 Hari (plan)
- Membuat rencana keuangan untuk 7 hari ke depan
- Termasuk:
  - Fokus minggu ini
  - Target harian
  - Ritual harian
  - Reward system

### 4. Budget Goals

Menampilkan target tabungan berdasarkan profil pengguna.

### 5. Penyimpanan Data

- **IndexedDB**: Database browser untuk penyimpanan persisten
- **localStorage**: Backup storage untuk data penting
- Data otomatis tersinkronisasi saat ada perubahan

---

## Cara Penggunaan

### 1. Onboarding Pertama Kali

Saat pertama kali membuka aplikasi, Anda akan diminta untuk:
1. **Masukkan Nama**: Nama Anda untuk personalisasi
2. **Masukkan Gaji Bulanan**: Gaji bulanan untuk perhitungan budget

Klik "Simpan Profil" untuk melanjutkan.

### 2. Menambah Transaksi

1. **Buka form "Tambah Transaksi"**
2. **Pilih Tanggal**: Gunakan date picker
3. **Pilih Tipe**: Pemasukan atau Pengeluaran
4. **Masukkan Keterangan**: Deskripsi transaksi (contoh: "Nasi Padang siang")
5. **Masukkan Jumlah**: 
   - Anda bisa mengetik dalam format natural language
   - Contoh: "15k", "15000", "15rb", atau "lima belas ribu"
   - AI akan otomatis mendeteksi nominal dan kategori
   - Klik di luar field untuk trigger AI parsing
6. **Klik "Tambah Transaksi"**

### 3. Menggunakan AI Auditor

1. **Klik tombol "AI Auditor"** di sidebar
2. **Tunggu proses analisis** (beberapa detik)
3. **Baca hasil audit** yang mencakup:
   - Ringkasan pengeluaran
   - Langkah penghematan
   - Skor kesehatan finansial

### 4. Menggunakan AI Planner

1. **Klik tombol "AI Planner"** di sidebar
2. **Tunggu proses perencanaan**
3. **Baca rencana 7 hari** yang telah dibuat oleh AI

### 5. Mengedit Transaksi

1. **Klik ikon edit** pada transaksi yang ingin diubah
2. **Ubah data** di form yang muncul
3. **Klik "Simpan Perubahan"**

### 6. Menghapus Transaksi

1. **Klik ikon hapus** pada transaksi
2. **Konfirmasi penghapusan**

### 7. Reset Profil

Klik tombol "Reset Profil" di header untuk menghapus semua data dan memulai dari awal.

---

## Arsitektur Teknis

### State Management

Aplikasi menggunakan **React Context API** untuk state management global melalui `FinanceContext`:

```javascript
// State yang dikelola:
- transactions: Array transaksi
- userProfile: Profil pengguna
- aiLog: Log hasil AI (cache)
- incomeTotal: Total pemasukan (computed)
- expenseTotal: Total pengeluaran (computed)
- currentBalance: Saldo saat ini (computed)
- averageDailyExpense: Rata-rata pengeluaran harian (computed)
- daysLeftInMonth: Hari tersisa di bulan ini (computed)
```

### Data Storage

#### IndexedDB Structure

```
SmartSaverDB (version 1)
├── transactions (objectStore)
│   ├── id (keyPath)
│   ├── date (index)
│   ├── type (index)
│   └── category (index)
├── userProfile (objectStore)
│   └── id (keyPath: 'main')
└── aiLog (objectStore)
    └── id (keyPath: 'main')
```

#### Transaction Schema

```javascript
{
  id: string (UUID),
  date: string (ISO date),
  description: string,
  amount: number,
  type: 'INCOME' | 'EXPENSE',
  category: string
}
```

### AI Integration Flow

1. **API Key Management**
   - Mendukung multiple API keys dengan rotasi otomatis
   - Fallback ke key berikutnya jika kuota habis
   - Cooldown 60 detik saat rate limit

2. **Model Selection**
   - Mencoba model secara berurutan
   - Cache model yang berhasil
   - Fallback ke offline mode jika semua gagal

3. **Error Handling**
   - Deteksi error kuota (429)
   - Rotasi key otomatis
   - Pesan error yang user-friendly

### Component Architecture

```
App (Root)
├── FinanceProvider (Context Provider)
└── AppContent
    ├── Onboarding (jika belum setup)
    └── Main Layout (jika sudah setup)
        ├── DashboardStats
        ├── BudgetGoals
        ├── AIAuditor
        ├── AIPlanner
        ├── TransactionForm
        └── TransactionList
```

---

## Troubleshooting

### Masalah: AI tidak berfungsi

**Kemungkinan penyebab:**
1. API key tidak terkonfigurasi
2. API key tidak valid atau expired
3. Kuota API habis

**Solusi:**
1. Pastikan file `.env` ada dan berisi API key yang valid
2. Cek di browser console untuk error message
3. Tunggu 1 menit jika ada cooldown
4. Gunakan API key baru atau tambahkan key tambahan

### Masalah: Data tidak tersimpan

**Kemungkinan penyebab:**
1. IndexedDB tidak didukung di browser
2. Storage quota penuh
3. Browser dalam mode private/incognito

**Solusi:**
1. Gunakan browser modern (Chrome, Firefox, Edge)
2. Hapus data browser lama
3. Keluar dari mode incognito

### Masalah: Build error

**Kemungkinan penyebab:**
1. Dependencies tidak terinstall
2. Node.js version tidak kompatibel
3. Port sudah digunakan

**Solusi:**
```bash
# Hapus node_modules dan install ulang
rm -rf node_modules package-lock.json
npm install

# Atau gunakan port lain
npm run dev -- --port 3000
```

### Masalah: Styling tidak muncul

**Solusi:**
1. Pastikan CSS Modules terkonfigurasi dengan benar
2. Clear browser cache
3. Restart development server

---

## Pengembangan Lebih Lanjut

### Menambah Fitur Baru

1. **Tambah Komponen Baru**
   - Buat file di `src/components/`
   - Import dan gunakan di `App.jsx`

2. **Tambah Hook Baru**
   - Buat file di `src/hooks/`
   - Export function yang bisa digunakan di komponen

3. **Tambah Kategori Transaksi**
   - Edit `FALLBACK_CATEGORY` di `src/hooks/useAI.js`
   - Update prompt AI untuk kategori baru

### Customisasi Styling

- Edit file CSS Modules di masing-masing komponen
- Global styles di `src/index.css`
- CSS Variables untuk theming di `src/index.css`

### Optimasi Performance

1. **Lazy Loading**: Gunakan React.lazy() untuk komponen besar
2. **Memoization**: Gunakan useMemo dan useCallback untuk expensive operations
3. **Code Splitting**: Vite sudah otomatis melakukan code splitting

### Testing

Untuk menambahkan testing:
```bash
npm install --save-dev vitest @testing-library/react
```

### Deployment

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

#### GitHub Pages
1. Build project: `npm run build`
2. Deploy folder `dist/` ke GitHub Pages

---

## FAQ (Frequently Asked Questions)

**Q: Apakah data saya aman?**
A: Ya, semua data disimpan di browser Anda (IndexedDB dan localStorage). Data tidak dikirim ke server kecuali untuk API AI.

**Q: Apakah aplikasi ini gratis?**
A: Aplikasi ini gratis, namun penggunaan AI memerlukan API key dari OpenRouter. Beberapa model tersedia gratis dengan batasan kuota.

**Q: Bagaimana cara mendapatkan API key?**
A: Daftar di [OpenRouter.ai](https://openrouter.ai/) dan dapatkan API key gratis.

**Q: Apakah data tersinkronisasi antar perangkat?**
A: Tidak, data hanya tersimpan di browser lokal. Untuk sinkronisasi, perlu implementasi backend.

**Q: Bisakah saya export data?**
A: Fitur export belum tersedia, namun data tersimpan di IndexedDB browser yang bisa diakses melalui DevTools.

---

## Kontak dan Support

- **Repository**: https://github.com/bintanggeka/tugassistemcerdas
- **Issues**: Gunakan GitHub Issues untuk melaporkan bug atau request fitur

---

## Changelog

### Version 0.0.0 (Initial Release)
- ✅ Dashboard keuangan
- ✅ Manajemen transaksi (CRUD)
- ✅ AI-powered features (categorize, parse, audit, predict, plan)
- ✅ IndexedDB storage
- ✅ Responsive design
- ✅ Onboarding flow

---

## License

Project ini dibuat untuk keperluan edukasi dan tugas sistem cerdas.

---

**Dibuat dengan ❤️ menggunakan React dan AI**

