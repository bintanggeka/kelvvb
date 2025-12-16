# 🎤 Script Presentasi SmartSaver AI

## Persiapan Presentasi

**Durasi**: 10-15 menit  
**Target Audience**: Dosen, Mahasiswa, atau Developer  
**Format**: Slide + Demo Live

---

## SLIDE 1: Judul & Pengenalan (1 menit)

### Apa yang akan saya presentasikan?

**"Selamat pagi/siang, saya akan mempresentasikan project SmartSaver AI - sebuah aplikasi manajemen keuangan pribadi yang menggunakan teknologi Artificial Intelligence."**

**Poin-poin:**
- Nama project: **SmartSaver AI**
- Tujuan: Membantu orang mengelola keuangan pribadi dengan lebih efektif
- Teknologi utama: React + AI (OpenRouter)
- Fitur unik: AI bisa menganalisis pengeluaran dan memberikan saran

---

## SLIDE 2: Masalah yang Diselesaikan (1 menit)

### Kenapa aplikasi ini dibuat?

**"Banyak orang kesulitan mengelola keuangan pribadi karena:"**

1. **Tidak tahu kemana uangnya pergi** - Pengeluaran tidak tercatat dengan baik
2. **Sulit membuat budget** - Tidak tahu berapa yang harus ditabung
3. **Tidak ada yang mengingatkan** - Tidak ada sistem yang memperingatkan jika pengeluaran berlebihan
4. **Membutuhkan waktu** - Mencatat manual memakan waktu

**"SmartSaver AI hadir untuk menyelesaikan masalah-masalah ini dengan bantuan AI."**

---

## SLIDE 3: Solusi - Fitur Utama (2 menit)

### Apa saja yang bisa dilakukan aplikasi ini?

**"Aplikasi ini memiliki 5 fitur utama:"**

#### 1. 📊 Dashboard Keuangan
- **Menampilkan ringkasan**: Saldo, total pemasukan, total pengeluaran
- **Real-time update**: Setiap transaksi langsung terlihat di dashboard
- **Prediksi**: AI memprediksi apakah saldo cukup sampai akhir bulan

#### 2. 💰 Manajemen Transaksi
- **Tambah transaksi**: Pemasukan atau pengeluaran
- **Edit & Hapus**: Bisa ubah atau hapus transaksi yang salah
- **Kategorisasi otomatis**: AI otomatis mengkategorikan transaksi

#### 3. 🤖 AI Parsing (Fitur Cerdas)
- **Input natural language**: Bisa ketik "15k", "lima belas ribu", atau "15rb"
- **AI otomatis deteksi**: Nominal dan kategori terdeteksi otomatis
- **Contoh**: Ketik "Nasi Padang 15k" → AI tahu ini pengeluaran Makanan sebesar Rp 15.000

#### 4. 🔍 AI Auditor
- **Analisis pengeluaran**: AI menganalisis 50 transaksi terakhir
- **Saran penghematan**: Memberikan 3 langkah konkret untuk hemat uang
- **Skor kesehatan finansial**: Memberikan skor 0-100 dengan penjelasan

#### 5. 📅 AI Planner
- **Rencana 7 hari**: AI membuat rencana keuangan untuk seminggu ke depan
- **Target harian**: Menentukan batas pengeluaran per hari
- **Ritual harian**: Saran kebiasaan baik untuk menghemat

---

## SLIDE 4: Teknologi yang Digunakan (1 menit)

### Bagaimana aplikasi ini dibangun?

**"Aplikasi ini menggunakan teknologi modern:"**

#### Frontend
- **React 19.2** - Framework untuk UI yang interaktif
- **Vite** - Build tool yang cepat
- **CSS Modules** - Styling yang terorganisir

#### Storage
- **IndexedDB** - Database browser untuk menyimpan data
- **localStorage** - Backup storage
- **Data tersimpan lokal** - Privasi terjaga, data tidak dikirim ke server

#### AI Integration
- **OpenRouter API** - Platform untuk mengakses berbagai model AI
- **Model AI Gratis**: 
  - Tongyi DeepResearch
  - Llama 3.2
  - Qwen 2.5
- **Fallback Mode**: Jika AI tidak tersedia, aplikasi tetap berfungsi dengan mode offline

---

## SLIDE 5: Cara Kerja Aplikasi (2 menit)

### Flow penggunaan aplikasi

**"Mari saya jelaskan bagaimana pengguna menggunakan aplikasi ini:"**

#### Step 1: Onboarding
1. User pertama kali buka aplikasi
2. Diminta input **nama** dan **gaji bulanan**
3. Data tersimpan untuk personalisasi

#### Step 2: Menambah Transaksi
1. User klik "Tambah Transaksi"
2. Input tanggal, tipe (pemasukan/pengeluaran), keterangan
3. **Fitur cerdas**: Input jumlah bisa pakai natural language
   - Contoh: Ketik "15k" atau "lima belas ribu"
   - AI otomatis deteksi nominal dan kategori
4. Klik "Tambah" → Transaksi tersimpan

#### Step 3: Melihat Dashboard
- Dashboard otomatis update
- Menampilkan saldo, pemasukan, pengeluaran
- **Expense Predictor**: AI memprediksi apakah saldo cukup

#### Step 4: Menggunakan AI Auditor
1. Klik tombol "AI Auditor"
2. AI menganalisis transaksi
3. Hasil: Ringkasan pengeluaran + saran penghematan + skor kesehatan

#### Step 5: Menggunakan AI Planner
1. Klik tombol "AI Planner"
2. AI membuat rencana 7 hari
3. User bisa ikuti rencana untuk menghemat uang

---

## SLIDE 6: Arsitektur Teknis (2 menit)

### Bagaimana aplikasi ini diorganisir?

**"Dari sisi teknis, aplikasi ini menggunakan:"**

#### State Management
- **React Context API** - Mengelola state global
- **Data yang dikelola**:
  - Transaksi
  - Profil user
  - Hasil AI (cache)
  - Perhitungan otomatis (saldo, rata-rata pengeluaran)

#### Data Storage
- **IndexedDB** - Database browser dengan struktur:
  - `transactions` - Semua transaksi
  - `userProfile` - Profil pengguna
  - `aiLog` - Cache hasil AI
- **localStorage** - Backup untuk data penting

#### AI Integration Flow
1. **API Key Management**: 
   - Bisa pakai multiple API keys
   - Rotasi otomatis jika kuota habis
2. **Model Selection**:
   - Mencoba model AI secara berurutan
   - Cache model yang berhasil
3. **Error Handling**:
   - Deteksi error kuota
   - Fallback ke mode offline
   - Pesan error yang user-friendly

---

## SLIDE 7: Demo Aplikasi (3-4 menit)

### Live Demo

**"Sekarang saya akan demo aplikasi ini:"**

#### Demo Step-by-Step:

1. **Buka aplikasi di browser**
   - Tampilkan halaman onboarding
   - Input nama dan gaji
   - Klik "Simpan Profil"

2. **Tambah beberapa transaksi**
   - Tambah pemasukan: "Gaji bulanan" - "5jt"
   - Tambah pengeluaran: "Nasi Padang" - "15k"
   - Tunjukkan AI parsing bekerja (deteksi otomatis)
   - Tambah beberapa transaksi lagi

3. **Tunjukkan Dashboard**
   - Saldo terupdate
   - Total pemasukan dan pengeluaran
   - Expense Predictor menunjukkan prediksi

4. **Demo AI Auditor**
   - Klik tombol "AI Auditor"
   - Tunggu proses (jelaskan bahwa AI sedang menganalisis)
   - Tunjukkan hasil: ringkasan, saran, skor

5. **Demo AI Planner**
   - Klik tombol "AI Planner"
   - Tunjukkan rencana 7 hari yang dibuat AI

6. **Edit & Hapus Transaksi**
   - Tunjukkan bisa edit transaksi
   - Tunjukkan bisa hapus transaksi

---

## SLIDE 8: Keunggulan & Inovasi (1 menit)

### Apa yang membuat aplikasi ini unik?

**"Keunggulan aplikasi ini:"**

1. **AI-Powered**: 
   - Bukan hanya catat transaksi, tapi juga analisis dan saran
   - Natural language processing untuk input yang mudah

2. **Privasi Terjaga**:
   - Data tersimpan lokal di browser
   - Tidak ada server yang menyimpan data user
   - Hanya API key yang dikirim ke OpenRouter untuk AI

3. **User-Friendly**:
   - Interface yang sederhana dan mudah digunakan
   - Tidak perlu belajar cara pakai yang rumit
   - Input natural language (bisa ketik "15k" bukan harus "15000")

4. **Offline Capable**:
   - Tetap berfungsi meski AI tidak tersedia
   - Mode fallback untuk semua fitur AI

5. **Real-time Updates**:
   - Dashboard update otomatis
   - Prediksi update setiap ada transaksi baru

---

## SLIDE 9: Hasil & Manfaat (1 menit)

### Apa manfaat aplikasi ini?

**"Dengan menggunakan aplikasi ini, user bisa:"**

1. **Lebih sadar pengeluaran**
   - Semua transaksi tercatat
   - Dashboard memberikan gambaran jelas

2. **Dapat saran konkret**
   - AI memberikan langkah-langkah spesifik untuk hemat
   - Bukan hanya data, tapi juga solusi

3. **Lebih mudah membuat budget**
   - AI Planner membantu merencanakan pengeluaran
   - Target harian yang jelas

4. **Menghemat waktu**
   - Input natural language lebih cepat
   - Kategorisasi otomatis
   - Tidak perlu analisis manual

5. **Meningkatkan kesehatan finansial**
   - Skor kesehatan finansial sebagai indikator
   - Saran yang actionable

---

## SLIDE 10: Kesimpulan & Q&A (1 menit)

### Kesimpulan

**"Kesimpulannya:"**

1. **SmartSaver AI** adalah aplikasi manajemen keuangan yang menggunakan AI
2. **Fitur utama**: Dashboard, manajemen transaksi, AI parsing, AI auditor, AI planner
3. **Teknologi**: React, IndexedDB, OpenRouter API
4. **Manfaat**: Membantu user mengelola keuangan dengan lebih efektif

### Next Steps / Future Work

**"Untuk pengembangan selanjutnya:"**
- Export data ke Excel/PDF
- Grafik dan visualisasi pengeluaran
- Notifikasi pengingat budget
- Sinkronisasi antar perangkat (dengan backend)

### Q&A

**"Ada pertanyaan?"**

---

## Tips Presentasi

### Persiapan
1. **Siapkan demo environment**:
   - Pastikan aplikasi sudah running
   - Siapkan beberapa transaksi contoh
   - Pastikan API key sudah terkonfigurasi

2. **Siapkan backup**:
   - Screenshot jika demo gagal
   - Video demo jika perlu
   - Slide dengan screenshot aplikasi

3. **Test sebelum presentasi**:
   - Pastikan semua fitur bekerja
   - Test AI features (audit, planner)
   - Pastikan tidak ada error di console

### Saat Presentasi
1. **Jelaskan dengan bahasa sederhana**
   - Hindari jargon teknis yang terlalu dalam
   - Gunakan analogi jika perlu

2. **Tunjukkan, jangan hanya cerita**
   - Demo live lebih efektif
   - Tunjukkan fitur-fitur yang unik

3. **Siapkan jawaban untuk pertanyaan umum**:
   - "Bagaimana cara mendapatkan API key?"
   - "Apakah data aman?"
   - "Bisakah digunakan offline?"
   - "Bagaimana cara deploy?"

4. **Jaga timing**:
   - Jangan terlalu cepat atau terlalu lambat
   - Beri waktu untuk demo
   - Sisakan waktu untuk Q&A

### Pertanyaan yang Mungkin Muncul

**Q: Bagaimana cara mendapatkan API key?**
A: Daftar di OpenRouter.ai, dapatkan API key gratis. Beberapa model AI tersedia gratis dengan batasan kuota.

**Q: Apakah data aman?**
A: Ya, semua data tersimpan di browser user (IndexedDB). Tidak ada server yang menyimpan data. Hanya API key yang dikirim ke OpenRouter untuk fitur AI.

**Q: Bisakah digunakan tanpa internet?**
A: Untuk fitur dasar (tambah/edit/hapus transaksi, dashboard) bisa digunakan offline. Untuk fitur AI (audit, planner) perlu internet, tapi ada mode fallback.

**Q: Bagaimana cara deploy aplikasi ini?**
A: Bisa deploy ke Vercel, Netlify, atau GitHub Pages. Build dengan `npm run build`, lalu deploy folder `dist/`.

**Q: Apakah bisa digunakan di mobile?**
A: Ya, aplikasi responsive dan bisa diakses dari mobile browser. Tapi belum ada aplikasi mobile native.

**Q: Bagaimana jika API key habis?**
A: Aplikasi akan menggunakan mode fallback (offline mode) yang tetap memberikan analisis dasar tanpa AI.

---

## Script Singkat (Quick Reference)

### Opening (30 detik)
"Selamat pagi/siang. Saya akan mempresentasikan SmartSaver AI - aplikasi manajemen keuangan berbasis AI yang membantu user mengelola keuangan dengan lebih efektif."

### Masalah (30 detik)
"Banyak orang kesulitan mengelola keuangan karena tidak tahu kemana uangnya pergi, sulit membuat budget, dan tidak ada yang mengingatkan. SmartSaver AI hadir untuk menyelesaikan ini."

### Solusi (2 menit)
"Aplikasi ini punya 5 fitur utama: Dashboard keuangan, manajemen transaksi, AI parsing untuk input natural language, AI auditor untuk analisis pengeluaran, dan AI planner untuk rencana 7 hari."

### Demo (3 menit)
"Sekarang saya demo: [tunjukkan onboarding, tambah transaksi dengan AI parsing, dashboard, AI auditor, AI planner]"

### Teknologi (1 menit)
"Dibangun dengan React, IndexedDB untuk storage lokal, dan OpenRouter API untuk AI. Data tersimpan lokal di browser untuk privasi."

### Kesimpulan (30 detik)
"SmartSaver AI membantu user lebih sadar pengeluaran, dapat saran konkret, dan lebih mudah membuat budget. Ada pertanyaan?"

---

## Checklist Sebelum Presentasi

- [ ] Aplikasi sudah running dan berfungsi
- [ ] API key sudah terkonfigurasi
- [ ] Ada data contoh (beberapa transaksi)
- [ ] Semua fitur sudah ditest
- [ ] Screenshot/video backup sudah disiapkan
- [ ] Slide sudah siap
- [ ] Timing sudah dihitung
- [ ] Siap jawab pertanyaan umum

---

**Good luck dengan presentasinya! 🚀**


