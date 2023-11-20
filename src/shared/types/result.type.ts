import { Category, Post, User } from '@prisma/client'

export type Result = {
  result: User[] | Post[] | Category[]
  total: number
}
