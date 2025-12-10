import ReactMarkdown from 'react-markdown'
import { Card } from './common/Card'
import { Button } from './common/Button'
import { Modal } from './common/Modal'
import styles from './AIAuditor.module.css'

export default function AIAuditor({ onAudit, auditResult, loading, open, onClose, hasApiKey, error }) {
  return (
    <>
      <Card
        title="Financial Auditor"
        action={
          <Button variant="ai" onClick={onAudit} disabled={loading}>
            {loading ? 'Meminta saran...' : 'Minta Saran AI'}
          </Button>
        }
      >
        <p className={styles.note}>
          AI akan membaca 50 transaksi terakhir, memberi skor, dan 3 langkah konkret penghematan.
        </p>
        <p className={styles.status}>{hasApiKey ? 'AI siap dipakai.' : 'Tidak ada API key, gunakan mode offline.'}</p>
        {error && <p className={styles.error}>{error}</p>}
      </Card>

      <Modal
        open={open}
        onClose={onClose}
        title="Hasil Audit AI"
        primaryAction={
          <Button variant="ai" onClick={onAudit} disabled={loading}>
            {loading ? 'Meminta saran...' : 'Refresh Audit'}
          </Button>
        }
      >
        {loading ? (
          <p>Sedang menganalisis transaksi...</p>
        ) : auditResult ? (
          <div className={styles.markdown}>
            <ReactMarkdown>{auditResult}</ReactMarkdown>
          </div>
        ) : (
          <p>Belum ada audit. Tekan "Minta Saran AI".</p>
        )}
      </Modal>
    </>
  )
}





