import { format } from 'date-fns'
import { Card } from './common/Card'
import { Badge } from './common/Badge'
import { Button } from './common/Button'
import styles from './TransactionList.module.css'

export default function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <Card title="Transaksi Terbaru">
      {!transactions.length && <p>Belum ada transaksi. Tambahkan pengeluaran/pemasukan pertama.</p>}
      <div className={styles.list}>
        {transactions.map((tx) => (
          <div key={tx.id} className={styles.row}>
            <div className={styles.rowLeft}>
              <div className={styles.icon} data-type={tx.type}>
                {tx.type === 'INCOME' ? '+' : '-'}
              </div>
              <div>
                <div className={styles.desc}>{tx.description}</div>
                <div className={styles.meta}>
                  <span>{format(new Date(tx.date), 'dd MMM yyyy')}</span> • <Badge>{tx.category || 'Lainnya'}</Badge>
                </div>
              </div>
            </div>
            <div className={styles.rowRight}>
              <div className={styles.amount} data-type={tx.type}>
                {tx.type === 'INCOME' ? '+' : '-'} Rp {Number(tx.amount).toLocaleString('id-ID')}
              </div>
              <div className={styles.actions}>
                <Button variant="ghost" onClick={() => onEdit(tx)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => onDelete(tx.id)}>
                  Hapus
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

