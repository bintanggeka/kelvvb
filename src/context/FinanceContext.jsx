import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { differenceInCalendarDays, endOfMonth, parseISO } from 'date-fns'
import { useIndexedDB } from '../hooks/useIndexedDB'

const STORAGE_KEY = 'smartsaver-ai-state'

const defaultState = {
  userProfile: {
    name: '',
    monthlyIncome: 0,
    savingsGoal: 0,
  },
  transactions: [],
  aiLog: {
    lastAuditDate: null,
    cachedAdvice: '',
    lastPlanDate: null,
    cachedPlan: '',
  },
}

const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const db = useIndexedDB()
  const [state, setState] = useState(() => {
    // Fallback ke localStorage saat IndexedDB belum ready
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (err) {
        console.error('Failed to parse saved state', err)
      }
    }
    return defaultState
  })

  // Load data dari IndexedDB saat ready
  useEffect(() => {
    if (!db.isReady) return

    const loadData = async () => {
      try {
        const [transactions, userProfile, aiLog] = await Promise.all([
          db.getTransactions(),
          db.getUserProfile(),
          db.getAiLog(),
        ])

        setState({
          transactions: transactions || [],
          userProfile: userProfile || defaultState.userProfile,
          aiLog: aiLog || defaultState.aiLog,
        })
      } catch (err) {
        console.error('Failed to load from IndexedDB:', err)
      }
    }

    loadData()
  }, [db.isReady])

  // Sync ke IndexedDB dan localStorage
  useEffect(() => {
    // Selalu sync ke localStorage sebagai backup
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))

    // Sync ke IndexedDB jika ready
    if (db.isReady) {
      // Save userProfile
      db.saveUserProfile(state.userProfile)

      // Save aiLog
      db.saveAiLog(state.aiLog)
    }
  }, [state, db.isReady])

  const addTransaction = (tx) => {
    const next = {
      ...tx,
      id: uuid(),
    }
    setState((prev) => ({
      ...prev,
      transactions: [next, ...prev.transactions],
    }))

    // Sync ke IndexedDB
    if (db.isReady) {
      db.saveTransaction(next)
    }
  }

  const updateTransaction = (id, partial) => {
    setState((prev) => {
      const updated = prev.transactions.map((item) =>
        item.id === id ? { ...item, ...partial } : item
      )

      // Sync ke IndexedDB
      if (db.isReady) {
        const updatedTx = updated.find((item) => item.id === id)
        if (updatedTx) db.saveTransaction(updatedTx)
      }

      return {
        ...prev,
        transactions: updated,
      }
    })
  }

  const deleteTransaction = (id) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((item) => item.id !== id),
    }))

    // Sync ke IndexedDB
    if (db.isReady) {
      db.deleteTransaction(id)
    }
  }

  const setUserProfile = (profile) => {
    setState((prev) => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...profile },
    }))
  }

  const setAiLog = (payload) => {
    setState((prev) => ({
      ...prev,
      aiLog: { ...prev.aiLog, ...payload },
    }))
  }

  const incomeTotal = useMemo(
    () => state.transactions.filter((t) => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount || 0), 0),
    [state.transactions],
  )

  const expenseTotal = useMemo(
    () => state.transactions.filter((t) => t.type === 'EXPENSE').reduce((acc, t) => acc + Number(t.amount || 0), 0),
    [state.transactions],
  )

  const currentBalance = useMemo(() => incomeTotal - expenseTotal, [incomeTotal, expenseTotal])

  const averageDailyExpense = useMemo(() => {
    if (!state.transactions.length) return 0
    const expenses = state.transactions.filter((t) => t.type === 'EXPENSE')
    if (!expenses.length) return 0
    const dates = expenses.map((t) => parseISO(t.date))
    const minDate = dates.reduce((min, d) => (d < min ? d : min), dates[0])
    const maxDate = dates.reduce((max, d) => (d > max ? d : max), dates[0])
    const span = Math.max(1, differenceInCalendarDays(maxDate, minDate) + 1)
    const total = expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0)
    return Math.round(total / span)
  }, [state.transactions])

  const daysLeftInMonth = useMemo(() => {
    const today = new Date()
    const end = endOfMonth(today)
    return differenceInCalendarDays(end, today) + 1
  }, [])

  const value = {
    transactions: state.transactions,
    userProfile: state.userProfile,
    aiLog: state.aiLog,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setUserProfile,
    setAiLog,
    incomeTotal,
    expenseTotal,
    currentBalance,
    averageDailyExpense,
    daysLeftInMonth,
  }

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const ctx = useContext(FinanceContext)
  if (!ctx) throw new Error('useFinance must be used within FinanceProvider')
  return ctx
}

