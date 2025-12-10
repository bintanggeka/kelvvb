import { Card } from './common/Card'
import styles from './BudgetGoals.module.css'

export default function BudgetGoals({ profile, balance }) {
  const gap = Math.max(0, (profile.savingsGoal || 0) - balance)
  const progress = profile.savingsGoal ? Math.min(100, Math.round((balance / profile.savingsGoal) * 100)) : 0

  return (
    <Card title="Budgeting Goals">
      <div className={styles.row}>
        <div>
          <p className={styles.label}>Target Tabungan</p>
          <h3 className={styles.value}>Rp {Number(profile.savingsGoal || 0).toLocaleString('id-ID')}</h3>
          <p className={styles.caption}>Gap: Rp {gap.toLocaleString('id-ID')}</p>
        </div>
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.fill} style={{ width: `${progress}%` }} />
          </div>
          <p className={styles.caption}>Perkiraan tercapai: {progress >= 100 ? 'Sudah tercapai 🎉' : 'Teruskan konsistensi harian'}</p>
        </div>
      </div>
    </Card>
  )
}





