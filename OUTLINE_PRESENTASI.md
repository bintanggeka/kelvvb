# 📝 Outline Presentasi SmartSaver AI

## ⏱️ TIMELINE: 15-20 Menit

---

## 1️⃣ OPENING (2 menit)

**Apa yang dipresentasikan:**

- SmartSaver AI: Aplikasi manajemen keuangan berbasis AI
- Solusi untuk masalah pengelolaan keuangan pribadi

**Masalah:**

- Sulit tracking pengeluaran
- Tidak ada waktu analisis manual
- Perlu saran penghematan otomatis

---

## 2️⃣ OVERVIEW PROJECT (3 menit)

### Apa itu SmartSaver AI?

- Aplikasi web untuk manajemen keuangan pribadi
- Menggunakan AI untuk analisis & perencanaan
- Data tersimpan lokal (privasi terjaga)

### Teknologi Stack:

- **React 19.2** → UI Framework
- **Vite 7.2** → Build tool (cepat)
- **IndexedDB** → Database browser
- **OpenRouter API** → AI integration
- **CSS Modules** → Styling

### Kenapa teknologi ini?

- React: Populer, banyak resources
- Vite: Development cepat
- IndexedDB: Storage besar di browser
- OpenRouter: Model AI gratis

---

## 3️⃣ FITUR UTAMA (5 menit)

### A. Dashboard Keuangan

- ✅ Saldo saat ini
- ✅ Total pemasukan
- ✅ Total pengeluaran
- ✅ **Expense Predictor** (AI prediksi sisa bulan)

### B. Manajemen Transaksi

- ✅ CRUD transaksi (Create, Read, Update, Delete)
- ✅ Kategorisasi otomatis oleh AI

### C. AI-Powered Features ⭐ (POIN UTAMA)

#### 1. **Parsing Nominal (NLP)**

- Input: "15k", "15000", "lima belas ribu"
- Output: `{ amount: 15000, category: "Makanan" }`
- **Inovasi**: Natural language processing

#### 2. **Kategorisasi Otomatis**

- 7 kategori: Makanan, Transport, Tagihan, Hiburan, Belanja, Kesehatan, Lainnya
- AI menentukan kategori dari deskripsi

#### 3. **Audit Keuangan**

- Analisis 50 transaksi terakhir
- 3 langkah penghematan konkret
- Skor kesehatan finansial (0-100)

#### 4. **Prediksi Pengeluaran**

- Verdict: "Aman" atau "Bahaya"
- Alasan prediksi
- Berdasarkan pola pengeluaran

#### 5. **Perencanaan 7 Hari**

- Fokus minggu
- Target harian
- Ritual harian
- Reward system

---

## 4️⃣ ARSITEKTUR TEKNIS (3 menit)

### State Management

- React Context API
- Semua data dalam satu context
- Computed values otomatis

### Data Storage

- **IndexedDB**: Database browser (persisten)
- **localStorage**: Backup
- **Privasi**: Data tidak dikirim ke server

### AI Integration

- OpenRouter API
- Multiple API keys (rotasi otomatis)
- Fallback mechanism (offline mode)
- Model gratis: Tongyi, Llama, Qwen

### Flow AI:

```
User Input → AI Processing → Result
     ↓
API Key Habis? → Rotate Key
     ↓
Semua Gagal? → Offline Mode
```

---

## 5️⃣ CARA KERJA (3 menit)

### Onboarding

1. Input nama & gaji bulanan
2. Data untuk perhitungan budget

### Workflow:

1. User tambah transaksi (natural language)
2. AI parse nominal & kategori
3. Data tersimpan (IndexedDB)
4. Dashboard update real-time
5. User request audit/plan
6. AI analisis & berikan saran

### Contoh Use Case:

```
Input: "Nasi Padang siang 15k"
  ↓
AI Parse: amount=15000, category="Makanan"
  ↓
Tersimpan → Dashboard Update
  ↓
User klik "AI Auditor"
  ↓
AI analisis → Saran penghematan
```

---

## 6️⃣ KEUNGGULAN (2 menit)

### Keunggulan:

1. ✅ **AI-Powered**: Analisis & saran otomatis
2. ✅ **Natural Language**: Input bahasa natural
3. ✅ **Privacy-First**: Data lokal, tidak ada server
4. ✅ **Gratis**: Model AI gratis
5. ✅ **Offline Mode**: Tetap berfungsi tanpa AI
6. ✅ **Responsive**: Multi-device

### Inovasi:

- NLP untuk parsing nominal
- Multiple API key rotation
- Robust fallback mechanism
- Real-time prediction

---

## 7️⃣ DEMO (3 menit) - OPSIONAL

**Tunjukkan:**

1. Dashboard
2. Tambah transaksi (natural language)
3. AI parsing
4. AI Auditor
5. AI Planner

---

## 8️⃣ KESIMPULAN (2 menit)

### Ringkasan:

- SmartSaver AI = Manajemen keuangan + AI
- Teknologi modern (React, Vite)
- Privacy-first (data lokal)
- User-friendly (natural language)

### Future Work:

- Export/Import data
- Cloud sync
- Notifikasi
- Grafik visualisasi
- Multi-currency

### Q&A

---

## 🎯 POIN PENTING UNTUK DIINGAT

### Bahasa Presentasi:

- ✅ Jelas & mudah dipahami
- ✅ Fokus manfaat user
- ✅ Teknis hanya di bagian arsitektur
- ✅ Tekankan inovasi AI

### Contoh Kalimat:

**Opening:**

> "SmartSaver AI adalah solusi manajemen keuangan yang memanfaatkan AI"

**Fitur AI:**

> "User tidak perlu repot, AI yang akan menentukan kategori secara otomatis"

**Teknologi:**

> "Data tersimpan lokal, privasi user terjaga"

**Kesimpulan:**

> "AI bisa diterapkan untuk menyelesaikan masalah sehari-hari"

---

## ❓ FAQ & JAWABAN

**Q: Cara dapat API key?**
A: Daftar di OpenRouter.ai, gratis

**Q: Data aman?**
A: Ya, tersimpan di browser user

**Q: Bisa offline?**
A: Sebagian besar bisa, AI perlu internet (ada fallback)

**Q: Cara deploy?**
A: Build → Upload ke Vercel/Netlify/GitHub Pages

**Q: Multi-user?**
A: Saat ini single-user, perlu backend untuk multi-user

**Q: Akurasi AI?**
A: Cukup baik, ada fallback jika tidak yakin

---

## 🎤 TIPS PRESENTASI

1. ✅ Practice beberapa kali
2. ✅ Jaga timing (15-20 menit)
3. ✅ Gunakan visual (screenshot/demo)
4. ✅ Engagement (pertanyaan retorik)
5. ✅ Confidence
6. ✅ Siapkan Q&A

---

## 📊 SUGGESTED SLIDES

1. Cover
2. Masalah
3. Solusi
4. Teknologi
   5-9. Fitur (Dashboard, Transaksi, 5 AI Features)
5. Arsitektur
6. Demo
7. Keunggulan
8. Kesimpulan
9. Q&A

---

## 💬 CLOSING STATEMENT

> "SmartSaver AI adalah contoh bagaimana AI bisa diterapkan untuk masalah sehari-hari. Dengan teknologi modern dan AI, kita bisa membuat aplikasi yang powerful namun user-friendly. Terima kasih, saya siap menjawab pertanyaan."

---

**Good luck! 🚀**
