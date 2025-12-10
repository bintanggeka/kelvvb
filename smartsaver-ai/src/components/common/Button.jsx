import classNames from 'classnames'
import styles from './Button.module.css'

export function Button({ children, variant = 'primary', full, type = 'button', ...rest }) {
  return (
    <button
      type={type}
      className={classNames(styles.button, styles[variant], { [styles.full]: full })}
      {...rest}
    >
      {children}
    </button>
  )
}





