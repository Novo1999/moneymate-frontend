export enum IncomeCategory {
  SALARY = 'salary',
  AWARDS = 'awards',
  GRANTS = 'grants',
  SALE = 'sale',
  RENTAL = 'rental',
  REFUNDS = 'refunds',
  COUPON = 'coupon',
  LOTTERY = 'lottery',
  GIFTS = 'gifts',
  INTERESTS = 'interests',
  OTHERS_INCOME = 'others_income',
  TRANSFER = 'transfer',
}

export enum ExpenseCategory {
  FOOD_DRINKS = 'food_drinks',
  SHOPPING = 'shopping',
  HOUSING = 'housing',
  TRANSPORTATION = 'transportation',
  VEHICLE = 'vehicle',
  LIFE_ENTERTAINMENT = 'life_entertainment',
  COMMUNICATION_PC = 'communication_pc',
  FINANCIAL_EXPENSES = 'financial_expenses',
  INVESTMENTS = 'investments',
  OTHERS_EXPENSE = 'others_expense',
  TRANSFER = 'transfer_income',
}

export const incomeCategoryIcons: Record<IncomeCategory, string> = {
  [IncomeCategory.SALARY]: 'Briefcase',
  [IncomeCategory.AWARDS]: 'Trophy',
  [IncomeCategory.GRANTS]: 'HandCoins',
  [IncomeCategory.SALE]: 'ShoppingBag',
  [IncomeCategory.RENTAL]: 'Home',
  [IncomeCategory.REFUNDS]: 'ReceiptText',
  [IncomeCategory.COUPON]: 'Ticket',
  [IncomeCategory.LOTTERY]: 'Sparkles',
  [IncomeCategory.GIFTS]: 'Gift',
  [IncomeCategory.INTERESTS]: 'TrendingUp',
  [IncomeCategory.OTHERS_INCOME]: 'MoreHorizontal',
  [IncomeCategory.TRANSFER]: 'ArrowLeftRight',
}

export const expenseCategoryIcons: Record<ExpenseCategory, string> = {
  [ExpenseCategory.FOOD_DRINKS]: 'UtensilsCrossed',
  [ExpenseCategory.SHOPPING]: 'ShoppingCart',
  [ExpenseCategory.HOUSING]: 'Home',
  [ExpenseCategory.TRANSPORTATION]: 'Bus',
  [ExpenseCategory.VEHICLE]: 'Car',
  [ExpenseCategory.LIFE_ENTERTAINMENT]: 'Film',
  [ExpenseCategory.COMMUNICATION_PC]: 'Smartphone',
  [ExpenseCategory.FINANCIAL_EXPENSES]: 'Landmark',
  [ExpenseCategory.INVESTMENTS]: 'LineChart',
  [ExpenseCategory.OTHERS_EXPENSE]: 'MoreHorizontal',
  [ExpenseCategory.TRANSFER]: 'ArrowLeftRight',
}

// Helper function to get icon name by category
export const getCategoryIcon = (category: IncomeCategory | ExpenseCategory, type?: 'income' | 'expense'): string => {
  console.log("🚀 ~ getCategoryIcon ~ category:", category)
  if (type === 'income') {
    return incomeCategoryIcons[category as IncomeCategory] || 'HelpCircle'
  } else if (type === 'expense') {
    return expenseCategoryIcons[category as ExpenseCategory] || 'HelpCircle'
  } else {
    const merged = { ...incomeCategoryIcons, ...expenseCategoryIcons }
    return merged[category] || 'HelpCircle'
  }
}
