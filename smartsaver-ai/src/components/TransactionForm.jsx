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

export default function TransactionForm({ onSubmit, onAutoCategorize, loadingCategory, editingTx, onCancelEdit }) {
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    if (editingTx) {
      setForm({
        date: editingTx.date,
        description: editingTx.description,
        amount: editingTx.amount,
        type: editingTx.type,
        category: editingTx.category,
      })
    } else {
      setForm(initialState)
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
  }

  const handleBlur = async () => {
    if (!form.description) return
    const category = await onAutoCategorize(form.description, form.category || 'Lainnya')
    if (category) {
      setForm((prev) => ({ ...prev, category }))
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
          onBlur={handleBlur}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input
            label="Jumlah"
            type="number"
            min={0}
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            required
            rightSlot="Rp"
          />
          <Input
            label="Kategori (auto AI)"
            placeholder="Makanan / Transport / ..."
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            hint={loadingCategory ? 'Meminta AI...' : 'Isi manual atau biarkan AI'}
          />
        </div>

        <Button type="submit" variant="primary" full disabled={Number(form.amount) <= 0}>
          {editingTx ? 'Simpan Perubahan' : 'Tambah Transaksi'}
        </Button>
      </form>
    </Card>
  )
}





