import {
  Award,
  Briefcase,
  Building,
  Car,
  Coffee,
  CreditCard,
  Crown,
  Diamond,
  DollarSign,
  FolderTree,
  Gamepad2,
  Gift,
  HandCoins,
  Heart,
  Home,
  Loader,
  Music,
  Phone,
  PiggyBank,
  Plus,
  Settings,
  ShoppingCart,
  Star,
  Target,
  TrendingUp,
  Users,
  Utensils,
  Wallet,
  Zap,
} from 'lucide-react'
// Predefined icons to choose from in categories page
const iconOptions = [
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Home', icon: Home },
  { name: 'Car', icon: Car },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Utensils', icon: Utensils },
  { name: 'Gamepad2', icon: Gamepad2 },
  { name: 'Phone', icon: Phone },
  { name: 'CreditCard', icon: CreditCard },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Gift', icon: Gift },
  { name: 'Award', icon: Award },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'Building', icon: Building },
  { name: 'Coffee', icon: Coffee },
  { name: 'Music', icon: Music },
  { name: 'Heart', icon: Heart },
  { name: 'Zap', icon: Zap },
  { name: 'Wallet', icon: Wallet },
  { name: 'PiggyBank', icon: PiggyBank },
  { name: 'Target', icon: Target },
  { name: 'Users', icon: Users },
  { name: 'Star', icon: Star },
  { name: 'Crown', icon: Crown },
  { name: 'Diamond', icon: Diamond },
]

const FINANCE_ICONS = [
  // Money & Payments
  'Wallet',
  'CreditCard',
  'Banknote',
  'DollarSign',
  'Coins',
  'PiggyBank',
  'Landmark', // Bank building

  // Income Categories
  'Briefcase', // Salary/Job
  'TrendingUp', // Investment gains
  'Gift', // Bonus/Gift
  'Trophy', // Awards/Prizes
  'Sparkles', // Extra income

  // Expense Categories - Essential
  'Home', // Rent/Mortgage
  'Zap', // Utilities
  'Wifi', // Internet
  'Smartphone', // Phone bill
  'Droplet', // Water bill
  'Flame', // Gas/Heating

  // Expense Categories - Food & Drink
  'UtensilsCrossed', // Dining out
  'ShoppingCart', // Groceries
  'Coffee', // Coffee/Cafe
  'Pizza', // Fast food
  'Beer', // Alcohol

  // Expense Categories - Transportation
  'Car', // Car expenses
  'Fuel', // Gas/Fuel
  'Bus', // Public transport
  'Plane', // Travel/Flights
  'Train', // Train
  'Bike', // Bicycle

  // Expense Categories - Shopping
  'ShoppingBag', // General shopping
  'Shirt', // Clothing
  'Gem', // Jewelry/Luxury
  'Package', // Online shopping

  // Expense Categories - Entertainment
  'Film', // Movies
  'Music', // Music/Concerts
  'Gamepad2', // Gaming
  'Tv', // Streaming services
  'Ticket', // Events/Shows
  'Book', // Books

  // Expense Categories - Health & Fitness
  'Heart', // Healthcare
  'Pill', // Pharmacy/Medicine
  'Dumbbell', // Gym/Fitness
  'Activity', // Sports
  'Stethoscope', // Medical

  // Expense Categories - Personal
  'Scissors', // Haircut/Grooming
  'Sparkles', // Beauty/Spa
  'Users', // Family expenses
  'Baby', // Childcare
  'Dog', // Pets
  'GraduationCap', // Education

  // Savings & Goals
  'Target', // Financial goals
  'TrendingUp', // Investments
  'LineChart', // Stocks
  'Shield', // Insurance
  'Umbrella', // Emergency fund

  // Bills & Subscriptions
  'Receipt', // Bills
  'Calendar', // Recurring payments
  'Bell', // Reminders
  'FileText', // Documents

  // Miscellaneous
  'Settings', // Other/Settings
  'MoreHorizontal', // Miscellaneous
  'HelpCircle', // Unknown/Default
  'CircleDollarSign', // General finance
] as const

const TRANSACTION_CATEGORY_LABEL: Record<string, string> = {
  // Expense
  food_drinks: 'Food & Drinks',
  shopping: 'Shopping',
  housing: 'Housing',
  transportation: 'Transportation',
  vehicle: 'Vehicle',
  life_entertainment: 'Life & Entertainment',
  communication_pc: 'Communication & PC',
  financial_expenses: 'Financial Expenses',
  investments: 'Investments',
  others_expense: 'Others',
  transfer: 'Transfer',

  // Income
  salary: 'Salary',
  awards: 'Awards',
  grants: 'Grants',
  sale: 'Sale',
  rental: 'Rental',
  refunds: 'Refunds',
  coupon: 'Coupon',
  lottery: 'Lottery',
  gifts: 'Gifts',
  interests: 'Interests',
  others_income: 'Others',
}

const NAVIGATION_ITEMS = [
  {
    title: 'Categories',
    icon: FolderTree,
    href: '/categories',
  },
  {
    title: 'Accounts',
    icon: CreditCard,
    href: '/accounts',
  },
  {
    title: 'Currencies',
    icon: DollarSign,
    href: '/currencies',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/settings',
  },
  {
    title: 'Transactions',
    icon: HandCoins,
    href: '/#transactions',
  },
]

export { FINANCE_ICONS, iconOptions, NAVIGATION_ITEMS, TRANSACTION_CATEGORY_LABEL }

