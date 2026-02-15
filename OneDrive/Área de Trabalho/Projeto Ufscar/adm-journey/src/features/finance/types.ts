// Financial Types
export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
}

export interface FinancialSummary {
  totalBalance: number
  monthlyExpenses: number
  monthlyIncome: number
  savings: number
}
