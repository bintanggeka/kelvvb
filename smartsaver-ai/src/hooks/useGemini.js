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

export function useGemini({ transactions, monthlyIncome }) {
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

  const audit = useCallback(
    async ({ transactions: txs, salary }) => {
      const latest = txs.slice(0, 50)
      const res = await runWithModel({
        action: 'audit',
        promptBuilder: () =>
          `Bertindaklah sebagai akuntan pribadi yang tegas namun solutif. Berikut data keuanganku (maks 50 terakhir) dalam JSON: ${JSON.stringify(
            latest,
          )}. Gaji bulananku: ${salary}. 1. Analisa kemana uangku paling banyak habis. 2. Berikan 3 langkah konkret penghematan. 3. Beri skor kesehatan finansial (0-100). Format jawaban dalam Markdown.`,
        resultParser: (result) => ({ markdown: result?.response?.text() || '' }),
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

  return {
    categorize,
    audit,
    predict,
    loadingKey,
    error,
    hasApiKey: Boolean(activeKey),
    activeModel,
  }
}





