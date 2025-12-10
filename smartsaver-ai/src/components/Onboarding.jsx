import { useState } from 'react'
import { Card } from './common/Card'
import { Input } from './common/Input'
import { Button } from './common/Button'

export default function Onboarding({ initialProfile, onSave, loading }) {
  const [profile, setProfile] = useState({
    name: initialProfile.name || '',
    monthlyIncome: initialProfile.monthlyIncome || '',
    savingsGoal: initialProfile.savingsGoal || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      name: profile.name.trim(),
      monthlyIncome: Number(profile.monthlyIncome || 0),
      savingsGoal: Number(profile.savingsGoal || 0),
    })
  }

  return (
    <Card title="Onboarding SmartSaver AI">
      <p>Isi dulu profil dasar supaya AI bisa memberi rekomendasi yang relevan.</p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <Input
          label="Nama"
          placeholder="Misal: Nura"
          value={profile.name}
          onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
          required
        />
        <Input
          label="Gaji Bulanan"
          type="number"
          min={0}
          value={profile.monthlyIncome}
          onChange={(e) => setProfile((prev) => ({ ...prev, monthlyIncome: e.target.value }))}
          required
          rightSlot="Rp"
        />
        <Input
          label="Target Tabungan"
          type="number"
          min={0}
          value={profile.savingsGoal}
          onChange={(e) => setProfile((prev) => ({ ...prev, savingsGoal: e.target.value }))}
          rightSlot="Rp"
        />
        <Button type="submit" variant="primary" disabled={loading}>
          Mulai Dashboard
        </Button>
      </form>
    </Card>
  )
}





