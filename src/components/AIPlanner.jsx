import ReactMarkdown from 'react-markdown'
import { Card } from './common/Card'
import { Button } from './common/Button'
import { Modal } from './common/Modal'
import styles from './AIPlanner.module.css'

export default function AIPlanner({ onPlan, planResult, loading, open, onClose, hasApiKey, error }) {
  return (
    <>
      <Card
        title="AI Coach"
        action={
          <Button variant="ai" onClick={onPlan} disabled={loading}>
            {loading ? 'Menyusun rencana...' : 'Rencana 7 Hari'}
          </Button>
        }
      >
        <p className={styles.note}>
          Minta AI jadi pelatih harian: batas harian, ritual singkat, dan reward agar disiplin.
        </p>
        <p className={styles.status}>{hasApiKey ? 'AI siap memberi rencana.' : 'Tidak ada API key, AI dimatikan.'}</p>
        {error && <p className={styles.error}>{error}</p>}
      </Card>

      <Modal
        open={open}
        onClose={onClose}
        title="Rencana 7 Hari AI"
        primaryAction={
          <Button variant="ai" onClick={onPlan} disabled={loading}>
            {loading ? 'Menyusun...' : 'Refresh Rencana'}
          </Button>
        }
      >
        {loading ? (
          <p>AI sedang menyusun rencana harian...</p>
        ) : planResult ? (
          <div className={styles.markdown}>
            <ReactMarkdown>{planResult}</ReactMarkdown>
          </div>
        ) : (
          <p>Tekan "Rencana 7 Hari" untuk memulai.</p>
        )}
      </Modal>
    </>
  )
}

