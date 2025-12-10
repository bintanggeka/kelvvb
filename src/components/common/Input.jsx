import styles from './Input.module.css'

export function Input({ label, hint, error, rightSlot, ...rest }) {
  return (
    <label className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.inputBox}>
        <input className={styles.input} {...rest} />
        {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
      </div>
      {(hint || error) && <span className={error ? styles.error : styles.hint}>{error || hint}</span>}
    </label>
  )
}

