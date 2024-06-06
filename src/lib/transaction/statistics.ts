import { Transaction } from "./index"

type MostSpent = {
  category: string
  amount: number
}

type TransactionCount = {
  count: number
  total: number
}

class TransactionStatistics {
  balance = 0
  income: TransactionCount = {
    count: 0,
    total: 0,
  }
  expense: TransactionCount = {
    count: 0,
    total: 0,
  }
  mostSpent: MostSpent = {
    category: "",
    amount: 0,
  }
  spendingMap: Record<string, number> = {}

  private transactions!: Transaction[]

  constructor(transactions: Transaction[]) {
    this.transactions = transactions
    this.update()
  }

  setTransactions(transactions: Transaction[]) {
    this.transactions = transactions
    this.update()
  }

  private update() {
    let balance = 0
    let income: TransactionCount = { count: 0, total: 0 }
    let expense: TransactionCount = { count: 0, total: 0 }
    const spendingMap: Record<string, number> = {}
    let mostSpent: MostSpent = {
      amount: 0,
      category: "",
    }

    for (const entry of this.transactions) {
      if (entry.type === "income") {
        balance += entry.amount
        income.total += entry.amount
        income.count++
      } else {
        balance += entry.amount
        expense.total += entry.amount
        expense.count++

        if (entry.category) {
          const spentAmount = Math.abs(
            (spendingMap[entry.category] || 0) + entry.amount
          )
          spendingMap[entry.category] = spentAmount

          if (spentAmount > mostSpent.amount) {
            mostSpent.amount = spentAmount
            mostSpent.category = entry.category
          }
        }
      }
    }

    this.balance = balance
    this.income = income
    this.expense = expense
    this.spendingMap = spendingMap
    this.mostSpent = mostSpent
  }
}

export default TransactionStatistics
