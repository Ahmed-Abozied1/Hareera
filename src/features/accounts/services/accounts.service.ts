import { getData } from '@/lib/getData'
import { PaginatedUsers, User } from '../types/accounts.types'

export const accountsService = {
  async fetchAll(
    page = 1,
    limit = 10,
    searchTerm = '',
    role = 'all',
    status = 'all',
    sortBy = 'newest'
  ): Promise<PaginatedUsers> {
    const query = `users?page=${page}&limit=${limit}&searchTerm=${searchTerm}&role=${role}&status=${status}&sortBy=${sortBy}`
    return await getData<PaginatedUsers>(query, true)
  },

  async fetchAllUsers(
    searchTerm = '',
    role = 'all',
    status = 'all',
    sortBy = 'newest'
  ): Promise<User[]> {
    const query = `users?getAll=true&searchTerm=${searchTerm}&role=${role}&status=${status}&sortBy=${sortBy}`
    const response = await getData<{ users: User[] }>(query, true)
    return response.users
  },

  async setActive(userId: string, isActive: boolean): Promise<User> {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isActive }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data?.error || 'فشل تحديث حالة الحساب')

    return data.user as User
  }
}