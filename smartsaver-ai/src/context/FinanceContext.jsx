import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { differenceInCalendarDays, endOfMonth, parseISO } from 'date-fns'

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
  },
}

const FinanceContext = createContext(null)

export function FinanceProvider({ children }) {
  const [state, setState] = useState(() => {
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const addTransaction = (tx) => {
    const next = {
      ...tx,
      id: uuid(),
    }
    setState((prev) => ({
      ...prev,
      transactions: [next, ...prev.transactions],
    }))
  }

  const updateTransaction = (id, partial) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.map((item) => (item.id === id ? { ...item, ...partial } : item)),
    }))
  }

  const deleteTransaction = (id) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((item) => item.id !== id),
    }))
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





