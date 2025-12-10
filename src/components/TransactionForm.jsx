import { useEffect, useState } from 'react'
import { Card } from './common/Card'
import { Input } from './common/Input'
import { Button } from './common/Button'

const initialState = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  amount: '',
  type: 'EXPENSE',
  category: '',
}

export default function TransactionForm({ onSubmit, onParseAmount, loadingParse, editingTx, onCancelEdit }) {
  const [form, setForm] = useState(initialState)
  const [amountText, setAmountText] = useState('')

  useEffect(() => {
    if (editingTx) {
      setForm({
        date: editingTx.date,
        description: editingTx.description,
        amount: editingTx.amount,
        type: editingTx.type,
        category: editingTx.category,
      })
      setAmountText(editingTx.amount.toString())
    } else {
      setForm(initialState)
      setAmountText('')
    }
  }, [editingTx])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (Number(form.amount) <= 0) return
    onSubmit({
      ...form,
      amount: Number(form.amount),
    })
    setForm(initialState)
    setAmountText('')
  }

  const handleAmountBlur = async () => {
    if (!amountText?.trim()) return
    const result = await onParseAmount(amountText)
    if (result) {
      setForm((prev) => ({
        ...prev,
        amount: result.amount || 0,
        category: result.category || prev.category || 'Lainnya'
      }))
    }
  }

  return (
    <Card
      title={editingTx ? 'Edit Transaksi' : 'Tambah Transaksi'}
      action={
        editingTx ? (
          <Button variant="ghost" onClick={onCancelEdit}>
            Batal
          </Button>
        ) : null
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input
            label="Tanggal"
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
            required
          />
          <div>
            <span style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>Tipe</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <Button
                type="button"
                variant={form.type === 'INCOME' ? 'success' : 'ghost'}
                onClick={() => setForm((prev) => ({ ...prev, type: 'INCOME' }))}
              >
                Pemasukan
              </Button>
              <Button
                type="button"
                variant={form.type === 'EXPENSE' ? 'danger' : 'ghost'}
                onClick={() => setForm((prev) => ({ ...prev, type: 'EXPENSE' }))}
              >
                Pengeluaran
              </Button>
            </div>
          </div>
        </div>

        <Input
          label="Keterangan"
          placeholder="Contoh: Nasi Padang siang"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />

        <Input
          label="Jumlah (AI akan deteksi otomatis)"
          type="text"
          placeholder="Contoh: 15k, 15000, 15rb, atau lima belas ribu"
          value={amountText}
          onChange={(e) => setAmountText(e.target.value)}
          onBlur={handleAmountBlur}
          required
          hint={loadingParse ? 'AI sedang mendeteksi...' : form.amount > 0 ? `Terdeteksi: Rp ${form.amount.toLocaleString('id-ID')}` : 'Ketik nominal lalu klik di luar'}
        />

        {form.category && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Kategori:</span>
            <span style={{
              padding: '4px 12px',
              background: 'var(--color-primary)',
              color: 'white',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600
            }}>
              {form.category}
            </span>
          </div>
        )}

        <Button type="submit" variant="primary" full disabled={Number(form.amount) <= 0}>
          {editingTx ? 'Simpan Perubahan' : 'Tambah Transaksi'}
        </Button>
      </form>
    </Card>
  )
}

