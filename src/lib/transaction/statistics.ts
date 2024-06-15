import { SupportedCurrencyCode } from "../definitions"
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
  private baseCurrency!: SupportedCurrencyCode

  constructor(
    transactions: Transaction[],
    baseCurrency: SupportedCurrencyCode
  ) {
    this.transactions = transactions
    this.baseCurrency = baseCurrency
    this.update()
  }

  setTransactions(transactions: Transaction[]) {
    this.transactions = transactions
    this.update()
  }

  setBaseCurrency(baseCurrency: SupportedCurrencyCode) {
    this.baseCurrency = baseCurrency
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
      const rate = entry.exchangeRate[this.baseCurrency] || 1
      const realAmount = entry.amount * rate
      if (entry.type === "income") {
        balance += realAmount
        income.total += realAmount
        income.count++
      } else {
        balance += realAmount
        expense.total += realAmount
        expense.count++

        if (entry.category) {
          const spentAmount = Math.abs(
            (spendingMap[entry.category] || 0) * rate + entry.amount * rate
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
