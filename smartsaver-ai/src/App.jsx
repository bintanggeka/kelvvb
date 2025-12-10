import { useEffect, useState } from 'react'
import styles from './App.module.css'
import { FinanceProvider, useFinance } from './context/FinanceContext'
import DashboardStats from './components/DashboardStats'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import BudgetGoals from './components/BudgetGoals'
import AIAuditor from './components/AIAuditor'
import Onboarding from './components/Onboarding'
import { Button } from './components/common/Button'
import { useGemini } from './hooks/useGemini'

function AppContent() {
  const {
    transactions,
    userProfile,
    currentBalance,
    incomeTotal,
    expenseTotal,
    averageDailyExpense,
    daysLeftInMonth,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setUserProfile,
    setAiLog,
    aiLog,
  } = useFinance()
  const [editingTx, setEditingTx] = useState(null)
  const [auditOpen, setAuditOpen] = useState(false)
  const [auditResult, setAuditResult] = useState(aiLog.cachedAdvice || '')

  const { categorize, audit, predict, loadingKey, error, hasApiKey } = useGemini({
    transactions,
    monthlyIncome: userProfile.monthlyIncome,
  })
  const [predictor, setPredictor] = useState({ verdict: '-', reason: 'Menunggu data...' })

  const handleSubmit = async (tx) => {
    if (editingTx) {
      updateTransaction(editingTx.id, tx)
      setEditingTx(null)
    } else {
      addTransaction(tx)
    }
  }

  const handleAutoCategorize = async (description, fallbackCategory) => {
    if (!description?.trim()) return null
    const result = await categorize(description, fallbackCategory)
    return result?.category || null
  }

  const handleAudit = async () => {
    setAuditOpen(true)
    const result = await audit({
      transactions,
      salary: userProfile.monthlyIncome,
    })
    if (result?.markdown) {
      setAuditResult(result.markdown)
      setAiLog({ cachedAdvice: result.markdown, lastAuditDate: new Date().toISOString() })
    }
  }

  useEffect(() => {
    let mounted = true
    const run = async () => {
      const result = await predict({
        currentBalance,
        daysLeft: daysLeftInMonth,
        dailyAverage: averageDailyExpense,
      })
      if (mounted) setPredictor(result)
    }
    run()
    return () => {
      mounted = false
    }
  }, [predict, currentBalance, daysLeftInMonth, averageDailyExpense])

  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>SS</div>
          <div>
            <h1 className={styles.title}>SmartSaver AI</h1>
            <p className={styles.subtitle}>Asisten keuangan proaktif berbasis OpenRouter AI</p>
          </div>
        </div>
        <Button variant="ghost" onClick={() => setUserProfile({ name: '', monthlyIncome: 0 })}>
          Reset Profil
        </Button>
      </header>

      {!userProfile.name || !userProfile.monthlyIncome ? (
        <Onboarding
          initialProfile={userProfile}
          onSave={(profile) => setUserProfile(profile)}
          loading={false}
        />
      ) : (
        <div className={styles.grid}>
          <div className={styles.sectionColumn}>
            <DashboardStats
              balance={currentBalance}
              incomeTotal={incomeTotal}
              expenseTotal={expenseTotal}
              predictor={predictor}
              daysLeft={daysLeftInMonth}
              hasApiKey={hasApiKey}
            />
            <BudgetGoals profile={userProfile} balance={currentBalance} />
            <AIAuditor
              onAudit={handleAudit}
              auditResult={auditResult}
              loading={loadingKey === 'audit'}
              open={auditOpen}
              onClose={() => setAuditOpen(false)}
              hasApiKey={hasApiKey}
              error={error}
            />
          </div>

          <div className={styles.sectionColumn}>
            <div className={styles.transactionsWrapper}>
              <TransactionForm
                onSubmit={handleSubmit}
                onAutoCategorize={handleAutoCategorize}
                loadingCategory={loadingKey === 'categorize'}
                editingTx={editingTx}
                onCancelEdit={() => setEditingTx(null)}
              />
              <TransactionList
                transactions={transactions}
                onEdit={setEditingTx}
                onDelete={deleteTransaction}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  )
}

export default App
