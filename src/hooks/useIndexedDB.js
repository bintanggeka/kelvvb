// Hook untuk menggunakan IndexedDB sebagai storage (alternatif SQLite untuk browser)
import { useEffect, useState, useCallback } from 'react'

const DB_NAME = 'SmartSaverDB'
const DB_VERSION = 1
const STORES = {
    transactions: 'transactions',
    userProfile: 'userProfile',
    aiLog: 'aiLog',
}

// Inisialisasi IndexedDB
const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
            const db = event.target.result

            // Store untuk transactions
            if (!db.objectStoreNames.contains(STORES.transactions)) {
                const txStore = db.createObjectStore(STORES.transactions, { keyPath: 'id' })
                txStore.createIndex('date', 'date', { unique: false })
                txStore.createIndex('type', 'type', { unique: false })
                txStore.createIndex('category', 'category', { unique: false })
            }

            // Store untuk userProfile
            if (!db.objectStoreNames.contains(STORES.userProfile)) {
                db.createObjectStore(STORES.userProfile, { keyPath: 'id' })
            }

            // Store untuk aiLog
            if (!db.objectStoreNames.contains(STORES.aiLog)) {
                db.createObjectStore(STORES.aiLog, { keyPath: 'id' })
            }
        }
    })
}

// Helper functions untuk CRUD operations
const dbOperations = {
    async getAll(storeName) {
        const db = await initDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly')
            const store = transaction.objectStore(storeName)
            const request = store.getAll()

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    },

    async get(storeName, id) {
        const db = await initDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly')
            const store = transaction.objectStore(storeName)
            const request = store.get(id)

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    },

    async add(storeName, data) {
        const db = await initDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite')
            const store = transaction.objectStore(storeName)
            const request = store.add(data)

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    },

    async put(storeName, data) {
        const db = await initDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite')
            const store = transaction.objectStore(storeName)
            const request = store.put(data)

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    },

    async delete(storeName, id) {
        const db = await initDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite')
            const store = transaction.objectStore(storeName)
            const request = store.delete(id)

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    },

    async clear(storeName) {
        const db = await initDB()
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite')
            const store = transaction.objectStore(storeName)
            const request = store.clear()

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    },
}

export function useIndexedDB() {
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        initDB()
            .then(() => setIsReady(true))
            .catch((err) => console.error('Failed to init IndexedDB:', err))
    }, [])

    const saveTransaction = useCallback(async (transaction) => {
        try {
            await dbOperations.put(STORES.transactions, transaction)
        } catch (err) {
            console.error('Failed to save transaction:', err)
        }
    }, [])

    const getTransactions = useCallback(async () => {
        try {
            return await dbOperations.getAll(STORES.transactions)
        } catch (err) {
            console.error('Failed to get transactions:', err)
            return []
        }
    }, [])

    const deleteTransaction = useCallback(async (id) => {
        try {
            await dbOperations.delete(STORES.transactions, id)
        } catch (err) {
            console.error('Failed to delete transaction:', err)
        }
    }, [])

    const saveUserProfile = useCallback(async (profile) => {
        try {
            await dbOperations.put(STORES.userProfile, { id: 'main', ...profile })
        } catch (err) {
            console.error('Failed to save user profile:', err)
        }
    }, [])

    const getUserProfile = useCallback(async () => {
        try {
            const profile = await dbOperations.get(STORES.userProfile, 'main')
            return profile || null
        } catch (err) {
            console.error('Failed to get user profile:', err)
            return null
        }
    }, [])

    const saveAiLog = useCallback(async (log) => {
        try {
            await dbOperations.put(STORES.aiLog, { id: 'main', ...log })
        } catch (err) {
            console.error('Failed to save AI log:', err)
        }
    }, [])

    const getAiLog = useCallback(async () => {
        try {
            const log = await dbOperations.get(STORES.aiLog, 'main')
            return log || null
        } catch (err) {
            console.error('Failed to get AI log:', err)
            return null
        }
    }, [])

    return {
        isReady,
        saveTransaction,
        getTransactions,
        deleteTransaction,
        saveUserProfile,
        getUserProfile,
        saveAiLog,
        getAiLog,
    }
}
