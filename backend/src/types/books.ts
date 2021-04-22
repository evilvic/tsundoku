export interface BookItem {
  title: string
  author: string
  pages: number
  cover: string
  userId: string
  bookId: string
  createdAt: string
  read: boolean
  rate: number
}

export interface BookUpdate {
  title: string
  author: string
  pages: number
  cover: string
  userId: string
  bookId: string
  read: boolean
  rate: number
}

export interface User {
  userId: string
}