import styles from './Modal.module.css'
import { Button } from './Button'

export function Modal({ open, onClose, title, children, primaryAction }) {
  if (!open) return null
  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            Tutup
          </Button>
        </div>
        <div className={styles.body}>{children}</div>
        {primaryAction && <div className={styles.footer}>{primaryAction}</div>}
      </div>
    </div>
  )
}





