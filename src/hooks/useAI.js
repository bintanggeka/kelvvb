import { useCallback, useMemo, useState } from 'react'

// Model OpenRouter yang akan dicoba berurutan (prioritas free/cepat)
const MODEL_CANDIDATES = [
  'alibaba/tongyi-deepresearch-30b-a3b:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'qwen/qwen-2.5-7b-instruct:free',
]

const FALLBACK_CATEGORY = (description) => {
  const text = description.toLowerCase()
  if (text.includes('gojek') || text.includes('grab') || text.includes('transport')) return 'Transport'
  if (text.includes('listrik') || text.includes('pln') || text.includes('wifi') || text.includes('tagihan')) return 'Tagihan'
  if (text.includes('nasi') || text.includes('makan') || text.includes('cafe')) return 'Makanan'
  if (text.includes('spotify') || text.includes('netflix') || text.includes('tonton')) return 'Hiburan'
  if (text.includes('obat') || text.includes('dokter') || text.includes('clinic')) return 'Kesehatan'
  if (text.includes('mall') || text.includes('beli') || text.includes('shop')) return 'Belanja'
  return 'Lainnya'
}

const FALLBACK_AUDIT = (transactions, salary) => {
  const topCategory = (() => {
    const agg = transactions.reduce((acc, tx) => {
      if (tx.type !== 'EXPENSE') return acc
      acc[tx.category || 'Lainnya'] = (acc[tx.category || 'Lainnya'] || 0) + Number(tx.amount || 0)
      return acc
    }, {})
    const entries = Object.entries(agg)
    if (!entries.length) return 'Belum ada pengeluaran'
    return entries.sort((a, b) => b[1] - a[1])[0][0]
  })()

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)

  return `## Audit Singkat (Offline Mode)
- Pengeluaran terbesar: **${topCategory}**
- Total pengeluaran tersimpan: Rp ${totalExpense.toLocaleString('id-ID')}
- Gaji terdaftar: Rp ${Number(salary || 0).toLocaleString('id-ID')}

**Saran cepat**
1. Tetapkan batas harian 5-10% dari gaji.
2. Kunci 1 kategori terbesar selama 7 hari (pause belanja impulsif).
3. Buat auto-transfer tabungan di awal bulan.`
}

const FALLBACK_PREDICT = ({ currentBalance, daysLeft, dailyAverage }) => {
  if (!daysLeft) {
    return { verdict: 'Aman', reason: 'Bulan berakhir hari ini.' }
  }
  const projected = dailyAverage * daysLeft
  if (currentBalance >= projected) {
    return { verdict: 'Aman', reason: 'Saldo mencukupi dengan pola pengeluaran saat ini.' }
  }
  return {
    verdict: 'Bahaya',
    reason: 'Pengeluaran harian lebih besar daripada saldo tersisa. Kurangi 10-20%.',
  }
}

const FALLBACK_PLAN = ({ transactions, salary }) => {
  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0)
  return `## Rencana 7 Hari (Offline Mode)
- Fokus penghematan: tekan pengeluaran harian menjadi Rp ${(totalExpense / 7 || 0).toLocaleString('id-ID')}
- Otomatiskan tabungan: pindahkan 5-10% gaji (${Number((salary || 0) * 0.1).toLocaleString('id-ID')}) ke rekening simpanan tiap Senin
- Blok satu kategori boros selama 7 hari, ganti dengan limit harian tunai`
}

// Fungsi untuk membersihkan output markdown dari AI
const cleanMarkdown = (text) => {
  if (!text) return ''

  return text
    // Hapus catatan/disclaimer yang tidak perlu (berbagai format)
    .replace(/\*\*Catatan:?\*\*.*?(?=\n\n|\n#|$)/gis, '')
    .replace(/Catatan:.*?(?=\n\n|\n#|$)/gis, '')
    .replace(/\*\*Disclaimer:?\*\*.*?(?=\n\n|\n#|$)/gis, '')
    .replace(/Disclaimer:.*?(?=\n\n|\n#|$)/gis, '')
    .replace(/\*\*Note:?\*\*.*?(?=\n\n|\n#|$)/gis, '')
    .replace(/Note:.*?(?=\n\n|\n#|$)/gis, '')

    // Hapus kalimat tentang data tidak tersedia/asumsi
    .replace(/.*?(data|JSON).*?(tidak tersedia|tidak ada|belum ada|asumsi|berdasarkan asumsi).*?\n/gi, '')
    .replace(/.*?Karena.*?(tidak tersedia|tidak ada).*?\n/gi, '')
    .replace(/.*?analisis bersifat.*?asumsi.*?\n/gi, '')

    // Hapus seluruh tabel markdown (yang sering rusak dari AI)
    // Format tabel: | Header | Header |
    //              |--------|--------|
    //              | Data   | Data   |
    .replace(/\n\|[^\n]+\|\n\|[-:\s|]+\|\n(\|[^\n]+\|\n)*/g, '\n')

    // Hapus baris yang hanya berisi | dan -
    .replace(/^\|[-:\s|]+\|$/gm, '')

    // Hapus baris kosong berlebihan (lebih dari 2)
    .replace(/\n{3,}/g, '\n\n')

    // Hapus spasi trailing di setiap baris
    .replace(/[ \t]+$/gm, '')

    // Hapus spasi di awal/akhir
    .trim()
}

export function useAI({ transactions, monthlyIncome }) {
  const rawKeys = import.meta.env.VITE_OPENROUTER_API_KEYS || import.meta.env.VITE_OPENROUTER_API_KEY || ''
  const apiKeys = useMemo(
    () =>
      rawKeys
        .split(/[, \n\r\t]+/)
        .map((k) => k.trim())
        .filter(Boolean),
    [rawKeys],
  )
  const [loadingKey, setLoadingKey] = useState('')
  const [error, setError] = useState('')
  const [activeModel, setActiveModel] = useState('')
  const [cooldownUntil, setCooldownUntil] = useState(0)
  const [keyIndex, setKeyIndex] = useState(0)

  const activeKey = apiKeys[keyIndex] || ''

  const isQuotaError = (err) => {
    const msg = String(err?.message || '').toLowerCase()
    return err?.status === 429 || msg.includes('quota') || msg.includes('429') || msg.includes('rate limit')
  }

  const cooldownActive = () => cooldownUntil && Date.now() < cooldownUntil
  const rotateKey = () => {
    if (!apiKeys.length) return
    setKeyIndex((idx) => (idx + 1) % apiKeys.length)
  }

  // Coba model berurutan saat dibutuhkan; cache keberhasilan pertama
  const resolveModel = useCallback(
    async () => {
      if (!activeKey) {
        setError('Tidak ada API key OpenRouter yang aktif.')
        return { model: null, name: '' }
      }
      if (cooldownActive()) return { model: null, name: '' }
      if (activeModel) {
        return { model: activeModel, name: activeModel }
      }
      for (const name of MODEL_CANDIDATES) {
        try {
          // Tes ringan dengan prompt pendek
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${activeKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: name,
              messages: [{ role: 'user', content: 'hi' }],
            }),
          })
          if (!response.ok) {
            const errData = await response.json().catch(() => ({}))
            throw { status: response.status, message: errData.error?.message || response.statusText }
          }
          setActiveModel(name)
          setError('')
          return { model: name, name }
        } catch (err) {
          console.error('Model gagal:', name, err)
          if (isQuotaError(err)) {
            setCooldownUntil(Date.now() + 60_000)
            setError('Kuota AI habis, coba lagi dalam 1 menit. Beralih key berikutnya.')
            rotateKey()
            break
          }
        }
      }
      if (!cooldownActive()) {
        setError('Tidak ada model AI yang tersedia untuk API key ini.')
      }
      return { model: null, name: '' }
    },
    [activeKey, activeModel, cooldownUntil, apiKeys.length],
  )

  const runWithModel = useCallback(
    async ({ action, promptBuilder, resultParser }) => {
      setLoadingKey(action)
      setError('')
      if (cooldownActive()) {
        setLoadingKey('')
        setError('Kuota AI habis, jeda sebentar lalu coba lagi.')
        return { source: 'unavailable' }
      }
      const { model: modelName, name } = await resolveModel()
      if (!modelName || !activeKey) {
        setLoadingKey('')
        return { source: 'unavailable' }
      }
      try {
        const prompt = promptBuilder()
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${activeKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            messages: [{ role: 'user', content: prompt }],
          }),
        })
        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          throw { status: response.status, message: errData.error?.message || response.statusText }
        }
        const result = await response.json()
        const content = result.choices?.[0]?.message?.content || ''
        const parsed = resultParser({ response: { text: () => content } })
        return { ...parsed, source: 'ai', model: name }
      } catch (err) {
        console.error(err)
        if (isQuotaError(err)) {
          setCooldownUntil(Date.now() + 60_000)
          setError('Kuota AI habis, ganti key dan coba lagi sebentar.')
          rotateKey()
        } else {
          setError(`Gagal memproses ${action} dengan AI.`)
        }
        return { source: 'unavailable', model: name }
      } finally {
        setLoadingKey('')
      }
    },
    [resolveModel, cooldownUntil, activeKey],
  )

  const categorize = useCallback(
    async (description, fallbackCategory = FALLBACK_CATEGORY(description)) => {
      if (!description) return null
      return runWithModel({
        action: 'categorize',
        promptBuilder: () =>
          `Analisa teks ini: "${description}". Kategorikan ke dalam satu dari: [Makanan, Transport, Tagihan, Hiburan, Belanja, Kesehatan, Lainnya]. Jawab hanya satu kata kategori.`,
        resultParser: (result) => {
          const text = result?.response?.text()?.trim()
          const category = text?.split(/\s+/)[0] || fallbackCategory
          return { category }
        },
      })
    },
    [runWithModel],
  )

  const parseAmount = useCallback(
    async (text) => {
      if (!text?.trim()) return { amount: 0, category: 'Lainnya' }

      // Fallback: coba ekstrak angka dari teks
      const fallbackAmount = (() => {
        // Cari pola angka dengan separator (15.000, 15000, 15k, 15rb)
        const patterns = [
          /(\d+)[.,]?(\d+)?[kK]/,  // 15k, 15.5k
          /(\d+)[.,]?(\d+)?\s*rb/i, // 15rb, 15.5rb
          /(\d+)[.,](\d{3})/,       // 15.000
          /(\d+)/,                   // 15000
        ]
        for (const pattern of patterns) {
          const match = text.match(pattern)
          if (match) {
            let num = parseInt(match[1])
            if (text.match(/[kK]/)) num *= 1000
            if (text.match(/rb/i)) num *= 1000
            return num
          }
        }
        return 0
      })()

      const res = await runWithModel({
        action: 'parseAmount',
        promptBuilder: () =>
          `Ekstrak informasi dari teks: "${text}". 
          1. Temukan nominal uang (dalam Rupiah). Jika ada "k" atau "rb" berarti ribu (contoh: 15k = 15000).
          2. Kategorikan transaksi ke: [Makanan, Transport, Tagihan, Hiburan, Belanja, Kesehatan, Lainnya].
          
          Format jawaban HARUS JSON:
          {"amount": 15000, "category": "Makanan"}`,
        resultParser: (result) => {
          const text = result?.response?.text()?.trim()
          try {
            // Coba parse JSON
            const jsonMatch = text.match(/\{[^}]+\}/)
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0])
              return {
                amount: Number(parsed.amount) || fallbackAmount,
                category: parsed.category || FALLBACK_CATEGORY(text),
              }
            }
          } catch (e) {
            console.error('Failed to parse AI response:', e)
          }
          // Fallback jika parsing gagal
          return {
            amount: fallbackAmount,
            category: FALLBACK_CATEGORY(text),
          }
        },
      })

      if (!res?.amount && res?.amount !== 0) {
        return { amount: fallbackAmount, category: FALLBACK_CATEGORY(text) }
      }
      return res
    },
    [runWithModel],
  )

  const audit = useCallback(
    async ({ transactions: txs, salary }) => {
      const latest = txs.slice(0, 50)
      const res = await runWithModel({
        action: 'audit',
        promptBuilder: () =>
          `Kamu adalah financial advisor profesional. Analisa data transaksi berikut dan berikan laporan LANGSUNG tanpa catatan/disclaimer.

DATA TRANSAKSI (50 terakhir):
${JSON.stringify(latest)}

GAJI BULANAN: Rp ${Number(salary || 0).toLocaleString('id-ID')}

TUGAS:
1. Analisa kategori pengeluaran terbesar (gunakan data AKTUAL dari JSON)
2. Berikan 3 langkah konkret penghematan dengan estimasi nominal
3. Beri skor kesehatan finansial (0-100) dengan penjelasan singkat

FORMAT JAWABAN (Markdown):
## 📊 Ringkasan Pengeluaran
- [Kategori terbesar]: Rp [nominal]
- [Kategori kedua]: Rp [nominal]

## 💡 3 Langkah Penghematan
1. **[Judul]**: [Penjelasan singkat] → Hemat ~Rp [nominal]/bulan
2. **[Judul]**: [Penjelasan singkat] → Hemat ~Rp [nominal]/bulan
3. **[Judul]**: [Penjelasan singkat] → Hemat ~Rp [nominal]/bulan

## 🎯 Skor Kesehatan Finansial: [X]/100
[Penjelasan 2-3 kalimat]

PENTING: Jangan tulis catatan/disclaimer. Langsung jawab berdasarkan data.`,
        resultParser: (result) => {
          const rawText = result?.response?.text() || ''
          const cleaned = cleanMarkdown(rawText)
          return { markdown: cleaned }
        },
      })
      if (!res?.markdown) {
        return { markdown: '', source: 'unavailable' }
      }
      return res
    },
    [runWithModel],
  )

  const predict = useCallback(
    async ({ currentBalance, daysLeft, dailyAverage }) => {
      const res = await runWithModel({
        action: 'predict',
        promptBuilder: () =>
          `Berdasarkan pengeluaran rata-rata harian ${dailyAverage} dan saldo saat ini ${currentBalance}, apakah cukup untuk ${daysLeft} hari ke depan? Jawab singkat: 'Aman' atau 'Bahaya', diikuti satu kalimat alasan.`,
        resultParser: (result) => {
          const text = result?.response?.text()?.trim() || ''
          const [verdictWord, ...rest] = text.split(':')
          return {
            verdict: verdictWord?.trim() || 'Aman',
            reason: rest.join(':').trim() || text,
          }
        },
      })
      if (!res?.verdict) {
        return { verdict: '-', reason: 'AI tidak tersedia', source: 'unavailable' }
      }
      return res
    },
    [runWithModel],
  )

  const plan = useCallback(
    async ({ transactions: txs, salary }) => {
      const latest = txs.slice(0, 30)
      const res = await runWithModel({
        action: 'plan',
        promptBuilder: () =>
          `Kamu adalah financial coach. Buat rencana 7 hari LANGSUNG tanpa catatan/disclaimer.

DATA TRANSAKSI (30 terakhir):
${JSON.stringify(latest)}

GAJI BULANAN: Rp ${Number(salary || 0).toLocaleString('id-ID')}

TUGAS: Buat rencana 7 hari yang actionable

FORMAT JAWABAN (Markdown):
## 🎯 Fokus Minggu Ini
[1 kalimat fokus utama]

## 💰 Target Harian
- Batas pengeluaran: Rp [nominal]/hari
- Target tabungan: Rp [nominal]/minggu

## ✅ Ritual Harian
1. [Kebiasaan 1]
2. [Kebiasaan 2]
3. [Kebiasaan 3]

## 🎁 Reward
Jika berhasil 7 hari: [reward kecil dengan budget]

PENTING: Jangan tulis catatan/disclaimer. Langsung berikan rencana.`,
        resultParser: (result) => {
          const rawText = result?.response?.text() || ''
          const cleaned = cleanMarkdown(rawText)
          return { markdown: cleaned }
        },
      })
      if (!res?.markdown) {
        return { markdown: '', source: 'unavailable' }
      }
      return res
    },
    [runWithModel],
  )

  return {
    categorize,
    parseAmount,
    audit,
    plan,
    predict,
    loadingKey,
    error,
    hasApiKey: Boolean(activeKey),
    activeModel,
  }
}


