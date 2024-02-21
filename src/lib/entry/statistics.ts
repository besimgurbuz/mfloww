import { Entry } from "./index"

type MostSpent = {
  category: string
  amount: number
}

type EntrySumCount = {
  count: number
  total: number
}

class EntryStatistics {
  balance = 0
  income: EntrySumCount = {
    count: 0,
    total: 0,
  }
  expense: EntrySumCount = {
    count: 0,
    total: 0,
  }
  mostSpent: MostSpent = {
    category: "",
    amount: 0,
  }
  spendingMap: Record<string, number> = {}

  private entries!: Entry[]

  constructor(entries: Entry[]) {
    this.entries = entries
    this.update()
  }

  setEntries(entries: Entry[]) {
    this.entries = entries
    this.update()
  }

  private update() {
    let balance = 0
    let income: EntrySumCount = { count: 0, total: 0 }
    let expense: EntrySumCount = { count: 0, total: 0 }
    const spendingMap: Record<string, number> = {}
    let mostSpent: MostSpent = {
      amount: 0,
      category: "",
    }

    for (const entry of this.entries) {
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

export default EntryStatistics
