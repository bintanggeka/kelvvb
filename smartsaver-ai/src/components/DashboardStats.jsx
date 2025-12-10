import { Card } from './common/Card'
import styles from './DashboardStats.module.css'

function Stat({ label, value, accent }) {
  return (
    <div className={styles.stat}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value} style={{ color: accent }}>
        {value}
      </strong>
    </div>
  )
}

export default function DashboardStats({ balance, incomeTotal, expenseTotal, predictor, daysLeft, hasApiKey }) {
  return (
    <Card title="Ringkasan Saldo & Prediksi">
      <div className={styles.statsRow}>
        <Stat label="Saldo Saat Ini" value={`Rp ${balance.toLocaleString('id-ID')}`} accent="var(--color-primary)" />
        <Stat label="Total Pemasukan" value={`Rp ${incomeTotal.toLocaleString('id-ID')}`} accent="var(--color-success)" />
        <Stat label="Total Pengeluaran" value={`Rp ${expenseTotal.toLocaleString('id-ID')}`} accent="var(--color-danger)" />
      </div>
      <div className={styles.predictCard}>
        <div>
          <p className={styles.predictLabel}>Expense Predictor (sisa {daysLeft} hari)</p>
          <h3 className={styles.predictVerdict} data-status={predictor?.verdict}>
            {predictor?.verdict || '-'}
          </h3>
          <p className={styles.predictReason}>{predictor?.reason || 'Belum ada data.'}</p>
        </div>
        <div className={styles.predictBadge}>
          {hasApiKey ? 'AI ON' : 'Fallback Mode'}
        </div>
      </div>
    </Card>
  )
}





