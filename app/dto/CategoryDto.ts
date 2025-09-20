export interface CategoryDto {
  id?: number
  userId: number
  name: string
  type: 'income' | 'expense'
  icon: string
}
