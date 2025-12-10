import classNames from 'classnames'
import styles from './Badge.module.css'

const palette = {
  Makanan: '#facc15',
  Transport: '#60a5fa',
  Tagihan: '#f87171',
  Hiburan: '#c084fc',
  Belanja: '#22c55e',
  Kesehatan: '#f472b6',
  Lainnya: '#94a3b8',
}

export function Badge({ children }) {
  const color = palette[children] || palette.Lainnya
  return (
    <span className={classNames(styles.badge)} style={{ backgroundColor: color }}>
      {children}
    </span>
  )
}

