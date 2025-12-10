import classNames from 'classnames'
import styles from './Card.module.css'

export function Card({ children, className, title, action }) {
  return (
    <div className={classNames(styles.card, className)}>
      {(title || action) && (
        <div className={styles.cardHeader}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

